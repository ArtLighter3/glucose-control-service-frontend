<script setup lang="ts">

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import AddEntryButton from '@/components/patient-view/diary/AddEntryButton.vue'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'
import { useRecentActivityFetching } from '@/composables/fetching/useRecentActivityFetching.ts'
import TimeChart from '@/components/patient-view/GlucoseTimeChart.vue'
import {BSpinner, BCard} from 'bootstrap-vue-next'

const id = ref(useRoute().params.id as string);

const { patientProfile } = usePatientProfileFetching(id.value);
const { recentActivity, loading: activityLoading } = useRecentActivityFetching(id.value);

</script>

<template>
  <div class="home-view-wrapper">
    <recent-diary-info-panel v-if="!activityLoading"
      :recent-glucose="recentActivity.lastGlucoseEntry"
      :active-insulin="recentActivity.activeInsulin"
      :carbs-unit="null"
      :overall-day-carbs="null"/>
    <b-spinner v-else/>
    <b-card class="chart-wrapper">
      <time-chart v-if="!activityLoading" :entries="recentActivity.recentEntries"
                  :glucose-units="patientProfile.glucoseUnit"
                  :hyper-glucose="patientProfile.hyperGlucose"
                  :high-glucose="patientProfile.highGlucose"
                  :low-glucose="patientProfile.lowGlucose"
                  :hypo-glucose="patientProfile.hypoGlucose"
                  time-range="day"/>
      <b-spinner v-else/>
    </b-card>

    <div class="add-button-wrapper">
      <add-entry-button :patient-id="id"></add-entry-button>
    </div>
  </div>

</template>

<style scoped>
.home-view-wrapper{
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 3rem;

  .chart-wrapper {
    width: 70%;
    flex-grow: 1;

    @media (max-width: 768px) {
      width: 85%;
    }
  }

  .add-button-wrapper {
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 999;

    @media (max-width: 768px) {
      right: 50px;
      bottom: 100px;
    }
  }
}

</style>
