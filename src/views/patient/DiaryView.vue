<script setup lang="ts">

import FunctionalDiary from '@/components/patient-view/diary/FunctionalDiary.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddEntryButton from '@/components/patient-view/diary/AddEntryFunctionalButton.vue'
import { useRefreshComponent } from '@/composables/useRefreshComponent.ts'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'

const id = ref(useRoute().params.id as string);

const { patientProfile } = usePatientProfileFetching(id.value);
const { componentKey, refresh } = useRefreshComponent();

</script>

<template>
  <div class="diary-view">
    <functional-diary :key="componentKey"
                      :patient-id="id"
                      :carbs-unit="patientProfile.carbsUnit"
                      :glucose-unit="patientProfile.glucoseUnit"
    />
    <div class="add-button-wrapper">
      <add-entry-button @entries:added="refresh()"
                        :glucose-unit="patientProfile.glucoseUnit"
                        :carbs-unit="patientProfile.carbsUnit"
                        :patient-id="id"
      />
    </div>
  </div>
</template>

<style scoped>
.diary-view {
  display: flex;
  flex-direction: column;

  .add-button-wrapper {
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 999;

    @media (max-width: 1080px) {
      right: 50px;
      bottom: 100px;
    }
  }
}
</style>
