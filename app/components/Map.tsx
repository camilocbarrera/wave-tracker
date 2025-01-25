import { useEffect, useRef } from 'react'
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

export default function Map({ onAreaSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

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
    instructionsDiv.innerHTML = 'Hold Shift + Click & Drag to select an area'
    mapContainer.current.appendChild(instructionsDiv)

    return () => {
      map.current?.remove()
    }
  }, [onAreaSelect])

  return (
    <>
      <div ref={mapContainer} className="w-full h-full relative" />
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