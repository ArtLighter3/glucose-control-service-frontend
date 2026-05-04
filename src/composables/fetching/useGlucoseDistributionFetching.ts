import { ref } from 'vue'
import { getGlucoseDistribution, type GlucoseDistribution } from '@/service/statisticsService.ts'

export function useGlucoseDistributionFetching(patientId: string) {
  const distribution = ref<GlucoseDistribution>({
    aboveHyperGlucose: 0,
    aboveHighGlucose: 0,
    inTargetRange: 0,
    belowLowGlucose: 0,
    belowHypoGlucose: 0
  });
  const loading = ref(true);

  const fetchDistribution = async (from: Date, to: Date) => {
    loading.value = true;
    try {
      const response = await getGlucoseDistribution(patientId, from, to);
      if (response.data) distribution.value = response.data;
    } catch (err) {
      console.log(err);
    }
    loading.value = false;
  };

  return { distribution, fetchDistribution, loading }
}
