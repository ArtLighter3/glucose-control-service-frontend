import {
  CarbsUnit,
  type GlucoseUnit,
  type PatientProfile
} from '@/service/patientProfileService.ts'
import axios from 'axios'

export enum MeasurementType {
  AFTER_MEAL = "После еды",
  BEFORE_MEAL = "До еды"
}

export enum InsulinType {
  LONG = "Пролонгированный",
  SHORT_CARBS = "Компенсирующий",
  SHORT_CORRECTION = "Корректирующий",
  SHORT = "Короткого действия"
}

export enum DiaryEntryType {
  GLUCOSE_ENTRY = "glucose",
  INSULIN_ENTRY = "insulin",
  MEDICATION_ENTRY = "medication",
  CARBS_ENTRY = "carbs"
}

export interface DiaryEntry {
  value: number,
  commitedAt: string,
  notes: string | null
}

export interface GlucoseEntry extends DiaryEntry {
  type: MeasurementType | null
  glucoseUnits: GlucoseUnit | null,
}

export class DefaultGlucoseEntry implements GlucoseEntry {
  commitedAt = "";
  glucoseUnits = null;
  notes = null;
  type = null;
  value = 0.0;
}

export interface InsulinEntry extends DiaryEntry {
  type: InsulinType
}

export class DefaultInsulinEntry implements InsulinEntry {
  commitedAt = "";
  notes = null;
  value = 0.0;
  type = InsulinType.SHORT;
}

export interface MedicationEntry extends DiaryEntry {
  name: string
}

export class DefaultMedicationEntry implements MedicationEntry {
  commitedAt = "";
  notes = null;
  value = 0.0;
  name = "";
}

export interface CarbsEntry extends DiaryEntry {
  carbsUnits: CarbsUnit | null,
}

export class DefaultCarbsEntry implements CarbsEntry {
  commitedAt = "";
  notes = null;
  value = 0.0;
  carbsUnits = null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function postDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  axios.defaults.withCredentials = true;
  return axios.post<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
}

export async function putDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  axios.defaults.withCredentials = true;
  return axios.put<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
}

// export function getDefaultFormByType(type: DiaryEntryType) : DiaryEntry {
//   switch (type) {
//     case DiaryEntryType.INSULIN_ENTRY:
//       return new DefaultInsulinEntry();
//     case DiaryEntryType.CARBS_ENTRY:
//       return new DefaultCarbsEntry();
//     case DiaryEntryType.MEDICATION_ENTRY:
//       return new DefaultMedicationEntry();
//     default:
//       return new DefaultGlucoseEntry();
//   }
// }

function getEntryCreationURL(patientId: string, type: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/entries/${type}`;
}




