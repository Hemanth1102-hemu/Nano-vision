import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PhysioXAI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Security & Origins
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Model configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", "backend/models/physioxai_rf_model.joblib")
    
    # Limits & Security Controls
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
    MAX_SIGNAL_POINTS: int = 50000
    SAMPLING_RATE: int = 2000
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
