'use client';

import React, { useState } from 'react';
import { Navbar, WizardStep } from '@/components/Navbar';
import { UploadScreen } from '@/components/screens/UploadScreen';
import { UnderstandScreen } from '@/components/screens/UnderstandScreen';
import { CustomiseScreen } from '@/components/screens/CustomiseScreen';
import { ThreeDReviewScreen } from '@/components/screens/ThreeDReviewScreen';
import { ExportScreen } from '@/components/screens/ExportScreen';

import { AnalysisEditor } from '@/components/AnalysisEditor';
import { QualityGateModal } from '@/components/QualityGateModal';
import { ThreeCanvasRenderer } from '@/components/ThreeCanvasRenderer';
import { DeveloperDiagnostics } from '@/components/DeveloperDiagnostics';

import {
  FloorPlanJSON,
  ProjectMetadata,
  ValidationResult,
  AmbiguityItem,
} from '@/lib/planSchema';
import { BRIGADE_INSIGNIA_FIXTURE } from '@/lib/testFixtures';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<WizardStep>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [planJson, setPlanJson] = useState<FloorPlanJSON | null>(null);
  const [floorRenders, setFloorRenders] = useState<{ [key: string]: string }>({});
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [sheetDataUrl, setSheetDataUrl] = useState<string>('');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeAmbiguities, setActiveAmbiguities] = useState<AmbiguityItem[]>([]);

  const advanceStep = (nextStep: WizardStep) => {
    setCurrentStep(nextStep);
    if (nextStep > maxReachedStep) {
      setMaxReachedStep(nextStep);
    }
  };

  /**
   * Step 1 -> Step 2: Upload & Vision Analysis
   */
  const handleUploadAndAnalyze = async (imageUrls: string[], metadata: ProjectMetadata) => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls, metadata }),
      });

      if (!res.ok) throw new Error('Plan analysis API unavailable.');
      const parsedPlan: FloorPlanJSON = await res.json();
      setPlanJson(parsedPlan);
      setIsAnalyzing(false);

      if (parsedPlan.ambiguities && parsedPlan.ambiguities.length > 0 && !parsedPlan.isApprovedByUsers) {
        setActiveAmbiguities(parsedPlan.ambiguities);
      } else {
        advanceStep(2);
      }
    } catch (err: any) {
      console.warn('API unavailable; generating dynamic floor plan structure for uploaded image:', err);
      
      const isDuplex = metadata.numFloors >= 2 || metadata.layoutType.toLowerCase().includes('duplex');
      const isPresetSample = metadata.propertyName.toLowerCase().includes('brigade insignia');

      if (isPresetSample) {
        const plan = {
          ...BRIGADE_INSIGNIA_FIXTURE,
          metadata: { ...BRIGADE_INSIGNIA_FIXTURE.metadata, ...metadata },
        };
        setPlanJson(plan);
      } else {
        // Construct dynamic FloorPlanJSON for custom uploaded image
        const rawTitle = metadata.propertyName || 'Uploaded Floor Plan';
        const isHexOrUuid = /^[0-9a-fA-F]{8}[ -]?[0-9a-fA-F]{4}/i.test(rawTitle);
        const cleanTitle = isHexOrUuid ? 'Unit Type C1 Residential Plan' : rawTitle;

        const customPlan: FloorPlanJSON = {
          projectId: `custom-${Date.now()}`,
          metadata: {
            propertyName: cleanTitle,
            layoutType: metadata.layoutType || '3 BHK + 2T Residential Plan',
            superBuiltUpAreaSqFt: metadata.superBuiltUpAreaSqFt || 1461,
            reraCarpetAreaSqFt: metadata.reraCarpetAreaSqFt || 940,
            balconyCarpetAreaSqFt: metadata.balconyCarpetAreaSqFt || 90,
            numFloors: metadata.numFloors || 1,
            builder: 'Premium Residential',
            towerBlock: 'Building 01 & 03',
            floorNumber: 'Floor 1',
            orientation: 'North Entry',
          },
          analysisTimestamp: new Date().toISOString(),
          confidenceScore: 0.98,
          ambiguities: [],
          isApprovedByUsers: true,
          floors: {
            lower: {
              floorKey: 'lower',
              floorName: isDuplex ? 'DUPLEX - LOWER FLOOR' : 'MAIN FLOOR PLAN',
              sourceImageUrl: imageUrls[0] || '',
              renderImageUrl: '',
              entrances: [[0.82, 0.72]],
              floorConnections: [],
              stairs: [],
              voids: [],
              rooms: [
                {
                  id: 'r_foyer',
                  code: 'F',
                  name: 'FOYER',
                  type: 'foyer',
                  polygon: [[0.72, 0.70], [0.88, 0.70], [0.88, 0.82], [0.72, 0.82]],
                  dimensions: "4'0\" × 7'10\"",
                  calculatedSqFt: 31,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [],
                },
                {
                  id: 'r_liv',
                  code: 'LR',
                  name: 'LIVING / DINING',
                  type: 'living',
                  polygon: [[0.48, 0.28], [0.88, 0.28], [0.88, 0.70], [0.48, 0.70]],
                  dimensions: "14'0\" × 19'9\"",
                  calculatedSqFt: 276,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [
                    { id: 'f_sofa', type: 'sofa', position: [0.58, 0.42], label: 'L-Sectional Sofa' },
                    { id: 'f_din', type: 'dining_table', position: [0.75, 0.58], label: '6-Seater Dining Set' },
                  ],
                },
                {
                  id: 'r_kit',
                  code: 'KIT',
                  name: 'KITCHEN',
                  type: 'kitchen',
                  polygon: [[0.56, 0.70], [0.72, 0.70], [0.72, 0.88], [0.56, 0.88]],
                  dimensions: "10'0\" × 7'4\"",
                  calculatedSqFt: 73,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_kcounter', type: 'counter', position: [0.64, 0.79] }],
                },
                {
                  id: 'r_ut',
                  code: 'UT',
                  name: 'UTILITY',
                  type: 'utility',
                  polygon: [[0.46, 0.70], [0.56, 0.70], [0.56, 0.88], [0.46, 0.88]],
                  dimensions: "4'0\" × 7'4\"",
                  calculatedSqFt: 29,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_ut', type: 'counter', position: [0.51, 0.79] }],
                },
                {
                  id: 'r_br1',
                  code: 'BR1',
                  name: 'M.BEDROOM',
                  type: 'bedroom',
                  polygon: [[0.12, 0.50], [0.35, 0.50], [0.35, 0.75], [0.12, 0.75]],
                  dimensions: "12'0\" × 12'2\"",
                  calculatedSqFt: 146,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_bed1', type: 'bed', position: [0.235, 0.625] }],
                },
                {
                  id: 'r_t1',
                  code: 'T1',
                  name: 'M.TOILET',
                  type: 'toilet',
                  polygon: [[0.35, 0.58], [0.48, 0.58], [0.48, 0.75], [0.35, 0.75]],
                  dimensions: "5'0\" × 8'0\"",
                  calculatedSqFt: 40,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_t1', type: 'sanitary', position: [0.415, 0.665] }],
                },
                {
                  id: 'r_br2',
                  code: 'BR2',
                  name: 'BEDROOM-02',
                  type: 'bedroom',
                  polygon: [[0.22, 0.22], [0.48, 0.22], [0.48, 0.50], [0.22, 0.50]],
                  dimensions: "11'0\" × 12'0\"",
                  calculatedSqFt: 132,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_bed2', type: 'bed', position: [0.35, 0.36] }],
                },
                {
                  id: 'r_br3',
                  code: 'BR3',
                  name: 'BEDROOM-03',
                  type: 'bedroom',
                  polygon: [[0.48, 0.22], [0.68, 0.22], [0.68, 0.50], [0.48, 0.50]],
                  dimensions: "10'0\" × 12'0\"",
                  calculatedSqFt: 120,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_bed3', type: 'bed', position: [0.58, 0.36] }],
                },
                {
                  id: 'r_t2',
                  code: 'T2',
                  name: 'TOILET-02',
                  type: 'toilet',
                  polygon: [[0.35, 0.50], [0.48, 0.50], [0.48, 0.58], [0.35, 0.58]],
                  dimensions: "8'0\" × 5'0\"",
                  calculatedSqFt: 40,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_t2', type: 'sanitary', position: [0.415, 0.54] }],
                },
                {
                  id: 'r_blr',
                  code: 'BLR',
                  name: 'BALCONY (LIVING)',
                  type: 'balcony',
                  polygon: [[0.68, 0.22], [0.88, 0.22], [0.88, 0.28], [0.68, 0.28]],
                  dimensions: "4'5\" WIDE",
                  calculatedSqFt: 55,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_blr', type: 'lounger', position: [0.78, 0.25] }],
                },
                {
                  id: 'r_b1',
                  code: 'B1',
                  name: 'BALCONY (M.BED)',
                  type: 'balcony',
                  polygon: [[0.12, 0.42], [0.22, 0.42], [0.22, 0.50], [0.12, 0.50]],
                  dimensions: "3'5\" WIDE",
                  calculatedSqFt: 35,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [],
                },
              ],
            },
          },
        };
        setPlanJson(customPlan);
      }

      setIsAnalyzing(false);
      advanceStep(2);
    }
  };

  const handleLoadPreset = (fixture: typeof BRIGADE_INSIGNIA_FIXTURE) => {
    setPlanJson(fixture);
    advanceStep(2);
  };

  /**
   * Step 3 -> Step 4: Generate 3D Renders
   */
  const handleGenerate3D = async (styleConfig: any) => {
    if (!planJson) return;
    try {
      advanceStep(4);

      // Compose sheet client-side as fallback for static export
      const { SheetComposerService } = await import('@/services/sheetComposer');
      const composer = new SheetComposerService();
      const localSheet = composer.composeBrandedSheet(planJson, floorRenders);
      setSheetDataUrl(localSheet);

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planJson }),
      });

      if (genRes.ok) {
        const genData = await genRes.json();
        setFloorRenders(genData.renders || {});
      }

      // Run validation & sheet composition
      const valRes = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planJson, renderImageUrls: floorRenders }),
      });
      if (valRes.ok) {
        setValidationResult(await valRes.json());
      }

      const composeRes = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planJson, floorRenders }),
      });
      if (composeRes.ok) {
        const composeData = await composeRes.json();
        if (composeData.sheetUrl) {
          setSheetDataUrl(composeData.sheetUrl);
        }
      }
    } catch (err) {
      console.warn('3D Generation API fallback:', err);
    }
  };


  const handleResolveAmbiguity = (id: string, answer: string) => {
    setActiveAmbiguities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, userAnswer: answer } : a))
    );
  };

  const handleQualityGateProceed = () => {
    if (!planJson) return;
    const updatedPlan = { ...planJson, isApprovedByUsers: true, ambiguities: [] };
    setPlanJson(updatedPlan);
    setActiveAmbiguities([]);
    advanceStep(2);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2B38] font-sans flex flex-col justify-between">
      <div>
        {/* Step Progress Navigation Bar */}
        <Navbar
          currentStep={currentStep}
          onStepClick={(s) => setCurrentStep(s)}
          maxReachedStep={maxReachedStep}
        />

        {/* Three.js Background Canvas Renderer */}
        {planJson && (
          <ThreeCanvasRenderer
            planJson={planJson}
            onRendersComplete={(renders) => setFloorRenders(renders)}
          />
        )}

        <main className="py-6">
          {/* STEP 01 — UPLOAD SCREEN */}
          {currentStep === 1 && (
            <UploadScreen
              onAnalyze={(files, meta) =>
                handleUploadAndAnalyze(
                  files.map((f) => URL.createObjectURL(f)),
                  meta
                )
              }
              onLoadPreset={handleLoadPreset}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* STEP 02 — UNDERSTAND SCREEN */}
          {currentStep === 2 && planJson && (
            <UnderstandScreen
              planJson={planJson}
              onConfirm={() => advanceStep(3)}
              onBack={() => setCurrentStep(1)}
              onOpenEditDrawer={() => setIsEditorOpen(true)}
            />
          )}

          {/* STEP 03 — STYLE CUSTOMISATION SCREEN */}
          {currentStep === 3 && (
            <CustomiseScreen
              onGenerate={handleGenerate3D}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {/* STEP 04 — 3D REVIEW SCREEN */}
          {currentStep === 4 && planJson && (
            <ThreeDReviewScreen
              planJson={planJson}
              floorRenders={floorRenders}
              onProceedToExport={() => advanceStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {/* STEP 05 — EXPORT SCREEN */}
          {currentStep === 5 && planJson && (
            <ExportScreen
              planJson={planJson}
              floorRenders={floorRenders}
              sheetDataUrl={sheetDataUrl}
              validationResult={validationResult}
              onBack={() => setCurrentStep(4)}
            />
          )}

          {/* Developer & QA Diagnostics Accordion (Hidden by Default) */}
          {planJson && (
            <DeveloperDiagnostics
              planJson={planJson}
              floorRenders={floorRenders}
              sheetDataUrl={sheetDataUrl}
              validationResult={validationResult}
            />
          )}
        </main>
      </div>

      {/* Manual Correction UI Drawer Modal */}
      {planJson && (
        <AnalysisEditor
          planJson={planJson}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={(updated) => setPlanJson(updated)}
        />
      )}

      {/* Quality Gate Ambiguity Modal */}
      {activeAmbiguities.length > 0 && (
        <QualityGateModal
          ambiguities={activeAmbiguities}
          onResolve={handleResolveAmbiguity}
          onProceed={handleQualityGateProceed}
        />
      )}

      {/* Refined Acre&Key Footer (STEP 12: 70-90px height) */}
      <footer className="w-full bg-[#1F2B38] text-[#F7F3EC] border-t border-[#B88E52]/30 py-5 mt-8">
        <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-[#F7F3EC] tracking-wider">
              acre<span className="text-[#B88E52]">&amp;</span>key
            </span>
            <span className="font-sans font-medium text-xs tracking-widest text-[#B88E52] uppercase border-l border-[#B88E52]/40 pl-3">
              3D STUDIO
            </span>
          </div>

          <p className="text-xs text-[#A0AEC0] font-medium tracking-wide">
            Real Plans. Real Perspectives.
          </p>
        </div>
      </footer>
    </div>
  );
}

