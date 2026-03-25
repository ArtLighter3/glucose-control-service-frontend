import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  DefaultPatientProfile, type PatientProfile
} from '@/service/patientProfileService.ts'

export const usePatientProfileStore = defineStore('patientProfile',
  () => {
  const isFetched = ref(false);
  const cachedPatientProfile = ref<PatientProfile>(new DefaultPatientProfile());

  const isUpToDate = computed(() => {
    return isFetched.value && cachedPatientProfile.value !== null;
  });
  // const globalError = ref(false);
  // const loading = ref(true);
  //
  // const submitting = ref(false);
  // const success = ref(false);
  // const fieldErrors = ref<FieldErrors>({});
  // const objectErrors = ref<string[]>([]);
  //
  // async function get(patientId: string) {
  //   if (isFetched.value) return patientProfile;
  //
  //   try {
  //     globalError.value = false;
  //     patientProfile.value = (await getPatientProfile(patientId)).data;
  //     isFetched.value = true;
  //   } catch (err) {
  //     if (isAxiosError(err) && err.response) {
  //       globalError.value = true;
  //     }
  //   }
  //   loading.value = false;
  // }
  //
  // async function update(patientId: string, newPatientProfile: PatientProfile) {
  //   submitting.value = true;
  //   try {
  //     if (globalError.value) return;
  //     fieldErrors.value = {};
  //     objectErrors.value = [];
  //
  //     const response =
  //       await putPatientProfile(patientId, newPatientProfile);
  //     patientProfile.value = response.data;
  //     success.value = true;
  //   } catch (err) {
  //     success.value = false;
  //     if (isAxiosError(err) && err.response) {
  //       if (err.response.status === 400 && err.response.data) {
  //         const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>;
  //         fieldErrors.value = exceptionResponse.data.fieldErrors;
  //         objectErrors.value = exceptionResponse.data.objectErrors;
  //       }
  //     }
  //   }
  //   isFetched.value = true;
  //   submitting.value = false;
  // }
  // async function setFetchedData(patientProfile: PatientProfile) {
  //   cachedData.value = patientProfile;
  //   isFetched.value = true;
  // }

  // return { patientProfile, globalError, loading, submitting, success, fieldErrors, objectErrors,
  // get, update}
    return { isFetched, cachedPatientProfile, isUpToDate }
})
