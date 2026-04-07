import { onMounted, ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import type { IntegrationProfile } from '@/service/integrationProfileService.ts'
import {
  getIntegrationProfile,
  postIntegrationProfile, putIntegrationProfile
} from '@/service/integrationProfileService.ts'

export function useIntegrationProfileFetchingAndSubmitting(patientId: string) {
  const integrationProfile = ref<IntegrationProfile>({
    isNightscoutEnabled: false,
    nightscoutApiSecret: null
  })

  const fetchingError = ref(false)
  const loading = ref(true)
  const integrationProfileDoesNotExist = ref(false)
  onMounted(async () => {
    loading.value = true;
    try {
      fetchingError.value = false
      integrationProfile.value = (await getIntegrationProfile(patientId)).data
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 404) integrationProfileDoesNotExist.value = true
        else fetchingError.value = true
      }
    }
    loading.value = false
  })

  const { submitting, success,
    fieldErrors, objectErrors, getValidationState}
    = useSubmittableForm();
  const submit = async () => {
    submitting.value = true
    try {
      if (fetchingError.value) return
      fieldErrors.value = {}
      objectErrors.value = []

      const response = integrationProfileDoesNotExist.value
        ? await postIntegrationProfile(patientId, integrationProfile.value)
        : await putIntegrationProfile(patientId, integrationProfile.value)
      integrationProfile.value = response.data
      success.value = true
      integrationProfileDoesNotExist.value = false
    } catch (err) {
      success.value = false
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>
          fieldErrors.value = exceptionResponse.data.fieldErrors
          objectErrors.value = exceptionResponse.data.objectErrors
        }
      }
    }
    submitting.value = false
  }

  return {
    integrationProfile,
    fetchingError,
    loading,
    submit,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState
  }
}
