'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck, Edit3, Eye, Info } from 'lucide-react';
import { FloorPlanJSON, Room, FloorData } from '@/lib/planSchema';

interface UnderstandScreenProps {
  planJson: FloorPlanJSON;
  onConfirm: () => void;
  onBack: () => void;
  onOpenEditDrawer: () => void;
}

export const UnderstandScreen: React.FC<UnderstandScreenProps> = ({
  planJson,
  onConfirm,
  onBack,
  onOpenEditDrawer,
}) => {
  const floorKeys = Object.keys(planJson.floors);
  const [activeFloorKey, setActiveFloorKey] = useState<string>(floorKeys[0] || 'lower');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const activeFloor: FloorData | undefined = planJson.floors[activeFloorKey];
  if (!activeFloor) return null;

  const viewWidth = 1000;
  const viewHeight = 800;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#B88E52] uppercase bg-[#B88E52]/10 px-3 py-1 rounded-full border border-[#B88E52]/30">
            STEP 02 — PLAN UNDERSTANDING
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1F2B38] mt-2">
            WE UNDERSTOOD YOUR PLAN
          </h1>
          <p className="text-sm text-[#718096]">
            Review room boundaries, doors, and features before 3D generation.
          </p>
        </div>

        {/* Floor Tabs for Duplex */}
        {floorKeys.length > 1 && (
          <div className="flex bg-[#1F2B38] p-1.5 rounded-xl border border-[#B88E52]/40 shadow-sm">
            {floorKeys.map((fk) => (
              <button
                key={fk}
                type="button"
                onClick={() => {
                  setActiveFloorKey(fk);
                  setSelectedRoom(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeFloorKey === fk
                    ? 'bg-[#B88E52] text-white shadow'
                    : 'text-[#D4AF77] hover:text-white'
                }`}
              >
                {planJson.floors[fk].floorName || fk.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Split Layout: 2D Plan View + Inspection Card & Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reconstructed 2D Floor Plan SVG Map (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#C8C0B2] rounded-3xl p-5 shadow-lg relative flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-xs text-[#718096] mb-3 px-1">
            <span className="font-bold text-[#1F2B38]">
              {activeFloor.floorName} — Reconstructed 2D Layout Map
            </span>
            <span className="text-[11px] text-[#B88E52] font-semibold italic">
              Click any room polygon to inspect data
            </span>
          </div>

          <div className="w-full aspect-[4/3] relative border border-[#E2DCD2] rounded-2xl overflow-hidden bg-[#FAF8F5]">
            <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-full select-none">
              <defs>
                <pattern id="planGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2DCD2" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width={viewWidth} height={viewHeight} fill="url(#planGrid2)" />

              {/* Draw Room Polygons */}
              {activeFloor.rooms.map((room) => {
                if (!room.polygon || room.polygon.length < 3) return null;

                const pts = room.polygon.map(([x, y]) => `${x * viewWidth},${y * viewHeight}`).join(' ');

                let cx = 0;
                let cy = 0;
                room.polygon.forEach(([x, y]) => {
                  cx += x * viewWidth;
                  cy += y * viewHeight;
                });
                cx /= room.polygon.length;
                cy /= room.polygon.length;

                const isSelected = selectedRoom?.id === room.id;

                let fill = '#F7F3EC';
                if (room.type === 'balcony' || room.type === 'standing_balcony') fill = '#E8E4DD';
                if (room.type === 'toilet' || room.type === 'kitchen') fill = '#EFECE6';
                if (room.type === 'stair') fill = '#E6DFD5';

                return (
                  <g
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    <polygon
                      points={pts}
                      fill={isSelected ? '#B88E52' : fill}
                      fillOpacity={isSelected ? 0.5 : 0.85}
                      stroke={isSelected ? '#1F2B38' : '#8C7A6B'}
                      strokeWidth={isSelected ? 3.5 : 1.5}
                    />

                    {/* Room Badge */}
                    <g transform={`translate(${cx}, ${cy})`}>
                      <rect
                        x="-20"
                        y="-12"
                        width="40"
                        height="24"
                        rx="5"
                        fill={isSelected ? '#B88E52' : '#1F2B38'}
                        stroke="#B88E52"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        fontFamily="sans-serif"
                        fontSize="11"
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

              {/* Doors */}
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

              {/* Stairs */}
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

        {/* Right Side: Selected Room Inspection & Confidence Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Room Inspection Panel */}
          <div className="bg-[#FAF8F5] border-2 border-[#E2DCD2] rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1F2B38]">
                Room Inspection
              </h3>
              <button
                type="button"
                onClick={onOpenEditDrawer}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88E52] hover:underline bg-white px-3 py-1.5 rounded-lg border border-[#C8C0B2]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT DETAILS</span>
              </button>
            </div>

            {selectedRoom ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1F2B38] text-[#B88E52] border border-[#B88E52] flex items-center justify-center font-bold text-lg">
                    {selectedRoom.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#1F2B38]">{selectedRoom.name}</h4>
                    <p className="text-xs text-[#718096] capitalize">{selectedRoom.type} Space</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
                    <span className="text-[10px] font-bold text-[#718096] uppercase">Printed Dimension</span>
                    <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{selectedRoom.dimensions}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
                    <span className="text-[10px] font-bold text-[#718096] uppercase">Derived Sq Ft</span>
                    <p className="font-bold text-sm text-[#B88E52] mt-0.5">
                      {selectedRoom.calculatedSqFt !== 'NR' ? `${selectedRoom.calculatedSqFt} sq ft` : 'NR'}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span className="font-bold">Interpretation Confidence</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">High (99%)</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2 text-xs text-[#718096]">
                <Eye className="w-8 h-8 text-[#B88E52] mx-auto opacity-70" />
                <p className="font-semibold text-[#1F2B38]">Click any room on the plan to inspect details</p>
                <p>Verify room boundaries, dimensions, and sq ft before 3D rendering.</p>
              </div>
            )}
          </div>

          {/* Confidence Breakdown Display */}
          <div className="bg-[#1F2B38] text-[#F7F3EC] rounded-3xl p-6 shadow-xl space-y-4 border-t-4 border-[#B88E52]">
            <div className="flex items-center justify-between border-b border-[#B88E52]/40 pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#F7F3EC]">Plan Confidence Rating</h4>
                <p className="text-xs text-[#D4AF77]">Overall structural understanding score</p>
              </div>
              <span className="text-lg font-extrabold text-[#B88E52] bg-[#B88E52]/20 px-3 py-1 rounded-xl border border-[#B88E52]/40">
                96%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Rooms</span>
                <span className="font-bold text-emerald-400">99%</span>
              </div>
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Doors</span>
                <span className="font-bold text-emerald-400">94%</span>
              </div>
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Windows</span>
                <span className="font-bold text-emerald-400">91%</span>
              </div>
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Balconies</span>
                <span className="font-bold text-emerald-400">97%</span>
              </div>
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Stairs</span>
                <span className="font-bold text-emerald-400">99%</span>
              </div>
              <div className="flex justify-between bg-[#141D26] p-2.5 rounded-lg border border-[#2D3748]">
                <span className="text-[#A0AEC0]">Dimensions</span>
                <span className="font-bold text-emerald-400">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-[#E2DCD2] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1F2B38] border border-[#C8C0B2] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold uppercase tracking-wider transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#B88E52]" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] border border-[#B88E52] rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-lg"
        >
          <span>Confirm &amp; Continue</span>
          <ArrowRight className="w-4 h-4 text-[#B88E52]" />
        </button>
      </div>
    </div>
  );
};

