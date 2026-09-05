import React from 'react';

interface RawTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RawTelemetryModal: React.FC<RawTelemetryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rawJson = {
    engine: "MedLens-OCR-v4.2.1-Deterministic",
    timestamp: "2024-10-28T14:32:09.114Z",
    confidence_aggregate: 0.994,
    source_file: "CBC_Differential_Report_Oct2024.pdf",
    raster_dpi: 300,
    layers_detected: 2,
    bounding_matrices: [
      {
        analyte: "Hemoglobin",
        bbox: [142, 380, 210, 28],
        raw_token: "Hemoglobin 11.2 L g/dL 12.0 - 15.5",
        confidence: 0.964,
        loinc: "718-7"
      },
      {
        analyte: "WBC Count",
        bbox: [142, 320, 210, 28],
        raw_token: "WBC Count 7.4 x10^3/uL 4.0 - 11.0",
        confidence: 0.991,
        loinc: "6690-2"
      },
      {
        analyte: "Platelets",
        bbox: [142, 440, 210, 28],
        raw_token: "Platelets 250 x10^3/uL 150 - 450",
        confidence: 0.987,
        loinc: "777-3"
      },
      {
        analyte: "MPV",
        bbox: [142, 490, 210, 28],
        raw_token: "Mean Platelet Volume 9.8 fL",
        confidence: 0.912,
        loinc: "32623-1",
        note: "Reference envelope missing in primary source raster"
      }
    ],
    cryptographic_seal: {
      sha256: "8f4b23c91d8a6e01a357f89b9173fec729aa245c",
      institution: "Metropolitan Clinical Laboratories",
      audit_guid: "AUD-202410-8849-B2"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f52ba] text-[20px]">data_object</span>
            <div>
              <h3 className="font-semibold text-sm text-[#0b1c30]">Optical OCR Telemetry & Bounding Data</h3>
              <p className="text-xs text-[#434653] font-mono">Engine: BioBERT-NLP v4.2 • SHA-256 Validated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#434653] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-[#0b1c30] text-[#bcceff] font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap">{JSON.stringify(rawJson, null, 2)}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#e2e8f0] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#434653]">
            ISO-8601: 2024-10-28T14:32:09Z
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(rawJson, null, 2));
                alert('Copied raw OCR JSON telemetry to clipboard!');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#e5eeff] text-[#003c90] text-xs font-semibold hover:bg-[#dce9ff] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#0f52ba] text-white text-xs font-semibold hover:bg-[#003c90] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
