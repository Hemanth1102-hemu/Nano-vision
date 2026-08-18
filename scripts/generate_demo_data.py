import os
import numpy as np
import pandas as pd

def generate_vibration_signal(
    duration: float = 2.0,
    sampling_rate: int = 2000,
    base_freq: float = 30.0,
    fault_freq: float = 120.0,
    fault_severity: float = 0.0,  # 0.0 = Normal, 1.0 = High Fault
    noise_level: float = 0.1,
    seed: int = 42
) -> pd.DataFrame:
    """
    Generates controlled synthetic machine vibration signal.
    
    Formula:
    s(t) = A_base * sin(2*pi*f_base*t) 
           + A_fault * sin(2*pi*f_fault*t) 
           + A_harm * sin(4*pi*f_fault*t)
           + noise(t)
    """
    np.random.seed(seed)
    t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
    
    # Base rotational component
    a_base = 1.0
    signal = a_base * np.sin(2 * np.pi * base_freq * t)
    
    # Fault component at characteristic frequency (120 Hz)
    a_fault = fault_severity * 1.5
    signal += a_fault * np.sin(2 * np.pi * fault_freq * t)
    
    # Fault harmonic component (240 Hz)
    if fault_severity > 0:
        a_harm = fault_severity * 0.5
        signal += a_harm * np.sin(2 * np.pi * (2 * fault_freq) * t)
        
    # Add random Gaussian noise
    noise = np.random.normal(0, noise_level, size=len(t))
    signal += noise
    
    df = pd.DataFrame({
        "time": t,
        "amplitude": signal
    })
    return df

def main():
    os.makedirs("backend/data/sample", exist_ok=True)
    
    # Generate Normal baseline
    df_normal = generate_vibration_signal(fault_severity=0.05, seed=42)
    df_normal.to_csv("backend/data/sample/normal_signal.csv", index=False)
    
    # Generate Fault sample
    df_fault = generate_vibration_signal(fault_severity=0.85, seed=101)
    df_fault.to_csv("backend/data/sample/fault_signal.csv", index=False)
    
    # Generate Dataset for Training
    dataset_rows = []
    
    # Generate 200 normal signals and 200 fault signals with varied severities
    for i in range(250):
        # Normal (0.0 to 0.2 severity)
        sev_norm = np.random.uniform(0.0, 0.2)
        seed_norm = i
        df = generate_vibration_signal(fault_severity=sev_norm, seed=seed_norm)
        amps = df["amplitude"].values
        dataset_rows.append((amps, 0)) # 0 = NORMAL
        
        # Fault (0.5 to 1.2 severity)
        sev_fault = np.random.uniform(0.45, 1.2)
        seed_fault = i + 1000
        df_f = generate_vibration_signal(fault_severity=sev_fault, seed=seed_fault)
        amps_f = df_f["amplitude"].values
        dataset_rows.append((amps_f, 1)) # 1 = FAULT

    print(f"Generated sample files in backend/data/sample/")
    print(f"Total dataset samples prepared for training: {len(dataset_rows)}")

if __name__ == "__main__":
    main()
