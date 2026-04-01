import {
  CarbsUnit,
  GlucoseUnit
} from '@/service/patientProfileService.ts'
import axios from 'axios'
import apiClient from '@/service/apiClient.ts'

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
  notes: string | null,
}

export interface GlucoseEntry extends DiaryEntry {
  category: MeasurementType | null,
  glucoseUnits: GlucoseUnit | null,
}

export class DefaultGlucoseEntry implements GlucoseEntry {
  commitedAt = "";
  glucoseUnits = null;
  notes = null;
  category = null;
  value = 0.0;
}

export interface InsulinEntry extends DiaryEntry {
  insulinType: InsulinType
}

export class DefaultInsulinEntry implements InsulinEntry {
  commitedAt = "";
  notes = null;
  value = 0.0;
  insulinType = InsulinType.SHORT;
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

export function isGlucoseEntry(obj: any): obj is GlucoseEntry {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'value' in obj &&
    typeof obj.value === 'number' &&
    'commitedAt' in obj &&
    typeof obj.commitedAt === 'string' &&
    // 'notes' in obj &&
    //typeof obj.notes === 'object' &&
    'category' in obj &&
    'glucoseUnits' in obj &&
    Object.keys(GlucoseUnit).includes(obj.glucoseUnits)
  );
}

export async function postDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  return apiClient.post<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
}

export async function putDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  return apiClient.put<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
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
  return `/patients/${patientId}/entries/${type}`;
}




