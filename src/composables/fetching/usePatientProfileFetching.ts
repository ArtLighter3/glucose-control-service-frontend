import { usePatientProfileStore } from '@/stores/patientProfileStore.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { type PatientProfile, putPatientProfile } from '@/service/patientProfileService.ts'
import { DefaultPatientProfile, getPatientProfile } from '@/service/patientProfileService.ts'
import { type AxiosResponse, isAxiosError } from 'axios'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import type { ApiExceptionResponse } from '@/util/exception.ts'

export function usePatientProfileFetching(patientId: string, useCaching: boolean) {
  const patientProfileStore = usePatientProfileStore();
  const { isFetched, cachedPatientProfile }
    = storeToRefs(patientProfileStore);

  const patientProfile = ref<PatientProfile>(new DefaultPatientProfile());
  const fetchingError = ref<boolean>(false);
  const loading = ref(true);

  const fetch = async () => {
    fetchingError.value = false;
    if (useCaching && patientProfileStore.isUpToDate) {
      patientProfile.value = {...cachedPatientProfile.value};
    } else {
      try {
        patientProfile.value = (await getPatientProfile(patientId)).data;
        cachedPatientProfile.value = {...patientProfile.value};
        isFetched.value = true;
      } catch (err) {
        fetchingError.value = true;
        if (isAxiosError(err) && err.response) {
          console.log(err);
        }
      }
    }
    loading.value = false;
  }

  const { submitting, success,
    fieldErrors, objectErrors, getValidationState}
    = useSubmittableForm();

  const submit = async () => {
    submitting.value = true;
    isFetched.value = false;
    try {
      if (fetchingError.value) return;
      fieldErrors.value = {};
      objectErrors.value = [];

      const response
        = await putPatientProfile(patientId, patientProfile.value);
      patientProfile.value = response.data;
      success.value = true;
      cachedPatientProfile.value = {...patientProfile.value};
      isFetched.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>;
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        }
      }
    }

    submitting.value = false;
  };

  return {
    patientProfile,
    fetch,
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
