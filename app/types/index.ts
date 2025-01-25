export interface TowerData {
  latitude: string
  longitude: string
  range: string
  signalStrength: string
}

export interface AnalysisResult {
  towerData: TowerData
  speedPrediction: number
  suggestions: string[]
} 