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
  { step: 1, label: 'UPLOAD', code: '01' },
  { step: 2, label: 'UNDERSTAND', code: '02' },
  { step: 3, label: 'VISUALIZE', code: '03' },
  { step: 4, label: 'REVIEW', code: '04' },
  { step: 5, label: 'EXPORT', code: '05' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  const currentStepObj = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  return (
    <header className="w-full bg-[#1F2B38] text-[#F7F3EC] border-b border-[#B88E52]/40 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Acre&Key 3D Studio Logo - Left Aligned */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onStepClick(1)}>
          <span className="font-serif font-bold text-xl sm:text-2xl tracking-wider text-[#F7F3EC]">
            acre<span className="text-[#B88E52]">&amp;</span>key
          </span>
          <span className="font-serif font-normal text-sm sm:text-base tracking-widest text-[#B88E52] uppercase ml-1">
            3D STUDIO
          </span>
        </div>

        {/* Desktop Navigation (5 Steps) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition ${
                  isActive
                    ? 'bg-[#B88E52] text-white shadow-md ring-1 ring-white/20'
                    : isCompleted
                    ? 'bg-[#2D3748] text-[#F7F3EC] hover:bg-[#3A4A5E]'
                    : isAccessible
                    ? 'text-[#A0AEC0] hover:text-[#F7F3EC]'
                    : 'text-[#4A5568] cursor-not-allowed opacity-60'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center ${
                    isActive
                      ? 'bg-white text-[#B88E52]'
                      : isCompleted
                      ? 'bg-[#B88E52] text-white'
                      : 'bg-[#141D26] text-[#A0AEC0]'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.code}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation - Compact Step Indicator */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141D26] border border-[#B88E52]/40 px-3 py-1 rounded-full text-xs">
            <span className="w-4 h-4 rounded-full bg-[#B88E52] text-white text-[9px] font-bold flex items-center justify-center">
              {currentStepObj.code}
            </span>
            <span className="font-bold text-[#F7F3EC] text-[11px]">{currentStepObj.label}</span>
            <span className="text-[#A0AEC0] text-[10px] ml-1">({currentStep}/5)</span>
          </div>
        </div>

        {/* Right Help & Avatar Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            title="Help & Info"
            className="text-[#A0AEC0] hover:text-[#B88E52] transition p-1"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-[#2D3748] text-[#B88E52] flex items-center justify-center text-xs font-bold border border-[#B88E52]/40">
            AK
          </div>
        </div>
      </div>
    </header>
  );
};

