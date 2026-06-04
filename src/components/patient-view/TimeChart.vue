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

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
  entries: DiaryEntryWithType[]
  glucoseUnits: GlucoseUnit
  hyperGlucose?: number
  highGlucose?: number
  lowGlucose?: number
  hypoGlucose?: number
}>();
const fontSize = ref(16);

const data = computed((): ChartData<'line'> => {
  return {
    datasets: [
      {
        backgroundColor: '#000',
        data: props.entries
          .filter((item) => item.type === DiaryEntryType.GLUCOSE_ENTRY)
          .map((item): Point => ({
            // @ts-expect-error по каким-то причинам ts не понимает,
            // что у графика тип оси - временной, и он может принимать строки
            x: new Date(item.entryInfo.commitedAt),
            y: item.entryInfo.value
          })),
      },
    ],
  }
});

const options = computed((): ChartOptions<'line'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        //   isoWeekday: true,
        //   displayFormats: {
        //     hour: xFormat.value,
        //   },
        },
        title: {
          display: true,
          text: 'День',
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
        // min: xMin.value,
        // max: xMax.value,
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
});
</script>

<template>
  <Line class="time-chart" id="entries-chart" :data="data" :options="options"></Line>
</template>

<style scoped>
.time-chart {
  padding: 1rem;
}
</style>
