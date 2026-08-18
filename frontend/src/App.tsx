import React, { useState, useEffect } from 'react';
import { Activity, Upload, Play, Cpu, Layers, HelpCircle } from 'lucide-react';
import { analyzeSignal, applyIntervention, uploadCSV } from './services/api';
import { generateSyntheticSignal } from './utils/demoData';
import { SignalCharts } from './charts/SignalCharts';
import { FeatureMetricsGrid } from './components/FeatureMetricsGrid';
import { ModelPredictionCard } from './components/ModelPredictionCard';
import { ControlledInterventionPanel } from './components/InterventionPanel';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { FeatureMap, PredictionResult, VisualSignalData, InterventionResponseData } from './types';

export function App() {
  const [currentSignal, setCurrentSignal] = useState<number[]>([]);
  const [features, setFeatures] = useState<FeatureMap | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [visuals, setVisuals] = useState<VisualSignalData | null>(null);
  const [interventionResult, setInterventionResult] = useState<InterventionResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'intervention' | 'scientific'>('analysis');

  // Sliders
  const [amplitudeMultiplier, setAmplitudeMultiplier] = useState<number>(3.0);
  const [additiveNoiseStd, setAdditiveNoiseStd] = useState<number>(0.05);

  // Load Demo Signal automatically on mount
  useEffect(() => {
    handleLoadDemo('NORMAL');
  }, []);

  const handleLoadDemo = async (type: 'NORMAL' | 'FAULT') => {
    setLoading(true);
    setInterventionResult(null);
    try {
      const signal = generateSyntheticSignal(type);
      setCurrentSignal(signal);
      const data = await analyzeSignal(signal);
      setFeatures(data.features);
      setPrediction(data.prediction);
      setVisuals(data.visuals);
    } catch (err: any) {
      console.error("Failed to load demo signal:", err);
      alert(`API Error (${err.config?.baseURL || 'URL'}): ${err.response?.data?.detail || err.message || "Failed to communicate with backend service"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setInterventionResult(null);
    try {
      const data = await uploadCSV(file);
      setCurrentSignal(data.amplitude);
      setFeatures(data.features);
      setPrediction(data.prediction);
      setVisuals(data.visuals);
    } catch (err: any) {
      console.error("Upload error details:", err);
      const detail = err.response?.data?.detail || err.message || "Error uploading signal CSV";
      const status = err.response?.status ? ` [HTTP ${err.response.status}]` : '';
      alert(`CSV Upload Failed${status}: ${detail}`);
    } finally {
      event.target.value = '';
      setLoading(false);
    }
  };

  const handleRunIntervention = async () => {
    if (!currentSignal.length) return;
    setLoading(true);
    try {
      const res = await applyIntervention({
        amplitude: currentSignal,
        amplitudeMultiplier,
        additiveNoiseStd,
      });
      setInterventionResult(res);
      setActiveTab('intervention');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error running physical intervention");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0e] text-gray-200">
      {/* Header Bar */}
      <header className="border-b border-[#2a313d] bg-[#14171d] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/40 rounded text-amber-500">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-wider text-gray-100 uppercase">
              PhysioXAI
            </h1>
            <p className="text-[10px] font-mono text-gray-400">
              Physics-Grounded Explainable AI Workstation | Vibration Diagnostics
            </p>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleLoadDemo('NORMAL')}
            disabled={loading}
            className="px-3 py-1.5 bg-[#1a1d23] hover:bg-[#2a313d] border border-[#2a313d] rounded text-xs font-mono text-emerald-400 flex items-center space-x-1.5 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Load Demo (Normal)</span>
          </button>

          <button
            onClick={() => handleLoadDemo('FAULT')}
            disabled={loading}
            className="px-3 py-1.5 bg-[#1a1d23] hover:bg-[#2a313d] border border-[#2a313d] rounded text-xs font-mono text-red-400 flex items-center space-x-1.5 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Load Demo (Fault)</span>
          </button>

          <label className="px-3 py-1.5 bg-[#d97706]/20 hover:bg-[#d97706]/30 border border-[#d97706]/40 text-amber-400 rounded text-xs font-mono flex items-center space-x-1.5 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2a313d] space-x-4">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-2 px-1 font-mono text-xs uppercase tracking-wider flex items-center space-x-2 border-b-2 ${
              activeTab === 'analysis'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Baseline Signal & Model Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('intervention')}
            className={`pb-2 px-1 font-mono text-xs uppercase tracking-wider flex items-center space-x-2 border-b-2 ${
              activeTab === 'intervention'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Controlled Physical Intervention</span>
          </button>

          <button
            onClick={() => setActiveTab('scientific')}
            className={`pb-2 px-1 font-mono text-xs uppercase tracking-wider flex items-center space-x-2 border-b-2 ${
              activeTab === 'scientific'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Scientific Methodology & Integrity</span>
          </button>
        </div>

        {/* TAB 1: BASELINE ANALYSIS */}
        {activeTab === 'analysis' && visuals && features && prediction && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SignalCharts
                  timeSeries={visuals.time_series}
                  fftSpectrum={visuals.fft_spectrum}
                  title="Baseline Signal"
                />
              </div>
              <div className="space-y-6">
                <ModelPredictionCard prediction={prediction} title="Baseline Classifier Output" />
                <div className="bg-[#14171d] border border-[#2a313d] p-4 rounded text-xs text-gray-400 font-mono space-y-2">
                  <div className="text-gray-300 font-bold uppercase">Signal Metadata</div>
                  <div>Sampling Rate: 2000 Hz</div>
                  <div>Duration: 2.0 Seconds</div>
                  <div>Total Points: {currentSignal.length}</div>
                  <div>Characteristic Band: 100 Hz – 140 Hz</div>
                </div>
              </div>
            </div>

            <FeatureMetricsGrid features={features} title="Measured Physical Features" />

            <ControlledInterventionPanel
              amplitudeMultiplier={amplitudeMultiplier}
              setAmplitudeMultiplier={setAmplitudeMultiplier}
              additiveNoiseStd={additiveNoiseStd}
              setAdditiveNoiseStd={setAdditiveNoiseStd}
              onApplyIntervention={handleRunIntervention}
              loading={loading}
            />
          </div>
        )}

        {/* TAB 2: INTERVENTION EXPERIMENT RESULTS */}
        {activeTab === 'intervention' && (
          <div className="space-y-6">
            <ControlledInterventionPanel
              amplitudeMultiplier={amplitudeMultiplier}
              setAmplitudeMultiplier={setAmplitudeMultiplier}
              additiveNoiseStd={additiveNoiseStd}
              setAdditiveNoiseStd={setAdditiveNoiseStd}
              onApplyIntervention={handleRunIntervention}
              loading={loading}
            />

            {interventionResult ? (
              <>
                <BeforeAfterComparison data={interventionResult} />

                {/* Side-by-side Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-gray-400 mb-2">Original Baseline Signal</h4>
                    <SignalCharts
                      timeSeries={interventionResult.visual_signal_before.time_series}
                      fftSpectrum={interventionResult.visual_signal_before.fft_spectrum}
                      isModified={false}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase text-amber-400 mb-2">Modified Signal (Intervention)</h4>
                    <SignalCharts
                      timeSeries={interventionResult.visual_signal_after.time_series}
                      fftSpectrum={interventionResult.visual_signal_after.fft_spectrum}
                      isModified={true}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#14171d] border border-[#2a313d] rounded p-8 text-center font-mono text-xs text-gray-500">
                Adjust sliders above and click <span className="text-amber-400">APPLY CONTROLLED INTERVENTION</span> to run the experiment.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCIENTIFIC METHODOLOGY & INTEGRITY */}
        {activeTab === 'scientific' && (
          <div className="bg-[#14171d] border border-[#2a313d] rounded p-6 space-y-6 text-sm font-mono leading-relaxed">
            <h2 className="text-base text-amber-400 font-bold border-b border-[#2a313d] pb-2 uppercase tracking-wider">
              Scientific Methodology & Anti-Cheating Architecture
            </h2>

            <div className="space-y-4 text-gray-300">
              <h3 className="text-xs text-gray-400 font-bold uppercase">1. Anti-Cheating Guarantee</h3>
              <p>
                The intervention engine NEVER modifies model prediction probabilities directly. Instead, when an intervention slider is moved, the backend mathematically modifies the physical frequency components of the signal using FFT, reconstructs the time-domain signal via IFFT, extracts new physical features, and passes those new features into the EXACT SAME pre-trained Random Forest model artifact.
              </p>

              <h3 className="text-xs text-gray-400 font-bold uppercase">2. Defensible Scientific Terminology</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong className="text-amber-400">Allowed Wording:</strong> "The system demonstrates sensitivity to a measurable physical feature through controlled intervention."</li>
                <li><strong className="text-amber-400">Prohibited Claims:</strong> NEVER claim "Our AI understands physics", "The AI discovered causality", or "100% proven diagnostic accuracy".</li>
              </ul>

              <h3 className="text-xs text-gray-400 font-bold uppercase">3. Prototype Disclaimer</h3>
              <p className="text-xs text-gray-500">
                This prototype demonstrates physics-grounded signal sensitivity using controlled vibration signals. It is not a certified industrial fault-diagnosis system and should not be used as the sole basis for safety-critical decisions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a313d] bg-[#14171d] px-6 py-3 text-center text-[10px] font-mono text-gray-500">
        PhysioXAI &copy; Nano Technology Hackathon Project | Physics-Grounded Explainable AI Workstation
      </footer>
    </div>
  );
}

export default App;
