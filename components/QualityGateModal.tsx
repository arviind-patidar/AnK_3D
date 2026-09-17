'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { AmbiguityItem } from '@/lib/planSchema';

interface QualityGateModalProps {
  ambiguities: AmbiguityItem[];
  onResolve: (ambiguityId: string, answer: string) => void;
  onProceed: () => void;
}

export const QualityGateModal: React.FC<QualityGateModalProps> = ({
  ambiguities,
  onResolve,
  onProceed,
}) => {
  const unresolved = ambiguities.filter((a) => !a.resolved);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: string }>({});

  if (ambiguities.length === 0) return null;

  const handleOptionSelect = (ambiguityId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [ambiguityId]: option }));
    onResolve(ambiguityId, option);
  };

  const allResolved = unresolved.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border-2 border-[#B88E52] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-[#F7F3EC] tracking-wide">
              Plan Requires Confirmation
            </h3>
            <p className="text-xs text-[#D4AF77]">
              Quality Gate Audit: Ambiguity detected in floor plan geometry
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Architectural Fidelity Safeguard</span>
            </p>
            <p>
              Acre&Key rule: <span className="font-bold">Never silently guess geometry.</span> Please clarify the following structural details before generating 3D renders.
            </p>
          </div>

          {/* List of Ambiguity Questions */}
          <div className="space-y-4">
            {ambiguities.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition ${
                  item.resolved
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-[#B88E52]/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#1F2B38] text-[#B88E52]">
                      Question #{idx + 1} — {item.type.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm font-bold text-[#1F2B38] mt-1">{item.question}</p>
                  </div>
                  {item.resolved && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed
                    </span>
                  )}
                </div>

                {/* Options / Answer Buttons */}
                {!item.resolved && item.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionSelect(item.id, opt)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition border ${
                          selectedAnswers[item.id] === opt
                            ? 'bg-[#1F2B38] text-[#F7F3EC] border-[#B88E52] ring-2 ring-[#B88E52]'
                            : 'bg-[#F7F3EC] text-[#1F2B38] border-[#C8C0B2] hover:border-[#B88E52]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {item.resolved && item.userAnswer && (
                  <p className="text-xs text-emerald-800 font-semibold mt-2">
                    Confirmed Answer: <span className="underline">{item.userAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EFECE6] px-6 py-4 border-t border-[#E2DCD2] flex justify-end">
          <button
            type="button"
            disabled={!allResolved}
            onClick={onProceed}
            className="bg-[#1F2B38] hover:bg-[#141D26] text-[#F7F3EC] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-[#B88E52] transition shadow-md disabled:opacity-50"
          >
            {allResolved ? 'Proceed with 3D Rendering' : 'Please Answer All Questions'}
          </button>
        </div>
      </div>
    </div>
  );
};
