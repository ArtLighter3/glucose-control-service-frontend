import { ref } from "vue";
import { isAxiosError } from "axios";
import { attachToDoctor, detachFromDoctor } from '@/service/patientProfileService.ts'

export function useAttachDetachByCode(patientId: string) {
  const loading = ref(false);
  const success = ref(false);

  const attachByCode = async (doctorCode: string) => {
    loading.value = true;
    success.value = false;
      try {
        await attachToDoctor(patientId, doctorCode);
        success.value = true;
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err);
        }
      }
      loading.value = false;
  };

  const detachByCode = async (doctorCode: string) => {
      loading.value = true;
      success.value = false;
        try {
          await detachFromDoctor(patientId, doctorCode);
          success.value = true;
        } catch (err) {
          if (isAxiosError(err)) {
            console.log(err);
          }
        }
        loading.value = false;
    };

  return { loading, attachByCode, detachByCode, success }
}
