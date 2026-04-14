<script setup lang="ts">
import {
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  type Point,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { DiaryEntryType, type DiaryEntryWithType } from '@/service/diaryService.ts'
import { computed, ref } from 'vue'
import 'chartjs-adapter-luxon'
import { GlucoseUnit } from '@/service/patientProfileService.ts'
import { getGlucoseUnitName } from '@/util/enumToStringLiterals.ts'
import { DateTime } from 'luxon'

type TimeRange = 'day' | 'month' | 'week'

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  entries: DiaryEntryWithType[]
  glucoseUnits: GlucoseUnit
  hyperGlucose?: number
  highGlucose?: number
  lowGlucose?: number
  hypoGlucose?: number
  timeRange: TimeRange
  // chartOptions: ChartOptions<'line'>;
}>()
const fontSize = ref(16)

// const maxGlucose = computed(() => {
//   return (props.hyperGlucose !== undefined && props.hyperGlucose !== null)
//     ? props.hyperGlucose + 2 : 40;
// });
const xMin = computed(() => {
  switch (props.timeRange) {
    case 'day':
      return '00:00'
    case 'week':
//       const dayWeekAgo = new Date();
//       dayWeekAgo.setDate(dayWeekAgo.getDate() - 7);
//     //return format(dayWeekAgo, 'yyyy-MM-dd HH:mm:ss');
    //       return DateTime.fromISO(dayWeekAgo.toISOString());
      return 'Mon'
    case 'month':
//       const dayMonthAgo = new Date();
//       dayMonthAgo.setDate(dayMonthAgo.getDate() - 30);
    //       return DateTime.fromISO(dayMonthAgo.toISOString());
      return '1';
  }
  return '1';
})
const xMax = computed(() => {
  switch (props.timeRange) {
    case 'day':
      return '23:59'
    case 'week':
      return 'Sun';
  }
  return '31'
})
const xFormat = computed(() => {
  switch (props.timeRange) {
    case 'day':
      return 'HH:mm'
    case 'week':
      return 'ccc'
  }
  return 'd'
})
const xUnit = computed(() => {
  switch (props.timeRange) {
    case 'day':
      return 'hour';
    case 'week':
      return 'week';
  }
  return 'month';
})

const data = computed((): ChartData<'line'> => {
  return {
    datasets: [
      {
        backgroundColor: '#000',
        data: props.entries
          .filter((item) => item.type === DiaryEntryType.GLUCOSE_ENTRY)
          .map((item): Point => ({ x: item.entryInfo.commitedAt, y: item.entryInfo.value })),
      },
    ],
  }
})

const options = computed((): ChartOptions<'line'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    scales: {
      x: {
        type: 'time',
        time: {
          unit: xUnit.value,
          isoWeekday: true,
          displayFormats: {
            hour: xFormat.value,
          },
        },
        title: {
          display: true,
          text: 'Время',
          color: '#000',
          font: {
            size: fontSize.value,
          },
        },
        ticks: {
          color: '#000',
          font: {
            size: fontSize.value,
          },
        },
        min: xMin.value,
        max: xMax.value,
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: `Глюкоза [${getGlucoseUnitName(props.glucoseUnits)}]`,
          color: '#000',
          font: {
            size: fontSize.value,
          },
        },
        ticks: {
          color: '#000',
          font: {
            size: fontSize.value,
          },
        },
        min: 0,
        // max: maxGlucose.value,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      title: {
        color: '#000',
        display: true,
        text: 'Уровень глюкозы',
        font: {
          size: fontSize.value,
        },
      },
      annotation: {
        annotations: {
          hyperGlucose: {
            type: 'line',
            scaleID: 'y',
            value: props.hyperGlucose,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Гипер',
              display: true,
              position: 'start',
              color: 'rgba(255, 255, 255, 1)',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            },
          },
          targetGlucose: {
            type: 'box',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderDash: [6, 6],
            yMax: props.highGlucose,
            yMin: props.lowGlucose,
            label: {
              content: 'Целевой диапазон',
              display: true,
              position: 'start',
              color: 'rgba(0, 0, 0, 0.5)',
            },
          },
          // highGlucose: {
          //   type: 'line',
          //   scaleID: 'y',
          //   value: props.highGlucose,
          //   borderColor: 'black',
          //   borderWidth: 1,
          //   label: {
          //     content: 'Целевой диапазон',
          //     position: 'end',
          //   },
          // },
          // lowGlucose: {
          //   type: 'line',
          //   scaleID: 'y',
          //   value: props.lowGlucose,
          //   borderColor: 'black',
          //   borderWidth: 1,
          // },
          hypoGlucose: {
            type: 'line',
            scaleID: 'y',
            value: props.hypoGlucose,
            borderColor: 'rgba(0, 0, 255, 0.5)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Гипо',
              display: true,
              position: 'start',
              color: 'rgba(255, 255, 255, 1)',
              backgroundColor: 'rgba(0, 0, 255, 0.5)',
            },
          },
        },
      },
    },
  }
})
</script>

<template>
  <Line class="time-chart" id="entries-chart" :data="data" :options="options"></Line>
</template>

<style scoped>
.time-chart {
  padding: 1rem;
}
</style>
