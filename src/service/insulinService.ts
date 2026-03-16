import "axios"
import axios, { type AxiosResponse } from 'axios'

export interface InsulinProfile {
  defaultInsulinToCarbsRatio: number,
  defaultInsulinSensitivityFactor: number,
  durationOfInsulinAction: number,
  factorsByTime: { [key: string]: number },
  ratiosByTime: { [key: string]: number },
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

function convertMaps(response: AxiosResponse) {
  const data = response.data;
  if (data && data.ratiosByTime) {
    data.ratiosByTime = new Map(Object.entries(data.ratiosByTime));
    data.factorsByTime = new Map(Object.entries(data.factorsByTime));
  }
}

function getInsulinProfileURL(patientId: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/insulin-profile`;
}

function getInsulinCalculationURL(patientId: string) {
  return `${API_BASE_URL}/api/v1/patients/${patientId}/insulin/calculate`;
}
