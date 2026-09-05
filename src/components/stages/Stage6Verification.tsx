import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { PatientInfo, LabAnalyte } from '../../types';

interface Stage6VerificationProps {
  patient: PatientInfo;
  analytes: LabAnalyte[];
  onToggleVerifyAnalyte: (id: string) => void;
  onBatchConfirm: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenAuditModal: () => void;
}

export const Stage6Verification: React.FC<Stage6VerificationProps> = ({
  patient,
  analytes,
  onToggleVerifyAnalyte,
  onBatchConfirm,
  onNext,
  onPrev,
  onOpenAuditModal
}) => {
  const [mpvOverride, setMpvOverride] = useState('9.4 - 12.3');
  const [submitting, setSubmitting] = useState(false);

  const attestedCount = analytes.filter((a) => a.attested).length;
  const pendingCount = analytes.length - attestedCount;

  const handleFinalApprove = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onNext();
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Header / Step Context */}
      <section className="flex flex-col space-y-2">
        <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#00419c]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#003c90] animate-pulse" />
          <span className="text-[10px] tracking-wider uppercase font-bold">
            Active Record Target
          </span>
        </div>

        <div className="bg-[#ffffff] border border-[#e2e8f0] p-3.5 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#003c90] text-[20px] shrink-0">clinical_notes</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm text-[#0b1c30] font-bold truncate">{patient.name || patient.pid}</span>
                <span className="font-mono text-xs text-[#737784] font-medium shrink-0">({patient.pid})</span>
              </div>
            </div>
            <span className="text-[10px] text-[#006398] bg-[#cce5ff] px-2 py-0.5 rounded font-bold uppercase">
              Inpatient Lab
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#434653] text-xs font-mono truncate pt-1 border-t border-[#f1f5f9]">
            <span className="material-symbols-outlined text-[15px] text-[#737784] shrink-0">picture_as_pdf</span>
            <span className="truncate">CBC_Differential_Report_Oct2024.pdf</span>
            <span className="text-[#c3c6d5]">•</span>
            <span className="shrink-0">p.2</span>
          </div>
        </div>

        <div className="pt-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
            Review Extracted Information
          </h1>
          <p className="text-xs text-[#434653] mt-1 leading-relaxed">
            Verify and attest AI-extracted parameters against source clinical documentation prior to synthesizing final diagnostic narrative.
          </p>
        </div>
      </section>

      {/* Mandatory In-The-Loop Advisory */}
      <aside className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3.5 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#003c90] text-[18px]">verified</span>
            <span className="text-[10px] font-bold text-[#003c90] uppercase tracking-wider">
              Mandatory Protocol
            </span>
          </div>
          <span className="text-[10px] text-[#0d1c2f] bg-[#d5e3fd] px-2 py-0.5 rounded font-bold">
            HITL Active
          </span>
        </div>
        <div className="text-[#0b1c30]">
          <h2 className="text-xs font-bold">Clinician-in-the-Loop Required</h2>
          <p className="text-xs text-[#434653] mt-0.5 leading-relaxed">
            MedLens requires physician validation for all automated vector parses. Adjust reference envelopes or correct OCR drift before locked export.
          </p>
        </div>
      </aside>

      {/* PDF Source Bounding Box Preview */}
      <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-3 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[#434653] text-[17px]">crop_free</span>
            <span className="text-xs text-[#0b1c30] font-bold truncate">PDF Source Bounding</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
            <span className="bg-[#ffffff] border border-[#dce9ff] px-2 py-0.5 rounded text-[#434653]">PAGE 2/4</span>
            <span className="bg-[#cce5ff] text-[#001d31] px-2 py-0.5 rounded font-bold uppercase">300 DPI</span>
          </div>
        </div>

        {/* OCR Visual Window with Calibrated Bounding Geometry */}
        <div className="relative w-full h-48 bg-[#cbdbf5]/50 overflow-hidden flex items-center justify-center select-none">
          <img
            src={ASSETS.docScan2}
            alt="Scanned Lab Document"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* Scan Overlay */}
          <div className="absolute inset-0 bg-[#003c90]/10 pointer-events-none mix-blend-multiply" />

          {/* Calibrated Highlight Bounding Box */}
          <div className="absolute inset-x-4 top-6 bottom-8 bg-[#5bb8fe]/20 rounded border-2 border-[#0f52ba] shadow-[0_0_0_2px_rgba(15,82,186,0.5)] flex flex-col justify-between p-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] bg-[#003c90] text-white px-1.5 py-0.5 rounded font-semibold shadow-xs">
                BBox: [X:142 Y:398 W:620 H:180]
              </span>
              <span className="flex items-center gap-1 text-[10px] bg-white/90 backdrop-blur-xs text-[#0b1c30] px-1.5 py-0.5 rounded font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003c90]" />
                ACTIVE REGION
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="font-mono text-[10px] bg-white/90 px-2 py-0.5 rounded text-[#003c90] font-bold shadow-xs">
                CBC Differential • Panel B
              </span>
              <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                <span className="material-symbols-outlined text-[13px] text-[#003c90]">auto_awesome</span>
                <span className="font-mono text-[10px] text-[#0b1c30] font-bold">96.8% AVG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Sub-Bar Action */}
        <div className="p-2.5 bg-[#ffffff] flex items-center justify-between text-xs border-t border-[#e2e8f0]">
          <div className="flex items-center gap-1 text-[#434653]">
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>Cross-referenced against HL7 CDA feed</span>
          </div>
          <button
            className="inline-flex items-center gap-1 text-xs text-[#003c90] font-bold hover:underline"
            onClick={() => alert('Full Document Viewer Sheet (Pages 1-4) verified.')}
          >
            <span>Full Sheet</span>
            <span className="material-symbols-outlined text-[16px]">open_in_full</span>
          </button>
        </div>
      </section>

      {/* Telemetry Validation Header & Batch Confirm Bar */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#003c90] text-[18px]">fact_check</span>
            <h2 className="text-sm font-bold text-[#0b1c30]">Telemetry Validation</h2>
          </div>
          <span className="font-mono text-[10px] text-[#434653] font-medium">4 PARSED</span>
        </div>

        {/* Status Tally Chips */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#ffffff] border border-[#e2e8f0] p-2.5 rounded-lg shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#434653] uppercase font-bold">Attested</span>
              <span className="font-mono text-sm text-[#0b1c30] font-bold">
                {attestedCount} Complete
              </span>
            </div>
          </div>

          <div className="bg-[#ffffff] border border-[#e2e8f0] p-2.5 rounded-lg shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#434653] uppercase font-bold">Pending Sign-off</span>
              <span className="font-mono text-sm text-[#0b1c30] font-bold">
                {pendingCount} Remaining
              </span>
            </div>
          </div>
        </div>

        {/* Batch Confirm CTA */}
        <button
          className="w-full h-11 px-3.5 rounded-xl bg-[#dce9ff] hover:bg-[#d3e4fe] active:scale-[0.99] transition-all flex items-center justify-between text-[#0b1c30] border border-[#0f52ba]/30 shadow-xs cursor-pointer"
          onClick={onBatchConfirm}
          type="button"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003c90] text-[18px]">done_all</span>
            <span className="text-xs font-bold text-[#003c90]">
              Batch Confirm High Confidence
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white text-[#003c90] px-2 py-0.5 rounded font-bold border border-[#dce9ff]">
            &gt;95% ({analytes.filter((a) => a.confidence > 95 && !a.attested).length} pending)
          </span>
        </button>
      </section>

      {/* Parameter Verification Cards */}
      <div className="space-y-3">
        {/* Item 1: Hemoglobin */}
        {(() => {
          const item = analytes.find((a) => a.id === 'hemoglobin')!;
          return (
            <article className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.attested ? 'bg-emerald-500' : 'bg-[#003c90]'}`} />
                  <h3 className="text-xs font-bold text-[#0b1c30]">Hemoglobin (Hgb)</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[12px] text-[#003c90]">psychology</span>
                  <span className="font-mono text-[10px] font-bold text-[#0b1c30]">96.4%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-[#434653] uppercase font-bold">Extracted Value</span>
                    <span className="material-symbols-outlined text-[13px] text-[#737784]">edit</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-base font-bold text-[#ba1a1a]">11.2</span>
                    <span className="text-[11px] text-[#ba1a1a] font-semibold">g/dL</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-[#434653] uppercase font-bold">Reference Interval</span>
                    <span className="material-symbols-outlined text-[13px] text-[#737784]">tune</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xs font-semibold text-[#0b1c30]">12.0 - 15.5</span>
                    <span className="text-[10px] text-[#434653]">g/dL</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#434653]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#737784]">description</span>
                  <span className="font-mono text-[10px]">CBC_Report.pdf • Line 14</span>
                </div>
                <span className="text-[10px] font-bold text-[#ba1a1a]">Low Indicator Flag</span>
              </div>

              {item.attested ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>Attested by Dr. S. Jenkins • 10:15:33 AM</span>
                  </div>
                  <button
                    onClick={() => onToggleVerifyAnalyte('hemoglobin')}
                    className="text-xs text-[#003c90] font-semibold hover:underline"
                  >
                    Re-edit
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => onToggleVerifyAnalyte('hemoglobin')}
                    className="flex-1 h-10 bg-[#0f52ba] hover:bg-[#003c90] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>
                    <span>Confirm Extracted Data</span>
                  </button>
                  <button
                    className="h-10 px-3 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg text-xs font-medium flex items-center justify-center border border-[#dce9ff]"
                    onClick={() => alert('Opening clinical note annotation for Hemoglobin...')}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                </div>
              )}
            </article>
          );
        })()}

        {/* Item 2: WBC (Verified Locked State) */}
        {(() => {
          const item = analytes.find((a) => a.id === 'wbc')!;
          return (
            <article className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-[#0b1c30]">White Blood Count (WBC)</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#cce5ff] text-[#001d31] px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  <span>99.1% CONF</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <span className="text-[10px] text-[#434653] uppercase font-bold block mb-0.5">
                    Attested Value
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-base font-bold text-[#0b1c30]">7,400</span>
                    <span className="text-[10px] text-[#434653] font-medium">/µL</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <span className="text-[10px] text-[#434653] uppercase font-bold block mb-0.5">
                    Normal Reference
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xs font-semibold text-[#0b1c30]">4,000 - 11,000</span>
                    <span className="text-[10px] text-[#434653]">/µL</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Human Attestation Seal */}
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#006398] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#0b1c30]">Dr. S. Jenkins, MD</span>
                      <span className="material-symbols-outlined text-[13px] text-[#006398]">verified</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#434653] truncate">
                      Attested 10:15:33 AM • Sign #884-MD
                    </span>
                  </div>
                </div>
                <button
                  className="text-xs text-[#003c90] font-semibold hover:underline p-1 shrink-0"
                  onClick={() => onToggleVerifyAnalyte('wbc')}
                >
                  {item.attested ? 'Re-edit' : 'Attest'}
                </button>
              </div>
            </article>
          );
        })()}

        {/* Item 3: Platelets */}
        {(() => {
          const item = analytes.find((a) => a.id === 'platelets')!;
          return (
            <article className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.attested ? 'bg-emerald-500' : 'bg-[#003c90]'}`} />
                  <h3 className="text-xs font-bold text-[#0b1c30]">Platelet Count (PLT)</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[12px] text-[#003c90]">psychology</span>
                  <span className="font-mono text-[10px] font-bold text-[#0b1c30]">98.7%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-[#434653] uppercase font-bold">Extracted Value</span>
                    <span className="material-symbols-outlined text-[13px] text-[#737784]">edit</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-base font-bold text-[#0b1c30]">250,000</span>
                    <span className="text-[10px] text-[#434653]">/µL</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-[#434653] uppercase font-bold">Reference Interval</span>
                    <span className="material-symbols-outlined text-[13px] text-[#737784]">tune</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xs font-semibold text-[#0b1c30]">150,000 - 450,000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#434653]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#737784]">description</span>
                  <span className="font-mono text-[10px]">CBC_Report.pdf • Line 18</span>
                </div>
                <span className="text-[10px] font-semibold text-[#434653]">Within Standard Bounds</span>
              </div>

              {item.attested ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>Attested by Dr. S. Jenkins • Verified Concordant</span>
                  </div>
                  <button
                    onClick={() => onToggleVerifyAnalyte('platelets')}
                    className="text-xs text-[#003c90] font-semibold hover:underline"
                  >
                    Re-edit
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => onToggleVerifyAnalyte('platelets')}
                    className="flex-1 h-10 bg-[#0f52ba] hover:bg-[#003c90] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">check_circle</span>
                    <span>Confirm Extracted Data</span>
                  </button>
                  <button
                    className="h-10 px-3 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-lg text-xs font-medium flex items-center justify-center border border-[#dce9ff]"
                    onClick={() => alert('Opening clinical note annotation for Platelets...')}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                </div>
              )}
            </article>
          );
        })()}

        {/* Item 4: MPV (Warning / Missing Reference Envelope) */}
        {(() => {
          const item = analytes.find((a) => a.id === 'mpv')!;
          return (
            <article className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.attested ? 'bg-emerald-500' : 'bg-[#ba1a1a]'}`} />
                  <h3 className="text-xs font-bold text-[#0b1c30]">Mean Platelet Volume (MPV)</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  <span>91.2%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg">
                  <span className="text-[10px] text-[#434653] uppercase font-bold block mb-0.5">
                    Extracted Value
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-base font-bold text-[#0b1c30]">9.8</span>
                    <span className="text-[10px] text-[#434653] font-medium">fL</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] border border-[#dce9ff] p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] text-[#ba1a1a] uppercase font-bold block mb-0.5">
                    Range Missing in PDF
                  </span>
                  <span className="font-mono text-[10px] text-[#434653] italic">Unspecified by Lab</span>
                </div>
              </div>

              {/* Manual Clinical Remediation Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#434653] uppercase font-bold flex items-center justify-between" htmlFor="mpv-range-input">
                  <span>Manual Reference Override</span>
                  <span className="text-[#003c90] font-semibold">Suggested: 9.4 - 12.3 fL</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-10 px-3 pr-16 bg-[#eff4ff] border border-[#dce9ff] rounded-lg font-mono text-xs text-[#0b1c30] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f52ba]"
                    id="mpv-range-input"
                    type="text"
                    value={mpvOverride}
                    onChange={(e) => setMpvOverride(e.target.value)}
                  />
                  <span className="absolute right-3 font-mono text-xs text-[#434653]">fL</span>
                </div>
              </div>

              {item.attested ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>Range attested [{mpvOverride} fL]</span>
                  </div>
                  <button
                    onClick={() => onToggleVerifyAnalyte('mpv')}
                    className="text-xs text-[#003c90] font-semibold hover:underline"
                  >
                    Re-edit
                  </button>
                </div>
              ) : (
                <div className="pt-0.5">
                  <button
                    onClick={() => onToggleVerifyAnalyte('mpv')}
                    className="w-full h-10 bg-[#0f52ba] hover:bg-[#003c90] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">verified</span>
                    <span>Attest Value & Range</span>
                  </button>
                </div>
              )}
            </article>
          );
        })()}
      </div>

      {/* Auditor Chain of Custody */}
      <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#434653] text-[18px]">account_tree</span>
            <h2 className="text-xs font-bold text-[#0b1c30]">Auditor Chain of Custody</h2>
          </div>
          <span className="font-mono text-[10px] bg-[#eff4ff] border border-[#dce9ff] px-2 py-0.5 rounded text-[#0b1c30] font-bold">
            SHA-256
          </span>
        </div>

        <div className="space-y-2.5 pl-1 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#006398] mt-1 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#0b1c30]">Parser OCR Ingestion</span>
                <span className="font-mono text-[10px] text-[#737784]">10:14:02 AM</span>
              </div>
              <span className="font-mono text-[11px] text-[#434653] truncate">
                Engine: BioBERT-NLP v4.2 • OCR Confidence 96.8%
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#003c90] mt-1 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#0b1c30]">Clinician Signed</span>
                <span className="font-mono text-[10px] text-[#737784]">10:15:33 AM</span>
              </div>
              <span className="font-mono text-[11px] text-[#434653] truncate">
                WBC Parameter attested by Dr. S. Jenkins • ID #884-MD
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#0b1c30]">Attestation Session</span>
                <span className="font-mono text-[10px] text-[#737784]">Active</span>
              </div>
              <span className="font-mono text-[11px] text-[#434653] truncate">
                TLS 1.3 • Checksum: c7b0ec22...9f21
              </span>
            </div>
          </div>
        </div>

        <button
          className="w-full pt-1 flex items-center justify-center gap-1 text-[#003c90] text-xs font-bold hover:underline"
          onClick={onOpenAuditModal}
        >
          <span>View Institutional Audit Trail</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </section>

      {/* Compliance Notice & Bottom CTAs */}
      <section className="space-y-3 pt-1">
        <div className="bg-[#eff4ff] border border-[#dce9ff] p-3 rounded-xl flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#003c90] text-[18px] shrink-0 mt-0.5">policy</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#003c90] uppercase tracking-wider">
              21 CFR § 820 Attestation
            </span>
            <p className="text-[11px] text-[#434653] mt-0.5 leading-snug">
              Attestation records conform to FDA and ISO 13485 electronic record standards. Clinician identity is cryptographically bound to this report package.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            className="w-full h-12 bg-[#003c90] hover:bg-[#0f52ba] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
            onClick={handleFinalApprove}
            type="button"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Finalizing Clinical Cryptoseal...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                <span>Approve & Generate AI Summary (Step 7)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>

          <button
            className="w-full h-11 bg-[#ffffff] border border-[#e2e8f0] hover:bg-[#eff4ff] text-[#0b1c30] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            onClick={onPrev}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Back to Source Viewer</span>
          </button>
        </div>

        {/* Security & Institutional Stamp */}
        <div className="pt-1 text-center flex flex-col items-center space-y-0.5 font-mono text-[10px] text-[#737784]">
          <div className="flex items-center gap-2">
            <span>SESSION: 884-MED-0941</span>
            <span>•</span>
            <span>AES-256 GCM</span>
          </div>
          <div className="flex items-center gap-1 text-[#434653]">
            <span className="material-symbols-outlined text-[13px] text-[#003c90]">security</span>
            <span>HIPAA BAA Secure Enclave • ISO 27001 Certified Workstation</span>
          </div>
        </div>
      </section>
    </div>
  );
};
