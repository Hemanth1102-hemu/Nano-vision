import React from 'react';
import { InterventionResponseData } from '../types';
import { ArrowRight, Info, AlertTriangle } from 'lucide-react';

interface ComparisonProps {
  data: InterventionResponseData;
}

export const BeforeAfterComparison: React.FC<ComparisonProps> = ({ data }) => {
  const { feature_deltas, prediction_delta, scientific_interpretation } = data;
  const charDelta = feature_deltas.char_band_energy;

  return (
    <div className="space-y-4">
      {/* Before / After Metrics Summary */}
      <div className="bg-[#14171d] border border-[#2a313d] rounded p-4">
        <h3 className="text-xs font-mono uppercase text-gray-400 mb-3 border-b border-[#2a313d] pb-2">
          Experimental Evidence: Before / After Delta
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Physical Feature Shift */}
          <div className="bg-[#1a1d23] border border-[#2a313d] p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-gray-400 mb-2">
              Manipulated Feature: Characteristic Band Energy (100-140Hz)
            </div>
            <div className="flex justify-between items-center font-mono">
              <div>
                <div className="text-xs text-gray-500">Before</div>
                <div className="text-sm font-bold text-gray-300">{charDelta.before.toFixed(4)} g²</div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs text-gray-500">After</div>
                <div className="text-sm font-bold text-amber-400">{charDelta.after.toFixed(4)} g²</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Change</div>
                <div className={`text-sm font-bold ${charDelta.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {charDelta.percentage_change >= 0 ? '+' : ''}{charDelta.percentage_change.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Model Output Shift */}
          <div className="bg-[#1a1d23] border border-[#2a313d] p-3 rounded">
            <div className="text-[10px] font-mono uppercase text-gray-400 mb-2">
              Model Prediction Shift (Same Model Artifact)
            </div>
            <div className="flex justify-between items-center font-mono">
              <div>
                <div className="text-xs text-gray-500">Fault Prob Before</div>
                <div className="text-sm font-bold text-gray-300">{(prediction_delta.fault_prob_before * 100).toFixed(1)}%</div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs text-gray-500">Fault Prob After</div>
                <div className="text-sm font-bold text-amber-400">{(prediction_delta.fault_prob_after * 100).toFixed(1)}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Shift</div>
                <div className="text-sm font-bold text-amber-400">
                  {prediction_delta.fault_prob_delta_percentage_points >= 0 ? '+' : ''}
                  {prediction_delta.fault_prob_delta_percentage_points.toFixed(1)} pts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Interpretation Card */}
      <div className="bg-[#1e1b18] border border-[#d97706] rounded p-4 space-y-2">
        <div className="flex items-center space-x-2 border-b border-[#d97706]/40 pb-2">
          <Info className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-mono uppercase text-amber-400 font-bold">
            Empirical Scientific Interpretation
          </h4>
        </div>
        <p className="text-xs text-gray-300 font-mono leading-relaxed">
          {scientific_interpretation}
        </p>
      </div>

      {/* Scientific Integrity Disclaimer */}
      <div className="bg-[#14171d] border border-[#2a313d] rounded p-3 flex items-start space-x-3">
        <AlertTriangle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-[11px] text-gray-400 font-mono leading-normal">
          <strong className="text-gray-300">Scientific Responsibility Disclaimer:</strong> This experiment provides empirical evidence that the classifier responds to the controlled feature manipulation. It does NOT claim that the AI possesses intrinsic physical understanding or proven causal knowledge.
        </div>
      </div>
    </div>
  );
};
