import { onMounted, ref } from 'vue'
import { getRecentActivity, type RecentActivity } from '@/service/insulinService.ts'

export function useRecentActivityFetching(patientId: string) {
  const recentActivity = ref<RecentActivity>({
    recentEntries: [],
    lastGlucoseEntry: null,
    activeInsulin: null
  });
  const loading = ref(true);

  onMounted(async () => {
    loading.value = true;
    try {
      const response = await getRecentActivity(patientId);
      if (response.data) recentActivity.value = response.data;
    } catch (err) {
      console.log(err);
    }
    loading.value = false;
  });

  return { recentActivity, loading }
}
