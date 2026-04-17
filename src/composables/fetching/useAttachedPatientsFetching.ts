import { getAttachedPatients, searchAttachedPatients, type PatientInfo }
  from "@/service/doctorService";
import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";

export function useAttachedPatientsFetching(doctorId: string) {
  const loading = ref(false);
  const patients = ref<PatientInfo[]>([]);

  const { page, pageIndex, totalElements, pageSize } = usePagination(1);

  const searchPatients = async (query: string) => {
    loading.value = true;
      try {
        const response = query === '' ?
          await getAttachedPatients(doctorId, pageIndex.value) :
          await searchAttachedPatients(doctorId, query, pageIndex.value);
        patients.value = response.data.content;
        pageSize.value = response.data.size;
        if (response.data.totalElements !== undefined)
          totalElements.value = response.data.totalElements;
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err);
        }
      }
      loading.value = false;
  };

  const getPatients = async () => {
      await searchPatients('');
  };

  return { loading, patients, page, totalElements, pageSize, getPatients, searchPatients }
}
