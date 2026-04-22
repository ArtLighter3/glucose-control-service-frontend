<script setup lang="ts">
import type { PatientInfo } from '@/service/doctorService.ts'
import PatientInfoItem from '@/components/doctor-view/PatientInfoItem.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

const props = defineProps<{
  patients: PatientInfo[],
  showDetachButtons: boolean,
  showAttachButtons: boolean
}>();

const emit = defineEmits<{
  (e: 'patient:click', patientInfo: PatientInfo): void,
  (e: 'patient:detach', patientInfo: PatientInfo): void
}>();
</script>

<template>
  <div class="patients-wrapper">
    <form-transition-group>
      <patient-info-item class="patient-info-item"
                         v-for="(patient, index) in patients"
                         :key="index"
                         :patient-info="patient"
                         :show-detach-button="showDetachButtons"
                         :show-attach-button="showAttachButtons"
                         @click="$emit('patient:click', patient)"
                         @detach:click="$emit('patient:detach', patient)"
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
