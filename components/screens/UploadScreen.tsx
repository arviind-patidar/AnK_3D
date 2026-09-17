'use client';

import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, Edit3, MoreVertical, Layers, CheckCircle2, FileText } from 'lucide-react';
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

  // Extracted Metadata State
  const [propertyName, setPropertyName] = useState('Brigade Insignia');
  const [layoutType, setLayoutType] = useState('5 BHK Duplex – Type L1');
  const [superBuiltUpArea, setSuperBuiltUpArea] = useState('5,827');
  const [reraCarpetArea, setReraCarpetArea] = useState('3,582.26');
  const [balconyCarpetArea, setBalconyCarpetArea] = useState('681.36');
  const [numFloors, setNumFloors] = useState<number>(2);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files);
    setSelectedFiles(validFiles);
    setHasUploaded(true);
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
    <div className="max-w-7xl mx-auto space-y-12 py-4 px-4 sm:px-6 lg:px-8">
      {/* Top Hero Layout: Left Upload Card + Right Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Title, Subtitle, Upload Card, Sample Link (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest text-[#B88E52] uppercase bg-[#B88E52]/10 px-3 py-1 rounded-full border border-[#B88E52]/20 inline-block">
              RESIDENTIAL VISUALISATION PLATFORM
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#1F2B38]">
              TURN YOUR FLOOR PLAN <br />
              <span className="text-[#B88E52]">INTO A 3D HOME</span>
            </h1>
            <p className="text-sm text-[#718096] font-medium max-w-lg leading-relaxed">
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
            className={`bg-[#FAF8F5] border-2 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all shadow-sm ${
              dragOver
                ? 'border-[#B88E52] bg-[#B88E52]/10 scale-[1.01]'
                : 'border-[#E5D9C5] hover:border-[#B88E52]'
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

            <div className="w-12 h-12 rounded-xl bg-transparent text-[#B88E52] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-9 h-9" />
            </div>

            <h2 className="font-serif font-bold text-xl text-[#1F2B38] tracking-wide">
              {dragOver ? 'DROP TO UPLOAD' : 'Drop file or click to browse'}
            </h2>
            <p className="text-xs text-[#718096] mt-1 font-medium">
              Upload your 2D floor plan drawing or PDF brochure
            </p>
            <p className="text-[11px] text-[#A0AEC0] mt-1.5 font-semibold tracking-wider">
              PNG · JPG · JPEG · WEBP · PDF
            </p>

            {/* Dominant Primary CTA */}
            <div className="mt-5">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B88E52] hover:bg-[#A37B43] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-md"
              >
                CHOOSE FLOOR PLAN
              </button>
            </div>

            <p className="text-[11px] text-[#A0AEC0] italic mt-3 font-medium">
              Single floor apartments or multi-floor duplex plans supported
            </p>
          </div>

          {/* Sample Link */}
          <div className="flex items-center gap-2 text-xs pt-1">
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

        {/* Right Column: Before / After Visual Sample (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E5D9C5] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-3">
              <span className="text-xs font-bold text-[#1F2B38] uppercase tracking-wider">
                Architectural Transformation
              </span>
              <span className="text-[10px] font-extrabold text-[#B88E52] bg-[#B88E52]/10 px-2.5 py-0.5 rounded-full border border-[#B88E52]/30">
                100% TOPOLOGY MATCH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Left: 2D Floor Plan Source */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-bold tracking-wider text-[#718096] uppercase block">
                  ORIGINAL 2D PLAN
                </span>
                <div className="bg-white border border-[#E2DCD2] rounded-xl p-2 shadow-inner aspect-square flex items-center justify-center overflow-hidden relative group">
                  <div className="w-full h-full bg-[#FAF8F5] flex flex-col items-center justify-center p-2 text-center border border-dashed border-[#C8C0B2] rounded-lg">
                    <FileText className="w-8 h-8 text-[#8C7A6B] mb-1" />
                    <span className="text-[10px] font-bold text-[#1F2B38]">2D Drawing</span>
                    <span className="text-[9px] text-[#718096]">Brigade Insignia</span>
                  </div>
                </div>
              </div>

              {/* Right: 3D Visual Render Result */}
              <div className="space-y-2 text-center relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 text-[#B88E52] font-bold text-lg">
                  →
                </div>
                <span className="text-[10px] font-bold tracking-wider text-[#B88E52] uppercase block">
                  3D VISUALIZATION
                </span>
                <div className="bg-[#1F2B38] border border-[#B88E52] rounded-xl p-2 shadow-md aspect-square flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full bg-[#141D26] rounded-lg p-2 flex flex-col items-center justify-center text-center">
                    <Layers className="w-8 h-8 text-[#B88E52] mb-1" />
                    <span className="text-[10px] font-bold text-[#F7F3EC]">3D Dollhouse</span>
                    <span className="text-[9px] text-[#D4AF77]">Furnished Cutaway</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1 border-t border-[#E5D9C5] pt-4 w-full">
            <p className="font-serif font-bold text-xs text-[#1F2B38]">
              From floor plan to presentation-ready 3D.
            </p>
            <p className="text-[10px] font-bold tracking-widest text-[#B88E52] uppercase">
              SAME SPACE. A CLEARER STORY.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Automatic Extracted Metadata Cards */}
      {hasUploaded && (
        <div className="bg-[#FAF8F5] border-2 border-[#B88E52]/40 rounded-2xl p-6 space-y-4 shadow-md animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88E52] hover:underline bg-white px-3 py-1.5 rounded-lg border border-[#C8C0B2]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT DETAILS</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Project Name</span>
              <p className="font-bold text-sm text-[#1F2B38] truncate mt-0.5">{propertyName}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Configuration</span>
              <p className="font-bold text-sm text-[#1F2B38] truncate mt-0.5">{layoutType}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Total Floors</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{numFloors} Floors</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Super Built-Up</span>
              <p className="font-bold text-sm text-[#B88E52] mt-0.5">{superBuiltUpArea} SQ FT</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">RERA Carpet</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{reraCarpetArea} SQ FT</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#C8C0B2]">
              <span className="text-[10px] font-bold text-[#718096] uppercase">Balcony Carpet</span>
              <p className="font-bold text-sm text-[#1F2B38] mt-0.5">{balconyCarpetArea} SQ FT</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="w-full sm:w-auto bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition border border-[#B88E52] shadow-lg flex items-center justify-center gap-3"
            >
              <span>{isAnalyzing ? 'Analyzing Floor Plan...' : 'Continue to Plan Understanding'}</span>
              <ArrowRight className="w-4 h-4 text-[#B88E52]" />
            </button>
          </div>
        </div>
      )}

      {/* Section 13: Recent Projects Cards */}
      <div className="space-y-4 pt-4 border-t border-[#E2DCD2]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#1F2B38]">
              Recent Projects
            </h3>
            <p className="text-xs text-[#718096]">
              Continue working on saved floor plans or start a new project.
            </p>
          </div>
          <button className="text-xs font-bold text-[#B88E52] hover:underline inline-flex items-center gap-1">
            <span>View all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Card 1 */}
          <div className="bg-[#FAF8F5] border border-[#E5D9C5] rounded-2xl p-5 shadow-sm hover:border-[#B88E52] transition flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#1F2B38] border border-[#B88E52]/40 p-2 flex flex-col items-center justify-center text-center shrink-0">
                <Layers className="w-6 h-6 text-[#B88E52]" />
                <span className="text-[9px] font-bold text-[#D4AF77] mt-0.5">5 BHK</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-[#1F2B38]">Brigade Insignia</h4>
                  <span className="text-[10px] font-bold uppercase bg-[#B88E52]/20 text-[#B88E52] px-2 py-0.5 rounded">
                    DUPLEX
                  </span>
                </div>
                <p className="text-xs text-[#718096]">5 BHK Duplex · Type L1</p>
                <p className="text-[11px] font-bold text-[#1F2B38]">5,827 sq ft · Lower + Upper Floor</p>
                <p className="text-[10px] text-[#A0AEC0]">Updated 16 Sep 2025</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSampleClick}
                className="px-4 py-2 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>OPEN PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B88E52]" />
              </button>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="bg-[#FAF8F5] border border-[#E5D9C5] rounded-2xl p-5 shadow-sm hover:border-[#B88E52] transition flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#1F2B38] border border-[#B88E52]/40 p-2 flex flex-col items-center justify-center text-center shrink-0">
                <Layers className="w-6 h-6 text-[#B88E52]" />
                <span className="text-[9px] font-bold text-[#D4AF77] mt-0.5">4 BHK</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-[#1F2B38]">Prestige Evergreen</h4>
                  <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    SINGLE FLOOR
                  </span>
                </div>
                <p className="text-xs text-[#718096]">4 BHK Premium Apartment</p>
                <p className="text-[11px] font-bold text-[#1F2B38]">2,850 sq ft</p>
                <p className="text-[10px] text-[#A0AEC0]">Updated 14 Sep 2025</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSampleClick}
                className="px-4 py-2 bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>OPEN PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B88E52]" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  className="w-full p-2 bg-white border border-[#C8C0B2] rounded mt-1 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#718096]">Layout Type</label>
                <input
                  type="text"
                  value={layoutType}
                  onChange={(e) => setLayoutType(e.target.value)}
                  className="w-full p-2 bg-white border border-[#C8C0B2] rounded mt-1 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#718096]">Super Built-up (sq ft)</label>
                  <input
                    type="text"
                    value={superBuiltUpArea}
                    onChange={(e) => setSuperBuiltUpArea(e.target.value)}
                    className="w-full p-2 bg-white border border-[#C8C0B2] rounded mt-1 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#718096]">RERA Carpet (sq ft)</label>
                  <input
                    type="text"
                    value={reraCarpetArea}
                    onChange={(e) => setReraCarpetArea(e.target.value)}
                    className="w-full p-2 bg-white border border-[#C8C0B2] rounded mt-1 font-bold"
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

