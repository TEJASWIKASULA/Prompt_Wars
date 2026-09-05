import React from 'react';
import { ASSETS } from '../data/mockData';
import { StageId } from '../types';

interface HeaderProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  onBack?: () => void;
  isDesktopFrame?: boolean;
  onToggleDesktopFrame?: () => void;
  viewMode?: 'mobile' | 'desktop';
  onToggleViewMode?: () => void;
  onOpenAuditModal?: () => void;
  onOpenAuditTrail?: () => void;
  onOpenCopilot?: () => void;
  apiConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onSelectStage,
  onBack,
  isDesktopFrame,
  onToggleDesktopFrame,
  viewMode,
  onToggleViewMode,
  onOpenAuditModal,
  onOpenAuditTrail,
  onOpenCopilot,
  apiConnected = true
}) => {
  const isDesktop = isDesktopFrame !== undefined ? isDesktopFrame : viewMode === 'desktop';
  const handleToggleLayout = onToggleDesktopFrame || onToggleViewMode;
  const handleAudit = onOpenAuditTrail || onOpenAuditModal;
  const stageTitles: Record<StageId, { stepText: string; title: string; badge: string; subBadge?: string }> = {
    1: { stepText: 'STAGE 01 / 07', title: 'Create Patient Record', badge: '256-BIT', subBadge: 'LIVE EHR' },
    2: { stepText: 'STEP 2 OF 7', title: 'Upload Report', badge: 'AUDITED' },
    3: { stepText: 'STAGE 3 OF 7', title: 'Step Review Encounter', badge: 'HIPAA SECURE', subBadge: 'STAGE 2/4' },
    4: { stepText: 'STEP 4 OF 7', title: 'Medical Record Labs', badge: 'HIPAA' },
    5: { stepText: 'STAGE 05 / 07', title: 'Source Document Viewer', badge: 'INSPECTION ACTIVE' },
    6: { stepText: 'STAGE 6 OF 7', title: 'Verification Workflow', badge: 'HIPAA', subBadge: '85%' },
    7: { stepText: 'STEP 7 OF 7', title: 'Ai Summary And Clinician Attestation', badge: 'HIPAA SECURE' }
  };

  const currentInfo = stageTitles[currentStage];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(11,28,48,0.04)]">
      {/* Top Workstation Bar */}
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {currentStage > 1 ? (
            <button
              aria-label="Navigate Back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#0b1c30] hover:bg-[#e5eeff] transition-colors shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-2" />
          )}

          <div
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            onClick={() => onSelectStage(1)}
            title="MedLens AI Home"
          >
            <img
              src={ASSETS.logo}
              alt="MedLens AI"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[#003c90] truncate">
                  MedLens AI
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#00476e] text-[10px] font-mono font-medium flex items-center gap-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[11px] text-[#006398]">lock</span>
                  {currentInfo.badge}
                </span>
              </div>
              <span className="text-[11px] text-[#434653] font-medium truncate max-w-[150px] sm:max-w-xs">
                {currentInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Stage Jump Menu */}
          <div className="hidden sm:flex items-center bg-[#eff4ff] border border-[#dce9ff] rounded-lg p-0.5 text-xs font-medium">
            <span className="px-2 text-[#434653] text-[11px] font-mono">Stage:</span>
            {([1, 2, 3, 4, 5, 6, 7] as StageId[]).map((num) => (
              <button
                key={num}
                onClick={() => onSelectStage(num)}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono transition-colors ${
                  currentStage === num
                    ? 'bg-[#0f52ba] text-white font-bold shadow-xs'
                    : 'text-[#434653] hover:bg-[#dce9ff]'
                }`}
                title={`Jump to Stage ${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Gemini AI Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini 3.8 Flash</span>
          </div>

          {/* AI Clinical Copilot button */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#0f52ba] hover:bg-[#003c90] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Open MedLens AI Clinical Copilot"
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          )}

          {/* View mode toggle (Mobile emulator frame vs Full desktop width) */}
          {handleToggleLayout && (
            <button
              onClick={handleToggleLayout}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#e5eeff] text-[#003c90] rounded-lg hover:bg-[#dce9ff] transition-colors"
              title="Toggle between Mobile Frame and Full Width view"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isDesktop ? 'smartphone' : 'desktop_windows'}
              </span>
              <span>{isDesktop ? 'Mobile View' : 'Full Width'}</span>
            </button>
          )}

          {/* Institutional Audit quick button */}
          {handleAudit && (
            <button
              onClick={handleAudit}
              className="h-8 px-2 flex items-center gap-1 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006398] text-xs font-mono font-medium border border-[#dce9ff] transition-colors"
              title="View Institutional Audit Trail"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span className="hidden xs:inline">Audit</span>
            </button>
          )}

          {/* Physician Avatar */}
          <div className="relative group cursor-pointer" title="Dr. S. Jenkins, MD (Attending Physician)">
            <img
              src={ASSETS.doctor}
              alt="Dr. S. Jenkins"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dce9ff]"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
          </div>
        </div>
      </div>

      {/* Stage Progress Bar Strip */}
      <div className="w-full bg-[#eff4ff] border-t border-[#e2e8f0]/60 px-4 py-1.5 flex items-center justify-between text-xs max-w-5xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#006398] animate-pulse shrink-0" />
          <span className="font-mono text-[11px] text-[#006398] font-semibold uppercase tracking-wider truncate">
            {currentInfo.stepText}: {currentInfo.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] text-[#434653] font-semibold">
            {Math.round((currentStage / 7) * 100)}%
          </span>
          <div className="w-16 sm:w-24 h-1.5 bg-[#dce9ff] rounded-full overflow-hidden">
            <div
              className="bg-[#0f52ba] h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStage / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
