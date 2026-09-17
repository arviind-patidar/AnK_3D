'use client';

import React, { useState } from 'react';
import { Layers, Edit3, ShieldCheck, Info } from 'lucide-react';
import { FloorPlanJSON, Room, FloorData } from '@/lib/planSchema';

interface PlanViewerProps {
  planJson: FloorPlanJSON;
  onEditClick: () => void;
}

export const PlanViewer: React.FC<PlanViewerProps> = ({ planJson, onEditClick }) => {
  const floorKeys = Object.keys(planJson.floors);
  const [activeFloorKey, setActiveFloorKey] = useState<string>(floorKeys[0] || 'lower');
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  const activeFloor: FloorData | undefined = planJson.floors[activeFloorKey];

  if (!activeFloor) return null;

  const viewWidth = 1000;
  const viewHeight = 800;

  return (
    <div className="bg-[#FAF8F5] border border-[#E2DCD2] rounded-2xl shadow-xl overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-[#F7F3EC]">
              Structured Geometry Plan &amp; Topology Map
            </span>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
              Plan Analysis Complete
            </span>
          </div>
          <p className="text-xs text-[#D4AF77] mt-0.5">
            Normalized 2D spatial polygon model extracted from floor plan drawing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Floor Switcher */}
          {floorKeys.length > 1 && (
            <div className="flex bg-[#141D26] p-1 rounded-lg border border-[#B88E52]/30">
              {floorKeys.map((fk) => (
                <button
                  key={fk}
                  type="button"
                  onClick={() => setActiveFloorKey(fk)}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
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

          {/* Manual Correction Button */}
          <button
            type="button"
            onClick={onEditClick}
            className="inline-flex items-center gap-2 bg-[#B88E52] hover:bg-[#A37B43] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-md"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Plan Analysis</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Geometry Overlay (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#C8C0B2] rounded-xl p-4 shadow-inner relative flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-xs text-[#718096] mb-2 px-2">
            <span className="font-semibold text-[#1F2B38]">
              {activeFloor.floorName} — 2D Topology Overlay
            </span>
            <span className="text-[11px] italic">Hover room polygon to inspect data</span>
          </div>

          <div className="w-full aspect-[4/3] relative border border-[#E2DCD2] rounded-lg overflow-hidden bg-[#FAF8F5]">
            <svg
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
              className="w-full h-full select-none"
            >
              <defs>
                <pattern id="planGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2DCD2" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width={viewWidth} height={viewHeight} fill="url(#planGrid)" />

              {/* Draw Room Polygons */}
              {activeFloor.rooms.map((room) => {
                if (!room.polygon || room.polygon.length < 3) return null;

                const pts = room.polygon.map(([x, y]) => `${x * viewWidth},${y * viewHeight}`).join(' ');

                // Centroid for label
                let cx = 0;
                let cy = 0;
                room.polygon.forEach(([x, y]) => {
                  cx += x * viewWidth;
                  cy += y * viewHeight;
                });
                cx /= room.polygon.length;
                cy /= room.polygon.length;

                const isHovered = hoveredRoom?.id === room.id;

                let fill = '#F7F3EC';
                if (room.type === 'balcony' || room.type === 'standing_balcony') fill = '#E8E4DD';
                if (room.type === 'toilet' || room.type === 'kitchen') fill = '#EFECE6';
                if (room.type === 'stair') fill = '#E6DFD5';
                if (room.type === 'void') fill = '#DDD8CF';

                return (
                  <g
                    key={room.id}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition"
                  >
                    <polygon
                      points={pts}
                      fill={isHovered ? '#B88E52' : fill}
                      fillOpacity={isHovered ? 0.35 : 0.85}
                      stroke={isHovered ? '#1F2B38' : '#8C7A6B'}
                      strokeWidth={isHovered ? 3 : 1.5}
                      className="transition-all duration-150"
                    />

                    {/* Compact Code Badge */}
                    <g transform={`translate(${cx}, ${cy})`}>
                      <rect
                        x="-18"
                        y="-10"
                        width="36"
                        height="20"
                        rx="3"
                        fill="#1F2B38"
                        stroke="#B88E52"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        fontFamily="sans-serif"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#F7F3EC"
                        textAnchor="middle"
                      >
                        {room.code}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Draw Doors */}
              {activeFloor.rooms.flatMap((r) => r.doors).map((door) => (
                <circle
                  key={door.id}
                  cx={door.position[0] * viewWidth}
                  cy={door.position[1] * viewHeight}
                  r="5"
                  fill="#B88E52"
                  stroke="#1F2B38"
                  strokeWidth="1.5"
                />
              ))}

              {/* Draw Stairs */}
              {activeFloor.stairs.map((stair) => {
                if (!stair.polygon || stair.polygon.length < 3) return null;
                const pts = stair.polygon.map(([x, y]) => `${x * viewWidth},${y * viewHeight}`).join(' ');
                return (
                  <polygon
                    key={stair.id}
                    points={pts}
                    fill="none"
                    stroke="#B88E52"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Room Index & Specifications Table (1/3 width) */}
        <div className="bg-[#1F2B38] text-[#F7F3EC] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#B88E52]/40 pb-2">
              <h4 className="font-serif font-bold text-sm text-[#F7F3EC] tracking-wider uppercase">
                {activeFloor.floorName} Index
              </h4>
              <span className="text-[11px] font-semibold text-[#D4AF77]">
                {activeFloor.rooms.length} Rooms
              </span>
            </div>

            {/* Room List Table */}
            <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {activeFloor.rooms.map((room) => {
                const isSelected = hoveredRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className={`p-2 rounded-lg transition border flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#B88E52]/30 border-[#B88E52] text-white'
                        : 'bg-[#141D26] border-[#2D3748] text-[#E2E8F0] hover:border-[#B88E52]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#B88E52] min-w-[32px]">{room.code}</span>
                      <span className="font-semibold truncate max-w-[120px]">{room.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#D4AF77]">{room.dimensions}</p>
                      <p className="text-[10px] font-bold text-white">
                        {room.calculatedSqFt !== 'NR' ? `${room.calculatedSqFt} sq ft` : 'NR'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Area Disclaimer */}
          <div className="pt-4 border-t border-[#B88E52]/30 text-[11px] text-[#A0AEC0] italic flex items-start gap-1.5 mt-2">
            <Info className="w-4 h-4 text-[#B88E52] shrink-0 mt-0.5" />
            <span>Room areas are dimension-derived; not RERA carpet area.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
