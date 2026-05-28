<script setup lang="ts">
import {
  BFormInput,
  BForm,
  BFormGroup, BButton,
  BSpinner,
  BCard, BFormInvalidFeedback
} from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import UpdateFormButtons from '@/components/UpdateFormButtons.vue'
import {
  useUserInfoFetchingAndSubmitting
} from '@/composables/fetching/useUserInfoFetchingAndSubmitting.ts'

  const props = defineProps({
    userId: {
      type: String,
      required: true
    },
    showDeleteButton: {
      type: Boolean,
      required: false,
      default: false
    }
  });


  const { userInfo, fetchingError,
    loading, submit, submitting, success, fieldErrors, objectErrors, getValidationState, remove }
    = useUserInfoFetchingAndSubmitting(props.userId);

  const emit = defineEmits(['user:deleted']);
</script>

<template>
    <b-spinner v-if="loading" variant="success"/>
    <div class="user-info-form-wrapper" v-else>
      <h4 class="error-text" v-if="fetchingError">ОШИБКА ЗАГРУЗКИ ПРОФИЛЯ</h4>
      <b-form class="user-info-form" v-else @submit.prevent="">
        <h2>Аккаунт</h2>
          <b-card class="form-group-wrapper">
              <form-transition-group>
                <span v-for="(objectError, index) in objectErrors"
                      :key="`error-${index}`"
                      class="error-text">{{ objectError }}
                </span>
                <b-form-group key="email" id="email"
                              class="form-group-inner"
                              label="Электронная почта"
                              label-for="email-input"
                              :state="getValidationState('email')">
                  <b-form-input class="squared-input-field"
                                id="email-input" type="email"
                                v-model="userInfo.email"/>
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
                              :state="getValidationState('lastName')">
                  <b-form-input class="squared-input-field"
                                id="last-name-input" type="text"
                                v-model="userInfo.lastName"/>
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
                              :state="getValidationState('firstName')">
                  <b-form-input class="squared-input-field"
                                id="first-name-input" type="text"
                                v-model="userInfo.firstName"/>
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
                              :state="getValidationState('middleName')">
                  <b-form-input class="squared-input-field"
                                id="middle-name-input" type="text"
                                v-model="userInfo.middleName"/>
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
                              :state="getValidationState('birthDate')">
                  <b-form-input class="squared-input-field"
                                id="birthdate-input" type="date"
                                v-model="userInfo.birthDate"/>
                  <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.birthDate" :key="index">
                      {{ message }}
                    </span>
                  </b-form-invalid-feedback>
                </b-form-group>
              </form-transition-group>
          </b-card>
        <update-form-buttons
          :show-delete-button="showDeleteButton"
          :submitting="submitting"
          @save="submit"
          @delete="remove(); $emit('user:deleted')"
        />
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

      .form-group-wrapper {
        margin: 1rem;
        flex: 1;
        padding: 2rem;
        width: 50%;
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
