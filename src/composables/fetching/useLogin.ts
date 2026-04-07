import { ref } from 'vue'
import { login, type UserLogin } from '@/service/userService.ts'
import { useAuthStore } from '@/stores/authStore.ts'

export function useLogin() {
  const loading = ref(false);
  const error = ref(false);
  const successfulLogin = ref(false);

  const authStore = useAuthStore();

  const userLogin = ref<UserLogin>({
    username: '',
    password: ''
  });

  const submitLogin = async () => {
    loading.value = true;
    successfulLogin.value = false;
    error.value = false;

    try {
      const response = await login(userLogin.value);
      //await router.push({ name: "patient-home", params: { id: `${response.data.id}` } })
      authStore.setAuth(response.data);
      successfulLogin.value = true;
    } catch (err) {
      error.value = true;
      console.log(err);
    }
    userLogin.value.password = ''
    loading.value = false;
  }

  return {
    loading,
    userLogin,
    submitLogin,
    error,
    successfulLogin
  }
}
