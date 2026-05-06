<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { BTabs, BTab, BSpinner } from 'bootstrap-vue-next'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'
import GlucoseDistributionChart from '@/components/patient-view/GlucoseDistributionChart.vue'
import DateFilterForm from '@/components/DateFilterForm.vue'
import { useRecentActivityFetching } from '@/composables/fetching/useRecentActivityFetching.ts'
import type { PatientInfo } from '@/service/doctorService'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching.ts'
import { onMounted } from 'vue'
import { useGlucoseDistributionFetching } from '@/composables/fetching/useGlucoseDistributionFetching'
import { useDatePeriodFilter } from '@/composables/useDatePeriodFilter'

const props = defineProps<{
  patientInfo: PatientInfo
}>();

//TODO убрать из fetching composables хуки onMounted, чтобы использующие их компоненты сами
//выбирали, когда загрузить, иначе вот тут сразу два запроса делается, когда может быть нужен один.
const { recentActivity, fetchActivity, loading: activityLoading }
  = useRecentActivityFetching(props.patientInfo.patientId);
const { distribution, fetchDistribution, loading: distributionLoading }
  = useGlucoseDistributionFetching(props.patientInfo.patientId);
const { loading: entriesLoading, entries, refreshDiary }
  = useDiaryEntriesFetching(props.patientInfo.patientId);

const { fromFormatted: diaryFromString, toFormatted: diaryToString, from: diaryFrom, to: diaryTo }
  = useDatePeriodFilter();
const diaryDateFilterRef = ref(null);
const { fromFormatted: statsFromString, toFormatted: statsToString, from: statsFrom, to: statsTo }
  = useDatePeriodFilter();
const statsDateFilterRef = ref(null);

const refreshPatientDiary = async () => {
  const filtered = diaryDateFilterRef.value !== null ? diaryDateFilterRef.value.filtered : false;
  await refreshDiary(filtered ? diaryFrom.value : undefined,
                     filtered ? diaryTo.value : undefined);
};
const refreshDistribution = async () => {
  const filtered = statsDateFilterRef.value !== null ? statsDateFilterRef.value.filtered : false;
  await fetchDistribution(filtered ? statsFrom.value : undefined,
                          filtered ? statsTo.value : undefined);
};

onMounted(async () => {
  await fetchActivity();

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  await fetchDistribution(lastWeek, today);
});
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
          <date-filter-form ref="diaryDateFilterRef"
                  v-model:from="diaryFromString"
                  v-model:to="diaryToString"
                  @apply="refreshPatientDiary"
                  @cancel="refreshPatientDiary"
          />
          <b-spinner v-if="entriesLoading" variant="success"/>
          <diary-entries-list v-else
            @entry:click=""
            :entries="entries"
          />
      </div>
      </b-tab>
      <b-tab title="Визуализация измерений" lazy>
        <date-filter-form ref="statsDateFilterRef"
                          v-model:from="statsFromString"
                          v-model:to="statsToString"
                          @apply="refreshDistribution"
                          :show-cancel-button="false"
        />
        <glucose-distribution-chart :distribution="distribution" />
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
