import { ref } from 'vue';
import type { FieldErrors } from '@/util/exception.ts'

export function useSubmittableForm() {
  const submitting = ref(false);
  const success = ref(false);
  const fieldErrors = ref<FieldErrors>({});
  const objectErrors = ref<string[]>([]);

  const getValidationState = (fieldName: string) => {
    if (success.value) return true;
    if (fieldErrors.value[fieldName] && fieldErrors.value[fieldName].length > 0)
      return false;

    return null;
  };

  return {
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState
  };
}
