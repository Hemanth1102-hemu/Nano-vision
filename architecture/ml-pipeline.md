# ML Pipeline & Explainability Architecture

## Machine Learning Pipeline
The classifier is a Random Forest model trained on synthetic vibration signals representing machine operating states:

- **NORMAL (Class 0)**: Dominant baseline rotational frequency (30 Hz), minimal harmonic distortion, low high-frequency energy.
- **FAULT (Class 1)**: Presence of bearing/gear characteristic fault frequencies (120 Hz) and associated harmonics (240 Hz).

### Feature Space
1. `rms`: Root Mean Square amplitude
2. `peak`: Maximum absolute amplitude
3. `crest_factor`: Peak-to-RMS ratio
4. `spectral_centroid`: Center of mass of frequency spectrum
5. `spectral_energy`: Total spectral power
6. `dominant_frequency`: Frequency with peak magnitude
7. `char_band_energy`: Band energy in characteristic fault range (100 - 140 Hz)
8. `low_band_energy`: Band energy in baseline rotation range (20 - 40 Hz)

## Anti-Cheating & Sensitivity Evidence
Explainability is established through controlled physical intervention rather than relying solely on post-hoc feature attributions.

```mermaid
graph LR
    Signal[Raw Vibration Signal] --> FFT[Single-Sided FFT]
    FFT --> BandMod[Manipulate 100-140Hz Frequency Components]
    BandMod --> IFFT[Reconstruct Modified Waveform via IFFT]
    IFFT --> Extractor[Extract 8 Physical Features]
    Extractor --> RF[Pre-trained RF Model Artifact]
    RF --> Probability[Fault Probability Response]
```
