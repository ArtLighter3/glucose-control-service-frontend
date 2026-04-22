import { onMounted, ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import { deleteUser, type UserUpdatableInfo } from '@/service/userService.ts'
import { getUserInfo, putUserInfo } from '@/service/userService.ts'

export function useUserInfoFetchingAndSubmitting(userId: string) {
  const userInfo = ref<UserUpdatableInfo>({
    email: null,
    firstName: "",
    middleName: null,
    lastName: "",
    birthDate: null
  })

  const fetchingError = ref(false)
  const loading = ref(true)
  onMounted(async () => {
    loading.value = true;
    try {
      fetchingError.value = false
      userInfo.value = (await getUserInfo(userId)).data
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        fetchingError.value = true
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

      const response = await putUserInfo(userId, userInfo.value)
      userInfo.value = response.data;
      success.value = true
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

const remove = async () => {
    submitting.value = true;
    success.value = false;
    try {
      await deleteUser(userId);
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        console.log(err);
      }
    }
    submitting.value = false;
  }

  return {
    userInfo,
    fetchingError,
    loading,
    submit,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState,
    remove
  }
}
