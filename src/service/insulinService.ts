import "axios"
import axios, { type AxiosResponse } from 'axios'
import type { DiaryEntry, GlucoseEntry } from '@/service/diaryService.ts'

export interface InsulinProfile {
  defaultInsulinToCarbsRatio: number,
  defaultInsulinSensitivityFactor: number,
  durationOfInsulinAction: number,
  factorsByTime: { [key: string]: number },
  ratiosByTime: { [key: string]: number },
}

export interface RecentActivity {
  recentEntries: DiaryEntry[],
  lastGlucoseEntry: GlucoseEntry | null,
  activeInsulin: number | null
}

// export interface TimeValuePair {
//   [key: Time]: number;
// }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getInsulinProfile(patientId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.get<InsulinProfile>(getInsulinProfileURL(patientId));
 // convertMaps(response);
  return response;
}

export async function postInsulinProfile(patientId: string, insulinProfile: InsulinProfile) {
  axios.defaults.withCredentials = true;
  const response = await axios.post<InsulinProfile>(getInsulinProfileURL(patientId), insulinProfile);
  //convertMaps(response);
  return response;
}

export async function putInsulinProfile(patientId: string, insulinProfile: InsulinProfile) {
  axios.defaults.withCredentials = true;
 // console.log(insulinProfile)
  const response = await axios.put<InsulinProfile>(getInsulinProfileURL(patientId), insulinProfile);
  //convertMaps(response);
  return response;
}

export async function getRecentActivity(patientId: string) {
  axios.defaults.withCredentials = true;
  const response =
    await axios.get<RecentActivity>(getRecentActivityURL(patientId), {
    params: {
      outputZoneOffset: getUtcOffsetString(new Date())
    }
  });

  // const data = response.data
  // if (data && data.)

  return response;
}

// function convertMaps(response: AxiosResponse) {
//   const data = response.data;
//   if (data && data.ratiosByTime) {
//     data.ratiosByTime = new Map(Object.entries(data.ratiosByTime));
//     data.factorsByTime = new Map(Object.entries(data.factorsByTime));
//   }
// }

function getUtcOffsetString(date: Date): string {
  const offsetMinutes: number = date.getTimezoneOffset();
  const sign: string = offsetMinutes >= 0 ? '-' : '+';
  const absOffsetMinutes: number = Math.abs(offsetMinutes);
  const hours: number = Math.floor(absOffsetMinutes / 60);
  const minutes: number = absOffsetMinutes % 60;

  const formattedHours: string = hours.toString().padStart(2, '0');
  const formattedMinutes: string = minutes.toString().padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
}

function getInsulinProfileURL(patientId: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/insulin-profile`;
}

function getInsulinCalculationURL(patientId: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/insulin/calculate`;
}

function getRecentActivityURL(patientId: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/recent`;
}


