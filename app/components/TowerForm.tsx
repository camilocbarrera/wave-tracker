'use client'

import { useState } from 'react'
import type { AnalysisResult } from '../types'

interface TowerFormProps {
  onAnalysis?: (data: AnalysisResult) => void
  defaultValues?: {
    mcc: string
    mnc: string
    cellId: string
    lac: string
  }
}

export default function TowerForm({ onAnalysis, defaultValues }: TowerFormProps) {
  const [formData, setFormData] = useState({
    mcc: defaultValues?.mcc || '260',
    mnc: defaultValues?.mnc || '2',
    cellId: defaultValues?.cellId || '22613',
    lac: defaultValues?.lac || '45080'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tower-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze network')
      }

      onAnalysis?.(result.data)
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <label htmlFor="mcc" className="block text-sm font-medium mb-1 text-gray-700">
            MCC
          </label>
          <input
            type="text"
            id="mcc"
            name="mcc"
            value={formData.mcc}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="mnc" className="block text-sm font-medium mb-1 text-gray-700">
            MNC
          </label>
          <input
            type="text"
            id="mnc"
            name="mnc"
            value={formData.mnc}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="cellId" className="block text-sm font-medium mb-1 text-gray-700">
            Cell ID
          </label>
          <input
            type="text"
            id="cellId"
            name="cellId"
            value={formData.cellId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="lac" className="block text-sm font-medium mb-1 text-gray-700">
            LAC
          </label>
          <input
            type="text"
            id="lac"
            name="lac"
            value={formData.lac}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        {loading ? 'Analyzing...' : 'Analyze Network'}
      </button>
    </form>
  )
} 