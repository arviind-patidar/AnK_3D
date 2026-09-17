import { NextResponse } from 'next/server';
import { RenderGeneratorService } from '@/services/renderGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planJson, apiKey, provider } = body;

    if (!planJson || !planJson.floors) {
      return NextResponse.json({ error: 'Valid FloorPlanJSON is required.' }, { status: 400 });
    }

    const generator = new RenderGeneratorService({
      imageGenApiKey: apiKey || process.env.OPENAI_API_KEY,
      provider: provider || 'isometric-synthesizer',
    });

    const floorRenders = await generator.generateAllFloorRenders(planJson);
    return NextResponse.json({ renders: floorRenders });
  } catch (error: any) {
    console.error('Render generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate 3D renders.' },
      { status: 500 }
    );
  }
}
