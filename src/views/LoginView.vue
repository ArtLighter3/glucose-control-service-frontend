<template>
  <div class="login-page">
    <div class="login-form-wrapper">
      <h4 class="login-text">ВХОД В СИСТЕМУ</h4>
      <user-login-form @login:success="redirectToHome"/>
    </div>

  </div>
</template>

<script setup lang="ts">
import UserLoginForm from '@/components/UserLoginForm.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import router from '@/router'
import { useCsrfFetching } from '@/composables/fetching/useCsrfFetching.ts'

const authStore = useAuthStore();

useCsrfFetching();

const redirectToHome = () => {
  let isPatient = false, isDoctor = false, isAdmin = false;
  for (const role of authStore.userSession?.roles) {
    console.log(role);
    switch (role) {
      case "ROLE_PATIENT": isPatient = true; break;
      case "ROLE_ADMIN": isAdmin = true; break;
      case "ROLE_DOCTOR": isDoctor = true; break;
    }
  }

  console.log(isPatient);
  console.log(isDoctor);
  console.log(isAdmin);
  if (isAdmin) return;
  else if (isDoctor)
    router.push({ name: "doctor", params: { id: `${authStore.getId()}` } });
  else if (isPatient)
    router.push({ name: "patient-home", params: { id: `${authStore.getId()}` } });
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login-text {
    margin: 3rem;
  }

  .login-form-wrapper {
    display: flex;
    width: 30rem;
    height: 30rem;
    flex-direction: column;
    align-items: center;
    border-width: 1px;
    border-style: solid;
    border-color: var(--color-background-alt);
  }
}
</style>
