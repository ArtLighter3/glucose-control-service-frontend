import { attachPatient, detachPatient }
  from "@/service/doctorService";
import { ref } from "vue";
import { isAxiosError } from "axios";

export function usePatientsAttachDetach(doctorId: string) {
  const loading = ref(false);
  const success = ref(false);

  const attach = async (patientId: string) => {
    loading.value = true;
    success.value = false;
      try {
        await attachPatient(doctorId, patientId);
        success.value = true;
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err);
        }
      }
      loading.value = false;
  };

  const detach = async (patientId: string) => {
      loading.value = true;
      success.value = false;
        try {
          await detachPatient(doctorId, patientId);
          success.value = true;
        } catch (err) {
          if (isAxiosError(err)) {
            console.log(err);
          }
        }
        loading.value = false;
    };

  return { loading, attach, detach, success }
}
