import "axios"
import apiClient from '@/service/apiClient.ts'

export enum GlucoseUnit {
  MILLIMOLES_PER_LITER = "ммоль/л",
  MILLIGRAMS_PER_DECILITER = "мг/дл"
}

export enum CarbsUnit {
  GRAMS = "грамм",
  BREAD_UNITS_10 = "хлебная единица (10г)",
  BREAD_UNITS_12 = "хлебная единица (12г)",
  BREAD_UNITS_15 = "хлебная единица (15г)"
}

export interface PatientProfile {
  glucoseUnit: GlucoseUnit,
  carbsUnit: CarbsUnit,
  diabetesType: number,
  hyperGlucose: number,
  highGlucose: number,
  lowGlucose: number,
  hypoGlucose: number,
  isNightscoutEnabled: boolean,
  nightscoutApiSecret: string
}

export class DefaultPatientProfile implements PatientProfile {
  glucoseUnit = GlucoseUnit.MILLIMOLES_PER_LITER;
  carbsUnit = CarbsUnit.GRAMS;
  diabetesType = 1;
  hyperGlucose = 15;
  highGlucose = 9;
  lowGlucose = 4;
  hypoGlucose = 3;
  isNightscoutEnabled = false;
  nightscoutApiSecret = "";

}

export async function getPatientProfile(patientId: string) {
  return apiClient.get<PatientProfile>(`/patients/${patientId}/patient-profile`);
}

export async function putPatientProfile(patientId: string, patientProfile: PatientProfile) {
  return apiClient
    .put<PatientProfile>(`/patients/${patientId}/patient-profile`, patientProfile);
}
