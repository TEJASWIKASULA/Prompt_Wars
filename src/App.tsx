/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RawTelemetryModal } from './components/modals/RawTelemetryModal';
import { AuditTrailModal } from './components/modals/AuditTrailModal';
import { ClinicalCopilotDrawer } from './components/modals/ClinicalCopilotDrawer';
import { Stage1Intake } from './components/stages/Stage1Intake';
import { Stage2Upload, UploadedDocPayload } from './components/stages/Stage2Upload';
import { Stage3Analyzing } from './components/stages/Stage3Analyzing';
import { Stage4StructuredRecord } from './components/stages/Stage4StructuredRecord';
import { Stage5SourceViewer } from './components/stages/Stage5SourceViewer';
import { Stage6Verification } from './components/stages/Stage6Verification';
import { Stage7Summary } from './components/stages/Stage7Summary';
import { DEFAULT_PATIENT, DEFAULT_ANALYTES } from './data/mockData';
import { PatientInfo, LabAnalyte } from './types';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [patient, setPatient] = useState<PatientInfo>(DEFAULT_PATIENT);
  const [analytes, setAnalytes] = useState<LabAnalyte[]>(DEFAULT_ANALYTES);
  const [uploadedPayload, setUploadedPayload] = useState<UploadedDocPayload | null>(null);
  const [isDesktopFrame, setIsDesktopFrame] = useState<boolean>(false);
  const [showRawTelemetry, setShowRawTelemetry] = useState<boolean>(false);
  const [showAuditTrail, setShowAuditTrail] = useState<boolean>(false);
  const [showCopilot, setShowCopilot] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdatePatient = (updated: Partial<PatientInfo>) => {
    setPatient((prev) => ({ ...prev, ...updated }));
    showToast('Patient record updated.');
  };

  const handleResetPatient = () => {
    setPatient(DEFAULT_PATIENT);
    showToast('Intake record reset to baseline defaults.');
  };

  const handleToggleVerifyAnalyte = (id: string) => {
    setAnalytes((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newState = !a.attested;
          return {
            ...a,
            attested: newState,
            attestedBy: newState ? 'Dr. S. Jenkins, MD' : undefined,
            attestedAt: newState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return a;
      })
    );
  };

  const handleBatchConfirm = () => {
    setAnalytes((prev) =>
      prev.map((a) =>
        a.confidence > 95
          ? {
              ...a,
              attested: true,
              attestedBy: 'Dr. S. Jenkins, MD',
              attestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : a
      )
    );
    showToast('High-confidence parameters attested by Dr. S. Jenkins, MD');
  };

  const handleNextStage = () => {
    if (currentStage < 7) {
      setCurrentStage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStage(1);
    setPatient(DEFAULT_PATIENT);
    setAnalytes(DEFAULT_ANALYTES);
    setUploadedPayload(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Started new intake workflow.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-[#cce5ff] selection:text-[#001d31]">
      {/* Universal Top Header with Quick Stage Switcher */}
      <Header
        currentStage={currentStage}
        onSelectStage={(stage) => {
          setCurrentStage(stage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDesktopFrame={isDesktopFrame}
        onToggleDesktopFrame={() => setIsDesktopFrame(!isDesktopFrame)}
        onOpenAuditTrail={() => setShowAuditTrail(true)}
        onOpenCopilot={() => setShowCopilot(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#003c90] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main
        className={`flex-1 w-full mx-auto transition-all duration-300 ${
          isDesktopFrame
            ? 'max-w-4xl px-6 py-6'
            : 'max-w-md px-4 py-4 sm:max-w-lg'
        }`}
      >
        {currentStage === 1 && (
          <Stage1Intake
            patient={patient}
            onUpdatePatient={handleUpdatePatient}
            onNext={handleNextStage}
            onReset={handleResetPatient}
          />
        )}

        {currentStage === 2 && (
          <Stage2Upload
            patient={patient}
            currentPayload={uploadedPayload}
            onNext={(payload) => {
              if (payload) setUploadedPayload(payload);
              handleNextStage();
            }}
            onPrev={handlePrevStage}
          />
        )}

        {currentStage === 3 && (
          <Stage3Analyzing
            patient={patient}
            uploadedPayload={uploadedPayload}
            onAnalytesExtracted={(extracted) => {
              setAnalytes(extracted);
              showToast(`${extracted.length} laboratory analytes extracted & structured.`);
            }}
            onNext={handleNextStage}
            onPrev={handlePrevStage}
            onOpenRawTelemetry={() => setShowRawTelemetry(true)}
          />
        )}

        {currentStage === 4 && (
          <Stage4StructuredRecord
            patient={patient}
            analytes={analytes}
            onToggleVerifyAnalyte={handleToggleVerifyAnalyte}
            onNext={handleNextStage}
            onPrev={handlePrevStage}
            onJumpToStage5={() => {
              setCurrentStage(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStage === 5 && (
          <Stage5SourceViewer
            patient={patient}
            analytes={analytes}
            onToggleVerifyAnalyte={handleToggleVerifyAnalyte}
            onNext={handleNextStage}
            onPrev={handlePrevStage}
          />
        )}

        {currentStage === 6 && (
          <Stage6Verification
            patient={patient}
            analytes={analytes}
            onToggleVerifyAnalyte={handleToggleVerifyAnalyte}
            onBatchConfirm={handleBatchConfirm}
            onNext={handleNextStage}
            onPrev={handlePrevStage}
            onOpenAuditModal={() => setShowAuditTrail(true)}
          />
        )}

        {currentStage === 7 && (
          <Stage7Summary
            patient={patient}
            analytes={analytes}
            onRestart={handleRestart}
            onOpenAuditModal={() => setShowAuditTrail(true)}
            onOpenCopilot={() => setShowCopilot(true)}
          />
        )}
      </main>

      {/* Floating AI Copilot FAB trigger */}
      <button
        onClick={() => setShowCopilot(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#0f52ba] hover:bg-[#003c90] text-white p-3.5 rounded-full shadow-xl flex items-center gap-2 font-semibold text-xs transition-transform active:scale-95 cursor-pointer ring-4 ring-[#0f52ba]/20"
        title="Open MedLens AI Clinical Reasoning Copilot"
      >
        <span className="material-symbols-outlined text-[20px]">psychology</span>
        <span className="hidden sm:inline">Clinical Copilot</span>
      </button>

      {/* Bottom Navigation for Mobile Workflow Tabs */}
      <BottomNav
        currentStage={currentStage}
        onSelectStage={(stage) => {
          setCurrentStage(stage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRawModal={() => setShowRawTelemetry(true)}
      />

      {/* OCR Telemetry & Bounding Inspection Modal */}
      <RawTelemetryModal
        isOpen={showRawTelemetry}
        onClose={() => setShowRawTelemetry(false)}
        analytes={analytes}
      />

      {/* Institutional Audit Trail Modal */}
      <AuditTrailModal
        isOpen={showAuditTrail}
        onClose={() => setShowAuditTrail(false)}
      />

      {/* Interactive AI Clinical Copilot Drawer */}
      <ClinicalCopilotDrawer
        isOpen={showCopilot}
        onClose={() => setShowCopilot(false)}
        patient={patient}
        analytes={analytes}
      />
    </div>
  );
}
