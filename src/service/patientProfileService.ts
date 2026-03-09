import "axios"
import axios from 'axios'

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getPatientProfile(patientId: string) {
  axios.defaults.withCredentials = true;
  return axios.get<PatientProfile>(`${API_BASE_URL}/api/v1/patients/${patientId}/patient-profile`);
}

export async function putPatientProfile(patientId: string, patientProfile: PatientProfile) {
  axios.defaults.withCredentials = true;
  return axios.put<PatientProfile>(`${API_BASE_URL}/api/v1/patients/${patientId}/patient-profile`,
    patientProfile);
}
