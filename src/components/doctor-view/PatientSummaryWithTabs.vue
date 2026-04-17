<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { BTabs, BTab, BSpinner } from 'bootstrap-vue-next'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'
import { useRecentActivityFetching } from '@/composables/fetching/useRecentActivityFetching.ts'
import type { PatientInfo } from '@/service/doctorService'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching.ts'

const props = defineProps<{
  patientInfo: PatientInfo
}>();

//TODO убрать из fetching composables хуки onMounted, чтобы использующие их компоненты сами
//выбирали, когда загрузить, иначе вот тут сразу два запроса делается, когда может быть нужен один.
const { recentActivity, loading: activityLoading }
  = useRecentActivityFetching(props.patientInfo.patientId);
const { loading: entriesLoading, entries, refreshDiary }
  = useDiaryEntriesFetching(props.patientInfo.patientId, undefined, undefined);
</script>

<template>
  <div class="patient-summary-wrapper">
    <h2>{{ patientInfo.lastName }}
      {{ patientInfo.firstName }}
      {{ patientInfo.middleName !== null ? patientInfo.middleName : "" }}
    </h2>
    <b-tabs pills class="tabs-wrapper" justified>
      <b-tab title="Последняя статистика" active>
        <div class="recent-tab-wrapper">
          <recent-diary-info-panel v-if="!activityLoading"
                                   :recent-glucose="recentActivity.lastGlucoseEntry"
                                   :active-insulin="recentActivity.activeInsulin"
                                   :carbs-unit="null"
                                   :overall-day-carbs="null"
          />
        </div>
      </b-tab>
      <b-tab title="Дневник измерений" lazy>
      <div class="diary-wrapper">
          <b-spinner v-if="entriesLoading" variant="success"/>
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
.patient-summary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;

  .tabs-wrapper {
    flex-grow: 1;
    width: 100%;

    .recent-tab-wrapper {
      padding-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  @media(max-width: 768px) {
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
