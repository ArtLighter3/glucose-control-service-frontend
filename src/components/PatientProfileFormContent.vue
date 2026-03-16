<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  CarbsUnit,
  getPatientProfile,
  GlucoseUnit,
  type PatientProfile, putPatientProfile
} from '@/service/patientProfileService.ts'
import {
  BFormInput,
  BForm,
  BFormGroup, BFormSelect, BFormSelectOption,
  BButton,
  BSpinner,
  BCard} from 'bootstrap-vue-next'
import { type AxiosResponse, isAxiosError } from 'axios'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { ApiExceptionResponse, FieldErrors } from '@/util/exception.ts'

  // type ProfilePartForm = object
  //
  // interface GlucoseRangeForm extends ProfilePartForm {
  //   hyperGlucose: number,
  //   highGlucose: number,
  //   lowGlucose: number,
  //   hypoGlucose: number
  // }
  //
  // interface UnitsForm extends ProfilePartForm {
  //   glucoseUnit: GlucoseUnit,
  //   carbsUnit: CarbsUnit
  // }
  //
  // interface IntegrationForm extends ProfilePartForm {
  //   isNightscoutEnabled: boolean,
  //   nightscoutApiSecret: string
  // }

  const props = defineProps({
    patientId: {
      type: String,
      required: true
    }
  });

  const patientProfile = ref<PatientProfile>({
    glucoseUnit: GlucoseUnit.MILLIMOLES_PER_LITER,
    carbsUnit: CarbsUnit.GRAMS,
    diabetesType: 1,
    hyperGlucose: 15,
    highGlucose: 9,
    lowGlucose: 4,
    hypoGlucose: 3,
    isNightscoutEnabled: false,
    nightscoutApiSecret: ""
  });

  const globalError = ref(false);
  const loading = ref(true);
  onMounted(async () => {
    try {
      globalError.value = false;
      patientProfile.value = (await getPatientProfile(props.patientId)).data;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        globalError.value = true;
      }
    }
    loading.value = false;
  });

  const submitting = ref(false);
  const success = ref(false);
  const fieldErrors = ref<FieldErrors>({});
  const objectErrors = ref<string[]>([]);
  /*const submitProfilePart = async (profilePart: ProfilePartForm) => {

  };*/
  const submitForm = async () => {
    submitting.value = true;
    try {
      if (globalError.value) return;
      fieldErrors.value = {};
      objectErrors.value = [];

      const response = await putPatientProfile(props.patientId, patientProfile.value);
      patientProfile.value = response.data;
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>;
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        }
      }
    }
    submitting.value = false;
  };

  const getValidationState = (fieldName: string, errors: FieldErrors) => {
    if (success.value) return true;
    if (errors[fieldName] && errors[fieldName].length > 0) return false;

    return null;
  };
</script>

<template>
<!--  <div class="profile-form-outer-wrapper">-->
    <b-spinner v-if="loading" variant="success"></b-spinner>
    <div class="profile-form-inner-wrapper" v-else>
      <h4 class="error-text" v-if="globalError">ОШИБКА</h4>
      <b-form class="profile-form" v-else @submit.prevent="submitForm">
        <h2>НАСТРОЙКИ ПРОФИЛЯ</h2>
        <div class="first-row">
          <b-card class="form-group-wrapper">
            <b-form-group class="form-group" id="glucose-range">
              <form-transition-group>
                <h4 key="header">Пороговые значения глюкозы</h4>
                <span v-for="(objectError, index) in objectErrors" :key="`error-${index}`"
                  class="error-text">{{ objectError }}</span>
                <b-form-group key="hyper-glucose" id="hyper-glucose"
                              class="form-group-inner"
                              label="Слишком высокая глюкоза"
                              label-for="hyper-glucose-input"
                              :state="getValidationState('hyperGlucose', fieldErrors)"
                              :invalid-feedback="fieldErrors.hyperGlucose">
                  <b-form-input class="squared-input-field"
                                id="hyper-glucose-input" type="number"
                                v-model="patientProfile.hyperGlucose"/>
                </b-form-group>
                <b-form-group key="high-glucose" id="high-glucose"
                              class="form-group-inner"
                              label="Верхняя граница нормы глюкозы"
                              label-for="high-glucose-input"
                              :state="getValidationState('highGlucose', fieldErrors)"
                              :invalid-feedback="fieldErrors.highGlucose">
                  <b-form-input class="squared-input-field"
                                id="high-glucose-input" type="number"
                                v-model="patientProfile.highGlucose"/>
                </b-form-group>
                <b-form-group key="low-glucose" id="low-glucose"
                              class="form-group-inner"
                              label="Нижняя граница нормы глюкозы"
                              label-for="low-glucose-input"
                              :state="getValidationState('lowGlucose', fieldErrors)"
                              :invalid-feedback="fieldErrors.lowGlucose">
                  <b-form-input class="squared-input-field"
                                id="low-glucose-input" type="number"
                                v-model="patientProfile.lowGlucose"/>
                </b-form-group>
                <b-form-group key="hypo-glucose" id="hypo-glucose"
                              class="form-group-inner"
                              label="Слишком низкая глюкоза"
                              label-for="hypo-glucose-input"
                              :state="getValidationState('hypoGlucose', fieldErrors)"
                              :invalid-feedback="fieldErrors.hypoGlucose">
                  <b-form-input class="squared-input-field"
                                id="hypo-glucose-input" type="number"
                                v-model="patientProfile.hypoGlucose"/>
                </b-form-group>
              </form-transition-group>
            </b-form-group>
          </b-card>
          <b-card class="form-group-wrapper">
            <b-form-group class="form-group" id="units">
              <h4>Единицы измерения</h4>
              <b-form-group id="glucose-unit"
                            class="form-group-inner"
                            label="Единицы глюкозы"
                            label-for="glucose-unit-selector"
                            :state="getValidationState('glucoseUnit', fieldErrors)"
                            :invalid-feedback="fieldErrors.glucoseUnit">
                <b-form-select class="squared-input-field"
                               id="glucose-unit-selector" v-model="patientProfile.glucoseUnit">
                  <b-form-select-option v-for="glucoseUnit in Object.entries(GlucoseUnit)"
                                        :key="glucoseUnit[0]" :value="glucoseUnit[0]">
                    {{ glucoseUnit[1] }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group id="carbs-unit"
                            class="form-group-inner"
                            label="Единицы углеводов"
                            label-for="carbs-unit-selector"
                            :state="getValidationState('carbsUnit', fieldErrors)"
                            :invalid-feedback="fieldErrors.carbsUnit">
                <b-form-select class="squared-input-field"
                               id="carbs-unit-selector" v-model="patientProfile.carbsUnit">
                  <b-form-select-option v-for="carbsUnit in Object.entries(CarbsUnit)"
                                        :key="carbsUnit[0]" :value="carbsUnit[0]">
                    {{ carbsUnit[1] }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </b-form-group>
          </b-card>
        </div>
        <b-button class="update-profile-btn"
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
<!--  </div>-->
</template>

<style scoped>
h4{
  text-align: center;
}

  .profile-form-inner-wrapper {
    display: flex;
    align-items: start;
    flex: 1;

    .profile-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      flex: 1;

      .first-row {
        display: flex;
        align-items: start;
        width: 100%;
        flex: 1;
        flex-flow: row wrap;
      }

      .form-group-wrapper {
        margin: 1rem;
        flex: 1;
        flex-basis: 250px;

        .form-group {
          margin: 2rem;

          .form-group-inner {
            margin-top: 1.1rem;
          }
        }
      }
    }
  }


</style>
