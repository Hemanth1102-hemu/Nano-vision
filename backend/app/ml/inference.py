import os
import joblib
import numpy as np
from typing import Dict, Any, List
from app.core.config import settings

class ModelService:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        self.feature_names = []
        self.metrics = {}
        self.load_model()
        
    def load_model(self):
        # Security: only load local repository model artifact
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Trained model artifact not found at {self.model_path}")
        
        data = joblib.load(self.model_path)
        self.model = data["model"]
        self.feature_names = data["feature_names"]
        self.metrics = data.get("metrics", {})

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        if not self.model:
            self.load_model()
            
        feature_vector = np.array([[features[name] for name in self.feature_names]])
        probabilities = self.model.predict_proba(feature_vector)[0]
        
        classes = self.model.classes_ # 0 = NORMAL, 1 = FAULT
        normal_idx = int(np.where(classes == 0)[0][0])
        fault_idx = int(np.where(classes == 1)[0][0])
        
        normal_prob = float(probabilities[normal_idx])
        fault_prob = float(probabilities[fault_idx])
        
        pred_class = "FAULT" if fault_prob >= 0.5 else "NORMAL"
        
        # Calculate feature importances
        importances = self.model.feature_importances_
        feat_imp = {name: float(imp) for name, imp in zip(self.feature_names, importances)}
        
        return {
            "predicted_class": pred_class,
            "normal_probability": round(normal_prob, 4),
            "fault_probability": round(fault_prob, 4),
            "feature_importances": feat_imp
        }

model_service = ModelService()
