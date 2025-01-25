import { NextResponse } from 'next/server';
import { getCellsInArea } from '@/lib/opencellid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bbox, mcc, mnc, lac, radio } = body;

    if (!bbox || typeof bbox !== 'object') {
      return NextResponse.json(
        { error: 'Invalid bbox parameter' },
        { status: 400 }
      );
    }

    const { cells, count } = await getCellsInArea({
      bbox,
      mcc,
      mnc,
      lac,
      radio,
      limit: 1000 // Get up to 1000 cells for better statistics
    });

    return NextResponse.json({ cells, count });
  } catch (error) {
    console.error('Error in cells-in-area route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 