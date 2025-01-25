'use client'

import { createContext, useContext, useState } from 'react'
import { AnalysisResult } from '@/lib/types'

interface AnalysisContextType {
  analysisData: AnalysisResult | null
  setAnalysisData: (data: AnalysisResult | null) => void
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
} 