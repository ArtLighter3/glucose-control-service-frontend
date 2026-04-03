import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import { ref } from 'vue'
import {
  deleteDiaryEntry,
  type DiaryEntry, DiaryEntryType,
  postDiaryEntry,
  putDiaryEntry
} from '@/service/diaryService.ts'
import { type AxiosResponse, isAxiosError } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception.ts'

export function useDiaryEntrySubmitting(patientId: string, entryType: DiaryEntryType) {
  const { submitting, success, fieldErrors, objectErrors, getValidationState }
    = useSubmittableForm()

  const conflict = ref(false)
  const diaryEntry = ref<DiaryEntry | null>(null)

  const setAndSubmit = async (alreadyExists: boolean, diaryEntryToSend: DiaryEntry) => {
    diaryEntry.value = diaryEntryToSend
    await submit(alreadyExists)
  }
  const submit = async (alreadyExists: boolean) => {
    submitting.value = true
    success.value = false;
    conflict.value = false
    try {
      if (diaryEntry.value === null) return;

      fieldErrors.value = {}
      objectErrors.value = []

      const response = alreadyExists
        ? await putDiaryEntry(patientId, diaryEntry.value, entryType)
        : await postDiaryEntry(patientId, diaryEntry.value, entryType)
      success.value = true
    } catch (err) {
      success.value = false
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data) {
          const exceptionResponse
            = err.response as AxiosResponse<ApiExceptionResponse>
          fieldErrors.value = exceptionResponse.data.fieldErrors
          objectErrors.value = exceptionResponse.data.objectErrors
        } else if (err.response.status === 409) {
          conflict.value = true
        }
      }
    }
    submitting.value = false
  }
  const remove = async (commitedAt: string) => {
    submitting.value = true;
    success.value = false;
    try {
      //if (diaryEntry.value === null) return;
      await deleteDiaryEntry(patientId, entryType, commitedAt);
      success.value = true
    } catch (err) {
      success.value = false
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
