export interface TowerData {
  latitude: string
  longitude: string
  mcc: string
  mnc: string
  lac: string
  cellId: string
  range: string
  samples: string
  signalStrength: string
  radio: string
}

export interface AnalysisResult {
  towerData: TowerData
  speedPrediction: number
  suggestions: string[]
} 