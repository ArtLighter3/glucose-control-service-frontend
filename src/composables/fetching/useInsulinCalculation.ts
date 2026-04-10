import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import { ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import {
  calculateInsulin,
  type InsulinCalculationRequest,
  type InsulinResult
} from '@/service/insulinService.ts'

export function useInsulinCalculation(patientId: string) {
  const { submitting: calculating, success,
    fieldErrors, objectErrors, getValidationState }
    = useSubmittableForm()

  const calculationData = ref<InsulinCalculationRequest>({
    carbs: 0,
    glucose: null,
    considerActiveInsulin: false,
    correctGlucoseLevel: false,
    correction: 0,
  });
  const calculationResult = ref<InsulinResult | null>(null);

  const calculate = async () => {
    calculating.value = true;
    success.value = false;
    try {
      fieldErrors.value = {};
      objectErrors.value = [];

      const response
        = await calculateInsulin(patientId, calculationData.value);
      calculationResult.value = response.data;
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>;
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        }
      }
    }
    calculating.value = false;
  }

  return {
    calculationData,
    calculate,
    calculating,
    success,
    fieldErrors,
    objectErrors,
    getValidationState,
    calculationResult
  }
}
