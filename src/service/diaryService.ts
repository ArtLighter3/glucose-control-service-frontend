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

export interface InsulinEntry extends DiaryEntry {
  insulinType: InsulinType
}

export interface MedicationEntry extends DiaryEntry {
  name: string
}

export interface CarbsEntry extends DiaryEntry {
  carbsUnits: CarbsUnit | null,
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

function getEntryCreationURL(patientId: string, type: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/entries/${type}`;
}




