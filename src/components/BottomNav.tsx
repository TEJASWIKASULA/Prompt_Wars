import React from 'react';
import { StageId } from '../types';

interface BottomNavProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onOpenAuditModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentStage,
  onSelectStage,
  onOpenAuditModal
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-2px_12px_rgba(11,28,48,0.06)]">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {/* Roster / Intake */}
        <button
          onClick={() => onSelectStage(1)}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-2 rounded-xl transition-all ${
            currentStage === 1
              ? 'text-[#0f52ba] font-semibold bg-[#eff4ff]'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">clinical_notes</span>
          <span className="text-[11px] mt-0.5 font-medium">Roster</span>
        </button>

        {/* Telemetry / Live Processing */}
        <button
          onClick={() => onSelectStage(3)}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-2 rounded-xl transition-all ${
            currentStage === 3
              ? 'text-[#0f52ba] font-semibold bg-[#eff4ff]'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">psychology</span>
          <span className="text-[11px] mt-0.5 font-medium">Telemetry</span>
        </button>

        {/* Labs / Structured Record */}
        <button
          onClick={() => onSelectStage(4)}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-2 rounded-xl transition-all ${
            currentStage === 4 || currentStage === 5
              ? 'text-[#0f52ba] font-semibold bg-[#eff4ff]'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">lab_research</span>
          <span className="text-[11px] mt-0.5 font-medium">Labs</span>
        </button>

        {/* Verification & Audit */}
        <button
          onClick={() => {
            if (currentStage < 6) {
              onSelectStage(6);
            } else if (currentStage === 6) {
              onSelectStage(7);
            } else {
              onOpenAuditModal();
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 px-2 rounded-xl transition-all ${
            currentStage >= 6
              ? 'text-[#0f52ba] font-semibold bg-[#eff4ff]'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span className="text-[11px] mt-0.5 font-medium">Audit</span>
        </button>
      </div>
    </nav>
  );
};
