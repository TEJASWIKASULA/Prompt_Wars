import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../../data/mockData';
import { PatientInfo } from '../../types';

export interface UploadedDocPayload {
  fileName: string;
  fileBase64?: string;
  mimeType?: string;
  documentText?: string;
  scenarioId?: string;
  previewUrl?: string;
}

interface Stage2UploadProps {
  patient: PatientInfo;
  onNext: (payload?: UploadedDocPayload) => void;
  onPrev: () => void;
  currentPayload?: UploadedDocPayload | null;
}

export const Stage2Upload: React.FC<Stage2UploadProps> = ({
  patient,
  onNext,
  onPrev,
  currentPayload
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'text'>('upload');
  const [stagedDoc, setStagedDoc] = useState<string | null>(
    currentPayload?.fileName || 'CBC_Differential_Report_Oct2024.pdf'
  );
  const [fileBase64, setFileBase64] = useState<string | undefined>(currentPayload?.fileBase64);
  const [mimeType, setMimeType] = useState<string | undefined>(currentPayload?.mimeType);
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentPayload?.previewUrl || ASSETS.docScan1
  );
  const [rawText, setRawText] = useState<string>(currentPayload?.documentText || '');
  const [dragOver, setDragOver] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('cbc-anemia');

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. Please browse a file or use preset reports.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setFileBase64(dataUrl);
      setMimeType('image/jpeg');
      setPreviewUrl(dataUrl);
      setStagedDoc(`Camera_Scan_${new Date().toISOString().slice(11, 19).replace(/:/g, '-')}.jpg`);
      stopCamera();
      setActiveTab('upload');
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileBase64(result);
      setMimeType(file.type || 'image/png');
      if (file.type.startsWith('image/')) {
        setPreviewUrl(result);
      } else {
        setPreviewUrl(ASSETS.docScan1);
      }
      setStagedDoc(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleScenarioPick = (
    scenarioId: string,
    title: string,
    preview: string,
    sampleText?: string
  ) => {
    setSelectedScenarioId(scenarioId);
    setStagedDoc(title);
    setPreviewUrl(preview);
    setFileBase64(undefined);
    setMimeType(undefined);
    if (sampleText) {
      setRawText(sampleText);
    }
  };

  const handleAnalyze = () => {
    const payload: UploadedDocPayload = {
      fileName: stagedDoc || 'Lab_Report.pdf',
      fileBase64,
      mimeType,
      documentText: activeTab === 'text' ? rawText : undefined,
      scenarioId: selectedScenarioId,
      previewUrl
    };
    onNext(payload);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-4">
      {/* Patient Header Context Strip */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] shadow-xs rounded-xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#003c90] text-[20px] shrink-0">badge</span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#0b1c30] font-bold truncate">
                {patient.name || patient.pid}
              </span>
              <span className="text-xs text-[#434653]">
                Record: {patient.pid} • {patient.sex}, {patient.age}y • Inpatient Lab Intake
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="bg-[#e5eeff] px-2 py-0.5 rounded text-[10px] font-semibold text-[#00476e] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#006398]">person</span>
              PATIENT PROVIDED
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9]">
          <div className="inline-flex items-center gap-1 bg-[#dce9ff] text-[#00419c] px-2 py-0.5 rounded font-mono text-[10px] font-bold">
            <span className="material-symbols-outlined text-[13px] text-[#0f52ba]">security</span>
            PII SCRUBBER ACTIVE
          </div>
          <span className="font-mono text-[11px] text-[#737784]">LOC: {patient.roomLoc}</span>
        </div>
      </div>

      {/* Page Headline & Pipeline Metadata */}
      <div className="flex flex-col px-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-[#003c90] uppercase font-bold tracking-wider">
            Step 02 / Diagnostics Intake
          </span>
          <span className="text-[#c3c6d5] font-mono text-[11px]">•</span>
          <span className="font-mono text-[11px] text-[#434653] font-medium">Gemini 3.8 Flash Multimodal OCR</span>
        </div>
        <h2 className="text-xl font-bold text-[#0b1c30]">Upload Medical Report</h2>
        <p className="text-xs text-[#434653] mt-0.5">
          Provide a laboratory PDF, photo scan, or paste raw clinical text for AI parameter extraction with spatial provenance.
        </p>
      </div>

      {/* Hackathon Preset Quick Pick Strip */}
      <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#003c90]">
            <span className="material-symbols-outlined text-[17px]">science</span>
            <span>Hackathon Quick-Pick Reports</span>
          </div>
          <span className="font-mono text-[10px] text-[#434653]">Instant Test Scenarios</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() =>
              handleScenarioPick(
                'cbc-anemia',
                'CBC_Differential_Report_Oct2024.pdf',
                ASSETS.docScan1,
                'COMPLETE BLOOD COUNT WITH DIFFERENTIAL\nHemoglobin: 11.2 g/dL (Ref: 12.0 - 15.5) [LOW]\nWBC: 7.4 x10^3/uL (Ref: 4.5 - 11.0) [NORMAL]\nPlatelet Count: 250 x10^3/uL (Ref: 150 - 450) [NORMAL]\nMean Platelet Volume (MPV): 11.8 fL (Reference range omitted in raw report)'
              )
            }
            className={`p-2 rounded-lg text-left border text-xs transition-all ${
              selectedScenarioId === 'cbc-anemia'
                ? 'bg-white border-[#0f52ba] shadow-xs ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90] truncate">A: CBC & Diff (Anemia)</div>
            <div className="text-[11px] text-[#434653]">Hgb 11.2 • MPV 11.8</div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleScenarioPick(
                'sepsis-leukocytosis',
                'STAT_Inpatient_CBC_Differential.pdf',
                ASSETS.docScan2,
                'STAT EMERGENCY ENCOUNTER LABS\nWBC: 18.6 x10^3/uL (Ref: 4.5 - 11.0) [HIGH]\nAbsolute Neutrophils: 14.2 x10^3/uL (Ref: 1.8 - 7.7) [HIGH]\nBands: 14% (Ref: 0 - 5%) [HIGH]\nPlatelets: 135 x10^3/uL (Ref: 150 - 450) [LOW]\nSerum Lactate: 3.2 mmol/L (Ref: 0.5 - 2.0) [HIGH]'
              )
            }
            className={`p-2 rounded-lg text-left border text-xs transition-all ${
              selectedScenarioId === 'sepsis-leukocytosis'
                ? 'bg-white border-[#0f52ba] shadow-xs ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90] truncate">B: Sepsis / STAT Panel</div>
            <div className="text-[11px] text-[#434653]">WBC 18.6 • Lactate 3.2</div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleScenarioPick(
                'metabolic-renal',
                'Comprehensive_Metabolic_Panel_CMP.pdf',
                ASSETS.docScan1,
                'COMPREHENSIVE METABOLIC PANEL (CMP)\nPotassium (K+): 5.4 mEq/L (Ref: 3.5 - 5.0) [HIGH]\nSerum Creatinine: 1.9 mg/dL (Ref: 0.7 - 1.3) [HIGH]\neGFR: 38 mL/min/1.73m2 (Ref: > 60) [LOW]\nFasting Glucose: 194 mg/dL (Ref: 70 - 99) [HIGH]'
              )
            }
            className={`p-2 rounded-lg text-left border text-xs transition-all ${
              selectedScenarioId === 'metabolic-renal'
                ? 'bg-white border-[#0f52ba] shadow-xs ring-1 ring-[#0f52ba]'
                : 'bg-white/70 border-[#dce9ff] hover:bg-white'
            }`}
          >
            <div className="font-bold text-[#003c90] truncate">C: CMP & Renal Panel</div>
            <div className="text-[11px] text-[#434653]">K+ 5.4 • Creatinine 1.9</div>
          </button>
        </div>
      </div>

      {/* Input Method Switcher Tabs */}
      <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff]">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            setActiveTab('upload');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-[#003c90] shadow-xs'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('camera');
            startCamera();
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'camera'
              ? 'bg-white text-[#003c90] shadow-xs'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          <span>Camera Scan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stopCamera();
            setActiveTab('text');
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'text'
              ? 'bg-white text-[#003c90] shadow-xs'
              : 'text-[#434653] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">notes</span>
          <span>Paste Text</span>
        </button>
      </div>

      {/* TAB 1: File Upload / Drag & Drop */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0]);
            }
          }}
          className={`bg-[#ffffff] border-2 ${
            dragOver ? 'border-[#0f52ba] bg-[#eff4ff]' : 'border-dashed border-[#c3c6d5]'
          } rounded-xl shadow-xs p-5 flex flex-col items-center text-center relative overflow-hidden transition-all`}
        >
          <div className="w-14 h-14 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0f52ba] mb-2 shadow-inner">
            <span className="material-symbols-outlined text-[30px] material-symbols-fill">
              document_scanner
            </span>
          </div>

          <h3 className="text-base font-semibold text-[#0b1c30]">Drop your report here</h3>
          <span className="text-xs text-[#434653] my-1">or select from your device</span>

          <div className="flex gap-2 w-full max-w-xs mt-1">
            <label className="flex-1 bg-[#0f52ba] hover:bg-[#003c90] text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] transition-all">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              <span>Browse Files</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <button
              className="bg-[#e5eeff] hover:bg-[#dce9ff] text-[#003c90] text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 active:bg-[#d3e4fe] transition-colors"
              type="button"
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
            >
              <span className="material-symbols-outlined text-[18px] text-[#0f52ba]">photo_camera</span>
              <span>Scan</span>
            </button>
          </div>

          <div className="mt-3 pt-2 w-full flex flex-col items-center gap-1 border-t border-[#f1f5f9]">
            <span className="inline-flex items-center gap-1 text-[#434653] font-mono text-[10px] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[13px]">attachment</span>
              Supported: PDF, JPG, PNG • Max 25MB
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: Live Camera Feed */}
      {activeTab === 'camera' && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs p-4 flex flex-col items-center gap-3">
          <div className="w-full relative bg-slate-900 rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Document Guide Overlay */}
            <div className="absolute inset-6 border-2 border-dashed border-white/80 rounded-lg pointer-events-none flex items-center justify-center">
              <span className="bg-black/60 text-white text-[11px] font-mono px-3 py-1 rounded">
                Align lab document within frame
              </span>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/90 text-white p-4 flex flex-col items-center justify-center text-center text-xs">
                <span className="material-symbols-outlined text-[32px] text-amber-400 mb-2">
                  videocam_off
                </span>
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-3 px-3 py-1.5 bg-[#0f52ba] rounded-lg text-xs font-semibold"
                >
                  Retry Camera
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={capturePhoto}
              disabled={!isCameraActive}
              className="flex-1 bg-[#0f52ba] hover:bg-[#003c90] disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">camera</span>
              <span>Capture Frame</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab('upload');
              }}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs text-[#434653] font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Raw Text Paste */}
      {activeTab === 'text' && (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0b1c30]">Paste Raw Laboratory Output</span>
            <button
              type="button"
              onClick={() =>
                setRawText(
                  'COMPREHENSIVE LAB PANEL\nHemoglobin: 11.2 g/dL (Normal: 12.0 - 15.5)\nWBC Count: 7.4 x10^3/uL (Normal: 4.5 - 11.0)\nPlatelets: 250 x10^3/uL (Normal: 150 - 450)\nMPV: 11.8 fL (No reference range provided)'
                )
              }
              className="text-[11px] text-[#003c90] font-semibold hover:underline"
            >
              Load Sample Text
            </button>
          </div>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setStagedDoc('Pasted_Lab_Transcript.txt');
            }}
            placeholder="Paste text from EHR, lab report, or diagnostic machine..."
            className="w-full p-3 font-mono text-xs bg-[#eff4ff] border border-[#dce9ff] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f52ba]"
          />
          <span className="text-[10px] text-[#737784]">
            Gemini 3.8 Flash will structure analytes, units, LOINC codes, and flags directly from the text.
          </span>
        </div>
      )}

      {/* Optical Capture Preview & Pre-flight Diagnostics */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#003c90]">visibility</span>
            <span className="text-xs text-[#0b1c30] font-semibold">Optical Capture Preview</span>
          </div>
          <span className="font-mono text-[10px] bg-[#cce5ff] text-[#001d31] font-bold px-2 py-0.5 rounded">
            PAGE 1/2
          </span>
        </div>

        {/* Preview Media Slot & OCR Scan overlay */}
        <div className="relative w-full h-36 bg-[#dce9ff] rounded-lg overflow-hidden flex items-center justify-center border border-[#e2e8f0]">
          <img
            src={previewUrl}
            alt="Scanned Lab Document"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Scan line simulation */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#0f52ba] shadow-[0_0_8px_rgba(15,82,186,0.8)] opacity-90 animate-pulse" />

          {/* Specimen ID overlay */}
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-1 rounded shadow-xs flex items-center gap-1 border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[13px] text-[#003c90]">qr_code_2</span>
            <span className="font-mono text-[10px] font-bold text-[#0b1c30]">
              Specimen ID: 0941-LAB-HEMATO
            </span>
          </div>

          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-[#003c90] font-bold border border-[#e2e8f0]">
            READY FOR GEMINI
          </div>
        </div>

        {/* Pre-flight Metric Counters */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#eff4ff] border border-[#dce9ff] p-2 rounded-lg flex flex-col">
            <span className="text-[10px] font-semibold text-[#434653] uppercase">Confidence</span>
            <span className="font-mono text-base text-[#003c90] font-bold">99.4%</span>
            <span className="font-mono text-[10px] text-[#006398]">High fidelity</span>
          </div>
          <div className="bg-[#eff4ff] border border-[#dce9ff] p-2 rounded-lg flex flex-col">
            <span className="text-[10px] font-semibold text-[#434653] uppercase">AI Engine</span>
            <span className="font-mono text-base text-[#0b1c30] font-bold">Gemini 3.8</span>
            <span className="font-mono text-[10px] text-[#434653]">Flash Multimodal</span>
          </div>
          <div className="bg-[#eff4ff] border border-[#dce9ff] p-2 rounded-lg flex flex-col">
            <span className="text-[10px] font-semibold text-[#434653] uppercase">Ontology</span>
            <span className="font-mono text-sm text-[#0b1c30] font-bold mt-0.5">LOINC</span>
            <span className="font-mono text-[10px] text-[#434653]">Standard v2.74</span>
          </div>
        </div>
      </div>

      {/* Staged For Processing Card */}
      {stagedDoc ? (
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xs p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0b1c30]">Staged Document</span>
            <span className="font-mono text-[10px] text-[#003c90] bg-[#d9e2ff] px-2 py-0.5 rounded font-bold">
              1 READY
            </span>
          </div>

          <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  {stagedDoc.endsWith('.txt') ? 'description' : 'picture_as_pdf'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[#0b1c30] truncate">
                    {stagedDoc}
                  </span>
                  <button
                    aria-label="Remove document"
                    className="text-[#434653] hover:text-[#ba1a1a] p-1 transition-colors"
                    type="button"
                    onClick={() => {
                      setStagedDoc(null);
                      setFileBase64(undefined);
                      setRawText('');
                    }}
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="bg-[#ffffff] text-[#434653] font-mono text-[10px] px-1 rounded border border-[#dce9ff]">
                    SHA: e3b0c4...8b9a
                  </span>
                  <span className="text-[11px] text-[#434653]">Ready</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 bg-[#ffffff] text-[#003c90] font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[13px] text-[#0f52ba]">check_circle</span>
                Virus scan passed
              </span>
              <span className="inline-flex items-center gap-1 bg-[#ffffff] text-[#434653] font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[13px] text-[#006398]">tune</span>
                300 DPI Raster Extractor
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          No document currently staged. Please drop or browse a PDF report above, or{' '}
          <button
            className="underline font-bold"
            onClick={() => setStagedDoc('CBC_Differential_Report_Oct2024.pdf')}
          >
            restore default sample report
          </button>.
        </div>
      )}

      {/* Primary CTAs */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          className="w-full bg-[#0f52ba] hover:bg-[#003c90] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          type="button"
          onClick={handleAnalyze}
        >
          <span className="material-symbols-outlined text-[20px]">psychology</span>
          <span>Analyze Report with Gemini AI</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          className="w-full bg-[#ffffff] hover:bg-[#eff4ff] text-[#434653] border border-[#e2e8f0] text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          onClick={onPrev}
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">arrow_back</span>
          <span>Back to Patient Info</span>
        </button>
      </div>
    </div>
  );
};
