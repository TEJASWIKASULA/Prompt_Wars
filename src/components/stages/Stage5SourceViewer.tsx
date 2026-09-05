import React, { useState } from 'react';
import { PatientInfo, LabAnalyte } from '../../types';

interface Stage5SourceViewerProps {
  patient: PatientInfo;
  analytes: LabAnalyte[];
  onToggleVerifyAnalyte: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Stage5SourceViewer: React.FC<Stage5SourceViewerProps> = ({
  patient,
  analytes,
  onToggleVerifyAnalyte,
  onNext,
  onPrev
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedAnalyteId, setSelectedAnalyteId] = useState('hemoglobin');
  const [verifiedState, setVerifiedState] = useState(false);

  const hgb = analytes.find((a) => a.id === selectedAnalyteId) || analytes[0];

  const handleConfirm = () => {
    onToggleVerifyAnalyte(hgb.id);
    setVerifiedState(true);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Top Context & Step Bar */}
      <div className="flex flex-col gap-2 p-3.5 bg-[#eff4ff] border border-[#dce9ff] rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-[#003c90] text-white rounded font-mono text-[10px] font-bold">
              STAGE 05 / 07
            </span>
            <span className="text-xs text-[#003c90] font-bold uppercase tracking-wider">
              Source Verification
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#ffffff] px-2 py-0.5 rounded border border-[#dce9ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003c90] animate-pulse" />
            <span className="font-mono text-[10px] text-[#434653] font-semibold">BBOX ACTIVE</span>
          </div>
        </div>

        {/* Document Meta Bar */}
        <div className="flex items-center justify-between bg-[#ffffff] p-2.5 rounded-lg border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#003c90] shrink-0">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#0b1c30] truncate">CBC_Report.pdf</span>
              <span className="font-mono text-[10px] text-[#737784]">Page 2 of 2 • 300 DPI</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Zoom Document"
              className="h-8 px-2.5 flex items-center gap-1 bg-[#eff4ff] text-[#003c90] rounded-md text-xs font-semibold hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
              onClick={() => setZoomLevel(100)}
            >
              <span className="material-symbols-outlined text-[15px]">fit_screen</span>
              <span>Fit</span>
            </button>
            <button
              aria-label="Download Document"
              className="w-8 h-8 flex items-center justify-center bg-[#eff4ff] text-[#003c90] rounded-md hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
              onClick={() => alert('Downloading CBC_Report_Page2.pdf from secure vault...')}
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>
        </div>

        {/* Patient & Specimen Sub-strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2.5 py-1 bg-[#dce9ff]/60 rounded text-[11px] font-mono text-[#434653]">
          <span>PT: <strong className="text-[#0b1c30]">{patient.name || patient.pid}</strong> ({patient.pid})</span>
          <span>•</span>
          <span>SPEC: <strong className="text-[#0b1c30]">0941-LAB-HEMATO</strong></span>
          <span>•</span>
          <span>10/24/2024 09:30</span>
        </div>
      </div>

      {/* Document Viewer Stage Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#003c90]">document_scanner</span>
            <span className="text-sm font-bold text-[#0b1c30]">Optical Scan Viewport</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#e5eeff] text-[#003c90] font-bold">
            OCR v2.4 DETECTED
          </span>
        </div>

        {/* Scanned Lab Document Card */}
        <div
          className="relative w-full bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-md overflow-hidden p-3 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Watermark */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-75">
            <span className="material-symbols-outlined text-[14px] text-[#737784]">verified</span>
            <span className="font-mono text-[10px] text-[#434653]">CLIA #49D108924</span>
          </div>

          {/* Scanned Hospital Letterhead */}
          <div className="pb-2 bg-[#eff4ff]/60 p-2 rounded border border-[#dce9ff]/50">
            <p className="font-mono text-[11px] font-bold tracking-tight text-[#0b1c30]">
              METROPOLITAN CLINICAL LABORATORIES • CAP/CLIA ACCREDITED
            </p>
            <p className="font-mono text-[10px] text-[#737784] leading-none mt-0.5">
              AUTOMATED CBC W/ DIFFERENTIAL • SYS_04 [XN-9000]
            </p>
          </div>

          {/* Document Table Simulation with Bounding Box Focus */}
          <div className="mt-2 flex flex-col w-full text-left">
            {/* Table Column Header */}
            <div className="grid grid-cols-12 gap-1 py-1.5 px-2 bg-[#e5eeff] text-[10px] font-bold text-[#434653] uppercase rounded">
              <div className="col-span-5 truncate">ANALYTE</div>
              <div className="col-span-3 text-right">OBSERVED</div>
              <div className="col-span-2 text-right">UNITS</div>
              <div className="col-span-2 text-right truncate">REF</div>
            </div>

            {/* Row: RBC Count */}
            <div
              className="grid grid-cols-12 gap-1 py-1.5 px-2 hover:bg-[#eff4ff] transition-colors rounded cursor-pointer"
              onClick={() => setSelectedAnalyteId('wbc')}
            >
              <div className="col-span-5 text-xs text-[#0b1c30] truncate">RBC Count</div>
              <div className="col-span-3 font-mono text-xs text-right text-[#0b1c30]">4.41</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">x10⁶/uL</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">4.0-5.2</div>
            </div>

            {/* Row: Hemoglobin (ACTIVE TARGET BOUNDING BOX) */}
            <div
              className={`relative my-1 rounded p-1.5 transition-all cursor-pointer ${
                showBoxes
                  ? 'bg-[#dce9ff]/60 border-2 border-[#003c90] shadow-xs'
                  : 'hover:bg-[#eff4ff]'
              }`}
              onClick={() => setSelectedAnalyteId('hemoglobin')}
            >
              {showBoxes && (
                <div className="absolute -top-3 left-1 flex items-center gap-1 bg-[#003c90] text-white px-1.5 py-0.5 rounded shadow-xs">
                  <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                  <span className="font-mono text-[9px] font-bold tracking-tighter">
                    BBOX [142,380,210,28] • 96.4% CONF
                  </span>
                </div>
              )}
              <div className="grid grid-cols-12 gap-1 items-center pt-0.5">
                <div className="col-span-5 text-xs font-bold text-[#003c90] flex items-center gap-1 truncate">
                  <span className="material-symbols-outlined text-[14px] text-[#003c90]">pin_drop</span>
                  <span>Hemoglobin</span>
                </div>
                <div className="col-span-3 text-right flex items-center justify-end gap-1">
                  <span className="font-mono text-xs font-bold text-[#0b1c30]">11.2</span>
                  <span className="px-1 py-0.2 bg-[#ffdad6] text-[#93000a] rounded font-mono text-[9px] font-bold">
                    LOW
                  </span>
                </div>
                <div className="col-span-2 font-mono text-[11px] text-right text-[#434653]">g/dL</div>
                <div className="col-span-2 font-mono text-[11px] text-right text-[#434653]">12.0-15.5</div>
              </div>
            </div>

            {/* Row: Hematocrit */}
            <div className="grid grid-cols-12 gap-1 py-1.5 px-2 hover:bg-[#eff4ff] transition-colors rounded">
              <div className="col-span-5 text-xs text-[#0b1c30] truncate">Hematocrit</div>
              <div className="col-span-3 text-right flex items-center justify-end gap-1">
                <span className="font-mono text-xs text-[#0b1c30]">34.2</span>
                <span className="text-[#ba1a1a] font-mono text-[10px] font-bold">L</span>
              </div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653]">%</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">36.0-46.0</div>
            </div>

