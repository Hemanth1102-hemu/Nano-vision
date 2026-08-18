# PhysioXAI

### Physics-Grounded Explainable AI for Physical Signal Classification

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Python: 3.9+](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React: 18](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-emerald.svg)](https://fastapi.tiangolo.com/)

**PhysioXAI** is an engineering analysis workstation designed for the Nano Technology Hackathon challenge: *"AI That Has to Explain the Physical Signal"*.

It demonstrates that controlled intervention on a measurable physical signal feature (such as characteristic frequency-band energy) produces a measurable, reproducible change in an AI classifier's prediction output, without resorting to misleading correlations or fake hardcoded results.

---

## Key Features

1. **Physical Feature Extraction**: Time and frequency-domain analysis (RMS, Peak, Crest Factor, Spectral Centroid, Dominant Frequency, Characteristic Band Energy 100-140Hz).
2. **Anti-Cheating Intervention Engine**: Modifies frequency domain math via FFT, reconstructs time-domain signals via IFFT, re-extracts features, and passes them through the **exact same trained Random Forest model**.
3. **Scientific Integrity First**: Strictly avoids unscientific claims ("AI understands physics" or "AI discovered causality"), adhering strictly to defensible empirical wording ("controlled intervention evidence").
4. **Industrial Workstation Dashboard**: High data-density dark workstation design built with React, TypeScript, Tailwind CSS, and Recharts.
5. **Production Ready & Secure**: Input sanitization, CORS policy, file upload validation, security headers, unit test coverage, Render ready.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: Python 3.9+, FastAPI, Pydantic v2, Uvicorn.
- **Signal Processing & ML**: NumPy, SciPy, Pandas, scikit-learn, Joblib.

---

## Quick Start (Running Locally)

### 1. Prerequisites
- Python 3.9+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Generate synthetic dataset and train model
python3 ../scripts/generate_demo_data.py
python3 ../scripts/train_model.py

# Run FastAPI Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running Tests

```bash
# Backend pytest suite
PYTHONPATH=backend python3 -m pytest backend/tests/
```

---

## Deployment on Render

### Frontend (Static Site)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment Variables: `VITE_API_URL=https://<your-backend-render-service>.onrender.com/api`

### Backend (Web Service)
- Build Command: `pip install -r backend/requirements.txt && python3 scripts/generate_demo_data.py && python3 scripts/train_model.py`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: `FRONTEND_URL=https://<your-frontend-render-app>.onrender.com`

---

## Disclaimer

*This prototype demonstrates physics-grounded signal sensitivity using controlled vibration signals. It is not a certified industrial fault-diagnosis system and should not be used as the sole basis for safety-critical decisions.*
