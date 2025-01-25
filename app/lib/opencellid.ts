import { XMLParser } from 'fast-xml-parser'

interface CellParams {
  mcc: string
  mnc: string
  cellId: string
  lac: string
}

interface AreaParams {
  latMin: number
  lonMin: number
  latMax: number
  lonMax: number
  mcc?: string
  mnc?: string
  lac?: string
  radio?: 'GSM' | 'UMTS' | 'LTE' | 'NR' | 'CDMA'
  limit?: number
  offset?: number
}

interface RawCellData {
  latitude: string
  longitude: string
  mcc: string
  mnc: string
  lac: string
  cellid: string
  range: string
  samples: string
  averageSignalStrength: string
  radio: string
}

export interface ProcessedCellData {
  latitude: string
  longitude: string
  mcc: string
  mnc: string
  lac: string
  cellId: string
  range: string
  samples: string
  signalStrength: string
  radio: string
}

class OpenCellIDService {
  private readonly apiKey: string

  constructor() {
    // Use a default test API key if environment variable is not set
    this.apiKey = process.env.OPENCELLID_API_KEY || 'pk.12fba778065b30af5de927050f1b4da4'
  }

  private calculateSpeed(cellData: ProcessedCellData): number {
    let signalStrength = parseInt(cellData.signalStrength || '-80')
    const rangeValue = parseInt(cellData.range)

    if (signalStrength === 0) {
      signalStrength = -80
    }

    let speed = 0
    if (signalStrength > -70) {
      speed = 50
    } else if (signalStrength > -80) {
      speed = 25
    } else {
      speed = 6.5
    }

    if (rangeValue > 1000) {
      speed *= 0.8
    } else if (rangeValue > 500) {
      speed *= 0.9
    }

    if (cellData.radio === 'LTE') {
      speed *= 1.5
    } else if (cellData.radio === 'GSM') {
      speed *= 0.8
    }

    return speed
  }

  async fetchTowerData({ mcc, mnc, cellId, lac }: CellParams): Promise<ProcessedCellData> {
    const baseUrl = 'https://opencellid.org/cell/get'

    const params = new URLSearchParams({
      key: this.apiKey,
      mcc,
      mnc,
      cellid: cellId,
      lac,
      format: 'xml'
    })

    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`OpenCellID API Error: ${response.status}`)
      }

      const xmlData = await response.text()
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
      const result = parser.parse(xmlData)

      if (result.rsp.error) {
        throw new Error(`OpenCellID Error: ${result.rsp.error.info}`)
      }

      const cellData: RawCellData = result.rsp.cell

      return {
        latitude: cellData.latitude,
        longitude: cellData.longitude,
        mcc: cellData.mcc,
        mnc: cellData.mnc,
        lac: cellData.lac,
        cellId: cellData.cellid,
        range: cellData.range,
        samples: cellData.samples,
        signalStrength: cellData.averageSignalStrength || '-80',
        radio: cellData.radio || 'GSM'
      }
    } catch (error) {
      console.error('Error fetching tower data:', error)
      throw error
    }
  }

  async getCellsInArea(params: AreaParams): Promise<ProcessedCellData[]> {
    const baseUrl = 'https://opencellid.org/cell/getInArea'

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      BBOX: `${params.latMin},${params.lonMin},${params.latMax},${params.lonMax}`,
      format: 'json',
      limit: (params.limit || 100).toString(),
      offset: (params.offset || 0).toString()
    })

    if (params.mcc) queryParams.append('mcc', params.mcc)
    if (params.mnc) queryParams.append('mnc', params.mnc)
    if (params.lac) queryParams.append('lac', params.lac)
    if (params.radio) queryParams.append('radio', params.radio)

    try {
      const response = await fetch(`${baseUrl}?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`OpenCellID API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.cells.map((cell: any) => ({
        latitude: cell.lat.toString(),
        longitude: cell.lon.toString(),
        mcc: cell.mcc.toString(),
        mnc: cell.mnc.toString(),
        lac: cell.lac.toString(),
        cellId: cell.cellid.toString(),
        range: cell.range.toString(),
        samples: cell.samples.toString(),
        signalStrength: cell.averageSignalStrength?.toString() || '-80',
        radio: cell.radio || 'GSM'
      }))
    } catch (error) {
      console.error('Error fetching cells in area:', error)
      throw error
    }
  }

  async getCellCount(params: AreaParams): Promise<number> {
    const baseUrl = 'https://opencellid.org/cell/getInAreaSize'

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      BBOX: `${params.latMin},${params.lonMin},${params.latMax},${params.lonMax}`,
      format: 'json'
    })

    if (params.mcc) queryParams.append('mcc', params.mcc)
    if (params.mnc) queryParams.append('mnc', params.mnc)
    if (params.lac) queryParams.append('lac', params.lac)
    if (params.radio) queryParams.append('radio', params.radio)

    try {
      const response = await fetch(`${baseUrl}?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`OpenCellID API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.count
    } catch (error) {
      console.error('Error fetching cell count:', error)
      throw error
    }
  }

  estimateInternetSpeed(cellData: ProcessedCellData): number {
    return this.calculateSpeed(cellData)
  }
}

// Create and export the singleton instance
const opencellid = new OpenCellIDService()
export { opencellid } 