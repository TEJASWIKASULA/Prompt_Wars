import { PatientInfo, LabAnalyte } from '../types';

export const ASSETS = {
  logo: "https://lh3.googleusercontent.com/aida/AEtjO1UDrIKTDgnPf2pzyLkG1Mx5_8bUr8fuhK3Rbc0L-r7z6iNGrxWwBeK3Ss3WjHA-JHrt1AqMBhotb0CxnsyeYKp3zEwKw2lflBpap8uzF_uFttjnBF573I8m98onH8_O8Vaj8lVVhBpx-_myUMvVXh-lgXaKwa5SpkU03PohVZuvPDfP6ECp9M2qCckzGUD97LJvc5Z1zyb3BqQbS0UtJ3GqtLo26I8rFv7BND5PxP4dgBnBmD2Fqt40zhDV",
  doctor: "https://lh3.googleusercontent.com/aida/AEtjO1Uc66-VA2co13F9wjDx9H5_Nw1M_HRxWtoAf7BFXnIlmpC_WIByeOx6CQ4DKI0xw9LW9kTR9WK2rFCM1xebGrQZTWxmEyv2ULwLZI1sg3ZtFN0uU5EG-CpNGJejac_g_7jhNC5TwPJd32osjJtBW1-tMiI2vFWFpFrCN8k65TOt_8WD6kRtenjZMPlTWmWdsadoXk422u-EyyzM6nlvmFz25UHCy7djL_AxpDXo_NiyjaSe3-wT4ZlBYb4",
  docScan1: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmYsmcbPE_1KrpuEehzNK8sJasY4R9k1ZAjUPeIIUB3NuXNCncj1EG1HfTx-9qtI0hfKMUScBPuaoTT8ZXyy5FAZ0EcypVmHGFaJJGFjb5CHja3lsl4loCytCYDe67f2jJ883-_TrH4t3Od92P6IEGHf42-0USpD1x8ZSreYJusn_7TPD5TLIBy-F2MMv5S4nnitWeB7tDDzo9U6Vt2YtJGVWQ6BK0JKVO5JE746h87NoMxKeVHM_kNg",
  docScan2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZZsVcXiCjkqeBao289HEmlnAAGXWz8cTw7sQzrviygSRbURVhp65DNlvPFVf-mmJplK22opPXgjTOMFJqdnzJe9N-LNNTOPLpVWuJBZthB1ageofC0_roI6f5Bxav3GS0BJmiAw0u5YcgvdqvCE2ZJ2ORP1ssip56pTYxXdOx5BHuO_jpCHGcAZ8E3AVMrXO_ul9-V3smBqQHCBfI4uhkmzd-Z5yS59w_7pMC2bWboNRAbihwWHV_PA"
};

export const INITIAL_PATIENT: PatientInfo = {
  name: "Eleanor Vance",
  pid: "PT-884920-X",
  age: 46,
  sex: "Female",
  chiefComplaint: "Fatigue, mild exertional dyspnea for 3 weeks, intermittent dizziness upon standing.",
  conditions: [
    { name: "Hypertension (Stage 1)", code: "I10" },
    { name: "Osteopenia", code: "M85.80" }
  ],
  allergies: "Penicillin (Anaphylaxis risk), Sulfa drugs",
  prescriptions: "Lisinopril 10mg daily, Vitamin D3 2,000 IU daily",
  ndcMapping: "68180-517-01",
  roomLoc: "S-BAY-04"
};

export const DEFAULT_PATIENT = INITIAL_PATIENT;

export const INITIAL_ANALYTES: LabAnalyte[] = [
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    loinc: "718-7",
    value: "11.2",
    numericValue: 11.2,
    unit: "g/dL",
    status: "low",
    refRange: "12.0 - 15.5 g/dL",
    refLow: 12.0,
    refHigh: 15.5,
    sourceLoc: "CBC_Report.pdf • P.2, Row 4",
    boundingBox: [142, 380, 210, 28],
    confidence: 96.4,
    attested: false
  },
  {
    id: "wbc",
    name: "WBC Count",
    loinc: "6690-2",
    value: "7,400",
    numericValue: 7400,
    unit: "/µL",
    status: "normal",
    refRange: "4,000 - 11,000 /µL",
    refLow: 4000,
    refHigh: 11000,
    sourceLoc: "CBC_Report.pdf • P.2, Row 2",
    boundingBox: [142, 320, 210, 28],
    confidence: 99.1,
    attested: true,
    attestedBy: "Dr. S. Jenkins, MD",
    attestedTime: "10:15:33 AM"
  },
  {
    id: "platelets",
    name: "Platelet Count",
    loinc: "777-3",
    value: "250,000",
    numericValue: 250000,
    unit: "/µL",
    status: "normal",
    refRange: "150,000 - 450,000 /µL",
    refLow: 150000,
    refHigh: 450000,
    sourceLoc: "CBC_Report.pdf • P.2, Row 8",
    boundingBox: [142, 440, 210, 28],
    confidence: 98.7,
    attested: false
  },
  {
    id: "mpv",
    name: "Mean Platelet Volume (MPV)",
    loinc: "32623-1",
    value: "9.8",
    numericValue: 9.8,
    unit: "fL",
    status: "unspecified",
    refRange: "Range missing in PDF",
    sourceLoc: "CBC_Report.pdf • P.2, Row 9",
    boundingBox: [142, 490, 210, 28],
    confidence: 91.2,
    missingRefRange: true,
    manualRefOverride: "9.4 - 12.3",
    attested: false
  }
];

export const DEFAULT_ANALYTES = INITIAL_ANALYTES;

