<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import {
  DiaryEntryType,
} from '@/service/diaryService.ts'
import BaseModal from '@/components/BaseModal.vue'
import GlucoseEntryForm from '@/components/patient-view/diary/GlucoseEntryForm.vue'
import InsulinEntryForm from '@/components/patient-view/diary/InsulinEntryForm.vue'
import CarbsEntryForm from '@/components/patient-view/diary/CarbsEntryForm.vue'
import MedicationEntryForm from '@/components/patient-view/diary/MedicationEntryForm.vue'
import { useDiaryEntrySubmitting } from '@/composables/useDiaryEntrySubmitting.ts'

const props = defineProps<{
  patientId: string
  entryType: DiaryEntryType
}>()

const { conflict, setAndSubmit, submit, submitting,
  success, fieldErrors, objectErrors, getValidationState }
  = useDiaryEntrySubmitting(props.patientId, props.entryType);

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
      :show-update-form="false"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
    />
    <insulin-entry-form
      v-else-if="entryType === DiaryEntryType.INSULIN_ENTRY"
      key="insulin-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="false"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
    />
    <carbs-entry-form
      v-else-if="entryType === DiaryEntryType.CARBS_ENTRY"
      key="carbs-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="false"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
    />
    <medication-entry-form
      v-else-if="entryType === DiaryEntryType.MEDICATION_ENTRY"
      key="medication-entry-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="false"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
    />
  </div>
  <base-modal :is-open="conflict" title="Запись на это время уже существует. Перезаписать?">
    <div class="update-prompt">
      <b-button
        class="update-prompt-btn"
        variant="outline-success"
        size="lg"
        squared
        @click="submit(true)"
        >Да</b-button
      >
      <b-button
        class="update-prompt-btn"
        variant="outline-danger"
        size="lg"
        squared
        @click="conflict = false"
        >Нет</b-button
      >
    </div>
  </base-modal>
</template>

<style scoped>
.update-prompt {
  display: flex;
  justify-content: space-evenly;

  .update-prompt-btn {
    width: 40%;
  }
}
</style>
