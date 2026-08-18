# System Architecture: PhysioXAI

PhysioXAI is designed with a decoupled React/TypeScript frontend workstation and a FastAPI backend service powering signal processing, ML inference, and physical intervention.

```mermaid
graph TD
    Client[React/TS Frontend Dashboard] -->|REST API Requests| API[FastAPI Gateway]
    
    subgraph Backend [PhysioXAI Python Backend]
        API --> Val[Input Validation & Sanitization]
        Val --> SP[Signal Processing & FFT Module]
        SP --> Feat[Physical Feature Extractor]
        
        Feat --> ML[Trained RF Classifier Model]
        ML --> Pred[Baseline Probabilities]
        
        API --> IntEngine[Controlled Physical Intervention Engine]
        IntEngine -->|Frequency-Domain Math| ModSignal[Synthesized Time-Domain Signal]
        ModSignal --> SP
        
        ModSignal --> Exp[Explainability & Delta Engine]
        Exp --> Resp[Scientific Evidence Payload]
    end
    
    Resp --> Client
```

## Security Boundaries
1. **Pydantic Validation Layer**: All numeric signals, sampling rates, and frequency boundaries are bounded and sanitized before hitting SciPy/NumPy computations.
2. **Model Integrity**: The Random Forest model artifact is strictly loaded from repository storage. Model uploading is forbidden to prevent arbitrary pickle code execution.
3. **CORS & Headers**: Strict CORS origin checking via `FRONTEND_URL` and security headers (`X-Content-Type-Options`, `Content-Security-Policy`).
