/**
 * MedLens AI Clinical Information System Type Definitions
 */

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PatientInfo {
  name: string;
  pid: string;
  age: number;
  sex: 'Female' | 'Male' | 'Intersex' | 'Declined';
  chiefComplaint: string;
  conditions: Array<{ name: string; code: string }>;
  allergies: string;
  prescriptions: string;
  ndcMapping: string;
  roomLoc: string;
}

export interface LabAnalyte {
  id: string;
  name: string;
  loinc: string;
  value: string;
  numericValue: number;
  unit: string;
  status: 'low' | 'normal' | 'high' | 'unspecified';
  refRange: string;
  refLow?: number;
  refHigh?: number;
  sourceLoc: string;
  boundingBox: [number, number, number, number];
  confidence: number;
  attested: boolean;
  attestedBy?: string;
  attestedTime?: string;
  missingRefRange?: boolean;
  manualRefOverride?: string;
}

export interface OcrTelemetryPoint {
  analyte: string;
  boundingBox: [number, number, number, number];
  confidence: number;
  rawText: string;
  baselineDiff?: string;
}
