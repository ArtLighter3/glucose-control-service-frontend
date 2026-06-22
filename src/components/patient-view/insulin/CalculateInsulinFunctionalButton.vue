<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'
import InsulinCalculator from '@/components/patient-view/insulin/InsulinCalculator.vue'

const props = defineProps<{
  patientId: string,
  glucoseUnit: GlucoseUnit,
  carbsUnit: CarbsUnit,
}>();

const { isOpen, openModal, closeModal } = useModal()

</script>

<template>
  <b-button variant="success" class="circular-btn" size="lg" @click="openModal">
    Расчет
  </b-button>
  <base-modal :is-open="isOpen" @close="closeModal" title="Калькулятор инсулина">
    <div class="scrollable-form">
      <insulin-calculator :patient-id="patientId"
                          :carbs-unit="carbsUnit"
                          :glucose-unit="glucoseUnit"
      />
    </div>
  </base-modal>
</template>

<style scoped>
button {
  font-size: 1rem;
}

.scrollable-form {
  height: 60vh;
  overflow-y: auto;
}
</style>
