<script setup lang="ts">
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { AttachedDoctorInfo } from '@/service/patientProfileService.ts'
import DoctorInfoItem from '@/components/patient-view/DoctorInfoItem.vue'

const props = defineProps<{
  doctors: AttachedDoctorInfo[],
  showDetachButtons: boolean,
}>();

const emit = defineEmits<{
  (e: 'doctor:click', doctorInfo: AttachedDoctorInfo): void,
  (e: 'doctor:detach', doctorInfo: AttachedDoctorInfo): void
}>();
</script>

<template>
  <div class="doctors-wrapper">
    <form-transition-group>
      <doctor-info-item  class="doctor-info-item"
                         v-for="(doctor, index) in doctors"
                         :key="index"
                         :doctor-info="doctor"
                         :show-detach-button="showDetachButtons"
                         @click="$emit('doctor:click', doctor)"
                         @detach:click="$emit('doctor:detach', doctor)"
      />
    </form-transition-group>
  </div>
</template>

<style scoped>
.doctors-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>
