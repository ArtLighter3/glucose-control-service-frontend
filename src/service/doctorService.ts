import "axios"
import apiClient from '@/service/apiClient.ts'
import type { Page } from "@/util/pagination";

const pageSize = import.meta.env.VITE_DEFAULT_FETCH_PAGE_SIZE;

export interface PatientInfo {
  lastName: string,
  firstName: string,
  middleName: string | null,
  patientId: string,
  email: string | null,
  birthDate: string | null
}

export async function attachPatient(doctorId: string, patientId: string) {
  return apiClient.post(getAttachedPatientsURL(doctorId), {
    patientId: patientId
  });
}

export async function detachPatient(doctorId: string, patientId: string) {
  return apiClient.delete(getAttachedPatientsURL(doctorId), {
    params: {
      patientId: patientId
    }
  });
}

export async function getAttachedPatients(doctorId: string, page: number) {
  return apiClient.get<Page<PatientInfo>>(getAttachedPatientsURL(doctorId), {
    params: {
      page: page,
      size: pageSize
    }
  });
}

export async function searchAttachedPatients(doctorId: string, query: string, page: number) {
  return apiClient.get<Page<PatientInfo>>(getSearchAttachedPatientsURL(doctorId), {
    params: {
      query: query,
      page: page,
      size: pageSize
    }
  });
}

function getAttachedPatientsURL(doctorId: string) {
  return `/doctors/${doctorId}/attached-patients`;
}

function getSearchAttachedPatientsURL(doctorId: string) {
  return `/doctors/${doctorId}/attached-patients/search`;
}
