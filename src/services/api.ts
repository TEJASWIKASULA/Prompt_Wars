/**
 * MedLens AI Client Service Layer
 * Interfaces with server-side Gemini 3.8 Flash API endpoints and FHIR engine
 */

import { PatientInfo, LabAnalyte } from '../types';

export interface HealthStatus {
  status: string;
  hasApiKey: boolean;
  geminiModel: string;
  timestamp: string;
}

export interface ScenarioItem {
  id: string;
  title: string;
  subtitle: string;
  patient: PatientInfo;
  sampleDocument: string;
  analyteCount: number;
}

export interface AnalyzeLabParams {
  documentText?: string;
  fileBase64?: string;
  mimeType?: string;
  patient: PatientInfo;
  scenarioId?: string;
}

export interface AnalyzeLabResponse {
  success: boolean;
  source: 'gemini_ai' | 'curated_scenario' | 'curated_fallback';
  aiProcessed: boolean;
  specimenId: string;
  collectionDate: string;
  documentType: string;
  triageSummary: string;
  analytes: LabAnalyte[];
  patientUpdate?: PatientInfo;
  errorMsg?: string;
}

export interface ClinicalSynthesisResponse {
  success: boolean;
  aiGenerated: boolean;
  primaryImpression: string;
  longitudinalTrajectory: string;
  differentialConsiderations: string;
  drugInteractions: string;
  recommendedOrders: Array<{
    id: string;
    title: string;
    code: string;
    checked: boolean;
  }>;
}

export interface CopilotResponse {
  success: boolean;
  answer: string;
  aiGenerated: boolean;
}

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      hasApiKey: false,
      geminiModel: 'gemini-3.8-flash',
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchScenarios(): Promise<ScenarioItem[]> {
  try {
    const res = await fetch('/api/scenarios');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.scenarios || [];
  } catch (err) {
    console.warn('Using local fallback scenarios', err);
    return [];
  }
}

export async function analyzeLabReport(params: AnalyzeLabParams): Promise<AnalyzeLabResponse> {
  const res = await fetch('/api/analyze-lab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error(`Analysis failed with HTTP status ${res.status}`);
  }

  return await res.json();
}

export async function fetchClinicalSynthesis(
  patient: PatientInfo,
  analytes: LabAnalyte[]
): Promise<ClinicalSynthesisResponse> {
  const res = await fetch('/api/clinical-synthesis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient, analytes })
  });

  if (!res.ok) {
    throw new Error(`Clinical synthesis failed with HTTP ${res.status}`);
  }

  return await res.json();
}

export async function askClinicalCopilot(
  question: string,
  patient: PatientInfo,
  analytes: LabAnalyte[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<CopilotResponse> {
  const res = await fetch('/api/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, patient, analytes, conversationHistory })
  });

  if (!res.ok) {
    throw new Error(`Clinical copilot query failed with HTTP ${res.status}`);
  }

  return await res.json();
}

export async function exportFhirBundle(
  patient: PatientInfo,
  analytes: LabAnalyte[]
): Promise<any> {
  const res = await fetch('/api/fhir-export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient, analytes })
  });

  if (!res.ok) {
    throw new Error(`FHIR export failed with HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.bundle;
}
