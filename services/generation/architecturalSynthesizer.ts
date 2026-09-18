import { FloorPlanJSON, FloorData } from '@/lib/planSchema';
import { ThreeRenderEngine } from '@/services/threeRenderEngine';

export interface StylingConfig {
  flooringStyle?: 'honey_oak' | 'marble' | 'modern_slate';
  wallCapColor?: string;
  furnitureStyle?: 'luxury_contemporary' | 'minimalist' | 'scandinavian';
  lightingMode?: 'warm_sunlight' | 'bright_daylight' | 'evening_ambient';
}

export class ArchitecturalSynthesizerService {
  /**
   * Synthesizes a high-fidelity 3D visual render receiving an AUTHORITATIVE spatial geometry model.
   * Topology/geometry is fixed; rendering controls materials, furniture models, lighting, and shadows.
   */
  public async synthesizeVisual(
    planJson: FloorPlanJSON,
    floorKey: string = 'lower',
    config: StylingConfig = {}
  ): Promise<string> {
    const floorData = planJson.floors[floorKey];
    if (!floorData) throw new Error(`Floor key ${floorKey} not found in spatial model.`);

    console.log(`[ArchitecturalSynthesizer] Rendering 3D visual for approved floor: ${floorData.floorName}`);

    // Client-side WebGL Three.js Render Engine using authoritative geometry
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const engine = new ThreeRenderEngine({ width: 1600, height: 1200 });
      const result = await engine.renderFloorToPNG(floorData);
      return result.pngDataUrl;
    }

    return floorData.renderImageUrl || '';
  }
}
