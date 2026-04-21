<template>
  <div class="register-page">
    <div class="register-form-wrapper">
      <b-card class="card-wrapper">
        <h4>РЕГИСТРАЦИЯ</h4>
        <user-registration-form @registration:success="redirectToLogin"/>
      </b-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import UserRegistrationForm from '@/components/UserRegistrationForm.vue'
import {BCard} from 'bootstrap-vue-next';

const redirectToLogin = () => {
  router.push({ name: "login" });
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;

  .register-form-wrapper {
    padding: 3rem;
    flex-basis: 500px;

    .card-wrapper {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  h4 {
    margin: 1rem;
    text-align: center;
  }

}
</style>
