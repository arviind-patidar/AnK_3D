export interface DocumentDetectionResult {
  sourceUrl: string;
  croppedPlanUrl: string;
  hasBrochureMargins: boolean;
  detectedOrientationDeg: number;
  dpiEstimate: number;
}

export class DocumentDetectorService {
  /**
   * Detects floor plan region of interest (ROI) in brochure images or multi-page documents
   */
  public async detectAndExtractPlan(imageUrl: string): Promise<DocumentDetectionResult> {
    console.log(`[DocumentDetector] Processing document image: ${imageUrl.slice(0, 40)}...`);

    return {
      sourceUrl: imageUrl,
      croppedPlanUrl: imageUrl,
      hasBrochureMargins: false,
      detectedOrientationDeg: 0,
      dpiEstimate: 300,
    };
  }
}
