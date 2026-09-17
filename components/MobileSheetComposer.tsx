'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { FloorPlanJSON, ValidationResult } from '@/lib/planSchema';
import { SheetComposerService } from '@/services/sheetComposer';

interface MobileSheetComposerProps {
  planJson: FloorPlanJSON;
  floorRenders: { [floorKey: string]: string };
  validationResult: ValidationResult | null;
}

export const MobileSheetComposer: React.FC<MobileSheetComposerProps> = ({
  planJson,
  floorRenders,
  validationResult,
}) => {
  const [sheetDataUrl, setSheetDataUrl] = useState<string>('');

  useEffect(() => {
    if (planJson) {
      const composer = new SheetComposerService();
      const url = composer.composeBrandedSheet(planJson, floorRenders);
      setSheetDataUrl(url);
    }
  }, [planJson, floorRenders]);

  const handleDownloadSheet = () => {
    if (!sheetDataUrl) return;
    const link = document.createElement('a');
    link.href = sheetDataUrl;
    link.download = `${planJson.metadata.propertyName.toLowerCase().replace(/\s+/g, '_')}_acre_and_key_branded_9x16_sheet.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="bg-[#FAF8F5] border border-[#E2DCD2] rounded-2xl shadow-xl overflow-hidden space-y-4">
      {/* Header */}
      <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B88E52]" />
            <h3 className="font-serif font-bold text-lg text-[#F7F3EC]">
              Acre&amp;Key 9:16 Branded Mobile Presentation Sheet
            </h3>
          </div>
          <p className="text-xs text-[#D4AF77] mt-0.5">
            Final presentation-ready property brochure output formatted for mobile distribution
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDownloadSheet}
          className="inline-flex items-center gap-2 bg-[#B88E52] hover:bg-[#A37B43] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Download Branded Sheet (9:16)</span>
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Sheet Visual Preview Container (Left 7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[440px] aspect-[9/16] bg-[#141D26] rounded-2xl p-3 border-4 border-[#1F2B38] shadow-2xl relative flex flex-col items-center justify-center">
            {sheetDataUrl ? (
              <img
                src={sheetDataUrl}
                alt="Acre&Key 9:16 Presentation Sheet"
                className="w-full h-full object-contain rounded-xl shadow-md"
              />
            ) : (
              <div className="text-xs text-[#718096]">Composing 9:16 Presentation Sheet...</div>
            )}
          </div>
        </div>

        {/* Downloads & Specification Suite (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white border border-[#C8C0B2] rounded-xl p-6 shadow-sm">
          <div>
            <h4 className="font-serif font-bold text-base text-[#1F2B38] border-b border-[#E2DCD2] pb-2">
              Deliverables &amp; Export Suite
            </h4>
            <p className="text-xs text-[#718096] mt-1">
              Download presentation files, raw 3D renders, structured JSON geometry, and compliance reports.
            </p>
          </div>

          <div className="space-y-3">
            {/* Download Branded Sheet */}
            <button
              type="button"
              onClick={handleDownloadSheet}
              className="w-full p-3.5 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] rounded-xl font-bold text-xs flex items-center justify-between border border-[#B88E52] transition shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-[#B88E52]" />
                <div className="text-left">
                  <p className="font-bold">Download Branded Sheet</p>
                  <p className="text-[10px] text-[#D4AF77]">9:16 High-Res Presentation Format</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#B88E52]" />
            </button>

            {/* Download Plan JSON */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="w-full p-3 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-semibold text-xs flex items-center justify-between border border-[#C8C0B2] transition"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#B88E52]" />
                <span>Download Plan Analysis JSON</span>
              </div>
              <Download className="w-4 h-4 text-[#718096]" />
            </button>

            {/* Download Validation Audit Report */}
            {validationResult && (
              <button
                type="button"
                onClick={handleDownloadValidation}
                className="w-full p-3 bg-[#FAF8F5] hover:bg-[#F7F3EC] text-[#1F2B38] rounded-xl font-semibold text-xs flex items-center justify-between border border-[#C8C0B2] transition"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Download Validation Audit JSON</span>
                </div>
                <Download className="w-4 h-4 text-[#718096]" />
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-[#E2DCD2] space-y-2">
            <h5 className="text-xs font-bold text-[#1F2B38] uppercase">Acre&amp;Key Specification Summary</h5>
            <div className="bg-[#FAF8F5] p-3 rounded-lg text-xs space-y-1 text-[#718096]">
              <p><span className="font-bold text-[#1F2B38]">Property:</span> {planJson.metadata.propertyName}</p>
              <p><span className="font-bold text-[#1F2B38]">Layout:</span> {planJson.metadata.layoutType}</p>
              <p><span className="font-bold text-[#1F2B38]">Super Built-up Area:</span> {planJson.metadata.superBuiltUpAreaSqFt?.toLocaleString()} sq ft</p>
              <p><span className="font-bold text-[#1F2B38]">RERA Carpet Area:</span> {planJson.metadata.reraCarpetAreaSqFt?.toLocaleString()} sq ft</p>
              <p><span className="font-bold text-[#1F2B38]">Balcony Carpet Area:</span> {planJson.metadata.balconyCarpetAreaSqFt?.toLocaleString()} sq ft</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
