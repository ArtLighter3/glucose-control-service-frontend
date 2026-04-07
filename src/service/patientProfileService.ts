import "axios"
import apiClient from '@/service/apiClient.ts'

export enum GlucoseUnit {
  MILLIMOLES_PER_LITER = "MILLIMOLES_PER_LITER",
  MILLIGRAMS_PER_DECILITER = "MILLIGRAMS_PER_DECILITER"
}

export enum CarbsUnit {
  GRAMS = "GRAMS",
  BREAD_UNITS_10 = "BREAD_UNITS_10",
  BREAD_UNITS_12 = "BREAD_UNITS_12",
  BREAD_UNITS_15 = "BREAD_UNITS_15"
}

export interface PatientProfile {
  glucoseUnit: GlucoseUnit,
  carbsUnit: CarbsUnit,
  diabetesType: number,
  hyperGlucose: number,
  highGlucose: number,
  lowGlucose: number,
  hypoGlucose: number
}

export class DefaultPatientProfile implements PatientProfile {
  glucoseUnit = GlucoseUnit.MILLIMOLES_PER_LITER;
  carbsUnit = CarbsUnit.GRAMS;
  diabetesType = 1;
  hyperGlucose = 15;
  highGlucose = 9;
  lowGlucose = 4;
  hypoGlucose = 3;
}

export async function getPatientProfile(patientId: string) {
  return apiClient.get<PatientProfile>(`/patients/${patientId}/patient-profile`);
}

export async function putPatientProfile(patientId: string, patientProfile: PatientProfile) {
  return apiClient
    .put<PatientProfile>(`/patients/${patientId}/patient-profile`, patientProfile);
}
