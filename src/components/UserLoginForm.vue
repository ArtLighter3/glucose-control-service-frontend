<template>
  <b-form class="form" @submit.prevent="submitLoginForm">
    <form-transition-group>
      <div v-if="form.error" class="error-text" key="err">
        Неверное имя пользователя или пароль!
      </div>
      <b-form-group class="b-form-group" id="login-form" key="login"
                    label="Логин" label-for="login-input">
        <b-form-input class="squared-input-field"
          id="login-input"
          v-model="form.username"
          required
        />
      </b-form-group>
      <b-form-group class="b-form-group" id="password-form" key="password"
                    label="Пароль" label-for="password-input">
        <b-form-input class="squared-input-field"
          id="password-input"
          v-model="form.password"
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
import { reactive, ref } from 'vue'
  import {login} from '@/service/userService'
  import router from '@/router'
  import { BFormInput, BFormGroup, BForm, BButton } from 'bootstrap-vue-next'
  import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

  interface LoginForm {
    username: string,
    password: string,
    error: boolean
  }

  const loading = ref(false)

  const form: LoginForm = reactive({
    username: '',
    password: '',
    error: false
  });

  const submitLoginForm = async () => {
    loading.value = true;
    try {
      form.error = false;
      const response = await login(form.username, form.password);
      await router.push({ name: "diary", params: { id: `${response.data.id}` } })
    } catch (err) {
      console.log(err);
      form.error = true;
    }
    loading.value = false;
    form.password = ''
  }
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
