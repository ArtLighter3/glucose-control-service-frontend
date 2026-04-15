<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { BTabs, BTab } from 'bootstrap-vue-next'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import { useRecentActivityFetching } from '@/composables/fetching/useRecentActivityFetching.ts'

const props = defineProps<{
  patientId: string
}>();

const { recentActivity, loading: activityLoading }
  = useRecentActivityFetching(props.patientId.value);
const { loading, entries, refreshDiary }
  = useDiaryEntriesFetching(props.patientId, undefined, undefined);
</script>

<template>
  <div class="patient-diary-for-doctor-view-wrapper">
    <b-tabs pills class="tabs-wrapper" justified>
      <b-tab title="Последняя статистика" active>
        <recent-diary-info-panel v-if="!activityLoading"
              :recent-glucose="recentActivity.lastGlucoseEntry"
              :active-insulin="recentActivity.activeInsulin"
              :carbs-unit="null"
              :overall-day-carbs="null"
        />
      </b-tab>
      <b-tab title="Дневник измерений" lazy>
      <div class="diary-wrapper">
          <b-spinner v-if="loading" variant="success"/>
          <diary-entries-list v-else
            @entry:click=""
            :entries="entries"
          />
      </div>
      </b-tab>
      <b-tab title="Визуализация измерений" lazy>

      </b-tab>
    </b-tabs>
  </div>
</template>

<style scoped>
.patient-diary-for-doctor-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;

  .tabs-wrapper {
    flex-grow: 1;
  }

  @media(max-width: 768px) {
    padding-left: 4rem;
    padding-right: 1rem;
  }
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt);
  }
}
</style>
