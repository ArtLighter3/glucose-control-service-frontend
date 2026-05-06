import { getDiaryEntries, getAllDiaryEntries, type DiaryEntryWithType }
  from "@/service/diaryService";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import { usePagination } from "@/composables/usePagination";

export function useDiaryEntriesFetching(patientId: string) {
  const loading = ref(false);
  const entries = ref<DiaryEntryWithType[]>([]);

  const filtered = ref(false);
  const to = ref(new Date());
  const from = ref(new Date());
  from.value.setDate(from.value.getDate() - 7);

  const { pageIndex, pageSize } = usePagination(1);
  const hasNext = ref(true);

  onMounted(async () => {
    await fetchAll();
  });

  const fetchAll = async () => {
    filtered.value = false;
    pageIndex.value = 1;
    //hasNext.value = true;

    await load(false);
  }
  const reloadWithFilter = async (newFrom: Date, newTo: Date) => {
    filtered.value = true;
    pageIndex.value = 1;
    //hasNext.value = true;

    to.value = newTo;
    from.value = newFrom;

    await load(false);
  };

  const loadMore = async () => {
    if (loading.value) return;
    //console.log('load more');
//     currentFrom.value.setDate(currentFrom.value.getDate() - 7);
//     currentTo.value.setDate(currentTo.value.getDate() - 7);
    pageIndex.value = pageIndex.value + 2;

    await load(true);
  };
  const load = async (append: boolean) => {
    loading.value = true;

    try {
      const response =  !filtered.value ?
                        await getAllDiaryEntries(patientId, pageIndex.value):
                        await getDiaryEntries(patientId, from.value, to.value, pageIndex.value);

      pageSize.value = response.data.page.size;
      hasNext.value = response.data.page.hasNext;

      if (!append) entries.value = response.data.content;
      else entries.value.push(...response.data.content);
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
      }
    }

    loading.value = false;
  };

  return { loading, entries, fetchAll, hasNext, reloadWithFilter, loadMore };
}
