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
import { useRoute } from 'vue-router'

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

  const id = useRoute().params.id as string;

  const error = ref(false);
  const loading = ref(true);

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
      error.value = false;
      patientProfile.value = (await getPatientProfile(id)).data;
      loading.value = false;
    } catch (err) {
      console.log(err);
      error.value = true;
    }
  });

  const submitPatientProfile = async () => {
    try {
      if (error.value) return;

      const response = await putPatientProfile(id, patientProfile.value);
      patientProfile.value = response.data;
    } catch (err) {
      console.log(err);
    }
  };
</script>

<template>
  <BSpinner v-if="loading" variant="success"></BSpinner>
  <BForm v-else @submit.prevent="submitPatientProfile">
    <BFormGroup id="glucose-range">
      <BFormGroup id="hyper-glucose"
                  label="Слишком высокая глюкоза"
                  label-for="hyper-glucose-input">
        <BFormInput id="hyper-glucose-input" type="number" v-model="patientProfile.hyperGlucose"/>
      </BFormGroup>
      <BFormGroup id="high-glucose"
                  label="Верхняя граница нормы глюкозы"
                  label-for="high-glucose-input">
        <BFormInput id="high-glucose-input" type="number" v-model="patientProfile.highGlucose"/>
      </BFormGroup>
      <BFormGroup id="low-glucose"
                  label="Нижняя граница нормы глюкозы"
                  label-for="low-glucose-input">
        <BFormInput id="low-glucose-input" type="number" v-model="patientProfile.lowGlucose"/>
      </BFormGroup>
      <BFormGroup id="hypo-glucose"
                  label="Слишком низкая глюкоза"
                  label-for="hypo-glucose-input">
        <BFormInput id="hypo-glucose-input" type="number" v-model="patientProfile.hypoGlucose"/>
      </BFormGroup>
    </BFormGroup>

    <BFormGroup id="units">
      <BFormGroup id="glucose-unit"
                  label="Единицы глюкозы"
                  label-for="glucose-unit-selector">
        <BFormSelect id="glucose-unit-selector" v-model="patientProfile.glucoseUnit">
          <BFormSelectOption v-for="glucoseUnit in Object.entries(GlucoseUnit)"
                             :key="glucoseUnit[0]" :value="glucoseUnit[0]">
            {{ glucoseUnit[1] }}
          </BFormSelectOption>
        </BFormSelect>
      </BFormGroup>
      <BFormGroup id="carbs-unit"
                  label="Единицы углеводов"
                  label-for="carbs-unit-selector">
        <BFormSelect id="carbs-unit-selector" v-model="patientProfile.carbsUnit">
          <BFormSelectOption v-for="carbsUnit in Object.entries(CarbsUnit)"
                             :key="carbsUnit[0]" :value="carbsUnit[0]">
            {{ carbsUnit[1] }}
          </BFormSelectOption>
        </BFormSelect>
      </BFormGroup>
    </BFormGroup>
    <BButton variant="outline-success" type="submit" squared>Сохранить</BButton>
  </BForm>
</template>

<style scoped>

</style>
