import React from 'react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">account_tree</span>
            <div>
              <h3 className="font-semibold text-sm text-[#0b1c30]">Institutional Audit Trail</h3>
              <p className="text-xs text-[#434653] font-mono">Chain of Custody #ARC-884920-OCT24</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#434653] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Audit Timeline */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 ring-4 ring-emerald-100" />
            <div className="flex-1 min-w-0 bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30]">PDF Document Ingest & SHA Integrity</span>
                <span className="font-mono text-[10px] text-[#737784]">10:12:04 AM</span>
              </div>
              <p className="text-[#434653] mt-1">File: cbc_panel_pt884920.pdf (1.4 MB). Checksum verified against cold EHR immutable ledger.</p>
              <span className="font-mono text-[10px] text-[#003c90] bg-[#e5eeff] px-1.5 py-0.5 rounded mt-2 inline-block">
                SHA: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006398] mt-1 shrink-0 ring-4 ring-sky-100" />
            <div className="flex-1 min-w-0 bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30]">Optical OCR Raster & Token Extraction</span>
                <span className="font-mono text-[10px] text-[#737784]">10:13:18 AM</span>
              </div>
              <p className="text-[#434653] mt-1">BioBERT-NLP v4.2 isolated 18 analyte tokens with coordinate geometry boundaries. Confidence 99.4%.</p>
              <span className="font-mono text-[10px] text-[#006398] bg-[#eff4ff] px-1.5 py-0.5 rounded mt-2 inline-block">
                SYS_04 Sysmex XN-9000 Calibrated
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#003c90] mt-1 shrink-0 ring-4 ring-blue-100" />
            <div className="flex-1 min-w-0 bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30]">Clinician-in-the-Loop Signatures</span>
                <span className="font-mono text-[10px] text-[#737784]">10:15:33 AM</span>
              </div>
              <p className="text-[#434653] mt-1">Dr. S. Jenkins, MD (License #MD-94021-CAL) reviewed out-of-range delta and certified reference interval bounds.</p>
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-2 inline-block font-semibold">
                HITL Attestation Seal #884-MD Valid
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#344256] mt-1 shrink-0 ring-4 ring-slate-200" />
            <div className="flex-1 min-w-0 bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0b1c30]">21 CFR § 820 & HIPAA Compliance Attestation</span>
                <span className="font-mono text-[10px] text-[#737784]">10:16:02 AM</span>
              </div>
              <p className="text-[#434653] mt-1">Cryptographic key committed to permanent EHR queue under AES-256 GCM vault.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#e2e8f0] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737784]">
            Archive ID: ARC-884920-OCT24
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0f52ba] text-white text-xs font-semibold hover:bg-[#003c90] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
