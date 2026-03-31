<template>
  <b-form class="form" @submit.prevent="submitLogin">
    <form-transition-group>
      <div v-if="userLogin.error" class="error-text" key="err">
        Неверное имя пользователя или пароль!
      </div>
      <b-form-group class="b-form-group" id="login-form" key="login"
                    label="Логин" label-for="login-input">
        <b-form-input class="squared-input-field"
          id="login-input"
          v-model="userLogin.username"
          required
        />
      </b-form-group>
      <b-form-group class="b-form-group" id="password-form" key="password"
                    label="Пароль" label-for="password-input">
        <b-form-input class="squared-input-field"
          id="password-input"
          v-model="userLogin.password"
          type="password"
          required
        />
      </b-form-group>

      <b-button class="login-button" key="login-button" :loading="loading" loading-fill
                variant="outline-success" type="submit" squared>Вход</b-button>
    </form-transition-group>
  </b-form>
</template>
<script setup lang="ts">
import { BFormInput, BFormGroup, BForm, BButton } from 'bootstrap-vue-next'
  import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import { useLogin } from '@/composables/useLogin.ts'

const {loading, userLogin, submitLogin} = useLogin();

</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: center;
}

.login-button {
  margin: 0.5rem;
}
</style>
