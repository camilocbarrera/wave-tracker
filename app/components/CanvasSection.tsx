'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useAnalysis } from '../context/AnalysisContext'
import AIInsights from './AIInsights'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { TowerData, AnalysisResult } from '@/lib/types'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface NetworkStats {
  speed: number
  latency: number
  timestamp: string
}

export default function CanvasSection() {
  const { analysisData } = useAnalysis() as { analysisData: AnalysisResult | null }
  const [stats, setStats] = useState<NetworkStats[]>([])

  useEffect(() => {
    if (!analysisData) return;

    if (analysisData.towerData) {
      // Single tower analysis
      const signalStrength = Number(analysisData.towerData?.signalStrength || -95);
      const newStats = Array.from({ length: 24 }, (_, i) => ({
        speed: (analysisData.speedPrediction || 0) + (Math.random() * 10 - 5),
        latency: signalStrength * -1 + (Math.random() * 20 - 10),
        timestamp: `${i}:00`
      }))
      setStats(newStats)
    } else if (analysisData.cells) {
      // Area analysis
      const avgSignalStrength = analysisData.cells.reduce((sum, cell) => 
        sum + (Number(cell.signalStrength) || -95), 0) / analysisData.cells.length;
      
      const newStats = Array.from({ length: 24 }, (_, i) => ({
        speed: (analysisData.coverageMetrics?.cellDensity || 0) * 5 + (Math.random() * 10 - 5),
        latency: avgSignalStrength * -1 + (Math.random() * 20 - 10),
        timestamp: `${i}:00`
      }))
      setStats(newStats)
    }
  }, [analysisData])

  if (!analysisData) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center text-slate-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No Analysis Data</h3>
          <p className="text-sm">Select an option and fill the form to see network analysis</p>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: stats.map(stat => stat.timestamp),
    datasets: [
      {
        label: 'Network Speed (Mbps)',
        data: stats.map(stat => stat.speed),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Latency (ms)',
        data: stats.map(stat => stat.latency),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  // Calculate network status based on analysis type
  let networkStatus = 'Unknown';
  let statusColor = 'text-gray-500';
  let avgSpeed = 0;
  let avgLatency = 0;

  if (analysisData.towerData) {
    // Single tower analysis
    const signalStrength = Number(analysisData.towerData?.signalStrength || -95);
    networkStatus = signalStrength > -85 ? 'Good' : 'Poor';
    statusColor = signalStrength > -85 ? 'text-green-500' : 'text-yellow-500';
    avgSpeed = analysisData.speedPrediction || 0;
    avgLatency = Math.abs(signalStrength);
  } else if (analysisData.cells) {
    // Area analysis
    const avgSignalStrength = analysisData.cells.reduce((sum, cell) => 
      sum + (Number(cell.signalStrength) || -95), 0) / analysisData.cells.length;
    networkStatus = avgSignalStrength > -85 ? 'Good' : 'Poor';
    statusColor = avgSignalStrength > -85 ? 'text-green-500' : 'text-yellow-500';
    avgSpeed = (analysisData.coverageMetrics?.cellDensity || 0) * 5;
    avgLatency = Math.abs(avgSignalStrength);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Network Performance</h2>
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Average Speed</h3>
          <p className="text-3xl font-bold text-blue-500">
            {avgSpeed.toFixed(1)} Mbps
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Average Latency</h3>
          <p className="text-3xl font-bold text-rose-500">
            {avgLatency.toFixed(0)} ms
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Network Status</h3>
          <p className={`text-3xl font-bold ${statusColor}`}>
            {networkStatus}
          </p>
        </div>
      </div>

      {/* Additional Network Details */}
      {analysisData.towerData ? (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tower Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Location</h3>
              <p className="text-lg text-gray-800">
                {analysisData.towerData.latitude}, {analysisData.towerData.longitude}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Range</h3>
              <p className="text-lg text-gray-800">
                {(Number(analysisData.towerData.range)/1000).toFixed(2)} km
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Signal Strength</h3>
              <p className="text-lg text-gray-800">
                {analysisData.towerData.signalStrength} dBm
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Estimated Speed</h3>
              <p className="text-lg text-gray-800">
                {analysisData.speedPrediction || 0} Mbps
              </p>
            </div>
          </div>
        </div>
      ) : analysisData.cells ? (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Area Coverage Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Cells</h3>
              <p className="text-lg text-gray-800">{analysisData.cells?.length || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Area Size</h3>
              <p className="text-lg text-gray-800">
                {analysisData.coverageMetrics?.areaSizeKm.toFixed(2) || '0.00'} km²
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Cell Density</h3>
              <p className="text-lg text-gray-800">
                {analysisData.coverageMetrics?.cellDensity.toFixed(2) || '0.00'} cells/km²
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Avg Tower Range</h3>
              <p className="text-lg text-gray-800">
                {analysisData.coverageMetrics?.averageRangeKm.toFixed(2) || '0.00'} km
              </p>
            </div>
          </div>

          {/* Network Types Distribution */}
          {analysisData.networkTypes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Network Types Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analysisData.networkTypes).map(([type, count]) => (
                  <div key={type} className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">{type}</h4>
                    <p className="text-lg font-semibold text-gray-800">{count} towers</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* AI Insights Section */}
      <AIInsights analysisData={analysisData} />
    </div>
  )
} 