import { ref } from "vue";
import { isAxiosError } from "axios";
import { attachToDoctor, detachFromDoctor } from '@/service/patientProfileService.ts'

export function useAttachDetachByCode(patientId: string) {
  const loading = ref(false);
  const success = ref(true);
  const conflict = ref(false);

  const attachByCode = async (doctorCode: string) => {
    loading.value = true;
    success.value = true;
    conflict.value = false;
      try {
        await attachToDoctor(patientId, doctorCode);
        success.value = true;
      } catch (err) {
        success.value = false;
        if (isAxiosError(err) && err.response && err.response.status === 409) {
          conflict.value = true;
        }
      }
      loading.value = false;
  };

  const detachByCode = async (doctorCode: string) => {
      loading.value = true;
      success.value = true;
        try {
          await detachFromDoctor(patientId, doctorCode);
          success.value = true;
        } catch (err) {
          success.value = false;
          if (isAxiosError(err)) {
            console.log(err);
          }
        }
        loading.value = false;
    };

  return { loading, attachByCode, conflict, detachByCode, success }
}
