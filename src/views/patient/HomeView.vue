<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import {
  getRecentActivity,
  type RecentActivity
} from '@/service/insulinService.ts'
import {
  DefaultPatientProfile,
  getPatientProfile,
  type PatientProfile
} from '@/service/patientProfileService.ts'
import { usePatientProfileStore } from '@/stores/patientProfileStore.ts'
import { storeToRefs } from 'pinia'
import AddEntryButton from '@/components/patient-view/AddEntryButton.vue'

const id = ref(useRoute().params.id as string);
const recentActivity = ref<RecentActivity>({
  recentEntries: [],
  lastGlucoseEntry: null,
  activeInsulin: null
});

const patientProfile = ref<PatientProfile>(new DefaultPatientProfile());
const patientProfileStore = usePatientProfileStore();
const { isFetched, cachedPatientProfile } = storeToRefs(patientProfileStore);

onMounted(async () => {
  try {
    const response = await getRecentActivity(id.value);
    if (response.data) recentActivity.value = response.data;
  } catch (err) {
    console.log(err);
  }

  if (patientProfileStore.isUpToDate) {
    patientProfile.value = cachedPatientProfile.value;
  } else {
    patientProfile.value = (await getPatientProfile(id.value)).data;
    cachedPatientProfile.value = patientProfile.value;
    isFetched.value = true;
  }
});

</script>

<template>
  <div class="home-view-wrapper">
    <recent-diary-info-panel class="info-panel"
      :recent-glucose="recentActivity.lastGlucoseEntry"
      :active-insulin="recentActivity.activeInsulin"
      :carbs-unit="null"
      :overall-day-carbs="null"/>
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

  .add-button-wrapper {
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 999;
  }
}

</style>
