'use client'

import { useState } from 'react'
import TowerForm from './TowerForm'
import { useAnalysis } from '../context/AnalysisContext'
import type { AnalysisResult } from '../types'
import AreaAnalysis from './AreaAnalysis'

interface Message {
  role: 'user' | 'assistant'
  content: string
  type?: 'form' | 'text' | 'options' | 'area-analysis'
}

export default function ChatSection() {
  const { setAnalysisData } = useAnalysis()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m Wavetracker AI, your network analysis assistant.',
      type: 'text'
    },
    {
      role: 'assistant',
      content: 'How can I help you today?',
      type: 'options'
    }
  ])

  const handleOptionClick = (option: number) => {
    switch (option) {
      case 1:
        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: 'I want to analyze mobile network data',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'Please provide the following network details:',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'Network Analysis Form',
            type: 'form'
          }
        ])
        break
      case 2:
        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: 'I want to analyze cells in an area',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'Select an area on the map to analyze cell coverage:',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'Area Analysis',
            type: 'area-analysis'
          }
        ])
        break
      case 3:
        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: 'Get cell statistics',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'I\'ll help you get cell statistics. Select an area:',
            type: 'text'
          },
          {
            role: 'assistant',
            content: 'Area Analysis',
            type: 'area-analysis'
          }
        ])
        break
    }
  }

  const handleAnalysis = (data: AnalysisResult) => {
    setAnalysisData(data)
    const signalStrength = Number(data.towerData.signalStrength)
    const signalQuality = signalStrength > -85 ? 'Good' : 'Poor'

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: '🔍 Analysis Complete! I\'ve processed your network data and updated the dashboard.',
        type: 'text'
      },
      {
        role: 'assistant',
        content: `📊 Key Findings:\n
• Signal Strength: ${data.towerData.signalStrength}dBm (${signalQuality})
• Estimated Speed: ${data.speedPrediction} Mbps
• Tower Distance: ${(Number(data.towerData.range)/1000).toFixed(1)}km\n
💡 Recommendations:\n${data.suggestions.join('\n')}`,
        type: 'text'
      }
    ])
  }

  const handleAreaAnalysis = async (data: any) => {
    setAnalysisData(data)
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: '🔍 Area Analysis Complete!',
        type: 'text'
      },
      {
        role: 'assistant',
        content: `📊 Coverage Analysis:\n
• Total Cells: ${data.cells.length}
• Area Size: ${data.coverageMetrics.areaSizeKm} km²
• Cell Density: ${data.coverageMetrics.cellDensity} cells/km²
• Average Range: ${data.coverageMetrics.averageRangeKm.toFixed(2)} km\n
Network Types Distribution:
${Object.entries(data.networkTypes)
  .map(([type, count]) => `• ${type}: ${count} cells`)
  .join('\n')}`,
        type: 'text'
      }
    ])
  }

  const renderOptions = () => (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={() => handleOptionClick(1)}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
      >
        <span className="text-2xl">📡</span>
        <div>
          <h3 className="font-medium text-slate-800">Single Tower Analysis</h3>
          <p className="text-sm text-slate-600">Analyze a specific cell tower</p>
        </div>
      </button>
      
      <button
        onClick={() => handleOptionClick(2)}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
      >
        <span className="text-2xl">🗺️</span>
        <div>
          <h3 className="font-medium text-slate-800">Area Coverage Analysis</h3>
          <p className="text-sm text-slate-600">Analyze cell towers in a specific area</p>
        </div>
      </button>
      
      <button
        onClick={() => handleOptionClick(3)}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
      >
        <span className="text-2xl">📊</span>
        <div>
          <h3 className="font-medium text-slate-800">Coverage Statistics</h3>
          <p className="text-sm text-slate-600">Get detailed coverage metrics for an area</p>
        </div>
      </button>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Wavetracker AI</h2>
        <p className="text-sm text-slate-600">Your Network Analysis Assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user' 
                ? 'ml-auto bg-indigo-600 text-white' 
                : 'bg-white shadow-md border border-gray-100 text-slate-700'
            } rounded-lg p-4 max-w-[80%] ${message.type === 'options' ? 'w-full max-w-full' : ''} ${
              message.type === 'form' || message.type === 'area-analysis' ? 'w-full' : ''
            } whitespace-pre-wrap`}
          >
            {message.type === 'form' ? (
              <div className="bg-white rounded-lg">
                <TowerForm onAnalysis={handleAnalysis} />
              </div>
            ) : message.type === 'area-analysis' ? (
              <div className="bg-white rounded-lg">
                <AreaAnalysis onAnalysisComplete={handleAreaAnalysis} />
              </div>
            ) : message.type === 'options' ? (
              renderOptions()
            ) : (
              <div className="text-[15px] leading-relaxed">{message.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 