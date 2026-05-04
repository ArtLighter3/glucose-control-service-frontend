import { ref } from 'vue'
import { getRecentActivity, type RecentActivity } from '@/service/statisticsService.ts'

export function useRecentActivityFetching(patientId: string) {
  const recentActivity = ref<RecentActivity>({
    recentEntries: [],
    lastGlucoseEntry: null,
    activeInsulin: null
  });
  const loading = ref(true);


  const fetchActivity = async () => {
    loading.value = true;
    try {
      const response = await getRecentActivity(patientId);
      if (response.data) recentActivity.value = response.data;
    } catch (err) {
      console.log(err);
    }
    loading.value = false;
  };

  return { recentActivity, fetchActivity, loading }
}
