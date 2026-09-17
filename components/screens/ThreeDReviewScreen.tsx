'use client';

import React, { useState } from 'react';
import { Box, Layers, RotateCw, ZoomIn, ArrowRight, ArrowLeft, Download, Info, Eye } from 'lucide-react';
import { FloorPlanJSON, Room, FloorData } from '@/lib/planSchema';

interface ThreeDReviewScreenProps {
  planJson: FloorPlanJSON;
  floorRenders: { [floorKey: string]: string };
  onProceedToExport: () => void;
  onBack: () => void;
}

export const ThreeDReviewScreen: React.FC<ThreeDReviewScreenProps> = ({
  planJson,
  floorRenders,
  onProceedToExport,
  onBack,
}) => {
  const floorKeys = Object.keys(planJson.floors);
  const [activeFloorKey, setActiveFloorKey] = useState<string>(floorKeys[0] || 'lower');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [cameraView, setCameraView] = useState<'isometric' | 'top' | 'cutaway'>('isometric');

  const activeFloor: FloorData | undefined = planJson.floors[activeFloorKey];
  const activeRenderUrl = activeFloor ? floorRenders[activeFloorKey] || activeFloor.renderImageUrl : '';

  if (!activeFloor) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 px-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#B88E52] uppercase bg-[#B88E52]/10 px-3 py-1 rounded-full border border-[#B88E52]/30">
            STEP 04 — 3D MODEL REVIEW
          </span>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F2B38] mt-2">
            YOUR 3D HOME
          </h1>
          <p className="text-xs text-[#718096] font-medium">
            {planJson.metadata.propertyName} • {planJson.metadata.layoutType} • 100% Structural Wall Topology Match
          </p>
        </div>

        {/* Floor Selector & Camera Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Floor Selector Tabs */}
          {floorKeys.length > 1 && (
            <div className="flex bg-[#1F2B38] p-1 rounded-xl border border-[#B88E52]/40 shadow-sm">
              {floorKeys.map((fk) => (
                <button
                  key={fk}
                  type="button"
                  onClick={() => {
                    setActiveFloorKey(fk);
                    setSelectedRoom(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
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

          {/* Camera View Mode Buttons */}
          <div className="flex bg-white p-1 rounded-xl border border-[#C8C0B2] text-xs font-bold">
            <button
              type="button"
              onClick={() => setCameraView('isometric')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cameraView === 'isometric' ? 'bg-[#1F2B38] text-white' : 'text-[#718096] hover:text-[#1F2B38]'
              }`}
            >
              ISOMETRIC
            </button>
            <button
              type="button"
              onClick={() => setCameraView('top')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cameraView === 'top' ? 'bg-[#1F2B38] text-white' : 'text-[#718096] hover:text-[#1F2B38]'
              }`}
            >
              TOP VIEW
            </button>
            <button
              type="button"
              onClick={() => setCameraView('cutaway')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cameraView === 'cutaway' ? 'bg-[#1F2B38] text-white' : 'text-[#718096] hover:text-[#1F2B38]'
              }`}
            >
              CUTAWAY
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: 3D Model Hero Viewer (70% width) + Bidirectional Room Index (30% width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Three.js 3D Hero Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white border-2 border-[#C8C0B2] rounded-3xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[560px]">
          <div className="flex items-center justify-between text-xs text-[#718096] mb-2 px-2">
            <span className="font-bold text-[#1F2B38]">
              {activeFloor.floorName} — 3D Dollhouse Render
            </span>
            <span className="text-[11px] font-bold text-[#B88E52] bg-[#B88E52]/10 px-2.5 py-0.5 rounded-full border border-[#B88E52]/30">
              Interactive 3D Perspective
            </span>
          </div>

          {/* Render Frame Container */}
          <div className="w-full h-full relative rounded-2xl overflow-hidden border border-[#E2DCD2] bg-[#FAF8F5] flex items-center justify-center p-2">
            {activeRenderUrl ? (
              <img
                src={activeRenderUrl}
                alt={`${activeFloor.floorName} 3D Visual`}
                className="max-h-[540px] w-full object-contain transition-transform duration-300 drop-shadow-md"
              />
            ) : (
              <div className="py-24 text-xs text-[#718096]">Rendering 3D WebGL Model...</div>
            )}

            {/* Floating Room Inspector Badge Overlay */}
            {selectedRoom && (
              <div className="absolute top-4 left-4 bg-[#1F2B38] text-[#F7F3EC] px-4 py-3 rounded-xl border-2 border-[#B88E52] shadow-2xl text-xs space-y-1 animate-fade-in max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs bg-[#B88E52] text-white px-2 py-0.5 rounded">
                    {selectedRoom.code}
                  </span>
                  <span className="font-bold text-sm text-[#F7F3EC]">{selectedRoom.name}</span>
                </div>
                <p className="text-[11px] text-[#E2E8F0]">Dimensions: {selectedRoom.dimensions}</p>
                <p className="text-[11px] font-bold text-[#D4AF77]">
                  Calculated Area: {selectedRoom.calculatedSqFt !== 'NR' ? `${selectedRoom.calculatedSqFt} sq ft` : 'NR'}
                </p>
              </div>
            )}
          </div>

          {/* Sub-footer controls bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-[#718096] px-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold">
                <RotateCw className="w-3.5 h-3.5 text-[#B88E52]" /> Rotate
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <ZoomIn className="w-3.5 h-3.5 text-[#B88E52]" /> Zoom
              </span>
            </div>

            <a
              href={activeRenderUrl}
              download={`${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_${activeFloorKey}_3d.png`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88E52] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeFloorKey === 'lower' ? 'Lower' : 'Upper'} Floor 3D PNG</span>
            </a>
          </div>
        </div>

        {/* Right Side: Bidirectional Room Index Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#1F2B38] text-[#F7F3EC] rounded-3xl p-5 shadow-2xl space-y-4 border-t-4 border-[#B88E52] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#B88E52]/30 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#F7F3EC] uppercase tracking-wider">
                ROOM INDEX
              </h3>
              <p className="text-xs text-[#D4AF77]">
                Click any room row to highlight in 3D viewer
              </p>
            </div>

            {/* Room Index List - Never truncate names! */}
            <div className="max-h-[440px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {activeFloor.rooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(isSelected ? null : room)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#B88E52] text-white border-[#F7F3EC] shadow-md scale-[1.01]'
                        : 'bg-[#141D26] text-[#E2E8F0] border-[#2D3748] hover:border-[#B88E52]'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold text-[11px] px-2 py-0.5 rounded ${isSelected ? 'bg-white text-[#B88E52]' : 'bg-[#1F2B38] text-[#B88E52]'}`}>
                          {room.code}
                        </span>
                        <span className="font-bold text-xs leading-snug break-words">
                          {room.name}
                        </span>
                      </div>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-white/90' : 'text-[#A0AEC0]'}`}>
                        {room.dimensions}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-xs block text-[#F7F3EC]">
                        {room.calculatedSqFt !== 'NR' ? `${room.calculatedSqFt} sq ft` : 'NR'}
                      </span>
                      <span className={`text-[9px] uppercase font-semibold ${isSelected ? 'text-white/80' : 'text-[#D4AF77]'}`}>
                        Dimension-Derived
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-3 border-t border-[#B88E52]/40 text-[10px] text-[#A0AEC0] italic flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#B88E52] shrink-0 mt-0.5" />
            <span>Room areas are dimension-derived; distinct from RERA carpet area.</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-[#E2DCD2] flex items-center justify-between">
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
          onClick={onProceedToExport}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] border-2 border-[#B88E52] rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-xl"
        >
          <span>Proceed to Export Presentation</span>
          <ArrowRight className="w-4 h-4 text-[#B88E52]" />
        </button>
      </div>
    </div>
  );
};

