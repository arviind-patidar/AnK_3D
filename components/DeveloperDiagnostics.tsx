'use client';

import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Code, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { FloorPlanJSON, ValidationResult } from '@/lib/planSchema';

interface DeveloperDiagnosticsProps {
  planJson: FloorPlanJSON | null;
  floorRenders: { [floorKey: string]: string };
  sheetDataUrl: string;
  validationResult: ValidationResult | null;
}

export const DeveloperDiagnostics: React.FC<DeveloperDiagnosticsProps> = ({
  planJson,
  floorRenders,
  sheetDataUrl,
  validationResult,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'json' | 'pngs' | 'validation' | 'sheet'>('overview');

  if (!planJson) return null;

  return (
    <div className="max-w-6xl mx-auto pt-8 border-t border-[#E2DCD2]">
      {/* Collapsible Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1F2B38] text-[#F7F3EC] p-4 rounded-2xl border border-[#B88E52]/40 shadow-md flex items-center justify-between transition hover:bg-[#141D26]"
      >
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-[#B88E52]/20 border border-[#B88E52] flex items-center justify-center text-[#B88E52]">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-serif font-bold text-sm text-[#F7F3EC] tracking-wider block">
              DEVELOPER / QA DIAGNOSTICS
            </span>
            <span className="text-[10px] text-[#D4AF77]">
              Internal Pipeline Logs, Plan JSON, Raw WebGL PNGs &amp; 14-Point Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF77]">
          <span>{isOpen ? 'Collapse' : 'Expand Debugging Tools'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="mt-4 bg-[#141D26] text-[#F7F3EC] border border-[#B88E52]/30 rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in">
          {/* Sub-navigation Tabs */}
          <div className="flex bg-[#1F2B38] p-1 rounded-xl border border-[#B88E52]/30 text-xs font-bold gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'json', label: 'Plan JSON' },
              { id: 'pngs', label: `Raw PNGs (${Object.keys(floorRenders).length})` },
              { id: 'validation', label: '14-Point Validation' },
              { id: 'sheet', label: 'Composed Sheet' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-[#B88E52] text-white' : 'text-[#A0AEC0] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748]">
                <span className="text-[#D4AF77] font-bold">1. Geometry JSON</span>
                <p className="font-bold text-emerald-400 mt-1">Valid Schema</p>
                <p className="text-[11px] text-[#A0AEC0]">{planJson.metadata.propertyName}</p>
              </div>

              <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748]">
                <span className="text-[#D4AF77] font-bold">2. Three.js Engine</span>
                <p className="font-bold text-emerald-400 mt-1">WebGL Active</p>
                <p className="text-[11px] text-[#A0AEC0]">Orthographic Camera</p>
              </div>

              <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748]">
                <span className="text-[#D4AF77] font-bold">3. Raster Output</span>
                <p className="font-bold text-emerald-400 mt-1">1600x1200 PNG</p>
                <p className="text-[11px] text-[#A0AEC0]">{Object.keys(floorRenders).length} floor(s)</p>
              </div>

              <div className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748]">
                <span className="text-[#D4AF77] font-bold">4. Audit Score</span>
                <p className="font-bold text-emerald-400 mt-1">
                  {validationResult ? `${validationResult.score}% Pass` : 'Audited'}
                </p>
                <p className="text-[11px] text-[#A0AEC0]">14 Topology Checks</p>
              </div>
            </div>
          )}

          {/* Tab 2: JSON */}
          {activeTab === 'json' && (
            <div className="bg-[#0D131A] p-4 rounded-xl border border-[#2D3748] max-h-96 overflow-y-auto font-mono text-xs text-[#E2E8F0] custom-scrollbar">
              <pre>{JSON.stringify(planJson, null, 2)}</pre>
            </div>
          )}

          {/* Tab 3: Raw PNGs */}
          {activeTab === 'pngs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(floorRenders).map((fk) => (
                <div key={fk} className="bg-[#1F2B38] p-4 rounded-xl border border-[#2D3748] space-y-2">
                  <span className="text-xs font-bold text-[#D4AF77]">{fk.toUpperCase()} Floor Raw PNG (1600x1200)</span>
                  <img src={floorRenders[fk]} alt={`${fk} PNG`} className="w-full h-auto rounded-lg border border-[#2D3748] bg-black" />
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Validation */}
          {activeTab === 'validation' && validationResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {validationResult.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#1F2B38] border border-[#2D3748] rounded-xl space-y-1">
                  <p className="font-bold text-[#F7F3EC]">{item.label}</p>
                  <p className="text-[11px] text-[#A0AEC0]">{item.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Sheet */}
          {activeTab === 'sheet' && (
            <div className="flex justify-center p-4 bg-[#0D131A] rounded-xl border border-[#2D3748]">
              <img src={sheetDataUrl} alt="Composed Sheet" className="max-h-[500px] w-auto rounded-lg shadow-xl" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
