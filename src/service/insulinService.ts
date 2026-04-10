import "axios"
import type { DiaryEntryWithType, GlucoseEntry } from '@/service/diaryService.ts'
import apiClient from '@/service/apiClient.ts'
import { getUtcOffsetString } from '@/util/utc.ts'
import type { GlucoseUnit } from '@/service/patientProfileService.ts'
import { CarbsUnit } from '@/service/patientProfileService.ts'

export interface InsulinProfile {
  defaultInsulinToCarbsRatio: number,
  defaultInsulinSensitivityFactor: number,
  durationOfInsulinAction: number,
  factorsByTime: { [key: string]: number },
  ratiosByTime: { [key: string]: number },
}

export interface InsulinCalculationRequest {
  carbs: number,
  glucose: number | null,
  considerActiveInsulin: boolean,
  correctGlucoseLevel: boolean,
  correction: number | null;
}

export interface InsulinResult {
  glucose: number | null;
  glucoseUnit: GlucoseUnit;
  insulinSensitivityFactor: number;
  correctionInsulin: number;
  activeInsulin: number;
  carbs: number;
  carbsUnit: CarbsUnit;
  insulinToCarbsRatio: number;
  carbsInsulin: number;
  correction: number;
  result: number;
}

export interface RecentActivity {
  recentEntries: DiaryEntryWithType[],
  lastGlucoseEntry: GlucoseEntry | null,
  activeInsulin: number | null
}

export async function getInsulinProfile(patientId: string) {
  const response
    = await apiClient.get<InsulinProfile>(getInsulinProfileURL(patientId));
 // convertMaps(response);
  return response;
}

export async function postInsulinProfile(patientId: string, insulinProfile: InsulinProfile) {
  const response =
    await apiClient.post<InsulinProfile>(getInsulinProfileURL(patientId), insulinProfile);
  //convertMaps(response);
  return response;
}

export async function putInsulinProfile(patientId: string, insulinProfile: InsulinProfile) {
 // console.log(insulinProfile)
  const response =
    await apiClient.put<InsulinProfile>(getInsulinProfileURL(patientId), insulinProfile);
  //convertMaps(response);
  return response;
}

export async function calculateInsulin(patientId: string,
                                       calculationData: InsulinCalculationRequest) {
  return await apiClient.get<InsulinResult>(getInsulinCalculationURL(patientId), {
    params: {
      carbs: calculationData.carbs,
      glucose: calculationData.glucose,
      considerActiveInsulin: calculationData.considerActiveInsulin,
      correctGlucoseLevel: calculationData.correctGlucoseLevel,
      correction: calculationData.correction,
      patientZoneOffset: getUtcOffsetString(new Date()),
    }
  });
}

export async function getRecentActivity(patientId: string) {
  const response =
    await apiClient.get<RecentActivity>(getRecentActivityURL(patientId), {
    params: {
      outputZoneOffset: getUtcOffsetString(new Date())
    }
  });

  return response;
}

function getInsulinProfileURL(patientId: string) {
  return `/patients/${patientId}/insulin-profile`;
}

function getInsulinCalculationURL(patientId: string) {
  return `/patients/${patientId}/insulin/calculate`;
}

function getRecentActivityURL(patientId: string) {
  return `/patients/${patientId}/recent`;
}


