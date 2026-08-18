# PhysioXAI Hackathon 3-Minute Demo Flow

## 1. Introduction (30 Seconds)
- **Problem**: AI classifiers can achieve 99% accuracy on signal data by relying on spurious correlations or noise rather than true physical mechanisms.
- **PhysioXAI Solution**: An engineering workstation that proves model sensitivity through **controlled physical intervention**.

## 2. Baseline Signal Analysis (1 Minute)
1. Click **"Load Demo (Normal)"**.
2. Show the **Time-Domain Waveform** (30 Hz rotation) and single-sided **FFT Spectrum**.
3. Highlight extracted physical features:
   - RMS, Peak, Crest Factor.
   - **Characteristic Frequency-Band Energy (100–140 Hz)**: Currently ~0.005 g².
4. View **Model Prediction**: **NORMAL (98.4%)**, Fault (1.6%).

## 3. Controlled Physical Intervention (1 Minute)
1. Move the **Characteristic Band Energy Multiplier** slider from `1.0x` to `5.0x`.
2. Click **"APPLY CONTROLLED INTERVENTION"**.
3. Point out the anti-cheating mechanism:
   - The backend modifies the frequency spectrum math using FFT.
   - Reconstructs the signal via Inverse FFT.
   - Re-extracts physical features.
   - Evaluates features using the **exact same pre-trained model artifact**.

## 4. Before / After Evidence & Scientific Interpretation (30 Seconds)
1. Show **Feature Delta**: Characteristic Band Energy increased by +420%.
2. Show **Prediction Shift**: Model output shifted from 1.6% Fault $\rightarrow$ **86.4% FAULT**.
3. Read the **Empirical Interpretation**:
   > "Controlled intervention increased characteristic frequency-band energy (100-140 Hz) by 420.0%. In response, the classifier's estimated fault probability increased from 1.6% to 86.4%."
4. Emphasize **Scientific Responsibility**: We do NOT claim the AI "understands physics" or "discovered causality"—we provide empirical evidence of sensitivity to controlled feature intervention.
