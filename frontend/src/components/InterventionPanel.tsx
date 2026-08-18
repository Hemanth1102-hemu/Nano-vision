import React from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

interface InterventionPanelProps {
  amplitudeMultiplier: number;
  setAmplitudeMultiplier: (val: number) => void;
  additiveNoiseStd: number;
  setAdditiveNoiseStd: (val: number) => void;
  onApplyIntervention: () => void;
  loading: boolean;
}

export const ControlledInterventionPanel: React.FC<InterventionPanelProps> = ({
  amplitudeMultiplier,
  setAmplitudeMultiplier,
  additiveNoiseStd,
  setAdditiveNoiseStd,
  onApplyIntervention,
  loading,
}) => {
  return (
    <div className="bg-[#14171d] border border-[#d97706]/40 rounded p-4 space-y-4">
      <div className="flex justify-between items-center border-b border-[#2a313d] pb-2">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            Controlled Physical Intervention Engine
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-500">Target Band: 100 - 140 Hz</span>
      </div>

      <p className="text-xs text-gray-400">
        Directly manipulate physical signal frequency components before model re-computation. 
        Demonstrates classifier output sensitivity through reproducible experimental intervention.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slider 1: Amplitude Multiplier */}
        <div className="bg-[#1a1d23] p-3 rounded border border-[#2a313d]">
          <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
            <span>Characteristic Band Energy Multiplier</span>
            <span className="text-amber-400 font-bold">{amplitudeMultiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="10.0"
            step="0.1"
            value={amplitudeMultiplier}
            onChange={(e) => setAmplitudeMultiplier(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer bg-[#2a313d]"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
            <span>0.0 (Suppressed)</span>
            <span>1.0 (Baseline)</span>
            <span>10.0 (Amplified)</span>
          </div>
        </div>

        {/* Slider 2: Additive Noise */}
        <div className="bg-[#1a1d23] p-3 rounded border border-[#2a313d]">
          <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
            <span>Additive Gaussian Noise (Std Dev)</span>
            <span className="text-amber-400 font-bold">{additiveNoiseStd.toFixed(2)} g</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={additiveNoiseStd}
            onChange={(e) => setAdditiveNoiseStd(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer bg-[#2a313d]"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
            <span>0.0 (Clean)</span>
            <span>0.5 (Moderate)</span>
            <span>1.0 (High Noise)</span>
          </div>
        </div>
      </div>

      <button
        onClick={onApplyIntervention}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-[#d97706] hover:bg-[#b45309] text-white font-mono text-xs uppercase tracking-wider rounded font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Signal & Running Model...</span>
          </>
        ) : (
          <>
            <Sliders className="w-4 h-4" />
            <span>APPLY CONTROLLED INTERVENTION</span>
          </>
        )}
      </button>
    </div>
  );
};
