export function generateSyntheticSignal(type: 'NORMAL' | 'FAULT'): number[] {
  const duration = 2.0;
  const samplingRate = 2000;
  const numPoints = duration * samplingRate;
  const signal: number[] = [];
  const baseFreq = 30.0;
  const faultFreq = 120.0;
  const faultSeverity = type === 'FAULT' ? 0.85 : 0.05;

  for (let i = 0; i < numPoints; i++) {
    const t = i / samplingRate;
    let s = 1.0 * Math.sin(2 * Math.PI * baseFreq * t);
    
    // Fault component
    s += faultSeverity * 1.5 * Math.sin(2 * Math.PI * faultFreq * t);
    if (type === 'FAULT') {
      s += faultSeverity * 0.5 * Math.sin(2 * Math.PI * (2 * faultFreq) * t);
    }
    
    // Noise
    const noise = (Math.random() - 0.5) * 0.2;
    s += noise;
    signal.push(s);
  }
  return signal;
}
