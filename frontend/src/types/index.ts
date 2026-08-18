export interface FeatureMap {
  rms: number;
  peak: number;
  crest_factor: number;
  spectral_centroid: number;
  spectral_energy: number;
  dominant_frequency: number;
  char_band_energy: number;
  low_band_energy: number;
}

export interface PredictionResult {
  predicted_class: 'NORMAL' | 'FAULT';
  normal_probability: number;
  fault_probability: number;
  feature_importances?: Record<string, number>;
}

export interface TimePoint {
  time: number;
  amplitude: number;
}

export interface FFTPoint {
  frequency: number;
  amplitude: number;
}

export interface VisualSignalData {
  time_series: TimePoint[];
  fft_spectrum: FFTPoint[];
  char_freq_band: { min: number; max: number };
}

export interface FeatureDelta {
  before: number;
  after: number;
  delta: number;
  percentage_change: number;
}

export interface InterventionResponseData {
  original_features: FeatureMap;
  modified_features: FeatureMap;
  original_prediction: PredictionResult;
  modified_prediction: PredictionResult;
  feature_deltas: Record<keyof FeatureMap, FeatureDelta>;
  prediction_delta: {
    fault_prob_before: number;
    fault_prob_after: number;
    fault_prob_delta_percentage_points: number;
  };
  scientific_interpretation: string;
  visual_signal_before: VisualSignalData;
  visual_signal_after: VisualSignalData;
}
