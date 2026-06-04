<script setup lang="ts">
import { ref } from 'vue'
import { BTabs, BTab, BSpinner } from 'bootstrap-vue-next'
import RecentDiaryInfoPanel from '@/components/patient-view/RecentDiaryInfoPanel.vue'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'
import DateFilterForm from '@/components/DateFilterForm.vue'
import { useRecentActivityFetching } from '@/composables/fetching/useRecentActivityFetching.ts'
import type { PatientInfo } from '@/service/doctorService'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching.ts'
import { onMounted } from 'vue'
import { useDatePeriodFilter } from '@/composables/useDatePeriodFilter'
import { useInfiniteScroll } from '@vueuse/core'
import SelectableAnalytics from '@/components/patient-view/SelectableAnalytics.vue'

const props = defineProps<{
  patientInfo: PatientInfo
}>();

//TODO убрать из fetching composables хуки onMounted, чтобы использующие их компоненты сами
//выбирали, когда загрузить, иначе вот тут сразу два запроса делается, когда может быть нужен один.
const { recentActivity, fetchActivity, loading: activityLoading }
  = useRecentActivityFetching(props.patientInfo.patientId);
const { loading: entriesLoading, entries, reloadWithFilter, loadMore, fetchAll, hasNext }
  = useDiaryEntriesFetching(props.patientInfo.patientId);

const { fromFormatted: diaryFromString, toFormatted: diaryToString, from: diaryFrom, to: diaryTo,
  saveFilterValues: saveDiaryFilterValues }
  = useDatePeriodFilter("diary-from", "diary-to");
const diaryDateFilterRef = ref<InstanceType<typeof DateFilterForm> | null>(null);

const refreshPatientDiary = async () => {
  const filtered = diaryDateFilterRef.value !== null ? diaryDateFilterRef.value.filtered : false;
  if (filtered) {
    await reloadWithFilter(diaryFrom.value, diaryTo.value);
    saveDiaryFilterValues();
  }
  else await fetchAll();
};
const entryListRef = ref(null);
const { reset } = useInfiniteScroll(
  entryListRef,
  () => {
    loadMore();
  },
  {
    distance: 10,
    canLoadMore: () => {
      return hasNext.value;
    }
  }
);

onMounted(async () => {
  await fetchActivity();
  await refreshPatientDiary();
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
      <b-tab title="Дневник" lazy>
      <div class="diary-wrapper">
          <date-filter-form ref="diaryDateFilterRef"
                  v-model:from="diaryFromString"
                  v-model:to="diaryToString"
                  @apply="refreshPatientDiary"
                  @cancel="refreshPatientDiary"
          />
          <div class="entry-list-wrapper" ref="entryListRef">
            <diary-entries-list
                        :entries="entries"
            />
            <b-spinner v-if="entriesLoading" variant="success"/>
          </div>
      </div>
      </b-tab>
      <b-tab title="Визуализация" lazy>
        <selectable-analytics :patient-id="patientInfo.patientId"/>
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

    .entry-list-wrapper {
      height: 60vh;
      overflow-y: auto;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  @media(max-width: 1080px) {
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
