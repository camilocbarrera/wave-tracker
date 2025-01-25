'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useAnalysis } from '../context/AnalysisContext'
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
  const { analysisData } = useAnalysis()
  const [stats, setStats] = useState<NetworkStats[]>([])

  useEffect(() => {
    if (analysisData) {
      // Generate time-series data based on the analysis
      const newStats = Array.from({ length: 24 }, (_, i) => ({
        speed: analysisData.speedPrediction + (Math.random() * 10 - 5), // Vary around the predicted speed
        latency: Number(analysisData.towerData.signalStrength) * -1 + (Math.random() * 20 - 10), // Convert signal to latency
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

  // Convert signal strength to number for comparison
  const signalStrength = Number(analysisData.towerData.signalStrength)
  const networkStatus = signalStrength > -85 ? 'Good' : 'Poor'
  const statusColor = signalStrength > -85 ? 'text-green-500' : 'text-yellow-500'

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
            {stats.length ? (stats.reduce((acc, stat) => acc + stat.speed, 0) / stats.length).toFixed(1) : 0} Mbps
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Average Latency</h3>
          <p className="text-3xl font-bold text-rose-500">
            {stats.length ? (stats.reduce((acc, stat) => acc + stat.latency, 0) / stats.length).toFixed(0) : 0} ms
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Network Status</h3>
          <p className={`text-3xl font-bold ${statusColor}`}>
            {networkStatus}
          </p>
        </div>
      </div>
    </div>
  )
} 