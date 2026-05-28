<script setup lang="ts">
import {
  BFormInput,
  BForm,
  BFormGroup, BButton,
  BFormInvalidFeedback, BFormSelectOption, BFormSelect
} from 'bootstrap-vue-next'
import {
  useUserCreation
} from '@/composables/fetching/useUserCreation.ts'
import { watch } from 'vue'
import { getRoleName } from '@/util/enumToStringLiterals.ts'
import { Role } from '@/service/userService.ts'

const { userInfo, submit, submitting, success, fieldErrors, objectErrors, getValidationState }
  = useUserCreation();

const emit = defineEmits(['user:added']);

watch(success, (newValue) => {
  if (newValue) emit('user:added');
});
</script>

<template>
    <div class="user-info-form-wrapper">
      <b-form class="user-info-form" @submit.prevent="submit">
        <div class="form-group-wrapper">
          <span v-for="(objectError, index) in objectErrors"
                :key="`error-${index}`"
                class="error-text">{{ objectError }}
          </span>
          <b-form-group
            class="form-group-inner"
            key="role"
            id="role"
            label="Роль"
            label-for="role-selector"
            :state="getValidationState('roles')"
          >
            <b-form-select
              class="squared-input-field"
              id="role-selector"
              key="role-selector"
              v-model="userInfo.roles[0]"
            >
              <b-form-select-option
                v-for="role in Object.entries(Role)"
                :key="role[0]"
                :value="role[0]"
              >
                {{ getRoleName(role[1]) }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              <span v-for="(message, index) in fieldErrors.roles" :key="index">
                {{ message }}
              </span>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group key="username" id="username"
                        class="form-group-inner"
                        label="Логин"
                        label-for="username-input"
                        :state="getValidationState('username')"
          >
            <b-form-input class="squared-input-field"
                          id="username-input" type="text"
                          v-model="userInfo.username"
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
                          v-model="userInfo.password"
                          required
            />
            <b-form-invalid-feedback>
                      <span v-for="(message, index) in fieldErrors.password" :key="index">
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
                          v-model="userInfo.email"
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
                          v-model="userInfo.lastName"
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
                          v-model="userInfo.firstName"
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
                          v-model="userInfo.middleName"
            />
            <b-form-invalid-feedback>
                      <span v-for="(message, index) in fieldErrors.middleName" :key="index">
                        {{ message }}
                      </span>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group key="birthdate" id="birthdate"
                        class="form-group-inner"
                        label="Дата рождения"
                        label-for="birthdate-input"
                        :state="getValidationState('birthDate')"
          >
            <b-form-input class="squared-input-field"
                          id="birthdate-input" type="date"
                          v-model="userInfo.birthDate"
            />
            <b-form-invalid-feedback>
                      <span v-for="(message, index) in fieldErrors.birthDate" :key="index">
                        {{ message }}
                      </span>
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <b-button class="create-btn"
                  key="create-btn"
                  size="lg"
                  :loading="submitting"
                  loading-fill
                  variant="outline-success"
                  type="submit"
                  squared>
          Создать
        </b-button>
      </b-form>
    </div>
</template>

<style scoped>
h4 {
  text-align: center;
}

  .user-info-form-wrapper {
    display: flex;
    align-items: start;
    flex: 1;

    .user-info-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      flex: 1;
      gap: 1rem;

      .form-group-wrapper {
        flex: 1;
        width: 60%;
        flex-basis: 250px;

        @media(max-width: 1080px) {
          width: 90%;
        }

        .form-group-inner {
          margin-top: 1.1rem;
        }
      }
    }
  }
</style>
