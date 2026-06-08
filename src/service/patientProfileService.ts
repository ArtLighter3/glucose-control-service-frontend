import "axios"
import apiClient from '@/service/apiClient.ts'
import type { UserFullName } from '@/service/userService.ts'
import type { Page } from '@/util/pagination.ts'

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

export interface AttachedDoctorInfo extends UserFullName {
  doctorCode: string
}

const pageSize = import.meta.env.VITE_DEFAULT_FETCH_PAGE_SIZE;

export async function getPatientProfile(patientId: string) {
  return apiClient.get<PatientProfile>(getPatientProfileURL(patientId));
}

export async function putPatientProfile(patientId: string, patientProfile: PatientProfile) {
  return apiClient
    .put<PatientProfile>(getPatientProfileURL(patientId), patientProfile);
}

export async function getAttachedDoctors(patientId: string, page: number) {
  return apiClient
    .get<Page<AttachedDoctorInfo>>(getAttachedDoctorsURL(patientId, null), {
      params: {
        page: page,
        size: pageSize
      }
    });
}

export async function attachToDoctor(patientId: string, doctorCode: string) {
  return apiClient.post(getAttachedDoctorsURL(patientId, true), {
    doctorCode: doctorCode
  });
}

export async function detachFromDoctor(patientId: string, doctorCode: string) {
  return apiClient.post(getAttachedDoctorsURL(patientId, false), {
    doctorCode: doctorCode
  });
}

function getPatientProfileURL(patientId: string) {
  return `/patients/${patientId}/patient-profile`;
}

function getAttachedDoctorsURL(patientId: string, attach: boolean | null) {
  if (attach === null) return `/patients/${patientId}/doctors`;

  const attachDetachPart = attach ? 'attach' : 'detach';
  return `/patients/${patientId}/doctors/${attachDetachPart}`;
}
