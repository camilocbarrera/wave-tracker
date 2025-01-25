import { NextResponse } from 'next/server'
import { opencellid, ProcessedCellData } from '../../lib/opencellid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mcc, mnc, cellId, lac } = body

    // Fetch real tower data
    const towerData: ProcessedCellData = await opencellid.fetchTowerData({ mcc, mnc, cellId, lac })
    
    // Estimate speed based on tower data
    const speedPrediction = opencellid.estimateInternetSpeed(towerData)

    // Generate suggestions based on data
    const suggestions = []
    const signalStrength = Number(towerData.signalStrength)
    
    if (signalStrength < -85) {
      suggestions.push('Consider moving closer to a window or higher ground for better signal')
    }
    if (towerData.radio !== 'LTE') {
      suggestions.push('Your device is using an older network technology. Consider upgrading to a 4G/LTE capable device')
    }
    if (Number(towerData.range) > 1000) {
      suggestions.push('You are relatively far from the tower. Moving closer could improve speeds')
    }

    return NextResponse.json({
      success: true,
      data: {
        towerData,
        speedPrediction,
        suggestions
      }
    })
  } catch (error) {
    console.error('Tower data error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tower data'
      },
      { status: 500 }
    )
  }
} 