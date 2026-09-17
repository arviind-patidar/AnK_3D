import { NextResponse } from 'next/server';
import { SheetComposerService } from '@/services/sheetComposer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planJson, floorRenders } = body;

    if (!planJson) {
      return NextResponse.json({ error: 'FloorPlanJSON is required.' }, { status: 400 });
    }

    const composer = new SheetComposerService();
    const sheetDataUrl = composer.composeBrandedSheet(planJson, floorRenders || {});

    return NextResponse.json({ sheetUrl: sheetDataUrl });
  } catch (error: any) {
    console.error('Sheet composition API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to compose branded sheet.' },
      { status: 500 }
    );
  }
}
