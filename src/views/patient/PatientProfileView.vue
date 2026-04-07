<script setup lang="ts">

import PatientProfileFormContent from '@/components/patient-view/PatientProfileFormContent.vue'
</script>

<template>
  <div class="profile-view-wrapper">
    <patient-profile-form-content :patientId="id"/>
  </div>
</template>

<style scoped>
.profile-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem
}
</style>
