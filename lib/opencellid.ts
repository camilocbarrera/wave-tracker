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

interface AreaCellsParams {
  bbox: {
    latMin: number;
    lonMin: number;
    latMax: number;
    lonMax: number;
  };
  mcc?: number;
  mnc?: number;
  lac?: number;
  radio?: 'GSM' | 'UMTS' | 'LTE' | 'NR' | 'CDMA';
  limit?: number;
  offset?: number;
}

interface CellStats {
  count: number;
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

export async function getCellsInArea({
  bbox,
  mcc,
  mnc,
  lac,
  radio,
  limit = 100,
  offset = 0
}: AreaCellsParams) {
  const apiKey = process.env.OPENCELLID_API_KEY;
  const params = new URLSearchParams({
    key: apiKey!,
    BBOX: `${bbox.latMin},${bbox.lonMin},${bbox.latMax},${bbox.lonMax}`,
    format: 'json',
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (mcc) params.append('mcc', mcc.toString());
  if (mnc) params.append('mnc', mnc.toString());
  if (lac) params.append('lac', lac.toString());
  if (radio) params.append('radio', radio);

  const url = `https://opencellid.org/cell/getInArea?${params.toString()}`;
  console.log('[OpenCellID] Requesting cells in area:', {
    url,
    bbox,
    mcc,
    mnc,
    lac,
    radio,
    limit,
    offset
  });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[OpenCellID] API error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`OpenCellID API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[OpenCellID] Response:', {
      cellsCount: data.cells?.length || 0,
      firstCell: data.cells?.[0],
      bbox
    });

    return {
      cells: data.cells || [],
      count: data.cells?.length || 0
    };
  } catch (error) {
    console.error('[OpenCellID] Error fetching cells:', error);
    throw new Error('Failed to fetch cells: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function getCellStats({
  bbox,
  mcc,
  mnc,
  lac,
  radio
}: AreaCellsParams): Promise<CellStats> {
  console.log('[OpenCellID] Getting cell stats:', {
    bbox,
    mcc,
    mnc,
    lac,
    radio
  });

  try {
    const { count } = await getCellsInArea({ bbox, mcc, mnc, lac, radio, limit: 1000 });
    console.log('[OpenCellID] Cell stats response:', { count });
    return { count };
  } catch (error) {
    console.error('[OpenCellID] Error getting cell stats:', error);
    throw error;
  }
} 