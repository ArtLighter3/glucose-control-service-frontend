<script setup lang="ts">
import { BFormSelect, BFormSelectOption } from 'bootstrap-vue-next'
import { onMounted, ref, watch } from 'vue'
import GlucoseDistributionChart from '@/components/patient-view/GlucoseDistributionChart.vue'
import { useGlucoseDistributionFetching } from '@/composables/fetching/useGlucoseDistributionFetching.ts'
import { useDatePeriodFilter } from '@/composables/useDatePeriodFilter.ts'
import DateFilterForm from '@/components/DateFilterForm.vue'
import { ru } from 'date-fns/locale/ru'
import { format } from 'date-fns'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching.ts'
import TimeChart from '@/components/patient-view/TimeChart.vue'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'

enum AnalyticsType {
  TIME_CHART = 'TIME_CHART',
  GLUCOSE_DISTRIBUTION = 'GLUCOSE_DISTRIBUTION',
}

const props = defineProps<{
  patientId: string,
  patientView?: boolean
}>()

const getAnalyticsTypeName = (type: AnalyticsType) => {
  switch (type) {
    case AnalyticsType.TIME_CHART:
      return 'Временной график';
    case AnalyticsType.GLUCOSE_DISTRIBUTION:
      return 'Распределение глюкозы по диапазонам';
  }

  return 'Отсутствует';
}

const { fromFormatted, toFormatted, from, to, saveFilterValues } = useDatePeriodFilter(
  'stats-from',
  'stats-to',
)
const constantFrom = ref<Date>(new Date(from.value))
const constantTo = ref<Date>(new Date(to.value))
const dateFilterRef = ref<InstanceType<typeof DateFilterForm> | null>(null)

const {
  distribution,
  fetchDistribution,
  loading: distributionLoading,
} = useGlucoseDistributionFetching(props.patientId)
const {
  loading: entriesLoading,
  entries,
  hasNext: hasNextEntries,
  loadAndAppendAllWithFilter: fetchEntries,
  loadMore: loadMoreEntries,
} = useDiaryEntriesFetching(props.patientId)
const { patientProfile, fetch: fetchPatientProfile }
  = usePatientProfileFetching(props.patientId,
                    props.patientView !== undefined ? props.patientView : false);

const analyticsType = ref<AnalyticsType>(
  AnalyticsType[
    (localStorage.getItem('selected-analytics') ??
      AnalyticsType.TIME_CHART) as keyof typeof AnalyticsType
  ],
)
const refreshGraphics = async () => {
  saveFilterValues()

  switch (analyticsType.value) {
    case AnalyticsType.TIME_CHART:
      await fetchEntries(from.value, to.value)
      break
    case AnalyticsType.GLUCOSE_DISTRIBUTION:
      await fetchDistribution(from.value, to.value)
      break
  }

  constantFrom.value = new Date(from.value)
  constantTo.value = new Date(to.value)
}

onMounted(async () => {
  await fetchPatientProfile();
  await refreshGraphics();
})
watch(analyticsType, (newType) => {
  localStorage.setItem('selected-analytics', analyticsType.value)
  refreshGraphics()
})
</script>

<template>
  <div class="selectable-analytics-wrapper">
    <div class="filter-wrapper">
      <date-filter-form
        ref="dateFilterRef"
        v-model:from="fromFormatted"
        v-model:to="toFormatted"
        @apply="refreshGraphics"
        :show-cancel-button="false"
      />
    </div>
    <div class="selector-wrapper">
      <b-form-select
        class="squared-input-field"
        id="analytics-selector"
        key="analytics-selector"
        label="Тип"
        v-model="analyticsType"
      >
        <b-form-select-option
          v-for="type in Object.entries(AnalyticsType)"
          :key="type[0]"
          :value="type[0]"
        >
          {{ getAnalyticsTypeName(type[1]) }}
        </b-form-select-option>
      </b-form-select>
    </div>
    <div class="date-wrapper">
      {{ format(constantFrom, 'd MMM, yyyy', { locale: ru }) }} -
      {{ format(constantTo, 'd MMM, yyyy', { locale: ru }) }}
    </div>
    <div class="graphics-wrapper">
      <time-chart v-if="analyticsType === AnalyticsType.TIME_CHART"
                  :entries="entries"
                  :glucose-units="patientProfile.glucoseUnit"
                  :hyper-glucose="patientProfile.hyperGlucose"
                  :high-glucose="patientProfile.highGlucose"
                  :low-glucose="patientProfile.lowGlucose"
                  :hypo-glucose="patientProfile.hypoGlucose"
      />
      <glucose-distribution-chart
        v-else-if="analyticsType === AnalyticsType.GLUCOSE_DISTRIBUTION"
        :distribution="distribution"
      />
    </div>
  </div>
</template>

<style scoped>
.selectable-analytics-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  height: 85vh;
  overflow-y: auto;

  .graphics-wrapper {
    width: 80%;
    height: 100vh;
    position: relative;
    overflow-x: auto;

    @media (max-width: 1080px) {
      width: 100%;
    }
  }

  @media (max-width: 1080px) {
    height: 90vh;
  }
}
</style>
