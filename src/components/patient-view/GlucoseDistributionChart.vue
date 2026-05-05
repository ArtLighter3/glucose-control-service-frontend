<script setup lang="ts">
import {
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Legend,
  ArcElement,
  CategoryScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import { computed, ref } from 'vue'
import type { GlucoseDistribution } from '@/service/statisticsService'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps<{
  distribution: GlucoseDistribution
}>();
const fontSize = ref(16);

const data = computed((): ChartData<'pie'> => {
  return {
    labels: ['Гипер', 'Высокий', 'В целевом диапазоне', 'Низкий', 'Гипо'],
    datasets: [
      {
        backgroundColor: ['#FF4500', '#FFD700', '#009900', '#66CDAA', '#7B68EE'],
        data: [props.distribution.aboveHyperGlucose, props.distribution.aboveHighGlucose,
          props.distribution.inTargetRange, props.distribution.belowLowGlucose,
          props.distribution.belowHypoGlucose]
      },
    ],
  }
})

const options = computed((): ChartOptions<'pie'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    //borderColor: 'rgba(0, 0, 0, 0.25)',
  }
})
</script>

<template>
  <Pie class="distribution-chart" id="distribution-chart" :data="data" :options="options"></Pie>
</template>

<style scoped>
.distribution-chart {
  padding: 1rem;
}
</style>
