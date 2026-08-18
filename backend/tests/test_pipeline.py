import pytest
import numpy as np
from app.signal_processing.features import extract_physical_features, compute_fft
from app.intervention.engine import apply_controlled_intervention
from app.ml.inference import model_service

def test_compute_fft():
    # 100 Hz sine wave
    t = np.linspace(0, 1, 2000, endpoint=False)
    signal = np.sin(2 * np.pi * 100 * t)
    freqs, amps = compute_fft(signal, sampling_rate=2000)
    
    idx_100 = np.argmin(np.abs(freqs - 100.0))
    assert amps[idx_100] > 0.9  # Amplitude should be ~1.0

def test_extract_physical_features():
    t = np.linspace(0, 1, 2000, endpoint=False)
    signal = np.sin(2 * np.pi * 120 * t)
    features = extract_physical_features(signal, sampling_rate=2000)
    
    assert "rms" in features
    assert "char_band_energy" in features
    assert features["char_band_energy"] > 0

def test_anti_cheating_intervention():
    # Test that intervention modifies physical signal math and recomputed features, not fake predictions
    t = np.linspace(0, 1, 2000, endpoint=False)
    # Signal with small 120Hz component (0.05 amplitude)
    orig_signal = np.sin(2 * np.pi * 30 * t) + 0.05 * np.sin(2 * np.pi * 120 * t)
    
    orig_features = extract_physical_features(orig_signal, sampling_rate=2000)
    orig_pred = model_service.predict(orig_features)
    
    # Boost 100-140 Hz frequency band (amplifying the 0.05 component to 0.5)
    mod_signal = apply_controlled_intervention(
        orig_signal, sampling_rate=2000,
        target_freq_min=100.0, target_freq_max=140.0,
        amplitude_multiplier=10.0
    )
    
    mod_features = extract_physical_features(mod_signal, sampling_rate=2000)
    mod_pred = model_service.predict(mod_features)
    
    # Assert physical features changed empirically
    assert mod_features["char_band_energy"] != orig_features["char_band_energy"]
    # Assert signal data actually changed
    assert not np.array_equal(orig_signal, mod_signal)
    # Assert model ran on real newly extracted features
    assert "fault_probability" in mod_pred

def test_model_inference():
    t = np.linspace(0, 1, 2000, endpoint=False)
    # High fault signal
    fault_signal = np.sin(2 * np.pi * 30 * t) + 1.5 * np.sin(2 * np.pi * 120 * t)
    features = extract_physical_features(fault_signal, sampling_rate=2000)
    pred = model_service.predict(features)
    
    assert pred["predicted_class"] in ["NORMAL", "FAULT"]
    assert 0.0 <= pred["normal_probability"] <= 1.0
    assert 0.0 <= pred["fault_probability"] <= 1.0
