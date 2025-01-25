interface TowerQueryParams {
  mcc: string
  mnc: string
  cellId: string
  lac: string
}

interface TowerData {
  latitude: string
  longitude: string
  range: string
  signalStrength?: string
}

export async function fetchTowerData(params: TowerQueryParams): Promise<TowerData> {
  const apiKey = process.env.OPENCELLID_API_KEY
  const { mcc, mnc, cellId, lac } = params

  const url = `https://opencellid.org/cell/get?key=${apiKey}&mcc=${mcc}&mnc=${mnc}&cellid=${cellId}&lac=${lac}&format=json`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tower data')
    }

    const data = await response.json()
    
    return {
      latitude: data.lat,
      longitude: data.lon,
      range: data.range,
      signalStrength: data.signal
    }
  } catch (error) {
    console.error('Error fetching tower data:', error)
    throw error
  }
} 