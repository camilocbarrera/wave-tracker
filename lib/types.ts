export interface TowerData {
  signalStrength: string;
  range: string;
  latitude: number;
  longitude: number;
  networkType?: string;
}

export interface CoverageMetrics {
  cellDensity: number;
  areaSizeKm: number;
  averageRangeKm: number;
}

export interface AnalysisResult {
  towerData?: TowerData;
  cells?: Array<TowerData>;
  coverageMetrics?: CoverageMetrics;
  networkTypes?: {
    [key: string]: number;
  };
  speedPrediction?: number;
  suggestions?: string[];
} 