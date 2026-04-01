<script setup lang="ts">
import {
  Chart as ChartJS, TimeScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, type ChartData, type ChartOptions, type Point
} from 'chart.js'
import { Line } from 'vue-chartjs';
import { type DiaryEntry, isGlucoseEntry } from '@/service/diaryService.ts'
import { computed, ref } from 'vue'
import 'chartjs-adapter-luxon'
import { GlucoseUnit } from '@/service/patientProfileService.ts'

type TimeRange = "day" | "month" | "week";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
  entries: DiaryEntry[];
  glucoseUnits: GlucoseUnit;
  hyperGlucose?: number;
  highGlucose?: number;
  lowGlucose?: number;
  hypoGlucose?: number;
  timeRange: TimeRange;
 // chartOptions: ChartOptions<'line'>;
}>();
const fontSize = ref(16);

// const maxGlucose = computed(() => {
//   return (props.hyperGlucose !== undefined && props.hyperGlucose !== null)
//     ? props.hyperGlucose + 2 : 40;
// });



const data = computed((): ChartData<'line'> => {
  return {
    datasets: [
      {
        backgroundColor: '#000',
        data: props.entries
          .filter((item) => isGlucoseEntry(item))
          .map((item): Point => ({x: item.commitedAt, y: item.value}))
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
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Время',
          color: "#000",
          font: {
            size: fontSize.value
          }
        },
        ticks: {
          color: "#000",
          font: {
            size: fontSize.value
          }
        },
        min: "00:00",
        max: "23:59"
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: `Глюкоза [${GlucoseUnit[props.glucoseUnits as keyof typeof GlucoseUnit]}]`,
          color: "#000",
          font: {
            size: fontSize.value
          }
        },
        ticks: {
          color: "#000",
          font: {
            size: fontSize.value
          }
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
        color: "#000",
        display: true,
        text: "Уровень глюкозы",
        font: {
          size: fontSize.value
        }
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
              content: "Целевой диапазон",
              display: true,
              position: 'start',
              color: 'rgba(0, 0, 0, 0.5)'
            }
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
        }
      }
    }
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
