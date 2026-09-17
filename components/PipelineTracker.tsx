'use client';

import React from 'react';
import { CheckCircle2, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { PipelineStep, ProcessingState } from '@/lib/planSchema';

interface PipelineTrackerProps {
  currentState: ProcessingState;
  steps: PipelineStep[];
  errorMessage?: string;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentState,
  steps,
  errorMessage,
}) => {
  if (currentState === 'idle') return null;

  // Transform technical developer labels into clear user microcopy
  const getFriendlyLabel = (label: string) => {
    if (label.toLowerCase().includes('vision') || label.toLowerCase().includes('analysis')) {
      return 'Reading floor plan';
    }
    if (label.toLowerCase().includes('geometry') || label.toLowerCase().includes('normalized')) {
      return 'Detecting rooms and spaces';
    }
    if (label.toLowerCase().includes('topology') || label.toLowerCase().includes('audit')) {
      return 'Checking the floor plan';
    }
    if (label.toLowerCase().includes('three') || label.toLowerCase().includes('render') || label.toLowerCase().includes('generator')) {
      return 'Creating your 3D home';
    }
    return label;
  };

  return (
    <div className="bg-[#1F2B38] text-[#F7F3EC] border border-[#B88E52]/40 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#B88E52]/30 pb-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#F7F3EC] tracking-wide">
            Understanding Your Floor Plan
          </h3>
          <p className="text-xs text-[#D4AF77]">
            Mapping room boundaries, openings, and architectural elements
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#B88E52]/20 text-[#B88E52] border border-[#B88E52]/40 uppercase tracking-widest">
          {currentState === 'completed' ? 'Ready' : 'Processing'}
        </span>
      </div>

      {errorMessage && (
        <div className="bg-rose-950/60 border border-rose-600/60 text-rose-200 p-4 rounded-xl flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-100">Unable to process plan:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Grid of User-Friendly Progress Checklist Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isWarn = step.status === 'warning';
          const isFail = step.status === 'failed';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition flex items-center gap-3 text-xs ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : isCurrent
                  ? 'bg-[#B88E52]/20 border-[#B88E52] text-[#F7F3EC] shadow-md ring-1 ring-[#B88E52]'
                  : isWarn
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : isFail
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : 'bg-[#141D26] border-[#2D3748] text-[#718096]'
              }`}
            >
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isCurrent && <Loader2 className="w-4 h-4 text-[#B88E52] animate-spin shrink-0" />}
              {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {isFail && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {!isDone && !isCurrent && !isWarn && !isFail && (
                <div className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0" />
              )}
              <div className="truncate">
                <p className="font-semibold truncate">{getFriendlyLabel(step.label)}</p>
                {step.message && <p className="text-[10px] opacity-80 truncate">{step.message}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

