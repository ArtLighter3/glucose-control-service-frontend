<script setup lang="ts">
import { BFormInput, BFormGroup, BForm, BButton, BFormInvalidFeedback } from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import { watch } from 'vue'
import { useRegistration } from '@/composables/fetching/useRegistration.ts'

const { userRegistration, submit, submitting, success,
  fieldErrors, objectErrors, getValidationState, } = useRegistration();

const emit = defineEmits(['registration:success']);
watch(success, (newValue) => {
  if (newValue) emit('registration:success');
})

</script>

<template>
  <b-form class="form" @submit.prevent="submit">
    <form-transition-group>
      <span v-for="(objectError, index) in objectErrors"
            :key="`error-${index}`"
            class="error-text">{{ objectError }}
      </span>
      <b-form-group key="username" id="username"
                    class="form-group-inner"
                    label="Логин"
                    label-for="username-input"
                    :state="getValidationState('username')"
      >
        <b-form-input class="squared-input-field"
                      id="username-input" type="text"
                      v-model="userRegistration.username"
                      required
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.username" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="password" id="password"
                    class="form-group-inner"
                    label="Пароль"
                    label-for="password-input"
                    :state="getValidationState('password')"
      >
        <b-form-input class="squared-input-field"
                      id="password-input" type="password"
                      v-model="userRegistration.password"
                      required
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.password" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="repeated-password" id="repeated-password"
                    class="form-group-inner"
                    label="Подтверждение пароля"
                    label-for="repeated-password-input"
                    :state="getValidationState('repeatedPassword')"
      >
        <b-form-input class="squared-input-field"
                      id="repeated-password-input" type="password"
                      v-model="userRegistration.repeatedPassword"
                      required
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.repeatedPassword" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="email" id="email"
                    class="form-group-inner"
                    label="Электронная почта"
                    label-for="email-input"
                    :state="getValidationState('email')"
      >
        <b-form-input class="squared-input-field"
                      id="email-input" type="email"
                      v-model="userRegistration.email"
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.email" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="last-name" id="last-name"
                    class="form-group-inner"
                    label="Фамилия"
                    label-for="last-name-input"
                    :state="getValidationState('lastName')"
      >
        <b-form-input class="squared-input-field"
                      id="last-name-input" type="text"
                      v-model="userRegistration.lastName"
                      required
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.lastName" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="first-name" id="first-name"
                    class="form-group-inner"
                    label="Имя"
                    label-for="first-name-input"
                    :state="getValidationState('firstName')"
      >
        <b-form-input class="squared-input-field"
                      id="first-name-input" type="text"
                      v-model="userRegistration.firstName"
                      required
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.firstName" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="middle-name" id="middle-name"
                    class="form-group-inner"
                    label="Отчество"
                    label-for="middle-name-input"
                    :state="getValidationState('middleName')"
      >
        <b-form-input class="squared-input-field"
                      id="middle-name-input" type="text"
                      v-model="userRegistration.middleName"
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.middleName" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group key="birthdate-name" id="birthdate-name"
                    class="form-group-inner"
                    label="Дата рождения"
                    label-for="birthdate-input"
                    :state="getValidationState('birthDate')"
      >
        <b-form-input class="squared-input-field"
                      id="birthdate-input" type="date"
                      v-model="userRegistration.birthDate"
        />
        <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.birthDate" :key="index">
                      {{ message }}
                    </span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="register-btn"
                key="register-btn"
                size="lg"
                :loading="submitting"
                loading-fill
                variant="outline-success"
                type="submit"
                squared>
        Регистрация
      </b-button>
    </form-transition-group>
  </b-form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: center;

  .form-group-inner {
    width: 100%;
    margin-top: 0.5rem;
  }

  .register-btn {
    margin-top: 1rem;
  }
}

</style>
