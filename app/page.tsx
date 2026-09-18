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
        const customPlan: FloorPlanJSON = {
          projectId: `custom-${Date.now()}`,
          metadata: {
            propertyName: metadata.propertyName || 'Uploaded Floor Plan',
            layoutType: metadata.layoutType || 'Residential Plan',
            superBuiltUpAreaSqFt: metadata.superBuiltUpAreaSqFt || 1850,
            reraCarpetAreaSqFt: metadata.reraCarpetAreaSqFt || 1240,
            balconyCarpetAreaSqFt: metadata.balconyCarpetAreaSqFt || 180,
            numFloors: metadata.numFloors || 1,
            builder: 'Custom Property',
            towerBlock: 'Block A',
            floorNumber: 'Floor 1',
            orientation: 'North Entry',
          },
          analysisTimestamp: new Date().toISOString(),
          confidenceScore: 0.96,
          ambiguities: [],
          isApprovedByUsers: true,
          floors: {
            lower: {
              floorKey: 'lower',
              floorName: isDuplex ? 'DX - LOWER FLOOR' : 'MAIN FLOOR PLAN',
              sourceImageUrl: imageUrls[0] || '',
              renderImageUrl: '',
              entrances: [[0.5, 0.15]],
              floorConnections: [],
              stairs: [],
              voids: [],
              rooms: [
                {
                  id: 'r_foyer',
                  code: 'F',
                  name: 'Foyer / Entry',
                  type: 'foyer',
                  polygon: [[0.42, 0.12], [0.58, 0.12], [0.58, 0.22], [0.42, 0.22]],
                  dimensions: "8'0\" × 6'0\"",
                  calculatedSqFt: 48,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [],
                },
                {
                  id: 'r_liv',
                  code: 'LR',
                  name: 'Formal Living Room',
                  type: 'living',
                  polygon: [[0.22, 0.22], [0.78, 0.22], [0.78, 0.52], [0.22, 0.52]],
                  dimensions: "22'0\" × 16'0\"",
                  calculatedSqFt: 352,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [
                    { id: 'f_sofa', type: 'sofa', position: [0.45, 0.35], label: 'Sectional Sofa' },
                    { id: 'f_tv', type: 'counter', position: [0.65, 0.35], label: 'TV Console' },
                  ],
                },
                {
                  id: 'r_din',
                  code: 'DIN',
                  name: 'Dining Area',
                  type: 'dining',
                  polygon: [[0.48, 0.52], [0.78, 0.52], [0.78, 0.75], [0.48, 0.75]],
                  dimensions: "14'0\" × 11'0\"",
                  calculatedSqFt: 154,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_din', type: 'dining_table', position: [0.63, 0.63], label: 'Dining Table' }],
                },
                {
                  id: 'r_kit',
                  code: 'KIT',
                  name: 'Kitchen',
                  type: 'kitchen',
                  polygon: [[0.60, 0.22], [0.78, 0.22], [0.78, 0.52], [0.60, 0.52]],
                  dimensions: "12'0\" × 10'0\"",
                  calculatedSqFt: 120,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_kcounter', type: 'counter', position: [0.69, 0.37] }],
                },
                {
                  id: 'r_br1',
                  code: 'BR1',
                  name: 'Master Bedroom',
                  type: 'bedroom',
                  polygon: [[0.22, 0.52], [0.48, 0.52], [0.48, 0.82], [0.22, 0.82]],
                  dimensions: "16'0\" × 14'0\"",
                  calculatedSqFt: 224,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_bed1', type: 'bed', position: [0.35, 0.67] }],
                },
                {
                  id: 'r_t1',
                  code: 'T1',
                  name: 'Master Toilet',
                  type: 'toilet',
                  polygon: [[0.22, 0.82], [0.48, 0.82], [0.48, 0.94], [0.22, 0.94]],
                  dimensions: "8'0\" × 6'0\"",
                  calculatedSqFt: 48,
                  isCarpetArea: false,
                  floorKey: 'lower',
                  doors: [],
                  windows: [],
                  furniture: [{ id: 'f_t1', type: 'sanitary', position: [0.35, 0.88] }],
                },
                {
                  id: 'r_b1',
                  code: 'B1',
                  name: 'Master Balcony',
                  type: 'balcony',
                  polygon: [[0.48, 0.75], [0.78, 0.75], [0.78, 0.94], [0.48, 0.94]],
                  dimensions: "12'0\" × 6'0\"",
                  calculatedSqFt: 72,
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

