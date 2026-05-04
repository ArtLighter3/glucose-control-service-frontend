import "axios"
import type { DiaryEntryWithType, GlucoseEntry } from '@/service/diaryService.ts'
import apiClient from '@/service/apiClient.ts'
import { getUtcOffsetString } from '@/util/utc.ts'

export interface RecentActivity {
  recentEntries: DiaryEntryWithType[],
  lastGlucoseEntry: GlucoseEntry | null,
  activeInsulin: number | null
}

export interface GlucoseDistribution {
        aboveHyperGlucose: number,
        aboveHighGlucose: number,
        inTargetRange: number,
        belowLowGlucose: number
        belowHypoGlucose: number
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

export async function getGlucoseDistribution(patientId: string, from: Date, to: Date) {
  const response =
    await apiClient.get<GlucoseDistribution>(getGlucoseDistributionURL(patientId), {
    params: {
      from: from.toISOString(),
      to: to.toISOString()
    }
  });

  return response;
}

function getRecentActivityURL(patientId: string) {
  return `/patients/${patientId}/recent`;
}

function getGlucoseDistributionURL(patientId: string) {
  return `/patients/${patientId}/level-distribution`;
}


