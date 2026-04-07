<script setup lang="ts">
import {
  BFormInput,
  BForm,
  BFormGroup, BButton,
  BSpinner,
  BCard, BFormInvalidFeedback,
  BFormCheckbox
} from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import {
  useIntegrationProfileFetchingAndSubmitting
} from '@/composables/fetching/useIntegrationProfileFetchingAndSubmitting.ts'

  const props = defineProps({
    patientId: {
      type: String,
      required: true
    }
  });


  const { integrationProfile, fetchingError,
    loading, submit, submitting, success, fieldErrors, objectErrors, getValidationState }
    = useIntegrationProfileFetchingAndSubmitting(props.patientId);
</script>

<template>
    <b-spinner v-if="loading" variant="success"/>
    <div class="integration-profile-form-wrapper" v-else>
      <h4 class="error-text" v-if="fetchingError">ОШИБКА ЗАГРУЗКИ ПРОФИЛЯ</h4>
      <b-form class="integration-profile-form" v-else @submit.prevent="submit">
        <h2>Интеграция с другими приложениями</h2>
          <b-card class="form-group-wrapper">
              <form-transition-group>
                <h4 key="header">Nightscout</h4>
                <span v-for="(objectError, index) in objectErrors" :key="`error-${index}`"
                  class="error-text">{{ objectError }}</span>
                <b-form-group key="is-nightscout-enabled" id="is-nightscout-enabled"
                              class="form-group-inner"
                              :state="getValidationState('isNightscoutEnabled')">
                  <b-form-checkbox id="is-nightscout-enabled-checkbox"
                                   value="true" unchecked-value="false"
                                   v-model="integrationProfile.isNightscoutEnabled"
                  >
                    Включить Nightscout API
                  </b-form-checkbox>
                  <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.isNightscoutEnabled" :key="index">
                      {{ message }}
                    </span>
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group key="nightscout-api-secret" id="nightscout-api-secret"
                              class="form-group-inner"
                              label="API Secret"
                              label-for="nightscout-api-secret-input"
                              :state="getValidationState('nightscoutApiSecret')">
                  <b-form-input class="squared-input-field"
                                id="nightscout-api-secret-input" type="text"
                                v-model="integrationProfile.nightscoutApiSecret"/>
                  <b-form-invalid-feedback>
                    <span v-for="(message, index) in fieldErrors.nightscoutApiSecret" :key="index">
                      {{ message }}
                    </span>
                  </b-form-invalid-feedback>
                </b-form-group>
              </form-transition-group>
          </b-card>
        <b-button class="update-integration-profile-btn"
                  variant="outline-success"
                  type="submit"
                  :loading="submitting"
                  loading-fill
                  squared
                  size="lg">
          Сохранить
        </b-button>
      </b-form>
    </div>
</template>

<style scoped>
h4 {
  text-align: center;
}

  .integration-profile-form-wrapper {
    display: flex;
    align-items: start;
    flex: 1;

    .integration-profile-form {
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

        @media(max-width: 768px) {
          width: 90%;
        }

        .form-group-inner {
          margin-top: 1.1rem;
        }
      }
    }
  }


</style>
