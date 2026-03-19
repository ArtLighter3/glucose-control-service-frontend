<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import type { GlucoseEntry } from '@/service/diaryService.ts'
import type { CarbsUnit } from '@/service/patientProfileService.ts'
import {
  getInsulinProfile,
  getRecentActivity,
  type RecentActivity
} from '@/service/insulinService.ts'
import { isAxiosError } from 'axios'

const id = ref(useRoute().params.id as string);
const recentActivity = ref<RecentActivity>({
  recentEntries: [],
  lastGlucoseEntry: null,
  activeInsulin: null
});

onMounted(async () => {
  try {
    const response = await getRecentActivity(id.value);
    if (response.data) recentActivity.value = response.data;
  } catch (err) {
    console.log(err);
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
  </div>
</template>

<style scoped>
.home-view-wrapper{
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

</style>
