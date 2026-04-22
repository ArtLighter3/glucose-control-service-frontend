<script setup lang="ts">
import {
  DefaultMedicationEntry, type MedicationEntry
} from '@/service/diaryService.ts'
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback
} from 'bootstrap-vue-next'
import { onMounted, ref } from 'vue'
import { useFormattedDate } from '@/composables/useFormattedDate.ts'
import UpdateFormButtons from '@/components/UpdateFormButtons.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { FieldErrors } from '@/util/exception.ts'

const props = defineProps<{
  success: boolean,
  objectErrors: string[],
  fieldErrors: FieldErrors,
  submitting: boolean,
  showUpdateForm: boolean,
  entryToUpdate?: MedicationEntry
}>()

const getValidationState = (fieldName: string) => {
  if (props.success) return true;
  if (props.fieldErrors[fieldName] && props.fieldErrors[fieldName].length > 0)
    return false;

  return null;
};

const {dateISOString: commitedAtStr, formattedDate} = useFormattedDate(new Date());

const medicationEntry = ref<MedicationEntry>(new DefaultMedicationEntry());

onMounted(() => {
  if (props.showUpdateForm && props.entryToUpdate !== undefined) {
    medicationEntry.value = {...props.entryToUpdate};
    formattedDate.value = medicationEntry.value.commitedAt;
  }
});


const emit = defineEmits<{
  (e: 'add', entry: MedicationEntry): void
  (e: 'update', entry: MedicationEntry): void
  (e: 'delete', commitedAt: string): void
}>();

const submit = () => {
  medicationEntry.value.commitedAt = commitedAtStr.value;
  if (props.showUpdateForm) emit('update', medicationEntry.value);
  else emit('add', medicationEntry.value);
};
</script>

<template>
  <b-form class="entry-form" @submit.prevent="submit">
    <form-transition-group>
    <h4 key="header">Принятие препарата</h4>
    <span
      v-for="(objectError, index) in objectErrors"
      :key="`error-${index}`"
      class="error-text">{{ objectError }}</span>
      <b-form-group
        class="entry-form-group"
        key="name"
        id="name"
        label="Наименование"
        label-for="name-input"
        :state="getValidationState('name')"
      >
        <b-form-input
          class="squared-input-field"
          id="name-input"
          key="name-input"
          type="text"
          v-model="medicationEntry.name"
        />
        <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.name" :key="index">
          {{ message }}
        </span>
        </b-form-invalid-feedback>
      </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="value"
      id="value"
      label="Дозировка [миллиграмм]"
      label-for="value-input"
      :state="getValidationState('value')"
    >
      <b-form-input
        class="squared-input-field"
        key="value-input"
        id="value-input"
        type="number"
        v-model="medicationEntry.value"
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
      :disabled="showUpdateForm"
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
        v-model="medicationEntry.notes"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.notes" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <update-form-buttons :submitting="submitting"
                        :show-delete-button="showUpdateForm"
                        @save="submit"
                        @delete="$emit('delete', commitedAtStr)"
    />
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
