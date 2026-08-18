import os
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any, List

from app.schemas.schemas import (
    SignalInput, InterventionRequest, PredictionResponse, 
    InterventionResponse, VisualSignalData
)
from app.signal_processing.features import extract_physical_features, compute_fft
from app.ml.inference import model_service
from app.intervention.engine import apply_controlled_intervention
from app.explainability.explainer import generate_scientific_interpretation
from app.core.config import settings

router = APIRouter()

def prepare_visual_data(signal: np.ndarray, sampling_rate: int = 2000) -> Dict[str, Any]:
    # Downsample time series for UI rendering performance (max 500 points)
    n = len(signal)
    step = max(1, n // 500)
    time_points = np.linspace(0, n / sampling_rate, n, endpoint=False)
    
    time_series = [
        {"time": round(float(t), 4), "amplitude": round(float(a), 4)}
        for t, a in zip(time_points[::step], signal[::step])
    ]
    
    freqs, amps = compute_fft(signal, sampling_rate=sampling_rate)
    # Downsample FFT spectrum (max 250 points up to 500Hz)
    freq_mask = freqs <= 500.0
    freqs_sub = freqs[freq_mask]
    amps_sub = amps[freq_mask]
    step_f = max(1, len(freqs_sub) // 250)
    
    fft_spectrum = [
        {"frequency": round(float(f), 1), "amplitude": round(float(a), 4)}
        for f, a in zip(freqs_sub[::step_f], amps_sub[::step_f])
    ]
    
    return {
        "time_series": time_series,
        "fft_spectrum": fft_spectrum,
        "char_freq_band": {"min": 100.0, "max": 140.0}
    }

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "model_loaded": model_service.model is not None
    }

@router.get("/model-info")
def model_info():
    return {
        "model_type": "RandomForestClassifier",
        "feature_names": model_service.feature_names,
        "metrics": model_service.metrics
    }

@router.post("/analyze")
def analyze_signal(input_data: SignalInput):
    try:
        signal = np.array(input_data.amplitude)
        features = extract_physical_features(signal, sampling_rate=input_data.sampling_rate)
        visuals = prepare_visual_data(signal, sampling_rate=input_data.sampling_rate)
        prediction = model_service.predict(features)
        
        return {
            "features": features,
            "prediction": prediction,
            "visuals": visuals
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing signal: {str(e)}")

@router.post("/predict")
def predict_signal(input_data: SignalInput):
    signal = np.array(input_data.amplitude)
    features = extract_physical_features(signal, sampling_rate=input_data.sampling_rate)
    prediction = model_service.predict(features)
    return {
        "features": features,
        "prediction": prediction
    }

@router.post("/intervention")
def perform_intervention(req: InterventionRequest):
    orig_signal = np.array(req.amplitude)
    sampling_rate = req.sampling_rate
    
    # 1. Baseline analysis
    orig_features = extract_physical_features(orig_signal, sampling_rate=sampling_rate)
    orig_pred = model_service.predict(orig_features)
    
    # 2. CRITICAL ANTI-CHEATING STEP: Modify signal mathematically in frequency domain
    mod_signal = apply_controlled_intervention(
        orig_signal,
        sampling_rate=sampling_rate,
        target_freq_min=req.target_freq_min,
        target_freq_max=req.target_freq_max,
        amplitude_multiplier=req.amplitude_multiplier,
        additive_noise_std=req.additive_noise_std
    )
    
    # 3. Extract features from modified signal
    mod_features = extract_physical_features(mod_signal, sampling_rate=sampling_rate)
    
    # 4. Predict using SAME trained ML model
    mod_pred = model_service.predict(mod_features)
    
    # 5. Compute feature and prediction deltas
    feature_deltas = {}
    for k in orig_features:
        before = orig_features[k]
        after = mod_features[k]
        diff = after - before
        pct = (diff / before * 100.0) if before != 0 else 0.0
        feature_deltas[k] = {
            "before": round(before, 6),
            "after": round(after, 6),
            "delta": round(diff, 6),
            "percentage_change": round(pct, 2)
        }
        
    pred_delta = {
        "fault_prob_before": orig_pred["fault_probability"],
        "fault_prob_after": mod_pred["fault_probability"],
        "fault_prob_delta_percentage_points": round((mod_pred["fault_probability"] - orig_pred["fault_probability"]) * 100.0, 2)
    }
    
    interpretation = generate_scientific_interpretation(orig_features, mod_features, orig_pred, mod_pred)
    
    visual_before = prepare_visual_data(orig_signal, sampling_rate=sampling_rate)
    visual_after = prepare_visual_data(mod_signal, sampling_rate=sampling_rate)
    
    return {
        "original_features": orig_features,
        "modified_features": mod_features,
        "original_prediction": orig_pred,
        "modified_prediction": mod_pred,
        "feature_deltas": feature_deltas,
        "prediction_delta": pred_delta,
        "scientific_interpretation": interpretation,
        "visual_signal_before": visual_before,
        "visual_signal_after": visual_after
    }

@router.post("/upload")
async def upload_csv_signal(file: UploadFile = File(...)):
    # File type security check
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .csv files are supported.")
        
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit (5MB).")
        
    import io
    try:
        # First attempt standard CSV reading
        df = pd.read_csv(io.BytesIO(contents))
        num_cols = df.select_dtypes(include=[np.number]).columns
        if len(num_cols) > 0:
            col_name = "amplitude" if "amplitude" in df.columns else num_cols[0]
            amplitude_vals = [float(x) for x in df[col_name].dropna().values]
        else:
            # Fallback: parse single column without header
            df_no_header = pd.read_csv(io.BytesIO(contents), header=None)
            num_cols_nh = df_no_header.select_dtypes(include=[np.number]).columns
            if len(num_cols_nh) > 0:
                amplitude_vals = [float(x) for x in df_no_header[num_cols_nh[0]].dropna().values]
            else:
                raise ValueError("No numeric data found")
    except Exception:
        # Fallback: plain text lines parsing
        try:
            text = contents.decode('utf-8', errors='ignore')
            lines = [line.strip() for line in text.replace(',', '\n').split('\n') if line.strip()]
            amplitude_vals = []
            for line in lines:
                try:
                    amplitude_vals.append(float(line))
                except ValueError:
                    continue
            if not amplitude_vals:
                raise HTTPException(status_code=400, detail="CSV file must contain numeric values for signal amplitude.")
        except Exception:
            raise HTTPException(status_code=400, detail="Malformed CSV file could not be parsed.")
    
    if len(amplitude_vals) < 100:
        raise HTTPException(status_code=400, detail="Signal must contain at least 100 sample data points.")
        
    if len(amplitude_vals) > settings.MAX_SIGNAL_POINTS:
        amplitude_vals = amplitude_vals[:settings.MAX_SIGNAL_POINTS]
        
    signal = np.array(amplitude_vals)
    features = extract_physical_features(signal, sampling_rate=settings.SAMPLING_RATE)
    visuals = prepare_visual_data(signal, sampling_rate=settings.SAMPLING_RATE)
    prediction = model_service.predict(features)
    
    return {
        "filename": os.path.basename(file.filename),
        "total_samples": len(amplitude_vals),
        "amplitude": amplitude_vals,
        "features": features,
        "prediction": prediction,
        "visuals": visuals
    }
