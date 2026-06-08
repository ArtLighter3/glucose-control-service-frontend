import { getAttachedPatients, searchAttachedPatients, type PatientInfo }
  from "@/service/doctorService";
import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";

export function useAttachedPatientsFetching(doctorId: string) {
  const loading = ref(false);
  const patients = ref<PatientInfo[]>([]);

  const fetchingError = ref(false);

  const { page, pageIndex, totalElements, pageSize } = usePagination(1);

  const fetch = async (query: string) => {
      loading.value = true;
      fetchingError.value = false;
        try {
          const response = query === '' ?
            await getAttachedPatients(doctorId, pageIndex.value) :
            await searchAttachedPatients(doctorId, query, pageIndex.value);
          patients.value = response.data.content;
          pageSize.value = response.data.page.size;
          if (response.data.page.totalElements !== undefined)
            totalElements.value = response.data.page.totalElements;
        } catch (err) {
          fetchingError.value = true;
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

  const getPatients = async () => {
    await fetch('');
  };

  return {
    loading,
    fetchingError,
    patients,
    page,
    totalElements,
    pageSize,
    getPatients,
    search,
    turnPage
  }
}
