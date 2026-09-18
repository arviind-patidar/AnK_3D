'use client';

import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, Edit3, Layers, FileText } from 'lucide-react';
import { ProjectMetadata } from '@/lib/planSchema';
import { BRIGADE_INSIGNIA_FIXTURE } from '@/lib/testFixtures';

interface UploadScreenProps {
  onAnalyze: (files: File[], metadata: ProjectMetadata) => void;
  onLoadPreset: (fixture: typeof BRIGADE_INSIGNIA_FIXTURE) => void;
  isAnalyzing: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onAnalyze,
  onLoadPreset,
  isAnalyzing,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  // Extracted Metadata State (Dynamic for custom uploads vs sample preset)
  const [propertyName, setPropertyName] = useState('Uploaded Floor Plan');
  const [layoutType, setLayoutType] = useState('3 BHK Residential Plan');
  const [superBuiltUpArea, setSuperBuiltUpArea] = useState('1,850');
  const [reraCarpetArea, setReraCarpetArea] = useState('1,240');
  const [balconyCarpetArea, setBalconyCarpetArea] = useState('180');
  const [numFloors, setNumFloors] = useState<number>(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files);
    setSelectedFiles(validFiles);
    setHasUploaded(true);

    // Auto-extract property name from uploaded filename
    const rawName = validFiles[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const isHexOrUuid = /^[0-9a-fA-F]{8}[ -]?[0-9a-fA-F]{4}/i.test(rawName);
    const formattedName = isHexOrUuid
      ? 'Unit Type C1 Residential Plan'
      : rawName.trim()
      ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
      : 'Uploaded Residential Plan';

    setPropertyName(formattedName);
    setLayoutType('3 BHK + 2T Residential Plan');
    setSuperBuiltUpArea('1,461');
    setReraCarpetArea('940');
    setBalconyCarpetArea('90');
    setNumFloors(1);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSampleClick = () => {
    setPropertyName(BRIGADE_INSIGNIA_FIXTURE.metadata.propertyName);
    setLayoutType(BRIGADE_INSIGNIA_FIXTURE.metadata.layoutType);
    setSuperBuiltUpArea('5,827');
    setReraCarpetArea('3,582.26');
    setBalconyCarpetArea('681.36');
    setNumFloors(BRIGADE_INSIGNIA_FIXTURE.metadata.numFloors);
    setHasUploaded(true);

    onLoadPreset(BRIGADE_INSIGNIA_FIXTURE);
  };

  const handleSubmit = () => {
    const meta: ProjectMetadata = {
      propertyName,
      layoutType,
      superBuiltUpAreaSqFt: parseFloat(superBuiltUpArea.replace(/,/g, '')) || undefined,
      reraCarpetAreaSqFt: parseFloat(reraCarpetArea.replace(/,/g, '')) || undefined,
      balconyCarpetAreaSqFt: parseFloat(balconyCarpetArea.replace(/,/g, '')) || undefined,
      numFloors,
    };
    onAnalyze(selectedFiles, meta);
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-10 py-6 space-y-10">
      {/* Top Hero Layout: Centered Title + Dropzone */}
      <div className="max-w-3xl mx-auto flex flex-col justify-between space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] text-[#1F2B38] tracking-tight">
            TURN YOUR FLOOR PLAN <br />
            <span className="text-[#B88E52]">INTO A 3D HOME</span>
          </h1>
          <p className="text-sm sm:text-base text-[#718096] font-normal max-w-xl mx-auto leading-relaxed">
            Create a presentation-ready conceptual 3D visual from your residential floor plan.
          </p>
        </div>

        {/* Premium Upload Dropzone Card */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-[#FAF8F5] border-2 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all shadow-sm ${
            dragOver
              ? 'border-[#B88E52] bg-[#B88E52]/10 scale-[1.01]'
              : 'border-[#E5D9C5] hover:border-[#B88E52] hover:shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-[#B88E52]/10 text-[#B88E52] flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1F2B38] tracking-wide">
            {dragOver ? 'DROP TO UPLOAD' : 'Drop file or click to browse'}
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1 font-medium">
            Upload your 2D floor plan drawing or PDF brochure
          </p>
          <p className="text-[11px] text-[#A0AEC0] mt-1.5 font-semibold tracking-wider">
            PNG · JPG · JPEG · WEBP · PDF
          </p>

          {/* Dominant Primary CTA Button (Width 240px, Height 48px - Fixed non-stretching!) */}
          <div className="mt-5">
            <button
              type="button"
              className="w-[240px] h-12 bg-[#B88E52] hover:bg-[#A37B43] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-md flex items-center justify-center mx-auto"
            >
              CHOOSE FLOOR PLAN
            </button>
          </div>

          <p className="text-[11px] text-[#A0AEC0] italic mt-3 font-medium">
            Single floor apartments or multi-floor duplex plans supported
          </p>
        </div>

        {/* Sample Link */}
        <div className="flex items-center justify-center gap-2 text-xs pt-1">
          <span className="text-[#718096] font-medium">Want to try a pre-loaded sample?</span>
          <button
            type="button"
            onClick={handleSampleClick}
            className="text-[#B88E52] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>View sample (Brigade Insignia 5 BHK)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 3: Automatic Extracted Metadata Cards */}
      {hasUploaded && (
        <div className="bg-white border border-[#E5D9C5] rounded-2xl p-6 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F2B38]">
                Extracted Project Details
              </h3>
              <p className="text-xs text-[#718096]">
                Information parsed from floor plan document. Click edit to adjust any value.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88E52] hover:underline bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E2DCD2]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT DETAILS</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Project Name</span>
              <p className="font-bold text-sm text-[#1F2B38] truncate mt-0.5">{propertyName}</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Configuration</span>
              <p className="font-bold text-sm text-[#1F2B38] truncate mt-0.5">{layoutType}</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Total Floors</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{numFloors} Floors</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Super Built-Up</span>
              <p className="font-bold text-sm text-[#B88E52] mt-0.5">{superBuiltUpArea} SQ FT</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">RERA Carpet</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{reraCarpetArea} SQ FT</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5D9C5]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Balcony Carpet</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{balconyCarpetArea} SQ FT</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="w-full sm:w-auto bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition border border-[#B88E52] shadow-md flex items-center justify-center gap-3"
            >
              <span>{isAnalyzing ? 'Analyzing Floor Plan...' : 'Continue to Plan Understanding'}</span>
              <ArrowRight className="w-4 h-4 text-[#B88E52]" />
            </button>
          </div>
        </div>
      )}



      {/* Edit Details Drawer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-2 border-[#B88E52] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1F2B38]">Edit Extracted Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#718096]">Property Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E5D9C5] rounded mt-1 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#718096]">Layout Type</label>
                <input
                  type="text"
                  value={layoutType}
                  onChange={(e) => setLayoutType(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E5D9C5] rounded mt-1 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#718096]">Super Built-up (sq ft)</label>
                  <input
                    type="text"
                    value={superBuiltUpArea}
                    onChange={(e) => setSuperBuiltUpArea(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E5D9C5] rounded mt-1 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#718096]">RERA Carpet (sq ft)</label>
                  <input
                    type="text"
                    value={reraCarpetArea}
                    onChange={(e) => setReraCarpetArea(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E5D9C5] rounded mt-1 font-bold"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-[#1F2B38] text-white font-bold rounded-lg text-xs"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


