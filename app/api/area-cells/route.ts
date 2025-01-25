import { NextResponse } from 'next/server'
import { opencellid } from '../../lib/opencellid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { latMin, lonMin, latMax, lonMax, mcc, mnc, lac, radio, limit, offset } = body

    // Get cells in the area
    const cells = await opencellid.getCellsInArea({
      latMin,
      lonMin,
      latMax,
      lonMax,
      mcc,
      mnc,
      lac,
      radio,
      limit,
      offset
    })

    // Get total cell count in the area
    const totalCells = await opencellid.getCellCount({
      latMin,
      lonMin,
      latMax,
      lonMax,
      mcc,
      mnc,
      lac,
      radio
    })

    // Calculate coverage density (cells per square km)
    const areaWidth = Math.abs(lonMax - lonMin)
    const areaHeight = Math.abs(latMax - latMin)
    const approximateAreaKm = areaWidth * areaHeight * 111 // rough conversion to km
    const coverageDensity = totalCells / approximateAreaKm

    return NextResponse.json({
      success: true,
      data: {
        cells,
        totalCells,
        coverageMetrics: {
          areaSizeKm: approximateAreaKm.toFixed(2),
          cellDensity: coverageDensity.toFixed(2),
          averageRangeKm: cells.reduce((acc, cell) => acc + Number(cell.range), 0) / cells.length / 1000
        }
      }
    })
  } catch (error) {
    console.error('Area cells error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch area cells'
      },
      { status: 500 }
    )
  }
} 