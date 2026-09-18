import { SheetComposerService } from '@/services/sheetComposer';
import { FloorPlanJSON } from '@/lib/planSchema';

export class BrandedSheetComposerService {
  private composer: SheetComposerService;

  constructor() {
    this.composer = new SheetComposerService();
  }

  /**
   * Generates a 1080x1920 9:16 Acre&Key branded presentation sheet SVG Data URL
   */
  public generateBrandedSheet(
    planJson: FloorPlanJSON,
    floorRenders: { [floorKey: string]: string }
  ): string {
    return this.composer.composeBrandedSheet(planJson, floorRenders);
  }
}
