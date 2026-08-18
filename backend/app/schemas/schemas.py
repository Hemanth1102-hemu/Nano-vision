from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Any

class SignalInput(BaseModel):
    amplitude: List[float] = Field(..., description="Vibration amplitude values")
    sampling_rate: int = Field(2000, ge=100, le=50000, description="Sampling rate in Hz")
    
    @validator("amplitude")
    def validate_amplitude(cls, v):
        if not v:
            raise ValueError("Signal amplitude array cannot be empty.")
        if len(v) > 50000:
            raise ValueError("Signal length exceeds maximum allowed 50,000 sample points.")
        import numpy as np
        arr = np.array(v)
        if np.isnan(arr).any() or np.isinf(arr).any():
            raise ValueError("Signal contains invalid values (NaN or Infinity).")
        return v

class InterventionRequest(BaseModel):
    amplitude: List[float] = Field(..., description="Original signal amplitude values")
    sampling_rate: int = Field(2000, ge=100, le=50000)
    target_freq_min: float = Field(100.0, ge=0.0, le=25000.0)
    target_freq_max: float = Field(140.0, ge=0.0, le=25000.0)
    amplitude_multiplier: float = Field(1.0, ge=0.0, le=10.0, description="Multiplier for target frequency band")
    additive_noise_std: float = Field(0.0, ge=0.0, le=2.0, description="Standard deviation of additive noise")

class PredictionResponse(BaseModel):
    predicted_class: str
    normal_probability: float
    fault_probability: float
    features: Dict[str, float]

class FFTPoint(BaseModel):
    frequency: float
    amplitude: float

class VisualSignalData(BaseModel):
    time_series: List[Dict[str, float]]
    fft_spectrum: List[FFTPoint]
    char_freq_band: Dict[str, float]

class InterventionResponse(BaseModel):
    original_features: Dict[str, float]
    modified_features: Dict[str, float]
    original_prediction: Dict[str, Any]
    modified_prediction: Dict[str, Any]
    feature_deltas: Dict[str, Dict[str, float]]
    prediction_delta: Dict[str, float]
    scientific_interpretation: str
    visual_signal_before: VisualSignalData
    visual_signal_after: VisualSignalData
