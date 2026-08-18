import React from 'react';
import { PredictionResult } from '../types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult;
  title?: string;
}

export const ModelPredictionCard: React.FC<PredictionCardProps> = ({ prediction, title = "Trained ML Model Output" }) => {
  const isFault = prediction.predicted_class === 'FAULT';
  const faultPct = (prediction.fault_probability * 100).toFixed(1);
  const normalPct = (prediction.normal_probability * 100).toFixed(1);

  return (
    <div className="bg-[#14171d] border border-[#2a313d] rounded p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-[#2a313d] pb-2 mb-3">
          <h3 className="text-xs font-mono uppercase text-gray-400">{title}</h3>
          <span className="text-[10px] font-mono text-gray-500">Classifier: Random Forest</span>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          {isFault ? (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          )}
          <div>
            <div className="text-2xl font-mono font-bold tracking-wide">
              {prediction.predicted_class}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Estimated Fault Probability: <span className="font-bold text-amber-500">{faultPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="space-y-2 pt-2 border-t border-[#2a313d]">
        <div>
          <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
            <span>NORMAL Probability</span>
            <span>{normalPct}%</span>
          </div>
          <div className="h-2 w-full bg-[#1a1d23] rounded overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${normalPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
            <span>FAULT Probability</span>
            <span>{faultPct}%</span>
          </div>
          <div className="h-2 w-full bg-[#1a1d23] rounded overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${faultPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
