import { NextResponse } from 'next/server';
import { getCellStats } from '@/lib/opencellid';

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

    const stats = await getCellStats({
      bbox,
      mcc,
      mnc,
      lac,
      radio
    });

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in cell-stats route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 