import {
  CarbsUnit,
  GlucoseUnit
} from '@/service/patientProfileService.ts'
import apiClient from '@/service/apiClient.ts'
import { getUtcOffsetString } from '@/util/utc.ts'
import { getDiaryEntryTypeURLCodename } from '@/util/enumToStringLiterals.ts'
import {type Page, type Slice} from '@/util/pagination.ts'

export enum MeasurementType {
  AFTER_MEAL = "AFTER_MEAL",
  BEFORE_MEAL = "BEFORE_MEAL"
}

export enum InsulinType {
  LONG = "LONG",
  SHORT_CARBS = "SHORT_CARBS",
  SHORT_CORRECTION = "SHORT_CORRECTION",
  SHORT = "SHORT"
}

export enum DiaryEntryType {
  GLUCOSE_ENTRY = "GLUCOSE_ENTRY",
  INSULIN_ENTRY = "INSULIN_ENTRY",
  MEDICATION_ENTRY = "MEDICATION_ENTRY",
  CARBS_ENTRY = "CARBS_ENTRY"
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

export interface DiaryEntryWithType {
  type: DiaryEntryType,
  entryInfo: DiaryEntry
}

const pageSize = import.meta.env.VITE_DEFAULT_FETCH_PAGE_SIZE;
//
// export function isGlucoseEntry(obj: any): obj is GlucoseEntry {
//   return (
//     typeof obj === 'object' &&
//     obj !== null &&
//     'value' in obj &&
//     typeof obj.value === 'number' &&
//     'commitedAt' in obj &&
//     typeof obj.commitedAt === 'string' &&
//     // 'notes' in obj &&
//     //typeof obj.notes === 'object' &&
//     'category' in obj &&
//     'glucoseUnits' in obj &&
//     Object.keys(GlucoseUnit).includes(obj.glucoseUnits)
//   );
// }

export async function postDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  return apiClient.post<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
}

export async function putDiaryEntry(patientId: string, entry: DiaryEntry, type: DiaryEntryType) {
  return apiClient.put<DiaryEntry>(getEntryCreationURL(patientId, type), entry);
}

export async function deleteDiaryEntry(patientId: string, type: DiaryEntryType,  commitedAt: string) {
  return apiClient.delete(getEntryCreationURL(patientId, type), {
    params: {
      commitedAt: commitedAt
    }
  });
}

export async function getDiaryEntries(patientId: string, from: Date, to: Date, page: number) {
  return apiClient.get<Slice<DiaryEntryWithType>>(getEntryFetchingURL(patientId), {
    params: {
      outputZoneOffset: getUtcOffsetString(new Date()),
      from: from.toISOString(),
      to: to.toISOString(),
      page: page,
      size: pageSize
    }
  });
}

export async function getAllDiaryEntries(patientId: string, page: number) {
  return apiClient.get<Slice<DiaryEntryWithType>>(getEntryFetchingURL(patientId), {
    params: {
      outputZoneOffset: getUtcOffsetString(new Date()),
      page: page,
      size: pageSize
    }
  });
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

function getEntryCreationURL(patientId: string, type: DiaryEntryType) {
  return `/patients/${patientId}/entries/${getDiaryEntryTypeURLCodename(type)}`;
}

function getEntryFetchingURL(patientId: string) {
  return `/patients/${patientId}/entries`;
}




