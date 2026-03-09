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
  BSpinner} from 'bootstrap-vue-next'
import { isAxiosError } from 'axios'
import BorderFrame from '@/components/BorderFrame.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

  interface GlucoseRangeForm {
    hyperGlucose: number,
    highGlucose: number,
    lowGlucose: number,
    hypoGlucose: number
  }

  interface UnitsForm {
    glucoseUnit: GlucoseUnit,
    carbsUnit: CarbsUnit
  }

  interface IntegrationForm {
    isNightscoutEnabled: boolean,
    nightscoutApiSecret: string
  }

  const props = defineProps({
    patientId: {
      type: String,
      required: true
    }
  });

  const globalError = ref(false);
  const loading = ref(true);
  const submitting = ref(false)

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

  onMounted(async () => {
    try {
      globalError.value = false;
      patientProfile.value = (await getPatientProfile(props.patientId)).data;
    } catch (err: unknown) {
      console.log(err);
      if (isAxiosError(err) && err.response) {
        if (err.response.status != 400) globalError.value = true;
      }
    }
    loading.value = false;
  });

  const submitPatientProfile = async () => {
    submitting.value = true;
    try {
      if (globalError.value) return;

      const response = await putPatientProfile(props.patientId, patientProfile.value);
      patientProfile.value = response.data;
    } catch (err) {
      console.log(err);
    }
    submitting.value = false;
  };
</script>

<template>
  <div class="profile-form-outer-wrapper">
    <b-spinner v-if="loading" variant="success"></b-spinner>
    <div class="profile-form-inner-wrapper" v-else>
      <h4 class="error-text" v-if="globalError">ОШИБКА</h4>
      <b-form class="profile-form" v-else @submit.prevent="submitPatientProfile">
        <div class="first-row">
          <border-frame class="form-group-wrapper">
            <b-form-group class="form-group" id="glucose-range">
              <h4>Пороговые значения глюкозы</h4>
              <b-form-group id="hyper-glucose"
                            label="Слишком высокая глюкоза"
                            label-for="hyper-glucose-input">
                <b-form-input class="squared-input-field"
                              id="hyper-glucose-input" type="number"
                              v-model="patientProfile.hyperGlucose"/>
              </b-form-group>
              <b-form-group id="high-glucose"
                            label="Верхняя граница нормы глюкозы"
                            label-for="high-glucose-input">
                <b-form-input class="squared-input-field"
                              id="high-glucose-input" type="number"
                              v-model="patientProfile.highGlucose"/>
              </b-form-group>
              <b-form-group id="low-glucose"
                            label="Нижняя граница нормы глюкозы"
                            label-for="low-glucose-input">
                <b-form-input class="squared-input-field"
                              id="low-glucose-input" type="number"
                              v-model="patientProfile.lowGlucose"/>
              </b-form-group>
              <b-form-group id="hypo-glucose"
                            label="Слишком низкая глюкоза"
                            label-for="hypo-glucose-input">
                <b-form-input class="squared-input-field"
                              id="hypo-glucose-input" type="number"
                              v-model="patientProfile.hypoGlucose"/>
              </b-form-group>
            </b-form-group>
          </border-frame>
          <border-frame class="form-group-wrapper">
            <b-form-group class="form-group" id="units">
              <h4>Единицы измерения</h4>
              <b-form-group id="glucose-unit"
                            label="Единицы глюкозы"
                            label-for="glucose-unit-selector">
                <b-form-select class="squared-input-field"
                               id="glucose-unit-selector" v-model="patientProfile.glucoseUnit">
                  <b-form-select-option v-for="glucoseUnit in Object.entries(GlucoseUnit)"
                                        :key="glucoseUnit[0]" :value="glucoseUnit[0]">
                    {{ glucoseUnit[1] }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group id="carbs-unit"
                            label="Единицы углеводов"
                            label-for="carbs-unit-selector">
                <b-form-select class="squared-input-field"
                               id="carbs-unit-selector" v-model="patientProfile.carbsUnit">
                  <b-form-select-option v-for="carbsUnit in Object.entries(CarbsUnit)"
                                        :key="carbsUnit[0]" :value="carbsUnit[0]">
                    {{ carbsUnit[1] }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </b-form-group>
          </border-frame>
        </div>
        <b-button class="update-profile-btn"
                  variant="outline-success"
                  type="submit"
                  :loading="submitting"
                  loading-fill
                  squared>
          Сохранить
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<style scoped>
.profile-form-outer-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;

  .profile-form-inner-wrapper {
    display: flex;
    align-items: center;
    flex: 1;

    .profile-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      flex: 1;

      .first-row {
        display: flex;
        align-items: center;
        flex: 1;
        flex-wrap: wrap;
      }

      .form-group-wrapper {
        margin: 1rem;
        flex: 1;

        .form-group {
          margin: 2rem;

          .update-profile-btn {

          }
        }
      }
    }
  }
}

</style>
