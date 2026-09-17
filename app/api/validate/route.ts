import { NextResponse } from 'next/server';
import { RenderValidatorService } from '@/services/renderValidator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planJson, renderImageUrls, apiKey } = body;

    if (!planJson) {
      return NextResponse.json({ error: 'FloorPlanJSON is required.' }, { status: 400 });
    }

    const validator = new RenderValidatorService({ apiKey });
    const validationResult = await validator.validateRender(planJson, renderImageUrls || {});

    return NextResponse.json(validationResult);
  } catch (error: any) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate renders.' },
      { status: 500 }
    );
  }
}