            {/* Row: WBC Count */}
            <div
              className="grid grid-cols-12 gap-1 py-1.5 px-2 hover:bg-[#eff4ff] transition-colors rounded cursor-pointer"
              onClick={() => setSelectedAnalyteId('wbc')}
            >
              <div className="col-span-5 text-xs text-[#0b1c30] truncate">WBC Count</div>
              <div className="col-span-3 font-mono text-xs text-right text-[#0b1c30]">7.4</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">x10³/uL</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">4.0-11.0</div>
            </div>

            {/* Row: Platelet Count */}
            <div
              className="grid grid-cols-12 gap-1 py-1.5 px-2 hover:bg-[#eff4ff] transition-colors rounded cursor-pointer"
              onClick={() => setSelectedAnalyteId('platelets')}
            >
              <div className="col-span-5 text-xs text-[#0b1c30] truncate">Platelets</div>
              <div className="col-span-3 font-mono text-xs text-right text-[#0b1c30]">250</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">x10³/uL</div>
              <div className="col-span-2 font-mono text-[11px] text-right text-[#434653] truncate">150-450</div>
            </div>
          </div>
        </div>

        {/* Canvas Navigation & Inspection Toolbar */}
        <div className="flex items-center justify-between bg-[#eff4ff] px-3 py-2 rounded-lg border border-[#dce9ff]">
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous Page"
              className="w-7 h-7 rounded flex items-center justify-center bg-[#ffffff] text-[#0b1c30] hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="font-mono text-xs text-[#0b1c30] font-semibold px-1">Pg 2/2</span>
            <button
              aria-label="Next Page"
              className="w-7 h-7 rounded flex items-center justify-center bg-[#ffffff] text-[#0b1c30] hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Zoom Out"
              className="w-7 h-7 rounded flex items-center justify-center bg-[#ffffff] text-[#0b1c30] hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono text-xs text-[#434653] font-semibold px-1">
              {zoomLevel}%
            </span>
            <button
              aria-label="Zoom In"
              className="w-7 h-7 rounded flex items-center justify-center bg-[#ffffff] text-[#0b1c30] hover:bg-[#dce9ff] transition-colors border border-[#dce9ff]"
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          {/* Bounding Box Toggle */}
          <button
            aria-label="Toggle BBoxes"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold shadow-xs transition-colors ${
              showBoxes
                ? 'bg-[#003c90] text-white'
                : 'bg-[#ffffff] text-[#434653] border border-[#dce9ff]'
            }`}
            onClick={() => setShowBoxes(!showBoxes)}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">
              {showBoxes ? 'visibility' : 'visibility_off'}
            </span>
            <span>{showBoxes ? 'Boxes On' : 'Boxes Off'}</span>
          </button>
        </div>
      </div>

      {/* Extracted Field Traceability Drawer / Card */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#003c90]">track_changes</span>
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30]">Extracted Field Traceability</h2>
              <p className="text-xs text-[#434653]">Optical coordinate lineage with deterministic validation.</p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#dce9ff] text-[#00419c] font-bold rounded">
            AUDIT #8849
          </span>
        </div>

        {/* Active Field Core Spotlight Card */}
        <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-xs border border-[#e2e8f0] gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#434653] tracking-wider">
                Target Analyte
              </span>
              <span className="text-lg font-bold text-[#0b1c30]">{hgb.name}</span>
              <span className="text-xs text-[#434653]">Adult Female Interval: {hgb.refRange}</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="font-mono text-xl font-bold text-[#0b1c30]">{hgb.value}</span>
                <span className="font-mono text-xs text-[#434653]">{hgb.unit}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffdad6] text-[#93000a] rounded text-[10px] font-bold mt-1">
                <span className="material-symbols-outlined text-[12px]">arrow_downward</span>
                BELOW REF INTERVAL
              </span>
            </div>
          </div>

          {/* Lineage Details Table */}
          <div className="flex flex-col bg-[#eff4ff] rounded-lg p-3 gap-2 border border-[#dce9ff] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#434653]">
                <span className="material-symbols-outlined text-[15px] text-[#003c90]">description</span>
                <span>Physical Source</span>
              </div>
              <span className="font-mono text-xs font-semibold text-[#0b1c30]">CBC_Report.pdf</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#434653]">
                <span className="material-symbols-outlined text-[15px] text-[#003c90]">layers</span>
                <span>Document Section</span>
              </div>
              <span className="text-[#0b1c30] font-medium">Page 2, Hematology Panel</span>
            </div>

            {/* Extraction Confidence Bar */}
            <div className="flex flex-col gap-1 py-1 border-t border-[#dce9ff]/60 border-b">
              <div className="flex items-center justify-between">
                <span className="text-[#434653]">Confidence Metric</span>
                <span className="font-mono text-[11px] text-[#003c90] font-bold">
                  {hgb.confidence}% Deterministic
                </span>
              </div>
              <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#003c90] rounded-full" style={{ width: `${hgb.confidence}%` }} />
              </div>
            </div>

            {/* Pixel Coordinates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#434653]">
                <span className="material-symbols-outlined text-[15px] text-[#003c90]">crop</span>
                <span>Coordinate Matrix</span>
              </div>
              <span className="font-mono text-[10px] text-[#0b1c30] bg-[#ffffff] px-2 py-0.5 rounded border border-[#dce9ff]">
                [{hgb.boundingBox.join(', ')}]
              </span>
            </div>

            {/* Verification State */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#434653]">
                <span className="material-symbols-outlined text-[15px] text-[#003c90]">rule</span>
                <span>Verification State</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffffff] border border-[#dce9ff]">
                <span className={`w-2 h-2 rounded-full ${verifiedState || hgb.attested ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-bold text-[#0b1c30]">
                  {verifiedState || hgb.attested ? 'VERIFIED CONGRUENT' : 'NEEDS CONFIRMATION'}
                </span>
              </div>
            </div>
          </div>

          {/* Hardware Instrument Telemetry Card */}
          <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded bg-[#dce9ff] flex items-center justify-center text-[#003c90] shrink-0">
                <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#0b1c30] truncate">
                  Sysmex XN-9000 [SYS_04]
                </span>
                <span className="font-mono text-[10px] text-[#434653]">QC: Passed • Delta: -1.8</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#ffffff] text-[#003c90] rounded font-mono text-[10px] font-bold border border-[#dce9ff] shadow-xs">
              CALIB VALID
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Attestation Actions Strip */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold shadow-xs transition-colors ${
            verifiedState || hgb.attested
              ? 'bg-emerald-700 text-white'
              : 'bg-[#003c90] hover:bg-[#0f52ba] text-white'
          }`}
          onClick={handleConfirm}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{verifiedState || hgb.attested ? 'Value Verified & Attested ✓' : 'Confirm & Verify This Value'}</span>
        </button>

        <button
          className="w-full h-10 flex items-center justify-center gap-1.5 bg-[#ffffff] border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl text-xs font-semibold transition-colors"
          onClick={() => {
            const v = prompt('Enter corrected value for ' + hgb.name, hgb.value);
            if (v) {
              hgb.value = v;
              alert('Updated value to ' + v);
            }
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">edit</span>
          <span>Edit Extracted Value</span>
        </button>

        <button
          className="w-full h-12 mt-1 flex items-center justify-center gap-2 bg-[#0f52ba] hover:bg-[#003c90] text-white rounded-xl text-xs font-bold shadow-md active:scale-[0.99] transition-all cursor-pointer"
          onClick={onNext}
          type="button"
        >
          <span>Proceed to Full Verification Review (Step 6)</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Cryptographic Integrity & Cold Storage Audit Footnote */}
      <div className="flex items-start gap-2 text-[#434653] p-1">
        <span className="material-symbols-outlined text-[16px] text-[#003c90] shrink-0 mt-0.5">verified_user</span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#0b1c30]">Cryptographic Integrity Guaranteed</span>
          <span className="font-mono text-[10px] text-[#737784] break-all">
            SHA-256: 8f4b23c91d8a6e01a357f89b9173fec729aa245c
          </span>
          <span className="text-[11px] text-[#737784] mt-0.5">
            Exact match verified against institutional encrypted cold storage record.
          </span>
        </div>
      </div>
    </div>
  );
};
