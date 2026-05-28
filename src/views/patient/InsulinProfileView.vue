<script setup lang="ts">

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import InsulinProfileFormContent from '@/components/patient-view/insulin/InsulinProfileFormContent.vue'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'
import CalculateInsulinFunctionalButton
  from '@/components/patient-view/insulin/CalculateInsulinFunctionalButton.vue'

const id = ref(useRoute().params.id as string);

const { patientProfile } = usePatientProfileFetching(id.value);
</script>

<template>
  <div class="insulin-profile-view-wrapper">
    <insulin-profile-form-content :patientId="id" :glucose-unit="patientProfile.glucoseUnit"/>
    <div class="calc-button-wrapper">
      <calculate-insulin-functional-button :patientId="id"
                                           :glucose-unit="patientProfile.glucoseUnit"
                                           :carbs-unit="patientProfile.carbsUnit"
      />
    </div>
  </div>
</template>

<style scoped>
.insulin-profile-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;
}

.calc-button-wrapper {
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;

  @media (max-width: 1080px) {
    right: 50px;
    bottom: 100px;
  }
}
</style>

