import numpy as np
from typing import Dict, Any, Tuple

def compute_fft(signal: np.ndarray, sampling_rate: int = 2000) -> Tuple[np.ndarray, np.ndarray]:
    """
    Computes single-sided FFT amplitude spectrum.
    Returns (freqs, amplitudes)
    """
    n = len(signal)
    fft_vals = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(n, d=1.0/sampling_rate)
    amplitudes = (2.0 / n) * np.abs(fft_vals)
    return freqs, amplitudes

def extract_physical_features(
    signal: np.ndarray,
    sampling_rate: int = 2000,
    char_freq_min: float = 100.0,
    char_freq_max: float = 140.0
) -> Dict[str, float]:
    """
    Extracts physically meaningful features from time and frequency domain signal.
    """
    # Time-domain features
    rms = float(np.sqrt(np.mean(signal**2)))
    peak = float(np.max(np.abs(signal)))
    crest_factor = float(peak / (rms + 1e-9))
    
    # Frequency-domain features
    freqs, amps = compute_fft(signal, sampling_rate=sampling_rate)
    
    spectral_energy = float(np.sum(amps**2))
    
    if np.sum(amps) > 0:
        spectral_centroid = float(np.sum(freqs * amps) / np.sum(amps))
    else:
        spectral_centroid = 0.0
        
    dominant_freq_idx = np.argmax(amps)
    dominant_frequency = float(freqs[dominant_freq_idx])
    
    # Characteristic Frequency Band Energy (100 - 140 Hz by default)
    band_mask = (freqs >= char_freq_min) & (freqs <= char_freq_max)
    char_band_energy = float(np.sum(amps[band_mask]**2))
    
    # Other band energies (Baseline rotation 20-40 Hz, Low band 0-50 Hz)
    low_band_mask = (freqs >= 20.0) & (freqs <= 40.0)
    low_band_energy = float(np.sum(amps[low_band_mask]**2))
    
    return {
        "rms": round(rms, 6),
        "peak": round(peak, 6),
        "crest_factor": round(crest_factor, 6),
        "spectral_centroid": round(spectral_centroid, 6),
        "spectral_energy": round(spectral_energy, 6),
        "dominant_frequency": round(dominant_frequency, 6),
        "char_band_energy": round(char_band_energy, 6),
        "low_band_energy": round(low_band_energy, 6)
    }
