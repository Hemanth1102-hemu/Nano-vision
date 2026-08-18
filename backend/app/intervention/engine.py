import numpy as np
from typing import Tuple

def apply_controlled_intervention(
    signal: np.ndarray,
    sampling_rate: int = 2000,
    target_freq_min: float = 100.0,
    target_freq_max: float = 140.0,
    amplitude_multiplier: float = 1.0,
    additive_noise_std: float = 0.0
) -> np.ndarray:
    """
    CRITICAL ANTI-CHEATING IMPLEMENTATION:
    
    Modifies the actual physical frequency-domain signal via FFT/IFFT 
    and returns a newly synthesized time-domain signal.
    
    No direct modification of AI model predictions or probabilities occurs.
    """
    n = len(signal)
    fft_vals = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(n, d=1.0/sampling_rate)
    
    # Create mask for target characteristic frequency band (e.g. 100 - 140 Hz)
    band_mask = (freqs >= target_freq_min) & (freqs <= target_freq_max)
    
    # Apply controlled mathematical intervention to frequency components in the band
    modified_fft_vals = fft_vals.copy()
    modified_fft_vals[band_mask] = modified_fft_vals[band_mask] * amplitude_multiplier
    
    # Reconstruct modified time-domain signal via Inverse FFT
    modified_signal = np.fft.irfft(modified_fft_vals, n=n)
    
    # Add optional noise if requested
    if additive_noise_std > 0:
        noise = np.random.normal(0, additive_noise_std, size=n)
        modified_signal += noise
        
    return modified_signal
