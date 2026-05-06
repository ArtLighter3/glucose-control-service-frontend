import { getDiaryEntries, type DiaryEntryWithType } from "@/service/diaryService";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";

export function useDiaryEntriesFetching(patientId: string) {
  const loading = ref(false);
  const entries = ref<DiaryEntryWithType[]>([]);
  const noMoreEntries = ref(false);

  const currentTo = ref(new Date());
  const currentFrom = ref(new Date());
  currentFrom.value.setDate(currentFrom.value.getDate() - 7);

  onMounted(async () => {
    await refreshDiary(currentFrom.value, currentTo.value);
  });
  const refreshDiary = async (from: Date | undefined, to: Date | undefined) => {
    currentTo.value = (to === undefined) ? new Date() : to;
    currentFrom.value = (from === undefined) ? new Date() : from;
    if (from === undefined) currentFrom.value.setDate(currentFrom.value.getDate() - 7);

    await load(currentFrom.value, currentTo.value, false, true);
  };

  const loadMore = async () => {
    //console.log('load more');
    currentFrom.value.setDate(currentFrom.value.getDate() - 7);
    currentTo.value.setDate(currentTo.value.getDate() - 7);

    await load(currentFrom.value, currentTo.value, true, false);
  };
  const load = async (from: Date, to: Date, append: boolean, setLoadingFlag: boolean) => {
    if (setLoadingFlag) loading.value = true;

    try {
      const response = await getDiaryEntries(patientId, from, to);
      if (!append) entries.value = response.data;
      else entries.value.push(...response.data);
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
      }
    }
    loading.value = false;
  };

  return { loading, entries, refreshDiary, loadMore };
}
