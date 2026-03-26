<script setup lang="ts">
import {
  type CarbsEntry,
  DefaultCarbsEntry
} from '@/service/diaryService.ts'
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback
} from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useFormattedCommitionDate } from '@/composables/useFormattedCommitionDate.ts'
import EntryFormButtons from '@/components/patient-view/diary/EntryFormButtons.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

const props = defineProps<{
  success: boolean,
  objectErrors: string[],
  fieldErrors: { [key: string]: string[] },
  submitting: boolean,
  showUpdateForm: boolean
}>()

const getValidationState = (fieldName: string) => {
  if (props.success) return true;
  if (props.fieldErrors[fieldName] && props.fieldErrors[fieldName].length > 0)
    return false;

  return null;
};

const {commitedAtStr, formattedDate} = useFormattedCommitionDate();

const carbsEntry = ref(new DefaultCarbsEntry());

const emit = defineEmits<{
  (e: 'add', entry: CarbsEntry): void
  (e: 'update', entry: CarbsEntry): void
  (e: 'delete', commitedAt: string): void
}>();

const submit = () => {
  carbsEntry.value.commitedAt = commitedAtStr.value;
  if (props.showUpdateForm) emit('update', carbsEntry.value);
  else emit('add', carbsEntry.value);
};
</script>

<template>
  <b-form class="entry-form" @submit.prevent="submit">
    <form-transition-group>
    <h4 key="header">Прием пищи</h4>
    <span
      v-for="(objectError, index) in objectErrors"
      :key="`error-${index}`"
      class="error-text">{{ objectError }}</span>
    <b-form-group
      class="entry-form-group"
      key="value"
      id="value"
      label="Количество углеводов [грамм]"
      label-for="value-input"
      :state="getValidationState('value')"
    >
      <b-form-input
        class="squared-input-field"
        key="value-input"
        id="value-input"
        type="number"
        v-model="carbsEntry.value"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.value" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="commited-at"
      id="commited-at"
      label="Дата и время"
      label-for="commited-at-input"
      :state="getValidationState('commitedAt')"
    >
      <b-form-input
        class="squared-input-field"
        id="commited-at-input"
        key="commited-at-input"
        type="datetime-local"
        v-model="formattedDate"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.commitedAt" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="notes"
      id="notes"
      label="Комментарий"
      label-for="notes-input"
      :state="getValidationState('notes')"
    >
      <b-form-input
        class="squared-input-field"
        id="notes-input"
        key="notes-input"
        type="text"
        v-model="carbsEntry.notes"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.notes" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <entry-form-buttons :submitting="submitting"
                        @save="submit"
                        @delete="$emit('delete', commitedAtStr)"/>
    </form-transition-group>
  </b-form>
</template>

<style scoped>
.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h4 {
    text-align: center;
  }
}
</style>
