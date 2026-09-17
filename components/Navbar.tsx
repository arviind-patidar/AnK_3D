'use client';

import React from 'react';
import { HelpCircle, Check } from 'lucide-react';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

interface NavbarProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
  maxReachedStep: WizardStep;
}

const STEPS: { step: WizardStep; label: string; code: string }[] = [
  { step: 1, label: 'Upload', code: '01' },
  { step: 2, label: 'Understand', code: '02' },
  { step: 3, label: 'Visualize', code: '03' },
  { step: 4, label: 'Review', code: '04' },
  { step: 5, label: 'Export', code: '05' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  const currentStepObj = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  return (
    <header className="w-full bg-[#1F2B38] text-[#F7F3EC] border-b border-[#B88E52]/30 shadow-md sticky top-0 z-40 h-16 sm:h-20 flex items-center">
      <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between gap-6">
        {/* Acre&Key 3D Studio Logo - Left Aligned */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0 group select-none"
          onClick={() => onStepClick(1)}
        >
          <span className="font-serif font-bold text-xl sm:text-2xl tracking-wider text-[#F7F3EC] group-hover:text-white transition">
            acre<span className="text-[#B88E52]">&amp;</span>key
          </span>
          <span className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] text-[#B88E52] uppercase ml-1.5 border-l border-[#B88E52]/40 pl-2.5 py-0.5">
            3D STUDIO
          </span>
        </div>

        {/* Desktop Navigation (5 Steps) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = s.step < currentStep && s.step <= maxReachedStep;
            const isAccessible = s.step <= maxReachedStep;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick(s.step)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition ${
                  isActive
                    ? 'bg-[#B88E52] text-white shadow-md font-bold'
                    : isCompleted
                    ? 'text-[#F7F3EC] bg-[#2D3748]/60 hover:bg-[#2D3748]'
                    : isAccessible
                    ? 'text-[#A0AEC0] hover:text-[#F7F3EC]'
                    : 'text-[#4A5568] cursor-not-allowed opacity-50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center transition ${
                    isActive
                      ? 'bg-white text-[#B88E52]'
                      : isCompleted
                      ? 'bg-[#B88E52] text-white'
                      : 'bg-[#141D26] text-[#A0AEC0]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.code}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation - Compact Step Badge */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-2 bg-[#141D26] border border-[#B88E52]/40 px-3.5 py-1.5 rounded-full text-xs">
            <span className="w-4 h-4 rounded-full bg-[#B88E52] text-white text-[9px] font-bold flex items-center justify-center">
              {currentStepObj.code}
            </span>
            <span className="font-bold text-[#F7F3EC]">{currentStepObj.label}</span>
            <span className="text-[#A0AEC0] text-[10px]">({currentStep}/5)</span>
          </div>
        </div>

        {/* Right Help & Avatar Controls */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            title="Help & Info"
            className="text-[#A0AEC0] hover:text-[#B88E52] transition p-1.5 rounded-lg hover:bg-[#141D26]"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#2D3748] text-[#B88E52] flex items-center justify-center text-xs font-bold border border-[#B88E52]/50 shadow-sm">
            AK
          </div>
        </div>
      </div>
    </header>
  );
};


