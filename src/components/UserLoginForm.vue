<template>
  <b-form class="form" @submit.prevent="submitLogin">
    <form-transition-group>
      <div v-if="invalidCredentials" class="error-text" key="err">
        Неверное имя пользователя или пароль!
      </div>
      <div v-else-if="serverError" class="error-text" key="servErr">
        Ошибка сервера
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

      <b-button class="login-button"
                key="login-button"
                :loading="loading"
                loading-fill
                variant="outline-success"
                type="submit"
                squared
                size="lg"
      >
        Вход
      </b-button>
    </form-transition-group>
  </b-form>
  <div class="registration-option" @click="redirectToRegistration">
    Регистрация
  </div>
</template>
<script setup lang="ts">
import { BFormInput, BFormGroup, BForm, BButton } from 'bootstrap-vue-next'
  import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import { useLogin } from '@/composables/fetching/useLogin.ts'
import { watch } from 'vue'
import router from '@/router'

const { loading, userLogin, submitLogin, invalidCredentials, serverError, successfulLogin }
  = useLogin();

const redirectToRegistration = () => {
  router.push({name: "register"});
};

const emit = defineEmits(['login:success']);
watch(successfulLogin, (newValue) => {
  if (newValue) {
    emit('login:success');
  }
});

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

.registration-option {
  margin-top: 2rem;
  text-align: center;
  opacity: 0.5;
  cursor: pointer;
}
</style>
