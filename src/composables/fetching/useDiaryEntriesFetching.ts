import { getDiaryEntries, type DiaryEntryWithType } from "@/service/diaryService";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";

export function useDiaryEntriesFetching(patientId: string,
                                        from: Date | undefined, to: Date | undefined) {
  const loading = ref(false);
  const entries = ref<DiaryEntryWithType[]>([]);

  onMounted(async () => {
    await refreshDiary(from, to);
  });
  const refreshDiary = async (from: Date | undefined, to: Date | undefined) => {
    loading.value = true;
    try {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const response = await getDiaryEntries(patientId,
                                            (from === undefined) ? lastWeek : from,
                                            (to === undefined) ? new Date() : to);

      entries.value = response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
      }
    }
    loading.value = false;
  };

  return { loading, entries, refreshDiary };
}
