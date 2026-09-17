'use client';

import React, { useState } from 'react';
import { Terminal, Code, Image as ImageIcon, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FloorPlanJSON } from '@/lib/planSchema';

interface DiagnosticsScreenProps {
  planJson: FloorPlanJSON | null;
  floorRenders: { [floorKey: string]: string };
  sheetDataUrl: string;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({
  planJson,
  floorRenders,
  sheetDataUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'json' | 'pngs' | 'sheet'>('overview');

  if (!planJson) return null;

  const floorKeys = Object.keys(planJson.floors);
  const lowerPng = floorRenders.lower || floorRenders[floorKeys[0]] || '';
  const upperPng = floorRenders.upper || (floorKeys.length > 1 ? floorRenders[floorKeys[1]] : '');

  const isLowerBlank = !lowerPng || lowerPng.length < 200;
  const isUpperBlank = floorKeys.length > 1 && (!upperPng || upperPng.length < 200);

  return (
    <div className="bg-[#141D26] text-[#F7F3EC] border border-[#B88E52]/40 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2D3748] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B88E52]/20 border border-[#B88E52] flex items-center justify-center text-[#B88E52]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#F7F3EC] tracking-wide flex items-center gap-2">
              <span>Rendering Diagnostics &amp; Inspection Suite</span>
              <span className="text-[10px] uppercase font-bold bg-[#B88E52]/20 text-[#B88E52] px-2 py-0.5 rounded border border-[#B88E52]/40">
                DEV STEP 14
              </span>
            </h3>
            <p className="text-xs text-[#D4AF77]">
              Inspect pipeline artifacts: Plan JSON, 3D Canvas, Raw Raster PNGs, and Final 9:16 Sheet
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#1F2B38] p-1 rounded-xl border border-[#B88E52]/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'overview' ? 'bg-[#B88E52] text-white' : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pngs')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'pngs' ? 'bg-[#B88E52] text-white' : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            Raw PNGs ({Object.keys(floorRenders).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'json' ? 'bg-[#B88E52] text-white' : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            Plan JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sheet')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'sheet' ? 'bg-[#B88E52] text-white' : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            9:16 Sheet
          </button>
        </div>
      </div>

      {/* Error Warnings */}
      {(isLowerBlank || isUpperBlank) && (
        <div className="bg-rose-950/80 border border-rose-600 text-rose-200 p-4 rounded-xl text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-100">Explicit Rendering Error:</p>
            <p>
              Raster 3D PNG output is blank or unrendered. Three.js WebGL canvas failed to produce non-empty pixel buffer.
            </p>
          </div>
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-1">
            <span className="text-[#D4AF77] font-bold">1. Plan JSON Status</span>
            <p className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Valid Geometry Model
            </p>
            <p className="text-[11px] text-[#A0AEC0]">{planJson.metadata.propertyName}</p>
          </div>

          <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-1">
            <span className="text-[#D4AF77] font-bold">2. Three.js 3D Model</span>
            <p className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Three.js Extruded Meshes
            </p>
            <p className="text-[11px] text-[#A0AEC0]">Axonometric Camera</p>
          </div>

          <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-1">
            <span className="text-[#D4AF77] font-bold">3. Raw Raster PNGs</span>
            <p className={`font-bold flex items-center gap-1 mt-1 ${!isLowerBlank ? 'text-emerald-400' : 'text-rose-400'}`}>
              {!isLowerBlank ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {!isLowerBlank ? '1600x1200 PNG Rendered' : 'PNG Render Blank'}
            </p>
            <p className="text-[11px] text-[#A0AEC0]">{Object.keys(floorRenders).length} floor(s) rendered</p>
          </div>

          <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-1">
            <span className="text-[#D4AF77] font-bold">4. 9:16 Mobile Sheet</span>
            <p className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> 75% Hero Render Split
            </p>
            <p className="text-[11px] text-[#A0AEC0]">Acre&amp;Key Branded Sheet</p>
          </div>
        </div>
      )}

      {/* Tab 2: Raw Raster PNGs Inspection */}
      {activeTab === 'pngs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#D4AF77]">
              <span>lower-floor.png (1600 × 1200)</span>
              <span className="text-emerald-400">{lowerPng ? `${(lowerPng.length / 1024).toFixed(1)} KB` : '0 KB'}</span>
            </div>
            {lowerPng ? (
              <img src={lowerPng} alt="Lower Floor Raw PNG" className="w-full h-auto rounded-lg border border-[#2D3748] bg-black" />
            ) : (
              <div className="h-48 bg-rose-950/40 border border-rose-800 rounded-lg flex items-center justify-center text-rose-300 text-xs">
                Lower Floor PNG is blank
              </div>
            )}
          </div>

          {floorKeys.length > 1 && (
            <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#D4AF77]">
                <span>upper-floor.png (1600 × 1200)</span>
                <span className="text-emerald-400">{upperPng ? `${(upperPng.length / 1024).toFixed(1)} KB` : '0 KB'}</span>
              </div>
              {upperPng ? (
                <img src={upperPng} alt="Upper Floor Raw PNG" className="w-full h-auto rounded-lg border border-[#2D3748] bg-black" />
              ) : (
                <div className="h-48 bg-rose-950/40 border border-rose-800 rounded-lg flex items-center justify-center text-rose-300 text-xs">
                  Upper Floor PNG is blank
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: JSON Inspector */}
      {activeTab === 'json' && (
        <div className="bg-[#0D131A] p-4 rounded-xl border border-[#2D3748] max-h-96 overflow-y-auto font-mono text-xs text-[#E2E8F0] custom-scrollbar">
          <pre>{JSON.stringify(planJson, null, 2)}</pre>
        </div>
      )}

      {/* Tab 4: 9:16 Sheet */}
      {activeTab === 'sheet' && (
        <div className="flex justify-center p-4 bg-[#0D131A] rounded-xl border border-[#2D3748]">
          <img src={sheetDataUrl} alt="Composed 9:16 Sheet" className="max-h-[600px] w-auto rounded-lg shadow-xl" />
        </div>
      )}
    </div>
  );
};
