import { onMounted, ref } from 'vue'
import { getCsrf, login, logout, type UserLogin } from '@/service/userService.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import { usePatientProfileStore } from '@/stores/patientProfileStore.ts'
import { DefaultPatientProfile } from '@/service/patientProfileService.ts'
import { isAxiosError, type AxiosResponse } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception'

export function useLogin() {
  const loading = ref(false);
  const invalidCredentials = ref(false);
  const serverError = ref(false);
  const successfulLogin = ref(false);

  const authStore = useAuthStore();
  const patientProfileStore = usePatientProfileStore();

  const userLogin = ref<UserLogin>({
    username: '',
    password: ''
  });

  onMounted(async () => {
    await getCsrf();
  });

  const submitLogin = async () => {
    loading.value = true;
    successfulLogin.value = false;
    invalidCredentials.value = false;
    serverError.value = false;

    try {
      const response = await login(userLogin.value);
      //await router.push({ name: "patient-home", params: { id: `${response.data.id}` } })
      authStore.setAuth(response.data);
      await getCsrf();
      successfulLogin.value = true;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          invalidCredentials.value = true;
          userLogin.value.password = ''
        } else {
          serverError.value = true;
          console.log(err);
        }
      } else {
        serverError.value = true;
        console.log(err);
      }
    }
    loading.value = false;
  }

  const submitLogout = async () => {
    try {
      const response = await logout();
    } catch (err) {
      console.log(err);
    }
    authStore.logout();
    patientProfileStore.isFetched = false;
    patientProfileStore.cachedPatientProfile = new DefaultPatientProfile();
  };

  return {
    loading,
    userLogin,
    submitLogin,
    invalidCredentials,
    serverError,
    successfulLogin,
    submitLogout
  }
}
