import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from app.signal_processing.features import extract_physical_features
from generate_demo_data import generate_vibration_signal

FEATURE_NAMES = [
    "rms",
    "peak",
    "crest_factor",
    "spectral_centroid",
    "spectral_energy",
    "dominant_frequency",
    "char_band_energy",
    "low_band_energy"
]

def train_and_save_model():
    print("Generating dataset for training...")
    X = []
    y = []
    
    np.random.seed(42)
    for i in range(300):
        # Normal samples (severity 0.0 - 0.2)
        sev_norm = np.random.uniform(0.0, 0.2)
        df_n = generate_vibration_signal(fault_severity=sev_norm, seed=i)
        feats_n = extract_physical_features(df_n["amplitude"].values)
        X.append([feats_n[k] for k in FEATURE_NAMES])
        y.append(0) # 0 = NORMAL
        
        # Fault samples (severity 0.45 - 1.2)
        sev_f = np.random.uniform(0.45, 1.2)
        df_f = generate_vibration_signal(fault_severity=sev_f, seed=i+5000)
        feats_f = extract_physical_features(df_f["amplitude"].values)
        X.append([feats_f[k] for k in FEATURE_NAMES])
        y.append(1) # 1 = FAULT

    X = np.array(X)
    y = np.array(y)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training Random Forest Classifier on {len(X_train)} samples...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1 Score:  {f1 * 100:.2f}%")
    print("---------------------------------\n")
    
    os.makedirs("backend/models", exist_ok=True)
    model_path = "backend/models/physioxai_rf_model.joblib"
    joblib.dump({"model": clf, "feature_names": FEATURE_NAMES, "metrics": {"accuracy": acc, "f1": f1}}, model_path)
    print(f"Model saved successfully to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
