'use client';

import React, { useState } from 'react';
import { Box, Layers, Download, CheckCircle2 } from 'lucide-react';
import { FloorPlanJSON } from '@/lib/planSchema';
import { ACRE_KEY_BRAND } from '@/lib/branding';

interface RenderPreviewProps {
  planJson: FloorPlanJSON;
  floorRenders: { [floorKey: string]: string };
}

export const RenderPreview: React.FC<RenderPreviewProps> = ({ planJson, floorRenders }) => {
  const floorKeys = Object.keys(planJson.floors);
  const [activeFloorKey, setActiveFloorKey] = useState<string>(floorKeys[0] || 'lower');

  const activeFloor = planJson.floors[activeFloorKey];
  const activeRenderUrl = activeFloor ? floorRenders[activeFloorKey] || activeFloor.renderImageUrl : '';

  if (!activeFloor) return null;

  return (
    <div className="bg-[#FAF8F5] border border-[#E2DCD2] rounded-2xl shadow-xl overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[#B88E52]" />
            <h3 className="font-serif font-bold text-lg text-[#F7F3EC]">
              Conceptual 3D Axonometric Dollhouse Visualisation
            </h3>
          </div>
          <p className="text-xs text-[#D4AF77] mt-0.5">
            Preserves exact architectural topology, walls, doors, stairs, balconies &amp; furniture anchors
          </p>
        </div>

        {/* Floor Selector */}
        {floorKeys.length > 1 && (
          <div className="flex bg-[#141D26] p-1 rounded-lg border border-[#B88E52]/30">
            {floorKeys.map((fk) => (
              <button
                key={fk}
                type="button"
                onClick={() => setActiveFloorKey(fk)}
                className={`px-4 py-1.5 rounded text-xs font-bold transition ${
                  activeFloorKey === fk
                    ? 'bg-[#B88E52] text-white shadow-sm'
                    : 'text-[#D4AF77] hover:text-white'
                }`}
              >
                {planJson.floors[fk].floorName || fk.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Layout: 3D Render (70% width) + Information Index Panel (30% width) */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Render Display (approx 70% width / 8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#C8C0B2] rounded-xl p-4 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[480px]">
          <div className="w-full flex items-center justify-between text-xs text-[#718096] mb-2 px-1">
            <span className="font-bold text-[#1F2B38]">
              {activeFloor.floorName} — 3D Cutaway Render
            </span>
            <span className="text-[11px] text-[#B88E52] font-semibold">
              Isometric / Axonometric Camera Angle
            </span>
          </div>

          {activeRenderUrl ? (
            <div className="w-full h-full relative rounded-lg overflow-hidden border border-[#E2DCD2] bg-[#F7F3EC] flex items-center justify-center">
              <img
                src={activeRenderUrl}
                alt={`${activeFloor.floorName} 3D Visual`}
                className="max-h-[520px] w-full object-contain drop-shadow-md"
              />
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-xs text-[#718096]">
              Generating 3D Isometric Dollhouse Visual...
            </div>
          )}

          {/* Download Individual Floor Render */}
          {activeRenderUrl && (
            <div className="mt-3 w-full flex justify-end">
              <a
                href={activeRenderUrl}
                download={`${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_${activeFloorKey}_3d.png`}
                className="inline-flex items-center gap-1.5 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#B88E52]"
              >
                <Download className="w-3.5 h-3.5 text-[#B88E52]" />
                <span>Download {activeFloorKey === 'lower' ? 'Lower Floor' : 'Upper Floor'} 3D</span>
              </a>
            </div>
          )}
        </div>

        {/* Acre&Key Right Side Navy Information Panel (approx 30% width / 4 cols) */}
        <div className="lg:col-span-4 bg-[#1F2B38] text-[#F7F3EC] rounded-xl p-5 shadow-xl flex flex-col justify-between border-t-4 border-[#B88E52]">
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-[#F7F3EC] tracking-wider uppercase">
                {planJson.metadata.propertyName}
              </h4>
              <p className="text-xs font-semibold text-[#D4AF77]">
                {activeFloor.floorName} ({planJson.metadata.layoutType})
              </p>
              <p className="text-[11px] text-[#A0AEC0] font-medium mt-0.5">5 BHK + MAID'S UNIT</p>
            </div>

            <div className="border-t border-[#B88E52]/30 pt-3">
              <h5 className="font-bold text-xs text-[#B88E52] tracking-wider uppercase mb-2">
                ROOM INDEX — {activeFloorKey === 'lower' ? 'LOWER FLOOR' : 'UPPER FLOOR'}
              </h5>

              {/* Index Table */}
              <div className="max-h-[340px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#4A5568] text-[#D4AF77] font-bold text-[10px] uppercase">
                      <th className="py-1 px-1">CODE</th>
                      <th className="py-1 px-1">ROOM</th>
                      <th className="py-1 px-1">DIMENSIONS</th>
                      <th className="py-1 px-1 text-right">SQ FT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFloor.rooms.map((room) => (
                      <tr key={room.id} className="border-b border-[#2D3748]/60 hover:bg-[#141D26] transition text-[11px]">
                        <td className="py-1 px-1 font-bold text-[#B88E52]">{room.code}</td>
                        <td className="py-1 px-1 font-semibold text-[#F7F3EC]">{room.name}</td>
                        <td className="py-1 px-1 text-[#E2E8F0]">{room.dimensions}</td>
                        <td className="py-1 px-1 text-right font-bold text-white">
                          {room.calculatedSqFt !== 'NR' ? room.calculatedSqFt : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel Footer & Acre&Key Logo */}
          <div className="pt-4 border-t border-[#B88E52]/30 space-y-3 mt-4">
            <p className="text-[10px] text-[#A0AEC0] italic">
              {ACRE_KEY_BRAND.disclaimers.roomArea}
            </p>
            <div className="flex items-center justify-between">
              <div className="font-serif font-bold text-lg text-[#F7F3EC]">
                acre<span className="text-[#B88E52]">&amp;</span>key
              </div>
              <span className="text-[9px] font-bold tracking-widest text-[#B88E52] uppercase">
                PROPERTY ADVISORY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
