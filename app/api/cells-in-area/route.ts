import { NextResponse } from 'next/server';
import { getCellsInArea } from '@/lib/opencellid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[cells-in-area] Request body:', body);

    const { bbox, mcc, mnc, lac, radio } = body;

    if (!bbox || typeof bbox !== 'object') {
      console.log('[cells-in-area] Invalid bbox parameter:', bbox);
      return NextResponse.json(
        { error: 'Invalid bbox parameter' },
        { status: 400 }
      );
    }

    console.log('[cells-in-area] Fetching cells with params:', {
      bbox,
      mcc,
      mnc,
      lac,
      radio,
      limit: 1000
    });

    const { cells, count } = await getCellsInArea({
      bbox,
      mcc,
      mnc,
      lac,
      radio,
      limit: 1000 // Get up to 1000 cells for better statistics
    });

    console.log('[cells-in-area] Response:', {
      cellsCount: cells.length,
      totalCount: count,
      firstCell: cells[0],
      bbox
    });

    return NextResponse.json({ cells, count });
  } catch (error) {
    console.error('[cells-in-area] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 