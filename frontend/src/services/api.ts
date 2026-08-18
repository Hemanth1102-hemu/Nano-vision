import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const analyzeSignal = async (amplitude: number[], samplingRate: number = 2000) => {
  const res = await api.post('/analyze', {
    amplitude,
    sampling_rate: samplingRate,
  });
  return res.data;
};

export const applyIntervention = async (params: {
  amplitude: number[];
  samplingRate?: number;
  targetFreqMin?: number;
  targetFreqMax?: number;
  amplitudeMultiplier: number;
  additiveNoiseStd: number;
}) => {
  const res = await api.post('/intervention', {
    amplitude: params.amplitude,
    sampling_rate: params.samplingRate || 2000,
    target_freq_min: params.targetFreqMin || 100.0,
    target_freq_max: params.targetFreqMax || 140.0,
    amplitude_multiplier: params.amplitudeMultiplier,
    additive_noise_std: params.additiveNoiseStd,
  });
  return res.data;
};

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/upload', formData);
  return res.data;
};
