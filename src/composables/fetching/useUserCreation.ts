import { ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import { postUser, Role, type UserCreation } from '@/service/userService.ts'

export function useUserCreation() {
  const userInfo = ref<UserCreation>({
    username: '',
    email: null,
    firstName: '',
    middleName: null,
    lastName: '',
    birthDate: null,
    password: '',
    roles: [Role.ROLE_DOCTOR],
  })

  const { submitting, success, fieldErrors, objectErrors, getValidationState } =
    useSubmittableForm()
  const submit = async () => {
    submitting.value = true
    try {
      fieldErrors.value = {}
      objectErrors.value = []

      const response = await postUser(userInfo.value)
      success.value = true
    } catch (err) {
      success.value = false
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>
          fieldErrors.value = exceptionResponse.data.fieldErrors
          objectErrors.value = exceptionResponse.data.objectErrors
        } else if (err.response.status === 409) {
          fieldErrors.value['username'] = ['пользователь с таким логином уже существует']
        }
      }
    }
    submitting.value = false
  }

  return {
    userInfo,
    submit,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState,
  }
}
