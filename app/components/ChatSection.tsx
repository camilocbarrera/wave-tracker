'use client'

import { useState } from 'react'
import TowerForm from './TowerForm'
import { useAnalysis } from '../context/AnalysisContext'
import type { AnalysisResult } from '@/lib/types'
import AreaAnalysis from './AreaAnalysis'

interface ChatMessage {
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  showOptions?: boolean;
  component?: 'tower-form' | 'area-analysis';
}

const ANALYSIS_OPTIONS = [
  {
    id: 'tower',
    title: 'Single Tower Analysis',
    description: 'Analyze a specific cell tower using MCC, MNC, Cell ID, and LAC.',
    icon: '📱'
  },
  {
    id: 'area',
    title: 'Area Coverage Analysis',
    description: 'Analyze network coverage in a specific geographical area.',
    icon: '🗺️'
  },
  {
    id: 'comparison',
    title: 'Network Comparison',
    description: 'Compare different network technologies and providers.',
    icon: '📊'
  }
];

export default function ChatSection() {
  const { setAnalysisData } = useAnalysis()
  const [messages, setMessages] = useState<ChatMessage[]>([{
    content: "Welcome! I'm your network analysis assistant. What would you like to analyze?",
    type: 'assistant',
    timestamp: new Date(),
    showOptions: true
  }]);
  const [loading, setLoading] = useState(false)

  const handleOptionSelect = (option: 'tower' | 'area' | 'comparison') => {
    // Add user selection to chat
    setMessages(prev => [...prev, {
      content: `I want to perform ${ANALYSIS_OPTIONS.find(opt => opt.id === option)?.title}`,
      type: 'user',
      timestamp: new Date()
    }]);

    // Add assistant acknowledgment and show appropriate form
    setMessages(prev => [...prev, {
      content: `Great choice! I'll help you with ${ANALYSIS_OPTIONS.find(opt => opt.id === option)?.title.toLowerCase()}.`,
      type: 'assistant',
      timestamp: new Date(),
      component: option === 'tower' ? 'tower-form' : option === 'area' ? 'area-analysis' : undefined,
      showOptions: true
    }]);
  };

  const handleAnalysis = (data: AnalysisResult) => {
    setAnalysisData(data)
    const signalStrength = Number(data.towerData?.signalStrength || -95)
    const signalQuality = signalStrength > -85 ? 'Good' : 'Poor'

    setMessages(prev => [
      ...prev,
      {
        content: '🔍 Analysis Complete! I\'ve processed your network data and updated the dashboard.',
        type: 'assistant',
        timestamp: new Date()
      },
      {
        content: `📊 Key Findings:\n
• Signal Strength: ${data.towerData?.signalStrength}dBm (${signalQuality})
• Estimated Speed: ${data.speedPrediction} Mbps
• Tower Distance: ${(Number(data.towerData?.range)/1000).toFixed(1)}km\n
${data.suggestions?.length ? `💡 Recommendations:\n${data.suggestions.join('\n')}` : ''}`,
        type: 'assistant',
        timestamp: new Date(),
        showOptions: true
      }
    ])
  }

  const handleAreaAnalysis = (data: any) => {
    setAnalysisData(data)
    setMessages(prev => [
      ...prev,
      {
        content: '🔍 Area Analysis Complete!',
        type: 'assistant',
        timestamp: new Date()
      },
      {
        content: `📊 Coverage Analysis:\n
• Total Cells: ${data.cells.length}
• Area Size: ${data.coverageMetrics.areaSizeKm.toFixed(2)} km²
• Cell Density: ${data.coverageMetrics.cellDensity.toFixed(2)} cells/km²
• Average Range: ${data.coverageMetrics.averageRangeKm.toFixed(2)} km\n
Network Distribution:\n${Object.entries(data.networkTypes)
  .map(([type, count]) => `• ${type}: ${count} cells`)
  .join('\n')}`,
        type: 'assistant',
        timestamp: new Date(),
        showOptions: true
      }
    ])
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.component === 'tower-form' && (
                <div className="mt-4">
                  <TowerForm onAnalysis={handleAnalysis} />
                </div>
              )}
              
              {message.component === 'area-analysis' && (
                <div className="mt-4">
                  <AreaAnalysis onAnalysisComplete={handleAreaAnalysis} />
                </div>
              )}

              {message.showOptions && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">Available Analysis Options:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {ANALYSIS_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id as 'tower' | 'area' | 'comparison')}
                        className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                      >
                        <span className="text-2xl mr-3">{option.icon}</span>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">{option.title}</h3>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 