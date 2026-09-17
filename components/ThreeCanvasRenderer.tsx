'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FloorPlanJSON } from '@/lib/planSchema';
import { ThreeRenderEngine } from '@/services/threeRenderEngine';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ThreeCanvasRendererProps {
  planJson: FloorPlanJSON;
  onRendersComplete: (renders: { [floorKey: string]: string }) => void;
}

export const ThreeCanvasRenderer: React.FC<ThreeCanvasRendererProps> = ({
  planJson,
  onRendersComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderingState, setRenderingState] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!planJson || !planJson.floors) return;

    let isMounted = true;

    const runThreeRendering = async () => {
      try {
        setRenderingState('rendering');
        console.log('Starting WebGL Three.js 3D Dollhouse Render Pipeline...');

        const engine = new ThreeRenderEngine({ width: 1600, height: 1200 });
        const renders: { [key: string]: string } = {};

        for (const floorKey of Object.keys(planJson.floors)) {
          const floorData = planJson.floors[floorKey];
          console.log(`Rendering real 3D raster PNG for floor: ${floorData.floorName}`);

          const { pngDataUrl } = await engine.renderFloorToPNG(floorData);

          if (!pngDataUrl || pngDataUrl.length < 100) {
            throw new Error(`Failed to generate raster 3D PNG for floor: ${floorData.floorName}`);
          }

          renders[floorKey] = pngDataUrl;
        }

        if (isMounted) {
          setRenderingState('done');
          onRendersComplete(renders);
        }
      } catch (err: any) {
        console.error('Three.js 3D rendering error:', err);
        if (isMounted) {
          setRenderingState('error');
          setErrorMessage(err.message || 'WebGL 3D render failed.');
        }
      }
    };

    runThreeRendering();

    return () => {
      isMounted = false;
    };
  }, [planJson]);

  if (renderingState === 'error') {
    return (
      <div className="bg-rose-950/80 border border-rose-600 text-rose-200 p-4 rounded-xl text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        <div>
          <p className="font-bold">Three.js 3D WebGL Render Error:</p>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (renderingState === 'rendering') {
    return (
      <div className="bg-[#1F2B38] text-[#F7F3EC] border border-[#B88E52]/40 p-4 rounded-xl text-xs flex items-center gap-3 shadow-lg">
        <Loader2 className="w-5 h-5 text-[#B88E52] animate-spin shrink-0" />
        <div>
          <p className="font-bold text-[#F7F3EC]">Three.js WebGL 3D Dollhouse Engine Active</p>
          <p className="text-[#D4AF77]">Building 3D extruded walls, floor slabs, furniture models &amp; realistic soft shadows (1600x1200 PNG)...</p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="hidden" />;
};
