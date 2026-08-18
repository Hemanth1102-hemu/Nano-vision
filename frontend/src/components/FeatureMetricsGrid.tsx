import React from 'react';
import { FeatureMap } from '../types';
import { Activity, Gauge, Zap, Waves } from 'lucide-react';

interface FeatureGridProps {
  features: FeatureMap;
  title?: string;
}

export const FeatureMetricsGrid: React.FC<FeatureGridProps> = ({ features, title = "Extracted Physical Features" }) => {
  const metrics = [
    { key: "char_band_energy", label: "Char. Band Energy (100-140Hz)", value: features.char_band_energy, unit: "g²", highlight: true, icon: Waves },
    { key: "rms", label: "RMS Amplitude", value: features.rms, unit: "g", highlight: false, icon: Activity },
    { key: "peak", label: "Peak Amplitude", value: features.peak, unit: "g", highlight: false, icon: Gauge },
    { key: "crest_factor", label: "Crest Factor", value: features.crest_factor, unit: "ratio", highlight: false, icon: Zap },
    { key: "dominant_frequency", label: "Dominant Frequency", value: features.dominant_frequency, unit: "Hz", highlight: false, icon: Waves },
    { key: "spectral_centroid", label: "Spectral Centroid", value: features.spectral_centroid, unit: "Hz", highlight: false, icon: Activity },
    { key: "spectral_energy", label: "Total Spectral Energy", value: features.spectral_energy, unit: "g²", highlight: false, icon: Gauge },
    { key: "low_band_energy", label: "Low Band Energy (20-40Hz)", value: features.low_band_energy, unit: "g²", highlight: false, icon: Zap },
  ];

  return (
    <div className="bg-[#14171d] border border-[#2a313d] rounded p-4">
      <h3 className="text-xs font-mono uppercase text-gray-400 mb-3 border-b border-[#2a313d] pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className={`p-3 rounded border ${
                m.highlight
                  ? 'bg-[#1e1b18] border-[#d97706] text-amber-400'
                  : 'bg-[#1a1d23] border-[#2a313d] text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-mono text-gray-400 mb-1">
                <span>{m.label}</span>
                <Icon className="w-3.5 h-3.5 opacity-70" />
              </div>
              <div className="text-lg font-mono font-bold tracking-tight">
                {m.value.toFixed(4)} <span className="text-xs font-normal text-gray-500">{m.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
