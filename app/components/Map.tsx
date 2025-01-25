import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapProps {
  onAreaSelect: (bounds: {
    latMin: number
    lonMin: number
    latMax: number
    lonMax: number
  }) => void
}

function calculateAreaSize(bounds: maplibregl.LngLatBounds): number {
  const width = Math.abs(bounds.getEast() - bounds.getWest()) * 
    111320 * Math.cos((bounds.getNorth() + bounds.getSouth()) * Math.PI / 360)
  const height = Math.abs(bounds.getNorth() - bounds.getSouth()) * 110574
  return width * height
}

export default function Map({ onAreaSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [areaWarning, setAreaWarning] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [0, 0],
      zoom: 1
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl())

    // Add box selection control
    map.current.boxZoom.enable()

    // Handle area selection
    map.current.on('boxzoomend', (e) => {
      const bounds = e.target.getBounds()
      const areaSize = calculateAreaSize(bounds)
      
      if (areaSize > 4_000_000) {
        setAreaWarning(`Selected area is too large (${(areaSize/1_000_000).toFixed(2)} km²). Maximum allowed is 4 km².`)
        return
      }
      
      setAreaWarning(null)
      onAreaSelect({
        latMin: bounds.getSouth(),
        lonMin: bounds.getWest(),
        latMax: bounds.getNorth(),
        lonMax: bounds.getEast()
      })
    })

    // Add instructions overlay
    const instructionsDiv = document.createElement('div')
    instructionsDiv.className = 'instructions'
    instructionsDiv.innerHTML = 'Hold Shift + Click & Drag to select an area (max 4 km²)'
    mapContainer.current.appendChild(instructionsDiv)

    return () => {
      map.current?.remove()
    }
  }, [onAreaSelect])

  return (
    <>
      <div ref={mapContainer} className="w-full h-full relative">
        {areaWarning && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {areaWarning}
          </div>
        )}
      </div>
      <style jsx global>{`
        .instructions {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </>
  )
} 