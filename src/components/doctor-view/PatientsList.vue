<script setup lang="ts">
import type { PatientInfo } from '@/service/doctorService.ts'
import PatientInfoItem from '@/components/doctor-view/PatientInfoItem.vue'
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

const props = defineProps<{
  patients: PatientInfo[],
}>();

const emit = defineEmits<{
  (e: 'patient:click', patientInfo: PatientInfo): void
}>();
</script>

<template>
  <div class="patients-wrapper">
    <form-transition-group>
      <patient-info-item class="patient-info-item"
                         v-for="(patient, index) in patients"
                         :key="index"
                         :patient-info="patient"
                         @click="$emit('patient:click', patient)"
      />
    </form-transition-group>
  </div>
</template>

<style scoped>
.patients-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>
