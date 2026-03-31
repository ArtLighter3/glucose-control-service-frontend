import { reactive, ref } from 'vue'
import { login, type UserLogin } from '@/service/userService.ts'
import router from '@/router'

export function useLogin() {
  const loading = ref(false)

  const userLogin: UserLogin = reactive({
    username: '',
    password: '',
    error: false
  });

  const submitLogin = async () => {
    loading.value = true;
    try {
      userLogin.error = false;
      const response = await login(userLogin.username, userLogin.password);
      await router.push({ name: "patient-home", params: { id: `${response.data.id}` } })
    } catch (err) {
      console.log(err);
      userLogin.error = true;
    }
    loading.value = false;
    userLogin.password = ''
  }

  return {
    loading,
    userLogin,
    submitLogin
  }
}
