import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";
import { type AttachedDoctorInfo, getAttachedDoctors } from '@/service/patientProfileService.ts'

export function useAttachedDoctorsFetching(patientId: string) {
  const loading = ref(false);
  const doctors = ref<AttachedDoctorInfo[]>([]);

  const { page, pageIndex,
    totalElements, pageSize } = usePagination(1);

  const fetchingError = ref(false);

  const fetch = async () => {
      loading.value = true;
      fetchingError.value = false;
        try {
          const response
            = await getAttachedDoctors(patientId, pageIndex.value);
          doctors.value = response.data.content;
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

  return { loading, fetch, fetchingError, doctors, page, totalElements, pageSize}
}
