import React, { useState } from 'react';
import { PatientInfo, LabAnalyte } from '../../types';

interface Stage4StructuredRecordProps {
  patient: PatientInfo;
  analytes: LabAnalyte[];
  onToggleVerifyAnalyte: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpToStage5: (analyteId?: string) => void;
}

export const Stage4StructuredRecord: React.FC<Stage4StructuredRecordProps> = ({
  patient,
  analytes,
  onToggleVerifyAnalyte,
  onNext,
  onPrev,
  onJumpToStage5
}) => {
  const [selectedId, setSelectedId] = useState<string>('hemoglobin');
  const [isBaselineExpanded, setIsBaselineExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValue, setEditValue] = useState('11.2');

  const selectedAnalyte = analytes.find((a) => a.id === selectedId) || analytes[0];

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Progress Milestone Bar */}
      <section className="w-full bg-[#eff4ff] border border-[#dce9ff] px-3.5 py-2.5 rounded-xl shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#003c90] animate-pulse" />
            <span className="text-[11px] text-[#003c90] font-bold uppercase tracking-wider truncate">
              Step 4 of 7 : Structured Medical Record
            </span>
          </div>
          <span className="font-mono text-xs text-[#003c90] font-bold">57%</span>
        </div>
        <div className="w-full h-1.5 bg-[#dce9ff] rounded-full overflow-hidden">
          <div className="h-full bg-[#0f52ba] rounded-full transition-all duration-500" style={{ width: '57.14%' }} />
        </div>
      </section>

      {/* Clinical Context Ribbon */}
      <section>
        <div className="p-3.5 bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#003c90] shrink-0">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#0b1c30] truncate">{patient.name || patient.pid}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#434653] font-mono text-[10px] font-semibold">
                    {patient.pid}
                  </span>
                </div>
                <p className="text-xs text-[#434653]">
                  {patient.age} yrs • {patient.sex} • Outpatient Triage
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#dce9ff] text-[#00419c] text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003c90]" />
                ACTIVE EHR
              </span>
              <span className="font-mono text-[10px] text-[#737784] mt-0.5">HL7 FHIR R4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Report Metadata Card */}
      <section>
        <div className="p-3.5 bg-[#eff4ff] border border-[#dce9ff] rounded-xl">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#003c90] uppercase tracking-wider">
                Source Intake Telemetry
              </span>
              <h2 className="text-sm font-bold text-[#0b1c30] mt-0.5 truncate">CBC with Differential</h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#003c90] font-mono text-[10px] font-semibold border border-[#dce9ff] shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[13px]">psychology</span>
              OCR 98.4%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#dce9ff]/60">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#737784] text-[15px]">calendar_today</span>
              <span className="text-xs text-[#434653]">Oct 24, 2024</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#737784] text-[15px]">description</span>
              <span className="font-mono text-[11px] text-[#434653] truncate">CBC_Report.pdf (P.2)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Clinical Baseline Summary (Accordion) */}
      <section>
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs overflow-hidden">
          <button
            className="w-full p-3.5 flex items-center justify-between gap-2 text-left hover:bg-[#eff4ff] transition-colors"
            onClick={() => setIsBaselineExpanded(!isBaselineExpanded)}
            type="button"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#003c90] shrink-0">
                <span className="material-symbols-outlined text-[17px]">clinical_notes</span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0b1c30] truncate">Clinical Baseline Summary</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#dce9ff] text-[#00419c] text-[10px] font-semibold uppercase">
                    Patient-Reported
                  </span>
                </div>
                <p className="text-xs text-[#434653] truncate">Fatigue, HTN, Lisinopril, Penicillin Allergy</p>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[#434653] text-[20px] transition-transform duration-200 ${
                isBaselineExpanded ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {isBaselineExpanded && (
            <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-[#f1f5f9]">
              {/* Critical Allergy Alert Pill */}
              <div className="p-2 px-3 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-between gap-2 border border-[#ba1a1a]/20">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[17px]">emergency</span>
                  <span className="text-xs font-bold truncate">Allergies: {patient.allergies}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold uppercase shrink-0">
                  High Risk
                </span>
              </div>

              {/* Symptoms & Conditions 2-col Grid */}
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                  <div className="flex items-center gap-1 text-[#737784] mb-1">
                    <span className="material-symbols-outlined text-[13px]">symptoms</span>
                    <span className="text-[10px] uppercase font-bold text-[#003c90]">Active Presenting Symptoms</span>
                  </div>
                  <p className="text-xs text-[#0b1c30]">{patient.chiefComplaint}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                    <div className="flex items-center gap-1 text-[#737784] mb-1">
                      <span className="material-symbols-outlined text-[13px]">vital_signs</span>
                      <span className="text-[10px] uppercase font-bold text-[#003c90]">Conditions</span>
                    </div>
                    <p className="text-xs text-[#0b1c30] font-medium">
                      {patient.conditions.map((c) => c.name).join(', ')}
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                    <div className="flex items-center gap-1 text-[#737784] mb-1">
                      <span className="material-symbols-outlined text-[13px]">medication</span>
                      <span className="text-[10px] uppercase font-bold text-[#003c90]">Medications</span>
                    </div>
                    <p className="text-xs text-[#0b1c30] font-medium truncate">
                      {patient.prescriptions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Extracted Laboratory Results Header */}
      <section>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0b1c30]">Extracted Laboratory Results</h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#d3e4fe] text-[#003c90] text-[10px] font-bold uppercase">
              <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
              AI Extracted
            </span>
          </div>
        </div>
        <p className="text-xs text-[#434653] mt-0.5">
          Automated extraction with coordinate bounding-box tracing. Tap any analyte to inspect provenance.
        </p>

        {/* Out of Range Triage Banner */}
        <div className="mt-2.5 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-center justify-between shadow-xs border border-[#ba1a1a]/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] animate-pulse shrink-0">
              warning
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold block">OUT-OF-RANGE: 1 / 4 TESTS</span>
              <p className="text-[11px] text-[#ba1a1a] font-medium truncate">
                Hemoglobin below physiological baseline
              </p>
            </div>
          </div>
          {/* Inline Sparkline Trend SVG */}
          <div className="w-16 h-7 shrink-0 flex items-center justify-end">
            <svg className="w-16 h-7 text-[#ba1a1a]" fill="none" viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6L18 7L34 10L50 20L62 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <circle cx="62" cy="21" fill="currentColor" r="2.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Lab Results Interactive Stack */}
      <section className="space-y-2">
        {analytes.map((item) => {
          const isSelected = item.id === selectedId;
          const isLow = item.status === 'low';
          const isNormal = item.status === 'normal';

          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full p-3.5 rounded-xl transition-all cursor-pointer relative overflow-hidden border ${
                isSelected
                  ? 'bg-[#ffffff] shadow-md border-[#0f52ba] ring-2 ring-[#0f52ba]'
                  : 'bg-[#ffffff] shadow-xs border-[#e2e8f0] hover:border-[#cbd5e1]'
              }`}
            >
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0f52ba]" />}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pl-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0b1c30] truncate">{item.name}</h4>
                    <span className="font-mono text-[10px] text-[#737784]">LOINC {item.loinc}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#434653]">
                    <span className="material-symbols-outlined text-[13px] text-[#737784]">pin_drop</span>
                    <span className="truncate">{item.sourceLoc}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-mono text-base font-bold ${
                        isLow ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                      }`}
                    >
                      {item.value}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        isLow ? 'text-[#ba1a1a] font-semibold' : 'text-[#434653]'
                      }`}
                    >
                      {item.unit}
                    </span>
                  </div>
                  {isLow && (
                    <span className="mt-0.5 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold uppercase inline-flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">arrow_downward</span>
                      Low
                    </span>
                  )}
                  {isNormal && (
                    <span className="mt-0.5 px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#003c90] text-[10px] font-bold inline-flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">check</span>
                      Normal
                    </span>
                  )}
                  {item.status === 'unspecified' && (
                    <span className="mt-0.5 px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#434653] text-[10px] font-medium">
                      Not determined
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[#434653] bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#dce9ff]">
                <span className="text-[11px]">
                  Ref Range:{' '}
                  <span className="font-mono font-semibold text-[#0b1c30]">
                    {item.refRange}
                  </span>
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    item.attested
                      ? 'text-emerald-700 flex items-center gap-0.5'
                      : 'text-[#003c90] flex items-center gap-0.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {item.attested ? 'verified' : 'pending_actions'}
                  </span>
                  <span>{item.attested ? 'Attested' : 'Pending Review'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mobile Detailed Inspector Sheet (Active Analyte Inspection) */}
      <section>
        <div className="p-4 bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-md space-y-3">
          {/* Inspector Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#003c90] text-white flex items-center justify-center font-mono text-xs font-bold">
                  01
                </span>
                <h3 className="text-sm font-bold text-[#0b1c30] truncate">
                  Analyte Audit: {selectedAnalyte.name}
                </h3>
              </div>
              <p className="font-mono text-xs text-[#003c90] font-semibold mt-0.5">
                LOINC: {selectedAnalyte.loinc} • Erythroid Series
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#d3e4fe] text-[#003c90] text-[10px] font-bold uppercase shrink-0">
              AI Extracted
            </span>
          </div>

          {/* Large Primary Value Display with Triage Pill */}
          <div className="p-3.5 bg-[#eff4ff] border border-[#dce9ff] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#434653] uppercase">Calibrated Value</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`font-mono text-2xl font-bold ${
                    selectedAnalyte.status === 'low' ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                  }`}
                >
                  {selectedAnalyte.value}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    selectedAnalyte.status === 'low' ? 'text-[#ba1a1a]' : 'text-[#434653]'
                  }`}
                >
                  {selectedAnalyte.unit}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                  selectedAnalyte.status === 'low'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#e5eeff] text-[#003c90]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {selectedAnalyte.status === 'low' ? 'arrow_downward' : 'check'}
                </span>
                {selectedAnalyte.status === 'low' ? 'Low Analyte' : 'Normal'}
              </span>
              <span className="font-mono text-[11px] text-[#737784]">
                Ref: {selectedAnalyte.refRange}
              </span>
            </div>
          </div>

          {/* Metadata & Telemetry Spec Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
              <span className="text-[10px] text-[#737784] block uppercase font-bold">Source File</span>
              <span className="font-mono text-[11px] text-[#0b1c30] font-semibold truncate block mt-0.5">
                CBC_Report.pdf (P.2)
              </span>
            </div>
            <div className="p-2 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
              <span className="text-[10px] text-[#737784] block uppercase font-bold">Bounding Box</span>
              <span className="font-mono text-[11px] text-[#0b1c30] font-semibold truncate block mt-0.5">
                [{selectedAnalyte.boundingBox.join(', ')}]
              </span>
            </div>
            <div className="p-2 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
              <span className="text-[10px] text-[#737784] block uppercase font-bold">Extraction Model</span>
              <span className="font-mono text-[11px] text-[#003c90] font-semibold truncate block mt-0.5">
                OCR v4.2 ({selectedAnalyte.confidence}% Conf)
              </span>
            </div>
            <div className="p-2 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
              <span className="text-[10px] text-[#737784] block uppercase font-bold">Verification Gate</span>
              <span
                className={`text-[10px] font-bold uppercase truncate block mt-0.5 ${
                  selectedAnalyte.attested ? 'text-emerald-700' : 'text-[#ba1a1a]'
                }`}
              >
                {selectedAnalyte.attested ? 'Attested Complete' : 'Action Required'}
              </span>
            </div>
          </div>

          {/* Simulated Optical Trace Snippet (Document Crop) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#434653] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#003c90]">crop_free</span>
                Optical Trace Crop (Original Raster)
              </span>
              <span className="font-mono text-[10px] text-[#003c90] font-semibold">100% Native Scale</span>
            </div>

            {/* High-contrast Clinical Document Snippet */}
            <div className="relative bg-[#ffffff] rounded-xl p-3.5 overflow-hidden border border-[#dce9ff] shadow-inner font-mono text-xs select-none">
              <div className="flex flex-col space-y-1 text-[#0b1c30]">
                <div className="flex justify-between text-[#737784] text-[10px] pb-1 border-b border-[#e2e8f0]">
                  <span>TEST NAME</span>
                  <span>RESULT</span>
                  <span>FLAG</span>
                  <span>REF INTERVAL</span>
                </div>
                <div className="flex justify-between text-[#434653] opacity-60">
                  <span>WBC</span>
                  <span>7.4</span>
                  <span></span>
                  <span>4.0 - 11.0</span>
                </div>
                <div className="flex justify-between text-[#434653] opacity-60">
                  <span>RBC</span>
                  <span>4.12</span>
                  <span></span>
                  <span>3.80 - 5.10</span>
                </div>

                {/* Highlighted Target Row */}
                <div className="relative -mx-2 px-2 py-1 bg-[#d3e4fe]/60 rounded-md border border-[#0f52ba]/50">
                  <div className="flex justify-between font-bold text-[#0b1c30]">
                    <span className="text-[#003c90] font-bold">{selectedAnalyte.name}</span>
                    <span className={selectedAnalyte.status === 'low' ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}>
                      {selectedAnalyte.value}
                    </span>
                    <span className={selectedAnalyte.status === 'low' ? 'text-[#ba1a1a]' : ''}>
                      {selectedAnalyte.status === 'low' ? 'L' : ''}
                    </span>
                    <span>{selectedAnalyte.refRange}</span>
                  </div>
                  <div className="absolute inset-0 bg-[#0f52ba]/10 rounded pointer-events-none flex items-end justify-end p-0.5">
                    <span className="bg-[#0f52ba] text-white text-[9px] px-1 py-0.2 rounded font-mono leading-none">
                      BOX: [{selectedAnalyte.boundingBox.join(', ')}]
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[#434653] opacity-60">
                  <span>Hematocrit</span>
                  <span>34.1</span>
                  <span className="text-[#ba1a1a]">L</span>
                  <span>36.0 - 46.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons within Inspector */}
          <div className="pt-1 space-y-2">
            <button
              onClick={() => onJumpToStage5(selectedAnalyte.id)}
              className="w-full h-11 bg-[#003c90] hover:bg-[#0f52ba] text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
              type="button"
            >
              <span>View Source in Document Viewer</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleVerifyAnalyte(selectedAnalyte.id)}
                className={`h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border ${
                  selectedAnalyte.attested
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-[#e5eeff] text-[#003c90] border-[#dce9ff] hover:bg-[#dce9ff]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {selectedAnalyte.attested ? 'check' : 'check_circle'}
                </span>
                <span>{selectedAnalyte.attested ? 'Verified ✓' : 'Verify Extraction'}</span>
              </button>

              <button
                onClick={() => {
                  setEditValue(selectedAnalyte.value);
                  setShowEditModal(true);
                }}
                className="h-10 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] border border-[#dce9ff] rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[#737784] text-[16px]">edit</span>
                <span>Edit Value</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Longitudinal Historical Baseline Card */}
      <section>
        <div className="p-3.5 bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003c90] text-[20px]">history</span>
              <span className="text-xs font-bold text-[#0b1c30]">Longitudinal Baseline Available</span>
            </div>
            <span className="font-mono text-[10px] text-[#737784]">Jun 14, 2024</span>
          </div>
          <p className="text-xs text-[#0b1c30] leading-relaxed">
            Hemoglobin was previously <span className="font-mono font-bold text-[#0b1c30]">13.4 g/dL</span>. 
            Calculated Delta: <span className="font-mono font-bold text-[#ba1a1a]">-2.2 g/dL</span> over 4 months.
          </p>
          <div className="pt-1">
            <button
              className="w-full h-10 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003c90] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold border border-[#dce9ff] transition-colors"
              onClick={() => alert('Longitudinal comparison view: Hemoglobin decreased by 16.4% from baseline 13.4 g/dL to current 11.2 g/dL.')}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">stacked_line_chart</span>
              <span>Compare Baseline Trajectory</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clinical Verification Gate Action & Navigation */}
      <section className="space-y-3 pt-1">
        <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-start gap-2">
          <span className="material-symbols-outlined text-[#737784] text-[17px] shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-[11px] text-[#434653] leading-relaxed">
            <strong className="text-[#0b1c30] font-semibold">Safety Reminder:</strong> MedLens AI organizes and extracts clinical structured data without autonomous medical judgment. All extracted lab parameters must be verified against source documentation by an authorized clinician before diagnostic copilot synthesis.
          </p>
        </div>

        <div className="space-y-2">
          <button
            className="w-full h-12 bg-[#003c90] hover:bg-[#0f52ba] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md active:scale-[0.99] transition-all cursor-pointer"
            onClick={onNext}
            type="button"
          >
            <span>Proceed to Verification Gate (Step 5)</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            className="w-full h-10 bg-[#ffffff] border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
            onClick={onPrev}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Back to AI Extraction Pipeline (Step 3)</span>
          </button>
        </div>

        {/* Cryptographic Audit Footer */}
        <div className="pt-2 text-center space-y-0.5 font-mono text-[10px] text-[#737784]">
          <p>SESSION_ID: 884-MED-0941 • ENCRYPTION: AES-256 GCM</p>
          <p>MedLens AI Clinical Precision Engine • v4.12.0-MVP</p>
        </div>
      </section>

      {/* Edit Value Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0b1c30]">Edit Analyte Value</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#434653] hover:text-black"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="text-xs text-[#434653] block mb-1">
                Override Extracted Value for {selectedAnalyte.name} ({selectedAnalyte.unit}):
              </label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full h-10 px-3 border border-[#cbd5e1] rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0f52ba]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#434653] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedAnalyte.value = editValue;
                  setShowEditModal(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0f52ba] text-white hover:bg-[#003c90]"
              >
                Save Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
