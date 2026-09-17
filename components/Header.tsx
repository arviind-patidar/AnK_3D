'use client';

import React from 'react';
import { Sparkles, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#1F2B38] text-[#F7F3EC] border-b border-[#B88E52]/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title Area */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#B88E52]/20 border border-[#B88E52] flex items-center justify-center text-[#B88E52] shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-2xl tracking-wider text-[#F7F3EC]">
                acre<span className="text-[#B88E52]">&amp;</span>key
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest bg-[#B88E52]/20 text-[#B88E52] px-2 py-0.5 rounded border border-[#B88E52]/30">
                ADVISORY 3D STUDIO
              </span>
            </div>
            <h1 className="text-lg font-medium text-[#E2DCD2] tracking-wide mt-0.5">
              Floor Plan to 3D Visualisation
            </h1>
          </div>
        </div>

        {/* Subtitle & Tagline */}
        <div className="text-center md:text-right">
          <p className="text-xs sm:text-sm text-[#D4AF77] font-medium max-w-md">
            Turn a residential floor plan into a presentation-ready conceptual 3D visual.
          </p>
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-[11px] text-[#A0AEC0] mt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E52]" />
            <span>Preserves exact floor-plan geometry &amp; architectural topology</span>
          </div>
        </div>
      </div>
    </header>
  );
};
