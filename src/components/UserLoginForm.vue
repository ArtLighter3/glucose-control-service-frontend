<template>
  <form @submit.prevent="onSubmit">
    <transition-group>
      <div v-if="form.error" class="field-error-message" key="err">
        Неверное имя пользователя или пароль!
      </div>
      <div class="form-group my-2" key="username">
        <label>Username</label>
        <input
          v-model="form.username"
          class="form-control"
          placeholder="Username"
          required
        />
      </div>
      <div class="form-group my-2" key="password">
        <label>Password</label>
        <input
          v-model="form.password"
          class="form-control"
          type="password"
          placeholder="Password"
          required
        />
      </div>
    </transition-group>

    <button class="btn btn-success btn-block my-2" type="submit">Login</button>
  </form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import {login} from '@/service/userService'
import router from '@/router'

interface LoginForm {
  username: string,
  password: string,
  error: boolean
}

export default defineComponent({
  setup() {
    const form: LoginForm = reactive({
      username: '',
      password: '',
      error: false
    });

    const onSubmit = async () => {


      await login(form.username, form.password)
        .then((response) => {
          console.log(response);
          form.error = false;

         // response.data.
          router.push("/patient/diary")
        }).catch((err) => {
          console.log(err);
          form.error = true;
        });
      form.password = ''


    }

    return { form, onSubmit }
  }
})
</script>

<style scoped>
.field-error-message{
  color: var(--color-text-error);
}

</style>
