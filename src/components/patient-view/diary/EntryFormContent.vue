<script setup lang="ts">
import {
  type CarbsEntry,
  type DiaryEntry,
  DiaryEntryType, type GlucoseEntry, type InsulinEntry, type MedicationEntry
} from '@/service/diaryService.ts'
import GlucoseEntryForm from '@/components/patient-view/diary/GlucoseEntryForm.vue'
import InsulinEntryForm from '@/components/patient-view/diary/InsulinEntryForm.vue'
import CarbsEntryForm from '@/components/patient-view/diary/CarbsEntryForm.vue'
import MedicationEntryForm from '@/components/patient-view/diary/MedicationEntryForm.vue'
import { useDiaryEntrySubmitting } from '@/composables/fetching/useDiaryEntrySubmitting.ts'
import { watch } from 'vue'
import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'
import ConfirmDialogModal from '@/components/ConfirmDialogModal.vue'

const props = defineProps<{
  patientId: string
  entryType: DiaryEntryType,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
  showUpdateForm?: boolean,
  entryToUpdate?: DiaryEntry
}>();

const { conflict, setAndSubmit, submit, remove, submitting,
  success, fieldErrors, objectErrors }
  = useDiaryEntrySubmitting(props.patientId, props.entryType);

const emit = defineEmits(['entries:updated']);
watch(success, (newValue) => {
  if (newValue) {
    emit('entries:updated');
  }
});
</script>

<template>
  <div class="entry-form-outer-wrapper">
    <glucose-entry-form
      v-if="entryType === DiaryEntryType.GLUCOSE_ENTRY"
      key="glucose-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :entry-to-update="entryToUpdate as GlucoseEntry"
      :glucose-unit="glucoseUnit"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
    <insulin-entry-form
      v-else-if="entryType === DiaryEntryType.INSULIN_ENTRY"
      key="insulin-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :entry-to-update="entryToUpdate as InsulinEntry"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
    <carbs-entry-form
      v-else-if="entryType === DiaryEntryType.CARBS_ENTRY"
      key="carbs-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :entry-to-update="entryToUpdate as CarbsEntry"
      :carbs-unit="carbsUnit"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
    <medication-entry-form
      v-else-if="entryType === DiaryEntryType.MEDICATION_ENTRY"
      key="medication-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :entry-to-update="entryToUpdate as MedicationEntry"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
  </div>
  <confirm-dialog-modal :is-open="conflict"
                        text="Запись на это время уже существует. Перезаписать?"
                        title="Обновление записи"
                        @confirm="submit(true)"
                        @cancel="conflict = false"
  />
</template>

<style scoped>

</style>
