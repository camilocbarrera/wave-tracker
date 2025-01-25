import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import MapLibre GL JS to avoid SSR issues
const Map = dynamic(() => import('./Map'), {
  ssr: false
})

interface AreaAnalysisProps {
  onAnalysisComplete?: (data: any) => void
}

interface CoverageMetrics {
  areaSizeKm: number
  cellDensity: number
  averageRangeKm: number
}

interface NetworkTypes {
  [key: string]: number
}

export default function AreaAnalysis({ onAnalysisComplete }: AreaAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAreaSelect = async (bounds: {
    latMin: number
    lonMin: number
    latMax: number
    lonMax: number
  }) => {
    setLoading(true)
    setError(null)

    console.log('[AreaAnalysis] Selected bounds:', bounds);

    try {
      // Calculate area size in square meters
      const areaSizeMeters = calculateAreaSizeMeters(bounds);
      console.log('[AreaAnalysis] Area size:', {
        areaSizeMeters,
        maxAllowed: 4_000_000
      });

      if (areaSizeMeters > 4_000_000) {
        throw new Error(`Selected area is too large (${(areaSizeMeters/1_000_000).toFixed(2)} km²). Please select a smaller area (max 4 km²).`);
      }

      // Get cells in area
      console.log('[AreaAnalysis] Fetching cells for bounds...');
      const cellsResponse = await fetch('/api/cells-in-area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bbox: bounds })
      })

      if (!cellsResponse.ok) {
        const errorData = await cellsResponse.json();
        console.error('[AreaAnalysis] Failed to fetch cells:', errorData);
        throw new Error(errorData.error || 'Failed to fetch cells');
      }

      const { cells, count } = await cellsResponse.json();
      console.log('[AreaAnalysis] Received cells:', {
        cellsCount: cells.length,
        totalCount: count,
        firstCell: cells[0]
      });

      // Calculate area metrics
      const areaSizeKm = calculateAreaSize(bounds)
      const cellDensity = cells.length / areaSizeKm
      const averageRangeKm = calculateAverageRange(cells)
      const networkTypes = calculateNetworkTypes(cells)

      console.log('[AreaAnalysis] Calculated metrics:', {
        areaSizeKm,
        cellDensity,
        averageRangeKm,
        networkTypes
      });

      const analysisData = {
        cells,
        stats: { count },
        coverageMetrics: {
          areaSizeKm,
          cellDensity,
          averageRangeKm
        },
        networkTypes
      }

      console.log('[AreaAnalysis] Final analysis data:', analysisData);
      onAnalysisComplete?.(analysisData)
    } catch (err) {
      console.error('[AreaAnalysis] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze area')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Area Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">
          Draw a box on the map to select an area for analysis
        </p>
        
        {/* Map Component */}
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <Map onAreaSelect={handleAreaSelect} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-2 text-gray-600">Analyzing area...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper functions
function calculateAreaSize(bounds: { latMin: number; lonMin: number; latMax: number; lonMax: number }): number {
  const R = 6371 // Earth's radius in km
  const dLat = (bounds.latMax - bounds.latMin) * Math.PI / 180
  const dLon = (bounds.lonMax - bounds.lonMin) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(bounds.latMin * Math.PI / 180) * Math.cos(bounds.latMax * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateAverageRange(cells: any[]): number {
  if (!cells.length) return 0
  const totalRange = cells.reduce((sum, cell) => sum + Number(cell.range), 0)
  return totalRange / cells.length / 1000 // Convert to km
}

function calculateNetworkTypes(cells: any[]): NetworkTypes {
  return cells.reduce((acc: NetworkTypes, cell) => {
    const type = cell.radio || 'Unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})
}

// Add new helper function for area size in meters
function calculateAreaSizeMeters(bounds: { latMin: number; lonMin: number; latMax: number; lonMax: number }): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (bounds.latMax - bounds.latMin) * Math.PI / 180
  const dLon = (bounds.lonMax - bounds.lonMin) * Math.PI / 180
  
  // Calculate the area using the haversine formula
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(bounds.latMin * Math.PI / 180) * Math.cos(bounds.latMax * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  // Approximate rectangular area
  const width = Math.abs(bounds.lonMax - bounds.lonMin) * 
    111320 * Math.cos((bounds.latMin + bounds.latMax) * Math.PI / 360)
  const height = Math.abs(bounds.latMax - bounds.latMin) * 110574

  return width * height
} 