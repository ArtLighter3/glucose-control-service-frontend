<script setup lang="ts">

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import InsulinProfileFormContent from '@/components/patient-view/InsulinProfileFormContent.vue'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'

const id = ref(useRoute().params.id as string);

const { patientProfile } = usePatientProfileFetching(id.value);
</script>

<template>
  <div class="insulin-profile-view-wrapper">
    <insulin-profile-form-content :patientId="id" :glucose-unit="patientProfile.glucoseUnit"/>
  </div>
</template>

<style scoped>
.insulin-profile-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;
}
</style>

