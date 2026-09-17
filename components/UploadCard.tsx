'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProjectMetadata } from '@/lib/planSchema';
import { BRIGADE_INSIGNIA_FIXTURE } from '@/lib/testFixtures';

interface UploadCardProps {
  onAnalyze: (files: File[], metadata: ProjectMetadata) => void;
  onLoadPreset: (fixture: typeof BRIGADE_INSIGNIA_FIXTURE) => void;
  isAnalyzing: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onAnalyze,
  onLoadPreset,
  isAnalyzing,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Form Fields
  const [propertyName, setPropertyName] = useState('Brigade Insignia');
  const [layoutType, setLayoutType] = useState('5 BHK Duplex – Type L1');
  const [superBuiltUpArea, setSuperBuiltUpArea] = useState('5827');
  const [reraCarpetArea, setReraCarpetArea] = useState('3582.26');
  const [balconyCarpetArea, setBalconyCarpetArea] = useState('681.36');
  const [numFloors, setNumFloors] = useState<number>(2);

  // Optional Fields
  const [builder, setBuilder] = useState('Brigade Group');
  const [towerBlock, setTowerBlock] = useState('Block C');
  const [floorNumber, setFloorNumber] = useState('14th Floor');
  const [orientation, setOrientation] = useState('North-East Facing');
  const [showOptional, setShowOptional] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setSelectedFiles(validFiles);
    setFilePreviews(previews);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta: ProjectMetadata = {
      propertyName,
      layoutType,
      superBuiltUpAreaSqFt: parseFloat(superBuiltUpArea) || undefined,
      reraCarpetAreaSqFt: parseFloat(reraCarpetArea) || undefined,
      balconyCarpetAreaSqFt: parseFloat(balconyCarpetArea) || undefined,
      numFloors,
      builder: builder || undefined,
      towerBlock: towerBlock || undefined,
      floorNumber: floorNumber || undefined,
      orientation: orientation || undefined,
    };

    onAnalyze(selectedFiles, meta);
  };

  const handlePresetClick = () => {
    setPropertyName(BRIGADE_INSIGNIA_FIXTURE.metadata.propertyName);
    setLayoutType(BRIGADE_INSIGNIA_FIXTURE.metadata.layoutType);
    setSuperBuiltUpArea(BRIGADE_INSIGNIA_FIXTURE.metadata.superBuiltUpAreaSqFt?.toString() || '');
    setReraCarpetArea(BRIGADE_INSIGNIA_FIXTURE.metadata.reraCarpetAreaSqFt?.toString() || '');
    setBalconyCarpetArea(BRIGADE_INSIGNIA_FIXTURE.metadata.balconyCarpetAreaSqFt?.toString() || '');
    setNumFloors(BRIGADE_INSIGNIA_FIXTURE.metadata.numFloors);

    onLoadPreset(BRIGADE_INSIGNIA_FIXTURE);
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E2DCD2] rounded-2xl shadow-xl overflow-hidden">
      {/* Card Header */}
      <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-wide text-[#F7F3EC]">
            Floor Plan Upload &amp; Project Details
          </h2>
          <p className="text-xs text-[#D4AF77]">
            Upload residential layout drawings (PNG, JPG, WEBP, PDF) for vision geometry analysis.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePresetClick}
          className="inline-flex items-center gap-2 bg-[#B88E52] hover:bg-[#A37B43] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition shadow-md whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#F7F3EC]" />
          <span>Load Brigade Insignia 5 BHK Preset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Upload Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? 'border-[#B88E52] bg-[#B88E52]/10 scale-[1.01]'
              : 'border-[#C8C0B2] bg-[#F7F3EC] hover:border-[#B88E52] hover:bg-[#FAF8F5]'
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

          <div className="w-14 h-14 rounded-full bg-[#1F2B38] text-[#B88E52] flex items-center justify-center shadow-lg">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-bold text-[#1F2B38]">
              Drag &amp; Drop Floor Plan Files Here
            </p>
            <p className="text-xs text-[#718096] mt-1">
              Supports <span className="font-semibold text-[#1F2B38]">PNG, JPG, JPEG, WEBP, PDF</span> (Single plan or 2-floor duplex drawings)
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white border border-[#B88E52]/40 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1F2B38] shadow-sm">
                  {file.type.includes('image') ? <ImageIcon className="w-4 h-4 text-[#B88E52]" /> : <FileText className="w-4 h-4 text-[#B88E52]" />}
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              Property / Project Name *
            </label>
            <input
              type="text"
              required
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. Brigade Insignia"
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              Layout Type *
            </label>
            <input
              type="text"
              required
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value)}
              placeholder="e.g. 5 BHK Duplex – Type L1"
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              Number of Floors *
            </label>
            <select
              value={numFloors}
              onChange={(e) => setNumFloors(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            >
              <option value={1}>Single Floor Plan</option>
              <option value={2}>2-Floor Duplex (Lower &amp; Upper)</option>
              <option value={3}>Multi-Floor Unit (3 Floors)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              Super Built-up Area (sq ft)
            </label>
            <input
              type="number"
              value={superBuiltUpArea}
              onChange={(e) => setSuperBuiltUpArea(e.target.value)}
              placeholder="e.g. 5827"
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              RERA Carpet Area (sq ft)
            </label>
            <input
              type="text"
              value={reraCarpetArea}
              onChange={(e) => setReraCarpetArea(e.target.value)}
              placeholder="e.g. 3582.26"
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2B38] uppercase tracking-wider mb-1">
              Balcony Carpet Area (sq ft)
            </label>
            <input
              type="text"
              value={balconyCarpetArea}
              onChange={(e) => setBalconyCarpetArea(e.target.value)}
              placeholder="e.g. 681.36"
              className="w-full px-3 py-2 bg-white border border-[#C8C0B2] rounded-lg text-sm text-[#1F2B38] focus:ring-2 focus:ring-[#B88E52] focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Metadata Toggle */}
        <div className="pt-2 border-t border-[#E2DCD2]">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-xs font-semibold text-[#B88E52] hover:underline flex items-center gap-1"
          >
            {showOptional ? '− Hide Optional Specifications' : '+ Show Optional Specifications (Builder, Tower, Orientation)'}
          </button>

          {showOptional && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-[#718096]">Builder</label>
                <input
                  type="text"
                  value={builder}
                  onChange={(e) => setBuilder(e.target.value)}
                  placeholder="e.g. Brigade Group"
                  className="w-full px-3 py-1.5 bg-white border border-[#C8C0B2] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096]">Tower / Block</label>
                <input
                  type="text"
                  value={towerBlock}
                  onChange={(e) => setTowerBlock(e.target.value)}
                  placeholder="e.g. Block C"
                  className="w-full px-3 py-1.5 bg-white border border-[#C8C0B2] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096]">Floor Number</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="e.g. 14th Floor"
                  className="w-full px-3 py-1.5 bg-white border border-[#C8C0B2] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096]">Orientation</label>
                <input
                  type="text"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  placeholder="e.g. North-East"
                  className="w-full px-3 py-1.5 bg-white border border-[#C8C0B2] rounded text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition border border-[#B88E52] shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-[#B88E52] animate-pulse" />
            <span>{isAnalyzing ? 'Analyzing Floor Plan...' : 'Analyse Floor Plan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
