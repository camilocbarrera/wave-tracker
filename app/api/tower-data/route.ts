import { NextResponse } from 'next/server'
import { fetchTowerData } from '@/lib/opencellid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mcc, mnc, cellId, lac } = body

    const towerData = await fetchTowerData({ mcc, mnc, cellId, lac })

    return NextResponse.json({ success: true, data: towerData })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tower data' },
      { status: 500 }
    )
  }
} 