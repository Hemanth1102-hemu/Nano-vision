# Scientific Methodology & Responsible AI Claims

## Problem Formulation
Machine learning models trained on sensor signals often pick up spurious correlations or noise signatures instead of true physical fault indicators.

PhysioXAI introduces a controlled experimental framework:
1. Extract measurable physical features from raw time-series signals via FFT.
2. Intervene directly on the physical frequency domain (e.g., boosting characteristic 120 Hz band energy).
3. Synthesize the modified signal back into the time domain via Inverse FFT.
4. Pass the modified physical signal through the **exact same trained classifier artifact**.
5. Measure the resulting shift in prediction probability.

## Scientific Integrity Guidelines
To maintain scientific responsibility, PhysioXAI enforces strict claims guidelines across the application UI and documentation:

### Approved Terminology:
- "The system demonstrates sensitivity to a measurable physical feature through controlled intervention."
- "Controlled manipulation of the characteristic frequency produces a measurable change in classifier output."
- "The experiment provides evidence that the classifier responds to the manipulated physical feature."

### Strictly Prohibited Claims:
- "Our AI understands physics."
- "The AI has discovered causality."
- "The model is guaranteed to use the physical feature in all scenarios."
