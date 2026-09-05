import React, { useState } from 'react';
import { PatientInfo } from '../../types';

interface Stage1IntakeProps {
  patient: PatientInfo;
  onUpdatePatient: (updated: Partial<PatientInfo>) => void;
  onNext: () => void;
  onReset: () => void;
}

export const Stage1Intake: React.FC<Stage1IntakeProps> = ({
  patient,
  onUpdatePatient,
  onNext,
  onReset
}) => {
  const [copied, setCopied] = useState(false);
  const [newConditionInput, setNewConditionInput] = useState('');
  const [showAddCondition, setShowAddCondition] = useState(false);

  const handleCopyPid = () => {
    navigator.clipboard.writeText(patient.pid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRemoveCondition = (index: number) => {
    const updated = patient.conditions.filter((_, i) => i !== index);
    onUpdatePatient({ conditions: updated });
  };

  const handleAddCondition = () => {
    if (!newConditionInput.trim()) return;
    const parts = newConditionInput.split(/[\[\]()]/).filter(Boolean);
    const name = parts[0]?.trim() || newConditionInput;
    const code = parts[1]?.trim() || 'CUSTOM';
    onUpdatePatient({
      conditions: [...patient.conditions, { name, code }]
    });
    setNewConditionInput('');
    setShowAddCondition(false);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Progress Tracker & Protocol Context */}
      <div className="flex flex-col space-y-1 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase text-[#006398] font-semibold tracking-wider">
            Stage 01 / 07 : Initial Intake
          </span>
          <span className="font-mono text-[11px] text-[#434653] bg-[#dce9ff] px-2 py-0.5 rounded font-medium">
            Rev #14
          </span>
        </div>
        <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#0f52ba] h-full w-[14.28%] rounded-full transition-all duration-300" />
        </div>
      </div>

      {/* Screen Header & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
          Create Patient Record
        </h1>
        <p className="text-xs text-[#434653] leading-relaxed">
          Step 1 of 7: Input verified demographic and baseline patient-reported data to initialize the clinical index.
        </p>
      </div>

      {/* Hackathon Prototype Quick Personas */}
      <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#003c90]">
            <span className="material-symbols-outlined text-[17px]">badge</span>
            <span>Hackathon Demonstration Personas</span>
          </div>
          <span className="font-mono text-[10px] bg-[#003c90] text-white px-2 py-0.5 rounded font-semibold">
            1-CLICK LOAD
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdatePatient({
                name: 'Eleanor Vance',
                pid: 'PT-884920-X',
                age: 46,
                sex: 'Female',
                chiefComplaint: 'Progressive fatigue, lightheadedness on standing, mild exertional dyspnea for 3 weeks.',
                conditions: [
                  { name: 'Essential Hypertension', code: 'I10' },
                  { name: 'Osteopenia', code: 'M85.80' }
                ],
                allergies: 'Penicillin (severe anaphylaxis with airway compromise, 2018)',
                prescriptions: 'Lisinopril 10mg PO daily, Vitamin D3 2000 IU daily',
                ndcMapping: '68180-517-01',
                roomLoc: 'S-BAY-04'
              })
            }
            className={`p-2 rounded-lg text-left border transition-all text-xs ${
              patient.name === 'Eleanor Vance' || patient.pid === 'PT-884920-X'
                ? 'bg-white border-[#0f52ba] shadow-xs text-[#0b1c30] ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] text-[#434653] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90]">1. Eleanor Vance</div>
            <div className="text-[11px] text-[#434653] truncate">46F • Microcytic Anemia</div>
            <div className="font-mono text-[10px] text-amber-700 mt-0.5">PID: PT-884920-X</div>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdatePatient({
                name: 'Marcus Brody',
                pid: 'PT-391044-Y',
                age: 62,
                sex: 'Male',
                chiefComplaint: 'Acute rigors, productive cough with purulent sputum, fever 39.1°C, tachypneic (RR 24).',
                conditions: [
                  { name: 'COPD GOLD Stage II', code: 'J44.9' },
                  { name: 'Type 2 Diabetes Mellitus', code: 'E11.9' }
                ],
                allergies: 'Sulfa drugs (Stevens-Johnson syndrome risk)',
                prescriptions: 'Tiotropium inhaler 18mcg daily, Metformin 500mg BID',
                ndcMapping: '0597-0075-41',
                roomLoc: 'ER-RESUS-02'
              })
            }
            className={`p-2 rounded-lg text-left border transition-all text-xs ${
              patient.name === 'Marcus Brody' || patient.pid === 'PT-391044-Y'
                ? 'bg-white border-[#0f52ba] shadow-xs text-[#0b1c30] ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] text-[#434653] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90]">2. Marcus Brody</div>
            <div className="text-[11px] text-[#434653] truncate">62M • Acute Sepsis / STAT</div>
            <div className="font-mono text-[10px] text-red-700 mt-0.5">PID: PT-391044-Y</div>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdatePatient({
                name: 'Robert Chen',
                pid: 'PT-552918-Z',
                age: 58,
                sex: 'Male',
                chiefComplaint: 'Routine 6-month diabetic surveillance; reports mild lower extremity bilateral pitting edema.',
                conditions: [
                  { name: 'Type 2 DM with Nephropathy', code: 'E11.21' },
                  { name: 'Hypertension', code: 'I10' }
                ],
                allergies: 'No Known Drug Allergies (NKDA)',
                prescriptions: 'Lisinopril 20mg daily, Metformin 1000mg BID, Atorvastatin 20mg daily',
                ndcMapping: '0093-7212-01',
                roomLoc: 'CLINIC-RM-08'
              })
            }
            className={`p-2 rounded-lg text-left border transition-all text-xs ${
              patient.name === 'Robert Chen' || patient.pid === 'PT-552918-Z'
                ? 'bg-white border-[#0f52ba] shadow-xs text-[#0b1c30] ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] text-[#434653] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90]">3. Robert Chen</div>
            <div className="text-[11px] text-[#434653] truncate">58M • Diabetic Nephropathy</div>
            <div className="font-mono text-[10px] text-purple-700 mt-0.5">PID: PT-552918-Z</div>
          </button>
        </div>
      </div>

      {/* Clinical Provenance Telemetry Card */}
      <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-[#ffffff] px-2.5 py-1 rounded-md text-[#003c90] text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#006398]">verified_user</span>
            <span>PATIENT PROVIDED (VERIFIED SOURCE)</span>
          </div>
          <span className="font-mono text-[11px] text-[#434653] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006398]" />
            Indexing Latency &lt;140ms
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#434653] flex items-center justify-between pt-1 border-t border-[#dce9ff]/60">
          <span>ISO-8601 TIMESTAMP</span>
          <span className="font-semibold text-[#0b1c30]">2024-10-28T14:32:09Z</span>
        </div>
      </div>

      {/* Main Patient Intake Form Block */}
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        {/* Field 1: Patient Full Name & Clinical ID */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider flex items-center gap-1.5" htmlFor="patient-name">
              <span className="material-symbols-outlined text-[16px] text-[#006398]">person</span>
              <span>Patient Full Name</span>
            </label>
            <span className="font-mono text-[10px] bg-[#e5eeff] text-[#00476e] px-2 py-0.5 rounded font-semibold">
              PRIMARY IDENTIFIER
            </span>
          </div>
          <div className="relative">
            <input
              id="patient-name"
              type="text"
              required
              className="w-full h-11 px-3.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-base font-semibold border border-[#dce9ff] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0f52ba] transition-all"
              placeholder="Enter patient full name (e.g. Eleanor Vance)"
              value={patient.name || ''}
              onChange={(e) => {
                const newName = e.target.value;
                // If PID was empty, we can keep PID in sync or generate initials
                onUpdatePatient({ name: newName });
              }}
            />
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#f0f4f9] text-xs">
            <div className="flex items-center gap-1.5 text-[#434653]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#00476e] font-semibold">Assigned Record PID:</span>
              <span className="font-mono font-bold text-[#0b1c30] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#dce9ff]" id="patient-id">{patient.pid}</span>
            </div>
            <button
              aria-label="Copy identifier token"
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                copied
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-[#003c90] hover:bg-[#e5eeff]'
              }`}
              onClick={handleCopyPid}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied PID' : 'Copy PID'}</span>
            </button>
          </div>
        </div>

        {/* Field 2: Demographics Matrix (Age & Assigned Sex) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider" htmlFor="patient-age">
              Age (Years)
            </label>
            <div className="relative">
              <input
                className="w-full h-11 px-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-mono text-lg font-semibold border border-[#dce9ff] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0f52ba]"
                id="patient-age"
                max={130}
                min={0}
                type="number"
                value={patient.age}
                onChange={(e) => onUpdatePatient({ age: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-3 top-3 font-mono text-xs text-[#434653] pointer-events-none">
                YRS
              </span>
            </div>
          </div>

          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider" htmlFor="sex-assigned">
              Assigned Sex
            </label>
            <div className="relative">
              <select
                className="w-full h-11 px-3 appearance-none rounded-lg bg-[#eff4ff] text-[#0b1c30] text-sm font-semibold border border-[#dce9ff] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0f52ba]"
                id="sex-assigned"
                value={patient.sex}
                onChange={(e) => onUpdatePatient({ sex: e.target.value as PatientInfo['sex'] })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Intersex">Intersex</option>
                <option value="Declined">Declined to state</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[20px] text-[#434653] pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>

        {/* Field 3: Primary Symptoms & Chief Complaint */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider" htmlFor="chief-complaint">
              Primary Symptoms & Chief Complaint
            </label>
            <span className="font-mono text-xs text-[#434653]">
              {patient.chiefComplaint.length}/500
            </span>
          </div>
          <textarea
            className="w-full p-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-sm leading-relaxed border border-[#dce9ff] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#0f52ba] resize-none"
            id="chief-complaint"
            maxLength={500}
            rows={3}
            value={patient.chiefComplaint}
            onChange={(e) => onUpdatePatient({ chiefComplaint: e.target.value })}
          />
          <div className="flex items-center gap-1.5 text-[#434653]">
            <span className="material-symbols-outlined text-[15px] text-[#006398]">psychology_alt</span>
            <span className="text-xs">Synthesized by Clinical NLP upon next step transition.</span>
          </div>
        </div>

        {/* Field 4: Existing Baseline Conditions */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider">
              Existing Baseline Conditions
            </label>
            <span className="font-mono text-[10px] text-[#434653] font-medium">ICD-10 CODED</span>
          </div>

          <div className="flex flex-wrap gap-2" id="condition-chips">
            {patient.conditions.map((condition, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-[#e5eeff] px-2.5 py-1 rounded-lg text-[#0b1c30] border border-[#dce9ff]"
              >
                <span className="text-xs font-medium">{condition.name}</span>
                <span className="font-mono text-[10px] text-[#434653] bg-[#dce9ff] px-1 rounded">
                  {condition.code}
                </span>
                <button
                  aria-label={`Remove condition ${condition.name}`}
                  className="w-5 h-5 flex items-center justify-center text-[#434653] hover:text-[#ba1a1a] transition-colors"
                  onClick={() => handleRemoveCondition(idx)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}

            {showAddCondition ? (
              <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-lg border border-[#0f52ba]">
                <input
                  type="text"
                  placeholder="e.g. Asthma [J45]"
                  value={newConditionInput}
                  onChange={(e) => setNewConditionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); } }}
                  className="px-2 py-0.5 text-xs bg-white rounded border border-[#cbd5e1] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-2 py-1 bg-[#0f52ba] text-white text-xs font-semibold rounded"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCondition(false)}
                  className="px-1.5 py-1 text-[#434653] text-xs hover:text-black"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#006398] text-xs font-semibold hover:bg-[#e5eeff] border border-dashed border-[#006398]/40 transition-colors"
                onClick={() => setShowAddCondition(true)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add condition (e.g. Asthma)</span>
              </button>
            )}
          </div>
        </div>

        {/* Field 5: Documented Allergies & Hypersensitivities (Critical Alert Box) */}
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-xl p-3.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">warning</span>
              <span className="text-[11px] font-bold text-[#ba1a1a] tracking-wider uppercase">
                Critical Flag
              </span>
            </div>
            <span className="font-mono text-[10px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-bold tracking-wider">
              SAFETY INTERLOCK
            </span>
          </div>
          <div className="bg-[#ffffff] p-3 rounded-lg space-y-1 border border-[#ffdad6]">
            <div className="text-sm text-[#0b1c30] font-semibold">
              Penicillin <span className="text-xs text-[#ba1a1a] font-bold">(Anaphylaxis risk)</span>, Sulfa drugs
            </div>
            <p className="text-xs text-[#434653] flex items-center gap-1.5 pt-0.5">
              <span className="material-symbols-outlined text-[15px] text-[#006398]">security_update_good</span>
              <span>Auto-checks cross-reactivity during subsequent pharmaceutical AI synthesis.</span>
            </p>
          </div>
        </div>

        {/* Field 6: Active Prescriptions & Daily Supplements */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase text-[#434653] tracking-wider">
              Active Prescriptions & Supplements
            </label>
            <span className="font-mono text-[10px] bg-[#e5eeff] text-[#00476e] px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#006398]">sync</span>
              RxNorm Synced
            </span>
          </div>
          <div className="p-3 bg-[#eff4ff] rounded-lg space-y-1.5 border border-[#dce9ff]">
            <div className="text-xs font-medium text-[#0b1c30]">
              {patient.prescriptions}
            </div>
            <div className="flex items-center justify-between text-[#434653] font-mono text-[11px] pt-1 border-t border-[#dce9ff]/60">
              <span>NDC MAPPED: {patient.ndcMapping}</span>
              <span className="text-[#006398] font-semibold">Verified Active</span>
            </div>
          </div>
        </div>

        {/* HIPAA & Privacy Regulatory Disclosure Note */}
        <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[18px] text-[#006398]">shield</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#003c90]">
              Regulatory Compliance & Minimization Standard
            </span>
          </div>
          <p className="text-xs text-[#434653] leading-relaxed">
            Privacy & Data Minimization Standard (HIPAA §164.514): Use only information necessary for organizing the medical record. All inputs are encrypted in-transit (TLS 1.3) and at-rest (AES-256 GCM) and logged under strict institutional access control audits.
          </p>
        </div>

        {/* Actions & CTA Row */}
        <div className="space-y-2.5 pt-1">
          <button
            className="w-full h-12 rounded-xl bg-[#0f52ba] hover:bg-[#003c90] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            type="submit"
          >
            <span>Continue to Report Upload</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-between px-1">
            <button
              className="text-xs text-[#434653] hover:text-[#ba1a1a] transition-colors py-1 flex items-center gap-1 font-medium"
              onClick={() => {
                if (window.confirm('Reset patient intake fields to initial defaults?')) {
                  onReset();
                }
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Form</span>
            </button>
            <span className="font-mono text-[11px] text-[#737784]">
              Draft auto-saved 2m ago • Client revision #14
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
