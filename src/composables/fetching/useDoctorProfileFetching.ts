import { ref } from 'vue'
import { type DoctorInfo, getDoctorProfile } from '@/service/doctorService.ts'

export function useDoctorProfileFetching(doctorId: string) {
  const fetchingError = ref(false);
  const loading = ref(true);

  const doctorProfile = ref<DoctorInfo>();

  const fetch = async () => {
    loading.value = true;
    fetchingError.value = false;
    try {
      const response = await getDoctorProfile(doctorId);
      if (response.data) doctorProfile.value = response.data;
    } catch (err) {
      fetchingError.value = true;
      console.log(err);
    }
    loading.value = false;
  };

  return { doctorProfile, fetch, fetchingError, loading }
}
