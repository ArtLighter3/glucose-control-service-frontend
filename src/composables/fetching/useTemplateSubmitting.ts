import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import { ref } from 'vue'
import { type AxiosResponse, isAxiosError } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import {
  deleteTemplate,
  postTemplate,
  putTemplate,
  type Template,
  type TemplateType
} from '@/service/templateService.ts'

export function useTemplateSubmitting(patientId: string, type: TemplateType) {
  const { submitting, success,
    fieldErrors, objectErrors, getValidationState }
    = useSubmittableForm()

  const conflict = ref(false);
  const template = ref<Template | null>(null);

  const setAndSubmit = async (alreadyExists: boolean, templateToSend: Template) => {
    template.value = templateToSend;
    await submit(alreadyExists);
  }
  const submit = async (alreadyExists: boolean) => {
    submitting.value = true;
    success.value = false;
    conflict.value = false;
    try {
      if (template.value === null) return;

      fieldErrors.value = {};
      objectErrors.value = [];

      const response = alreadyExists
        ? await putTemplate(patientId, template.value, type)
        : await postTemplate(patientId, template.value, type);
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>
          fieldErrors.value = exceptionResponse.data.fieldErrors;
          objectErrors.value = exceptionResponse.data.objectErrors;
        } else if (err.response.status === 409) {
          conflict.value = true;
        }
      }
    }
    submitting.value = false;
  }
  const remove = async (name: string) => {
    submitting.value = true;
    success.value = false;
    try {
      //if (diaryEntry.value === null) return;
      await deleteTemplate(patientId, name, type);
      success.value = true;
    } catch (err) {
      success.value = false;
      if (isAxiosError(err) && err.response) {
        console.log(err);
      }
    }
    submitting.value = false;
  }

  return {
    conflict,
    setAndSubmit,
    submit,
    remove,
    submitting,
    success,
    fieldErrors,
    objectErrors,
    getValidationState
  }
}
