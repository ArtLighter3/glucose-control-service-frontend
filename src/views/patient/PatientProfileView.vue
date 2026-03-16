<script setup lang="ts">

import PatientProfileFormContent from '@/components/PatientProfileFormContent.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const id = ref(useRoute().params.id as string);

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
}
</style>

