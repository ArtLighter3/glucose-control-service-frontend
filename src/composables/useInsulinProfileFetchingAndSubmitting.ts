import { onMounted, ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import {
  getInsulinProfile,
  type InsulinProfile,
  postInsulinProfile, putInsulinProfile
} from '@/service/insulinService.ts'

export function useInsulinProfileFetchingAndSubmitting(patientId: string) {
  const insulinProfile = ref<InsulinProfile>({
    defaultInsulinToCarbsRatio: 30,
    defaultInsulinSensitivityFactor: 30,
    durationOfInsulinAction: 5,
    factorsByTime: {},
    ratiosByTime: {},
  })

  const globalError = ref(false)
  const loading = ref(true)
  const insulinProfileDoesNotExist = ref(false)
  onMounted(async () => {
    try {
      globalError.value = false
      insulinProfile.value = (await getInsulinProfile(patientId)).data
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 404) insulinProfileDoesNotExist.value = true
        else globalError.value = true
      }
    }
    loading.value = false
  })

  const { submitting, success, fieldErrors, objectErrors, getValidationState}
    = useSubmittableForm();
  const submit = async () => {
    submitting.value = true
    try {
      if (globalError.value) return
      fieldErrors.value = {}
      objectErrors.value = []

      const response = insulinProfileDoesNotExist.value
        ? await postInsulinProfile(patientId, insulinProfile.value)
        : await putInsulinProfile(patientId, insulinProfile.value)
      insulinProfile.value = response.data
      success.value = true
      insulinProfileDoesNotExist.value = false
    } catch (err) {
      success.value = false
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>
          fieldErrors.value = exceptionResponse.data.fieldErrors
          objectErrors.value = exceptionResponse.data.objectErrors
        }
      }
    }
    submitting.value = false
  }

  return {
    insulinProfile,
    globalError,
    loading,
    submit,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState
  }
}
