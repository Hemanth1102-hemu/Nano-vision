import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';
import { TimePoint, FFTPoint } from '../types';

interface ChartProps {
  timeSeries: TimePoint[];
  fftSpectrum: FFTPoint[];
  title?: string;
  isModified?: boolean;
}

export const SignalCharts: React.FC<ChartProps> = ({ timeSeries, fftSpectrum, title, isModified }) => {
  const strokeColor = isModified ? '#f59e0b' : '#3b82f6';

  return (
    <div className="space-y-4">
      {/* Time-Domain Waveform */}
      <div className="bg-[#14171d] border border-[#2a313d] rounded p-4">
        <div className="flex justify-between items-center mb-2 border-b border-[#2a313d] pb-2">
          <h3 className="text-xs font-mono tracking-wider uppercase text-gray-400">
            {title ? `${title} - ` : ''}Time-Domain Waveform [s]
          </h3>
          <span className="text-[10px] font-mono text-gray-500">Fs = 2000 Hz</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10, fill: '#9ca3af' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1d222a', borderColor: '#3f495a', fontSize: '12px' }}
                itemStyle={{ color: strokeColor }}
              />
              <Line type="monotone" dataKey="amplitude" stroke={strokeColor} dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FFT Amplitude Spectrum */}
      <div className="bg-[#14171d] border border-[#2a313d] rounded p-4">
        <div className="flex justify-between items-center mb-2 border-b border-[#2a313d] pb-2">
          <h3 className="text-xs font-mono tracking-wider uppercase text-gray-400">
            {title ? `${title} - ` : ''}FFT Spectrum [Hz]
          </h3>
          <span className="text-[10px] font-mono text-amber-500">Highlighted Band: 100 - 140 Hz</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fftSpectrum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="frequency" stroke="#4b5563" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1d222a', borderColor: '#3f495a', fontSize: '12px' }}
                itemStyle={{ color: '#d97706' }}
              />
              {/* Highlight Characteristic Fault Frequency Band 100-140 Hz */}
              <ReferenceArea x1={100} x2={140} fill="#d97706" fillOpacity={0.2} stroke="#d97706" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amplitude" stroke="#d97706" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
