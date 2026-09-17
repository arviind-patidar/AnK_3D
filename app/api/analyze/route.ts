import { NextResponse } from 'next/server';
import { PlanAnalyzerService } from '@/services/planAnalyzer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrls, metadata, apiKey } = body;

    if (!metadata || !metadata.propertyName) {
      return NextResponse.json({ error: 'Property metadata is required.' }, { status: 400 });
    }

    const analyzer = new PlanAnalyzerService({
      visionApiKey: apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY,
    });

    const planJson = await analyzer.analyzeFloorPlan(imageUrls || [], metadata);
    return NextResponse.json(planJson);
  } catch (error: any) {
    console.error('Plan analysis API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze floor plan.' },
      { status: 500 }
    );
  }
}
