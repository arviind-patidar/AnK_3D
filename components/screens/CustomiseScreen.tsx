'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Check, Sun, Home, Compass, ShieldCheck } from 'lucide-react';

interface CustomiseScreenProps {
  onGenerate: (styleConfig: {
    style: string;
    furnishing: string;
    lighting: string;
    camera: string;
  }) => void;
  onBack: () => void;
}

export const CustomiseScreen: React.FC<CustomiseScreenProps> = ({
  onGenerate,
  onBack,
}) => {
  const [selectedStyle, setSelectedStyle] = useState('contemporary');
  const [furnishing, setFurnishing] = useState('full');
  const [lighting, setLighting] = useState('daylight');
  const [camera, setCamera] = useState('isometric');

  const styles = [
    {
      id: 'architectural',
      name: 'ARCHITECTURAL',
      desc: 'Clean architectural presentation with subtle wall rendering and monochrome accents.',
    },
    {
      id: 'contemporary',
      name: 'CONTEMPORARY',
      desc: 'Warm modern residential interiors with natural oak floors and neutral beige furniture.',
    },
    {
      id: 'luxury',
      name: 'LUXURY',
      desc: 'High-end residential styling featuring polished marble tiles and warm brass finishes.',
    },
    {
      id: 'minimal',
      name: 'MINIMAL',
      desc: 'Understated minimalist aesthetic with light plaster walls and soft shadow tones.',
    },
  ];

  const handleGenerateClick = () => {
    onGenerate({
      style: selectedStyle,
      furnishing,
      lighting,
      camera,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#B88E52] uppercase bg-[#B88E52]/10 px-3.5 py-1 rounded-full border border-[#B88E52]/30">
          STEP 03 — VISUAL CONFIGURATION
        </span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1F2B38] mt-2">
          CUSTOMIZE YOUR 3D
        </h1>
        <p className="text-sm text-[#718096] max-w-xl mx-auto font-medium">
          Select interior styling, furnishing density, lighting atmosphere, and camera views.
        </p>

        <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#E5D9C5] text-[#8C7A6B] text-[11px] font-bold px-3 py-1 rounded-full mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B88E52]" />
          <span>Visual choices preserve 100% exact floor plan topology.</span>
        </div>
      </div>

      {/* Style Selection Cards */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
          1. Architectural Style Palette
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {styles.map((s) => {
            const isSelected = selectedStyle === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1F2B38] text-[#F7F3EC] border-[#B88E52] shadow-xl scale-[1.01]'
                    : 'bg-white text-[#1F2B38] border-[#C8C0B2] hover:border-[#B88E52]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-base tracking-wide">
                    {s.name}
                  </h3>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#B88E52] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className={`text-xs ${isSelected ? 'text-[#D4AF77]' : 'text-[#718096]'}`}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Options Grid: Furnishing, Lighting, Camera */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E2DCD2]">
        {/* Furnishing Density */}
        <div className="bg-[#FAF8F5] border border-[#E2DCD2] p-5 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
            2. Furnishing
          </label>
          <div className="space-y-2 text-xs">
            {[
              { id: 'full', label: 'Fully Furnished' },
              { id: 'light', label: 'Lightly Furnished' },
              { id: 'architectural', label: 'Architectural Only' },
            ].map((opt) => (
              <label
                key={opt.id}
                onClick={() => setFurnishing(opt.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer font-semibold transition ${
                  furnishing === opt.id
                    ? 'bg-[#1F2B38] text-white border-[#B88E52]'
                    : 'bg-white text-[#1F2B38] border-[#C8C0B2]'
                }`}
              >
                <span>{opt.label}</span>
                {furnishing === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#B88E52]" />}
              </label>
            ))}
          </div>
        </div>

        {/* Lighting Atmosphere */}
        <div className="bg-[#FAF8F5] border border-[#E2DCD2] p-5 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
            3. Lighting
          </label>
          <div className="space-y-2 text-xs">
            {[
              { id: 'daylight', label: 'Natural Daylight' },
              { id: 'warm', label: 'Warm Interior' },
              { id: 'neutral', label: 'Neutral Lighting' },
            ].map((opt) => (
              <label
                key={opt.id}
                onClick={() => setLighting(opt.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer font-semibold transition ${
                  lighting === opt.id
                    ? 'bg-[#1F2B38] text-white border-[#B88E52]'
                    : 'bg-white text-[#1F2B38] border-[#C8C0B2]'
                }`}
              >
                <span>{opt.label}</span>
                {lighting === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#B88E52]" />}
              </label>
            ))}
          </div>
        </div>

        {/* Camera Perspective */}
        <div className="bg-[#FAF8F5] border border-[#E2DCD2] p-5 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
            4. Camera View
          </label>
          <div className="space-y-2 text-xs">
            {[
              { id: 'isometric', label: 'Isometric View' },
              { id: 'top', label: 'Top View' },
              { id: 'cutaway', label: 'Dollhouse Cutaway' },
            ].map((opt) => (
              <label
                key={opt.id}
                onClick={() => setCamera(opt.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer font-semibold transition ${
                  camera === opt.id
                    ? 'bg-[#1F2B38] text-white border-[#B88E52]'
                    : 'bg-white text-[#1F2B38] border-[#C8C0B2]'
                }`}
              >
                <span>{opt.label}</span>
                {camera === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#B88E52]" />}
              </label>
            ))}
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
          onClick={handleGenerateClick}
          className="inline-flex items-center gap-3 px-9 py-4 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] border-2 border-[#B88E52] rounded-2xl font-bold text-xs uppercase tracking-widest transition shadow-xl"
        >
          <Sparkles className="w-4 h-4 text-[#B88E52] animate-pulse" />
          <span>GENERATE 3D VISUALISATION</span>
          <ArrowRight className="w-4 h-4 text-[#B88E52]" />
        </button>
      </div>
    </div>
  );
};

