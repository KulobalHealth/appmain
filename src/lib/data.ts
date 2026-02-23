export interface MedicalCondition {
  id: number;
  condition: string;
  dateRecorded: string;
  remarks: string;
}

export interface Allergy {
  id: number;
  allergy: string;
  severity: "Mild" | "Moderate" | "Severe";
  dateRecorded: string;
  remarks: string;
}

export interface Medication {
  id: number;
  name: string;
  category: string;
  type: string;
  brand: string;
  prescribedBy: string;
  dosage: string;
  route: string;
  dateStarted: string;
  dateEnded?: string;
  status: "Active" | "Discontinued" | "Completed";
}

export interface TestResult {
  id: number;
  testName: string;
  category: string;
  result: string;
  normalRange?: string;
  units?: string;
  date: string;
  orderedBy: string;
  remarks?: string;
}

export interface VitalSign {
  id: number;
  date: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodSugar?: number;
  recordedBy: string;
}

export interface Patient {
  id: number;
  name: string;
  telephone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  status: "active" | "inactive";
  needsRefill: boolean;
  medicalConditions?: MedicalCondition[];
  allergies?: Allergy[];
  medications?: Medication[];
  testHistory?: TestResult[];
  vitalSigns?: VitalSign[];
}

export const patients: Patient[] = []
