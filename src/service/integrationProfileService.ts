import "axios"
import apiClient from '@/service/apiClient.ts'

export interface IntegrationProfile {
  isNightscoutEnabled: boolean,
  nightscoutApiSecret: string | null
}

export async function getIntegrationProfile(patientId: string) {
  const response = await apiClient.get<IntegrationProfile>(getIntegrationProfileURL(patientId));
  return response;
}

export async function postIntegrationProfile(patientId: string,
                                             integrationProfile: IntegrationProfile) {
  const response = await apiClient
    .post<IntegrationProfile>(getIntegrationProfileURL(patientId), integrationProfile);
  return response;
}

export async function putIntegrationProfile(patientId: string,
                                            integrationProfile: IntegrationProfile) {
  const response = await apiClient
      .put<IntegrationProfile>(getIntegrationProfileURL(patientId), integrationProfile);
  return response;
}


function getIntegrationProfileURL(patientId: string) {
  return `/patients/${patientId}/integration-profile`;
}



