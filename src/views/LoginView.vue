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
import { useRedirectionToRolePanel } from '@/composables/useRedirectionToRolePanel.ts'

const { redirectToHome } = useRedirectionToRolePanel();

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

