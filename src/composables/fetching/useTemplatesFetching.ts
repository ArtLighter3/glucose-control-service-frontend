import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";
import {
  getTemplates,
  searchTemplates,
  type Template,
  type TemplateType
} from '@/service/templateService.ts'

export function useTemplatesFetching(patientId: string, type: TemplateType){
  const loading = ref(false);
  const templates = ref<Template[]>([]);

  const { page, pageIndex,
    totalElements, pageSize } = usePagination(1);

  const fetch = async (query: string) => {
      loading.value = true;
        try {
          const response = query === '' ?
            await getTemplates(patientId, type, pageIndex.value) :
            await searchTemplates(patientId, type, query, pageIndex.value);
          templates.value = response.data.content;
          pageSize.value = response.data.page.size;
          if (response.data.page.totalElements !== undefined)
            totalElements.value = response.data.page.totalElements;
        } catch (err) {
          if (isAxiosError(err)) {
            console.log(err);
          }
        }
        loading.value = false;
  };

  const search = async (query: string) => {
    page.value = 1;
    await fetch(query);
  };

  const turnPage = async (query: string) => {
    await fetch(query);
  };

  const fetchAll = async () => {
    await fetch('');
  };

  return { loading, templates, page, totalElements, pageSize, fetchAll, search, turnPage }
}
