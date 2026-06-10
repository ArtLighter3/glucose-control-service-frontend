import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import { onMounted, ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import { getCsrf, register, type UserRegistration } from '@/service/userService.ts'

export function useRegistration() {
  const { submitting, success,
    fieldErrors, objectErrors, getValidationState }
    = useSubmittableForm()

  const userRegistration = ref<UserRegistration>({
    username: null,
    password: null,
    repeatedPassword: null,
    email: null,
    firstName: null,
    middleName: null,
    lastName: null,
    birthDate: null,
    isDoctor: false
  });

  onMounted(async () => {
    await getCsrf();
  });

  const submit = async () => {
    submitting.value = true;
    success.value = false;
    try {
      fieldErrors.value = {};
      objectErrors.value = [];

      const response = await register(userRegistration.value);
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>;
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        } else if (err.response.status === 409) {
          fieldErrors.value.username = ["пользователь с таким логином уже существует!"];
        }
      }
    }
    submitting.value = false;
  }

  return {
    userRegistration,
    submit,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState,
  }
}
