'use client';

import React, { useState } from 'react';
import { Download, Share2, Sparkles, FileText, Image as ImageIcon, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { FloorPlanJSON, ValidationResult } from '@/lib/planSchema';

interface ExportScreenProps {
  planJson: FloorPlanJSON;
  floorRenders: { [floorKey: string]: string };
  sheetDataUrl: string;
  validationResult: ValidationResult | null;
  onBack: () => void;
}

export const ExportScreen: React.FC<ExportScreenProps> = ({
  planJson,
  floorRenders,
  sheetDataUrl,
  validationResult,
  onBack,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadSheet = () => {
    if (!sheetDataUrl) return;
    const link = document.createElement('a');
    link.href = sheetDataUrl;
    link.download = `${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_acre_and_key_branded_9x16_sheet.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFloorPng = (floorKey: string) => {
    const url = floorRenders[floorKey];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_${floorKey}_3d.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = () => {
    const shareText = encodeURIComponent(
      `Acre&Key 3D Presentation for ${planJson.metadata.propertyName} (${planJson.metadata.layoutType}). Super Built-up: ${planJson.metadata.superBuiltUpAreaSqFt?.toLocaleString()} sq ft.`
    );
    const whatsappUrl = `https://wa.me/?text=${shareText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(planJson, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_plan_structure.json`;
    link.click();
  };

  const handleDownloadValidation = () => {
    if (!validationResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(validationResult, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_validation_report.json`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#B88E52] uppercase bg-[#B88E52]/10 px-3.5 py-1 rounded-full border border-[#B88E52]/30">
          STEP 05 — FINAL DELIVERABLE
        </span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1F2B38] mt-2">
          YOUR ACRE&amp;KEY PRESENTATION IS READY
        </h1>
        <p className="text-sm text-[#718096] max-w-xl mx-auto font-medium">
          Download high-resolution 9:16 mobile presentation layout, floor PNGs, or share directly via WhatsApp.
        </p>
      </div>

      {/* Main Split Layout: 9:16 Sheet Visual Preview (7 cols) + Download Suite (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 9:16 Mobile Sheet Visual Preview Container */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[450px] aspect-[9/16] bg-[#141D26] rounded-3xl p-3 border-4 border-[#1F2B38] shadow-2xl relative flex flex-col items-center justify-center">
            {sheetDataUrl ? (
              <img
                src={sheetDataUrl}
                alt="Acre&Key 9:16 Presentation Sheet"
                className="w-full h-full object-contain rounded-2xl shadow-md"
              />
            ) : (
              <div className="text-xs text-[#718096]">Composing 9:16 Presentation Sheet...</div>
            )}
          </div>
        </div>

        {/* Download & Share Suite (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white border-2 border-[#C8C0B2] rounded-3xl p-7 shadow-lg">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#1F2B38]">
              Deliverables &amp; Sharing
            </h3>
            <p className="text-xs text-[#718096] mt-1">
              {planJson.metadata.propertyName} • {planJson.metadata.layoutType}
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Primary Dominant CTA */}
            <button
              type="button"
              onClick={handleDownloadSheet}
              className="w-full p-4 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] rounded-2xl font-bold text-xs uppercase tracking-widest border-2 border-[#B88E52] transition shadow-xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B88E52]/20 text-[#B88E52] flex items-center justify-center border border-[#B88E52]/40">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[#F7F3EC]">DOWNLOAD 9:16 PRESENTATION</p>
                  <p className="text-[10px] text-[#D4AF77] font-semibold">High-Res Mobile Brochure Layout</p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-[#B88E52] group-hover:scale-110 transition-transform" />
            </button>

            {/* Share via WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full p-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs flex items-center justify-between transition shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-emerald-200" />
                <span>SHARE VIA WHATSAPP</span>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-200" />
            </button>

            {/* Secondary Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadFloorPng('lower')}
                className="p-3 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-bold text-xs border border-[#C8C0B2] transition flex items-center justify-between"
              >
                <span>Lower Floor PNG</span>
                <Download className="w-3.5 h-3.5 text-[#B88E52]" />
              </button>

              {planJson.floors.upper && (
                <button
                  type="button"
                  onClick={() => handleDownloadFloorPng('upper')}
                  className="p-3 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-bold text-xs border border-[#C8C0B2] transition flex items-center justify-between"
                >
                  <span>Upper Floor PNG</span>
                  <Download className="w-3.5 h-3.5 text-[#B88E52]" />
                </button>
              )}
            </div>

            {/* Structured Data & Validation */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="w-full p-2.5 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-semibold text-xs border border-[#C8C0B2] transition flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#B88E52]" /> Download Plan Data JSON
                </span>
                <Download className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              {validationResult && (
                <button
                  type="button"
                  onClick={handleDownloadValidation}
                  className="w-full p-2.5 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-semibold text-xs border border-[#C8C0B2] transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Download Validation Audit
                  </span>
                  <Download className="w-3.5 h-3.5 text-[#718096]" />
                </button>
              )}
            </div>
          </div>

          {/* Area Summary Card */}
          <div className="pt-4 border-t border-[#E2DCD2] space-y-2">
            <h4 className="text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
              Acre&amp;Key Property Summary
            </h4>
            <div className="bg-[#FAF8F5] p-3 rounded-xl text-xs space-y-1 text-[#718096]">
              <p><span className="font-bold text-[#1F2B38]">Super Built-up:</span> {planJson.metadata.superBuiltUpAreaSqFt?.toLocaleString()} sq ft</p>
              <p><span className="font-bold text-[#1F2B38]">RERA Carpet:</span> {planJson.metadata.reraCarpetAreaSqFt?.toLocaleString()} sq ft</p>
              <p><span className="font-bold text-[#1F2B38]">Balcony Carpet:</span> {planJson.metadata.balconyCarpetAreaSqFt?.toLocaleString()} sq ft</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4 border-t border-[#E2DCD2] flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1F2B38] border border-[#C8C0B2] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold uppercase tracking-wider transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#B88E52]" />
          <span>Back to 3D Review</span>
        </button>
      </div>
    </div>
  );
};
