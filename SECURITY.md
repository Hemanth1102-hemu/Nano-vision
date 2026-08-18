# PhysioXAI Security Architecture

## Threat Model Summary

| Threat Category | Potential Attack Vector | Mitigation Strategy |
| :--- | :--- | :--- |
| **File Upload Vulnerabilities** | Malicious script upload, oversized files, Zip bombs | Validate file extension (`.csv`), enforce 5MB limit, row limit (50,000 pts), numeric column parsing in memory without executing code. |
| **Model Insecurity** | Deserialization attacks via arbitrary user-uploaded pickle/joblib files | Strict ban on user model upload. Load only pre-approved repository-controlled model artifacts verified at startup. |
| **Path Traversal** | Manipulating filename parameters (`../../etc/passwd`) | Path traversal protection. Use strict `os.path.basename` and temporary in-memory streams (`io.BytesIO`). |
| **Command Injection** | Shell code execution from user input parameters | No execution of `subprocess` or `shell=True` commands based on user inputs anywhere in the application. |
| **Resource Exhaustion** | Denial of Service via massive FFT computation requests | Enforce maximum array length limits (50,000 points) and rate limiting on expensive endpoints (`/intervention`). |
| **CORS & Headers** | Cross-Origin Request Forgery / Clickjacking | Restricted `allow_origins=[FRONTEND_URL]` in production; strict security headers (`X-Content-Type-Options`, `Content-Security-Policy`). |

## Key Security Policies
1. **No Debug Mode in Production**: FastAPI documentation and stack trace returns disabled in production environments.
2. **Privacy**: Zero collection of Personally Identifiable Information (PII) or user telemetry.
3. **Secrets Management**: Credentials and environment configurations isolated via `.env` files and `Pydantic BaseSettings`.
