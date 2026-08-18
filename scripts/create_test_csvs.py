import os
import numpy as np
import pandas as pd
from generate_demo_data import generate_vibration_signal

def main():
    os.makedirs("test_datasets", exist_ok=True)
    
    # 1. Normal Machine Operating Signal (30Hz baseline, low noise)
    df_normal = generate_vibration_signal(fault_severity=0.03, noise_level=0.08, seed=12)
    df_normal.to_csv("test_datasets/1_normal_machine_baseline.csv", index=False)
    
    # 2. Severe Bearing Fault Signal (High 120Hz & 240Hz harmonics)
    df_severe_fault = generate_vibration_signal(fault_severity=0.95, noise_level=0.15, seed=88)
    df_severe_fault.to_csv("test_datasets/2_severe_bearing_fault.csv", index=False)

    # 3. Incipient / Mild Fault Signal (Slight 120Hz onset severity 0.35)
    df_mild_fault = generate_vibration_signal(fault_severity=0.38, noise_level=0.1, seed=404)
    df_mild_fault.to_csv("test_datasets/3_incipient_mild_fault.csv", index=False)

    # 4. Noisy Machinery Signal (High environmental Gaussian noise)
    df_noisy = generate_vibration_signal(fault_severity=0.7, noise_level=0.45, seed=999)
    df_noisy.to_csv("test_datasets/4_noisy_factory_environment.csv", index=False)

    # 5. Raw Single Column CSV (Headerless amplitude values for testing fallback parser)
    amps = df_severe_fault["amplitude"].values
    pd.DataFrame(amps).to_csv("test_datasets/5_raw_headerless_amplitude.csv", index=False, header=False)

    print("Generated 5 test datasets in folder: test_datasets/")

if __name__ == "__main__":
    main()
