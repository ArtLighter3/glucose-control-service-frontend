<script setup lang="ts">
import {
  DefaultMedicationEntry,
  type MedicationEntry, PortionType
} from '@/service/diaryService.ts'
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
  BFormSelectOption
} from 'bootstrap-vue-next'
import { onMounted, ref } from 'vue'
import { useFormattedDate } from '@/composables/useFormattedDate.ts'
import UpdateFormButtons from '@/components/UpdateFormButtons.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { FieldErrors } from '@/util/exception.ts'
import { useModal } from '@/composables/useModal.ts'
import BaseModal from '@/components/BaseModal.vue'
import { type Medication, TemplateType } from '@/service/templateService.ts'
import { useRoute } from 'vue-router'
import TemplateChooser from '@/components/patient-view/templates/TemplateChooser.vue'
import { getPortionTypeShortName } from '@/util/enumToStringLiterals.ts'

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

const id = ref(useRoute().params.id as string);
const { isOpen: isChooserOpen, closeModal: closeChooser, openModal: openChooser } = useModal();
const medicationChosen = (chosen: Medication) => {
  medicationEntry.value.value = chosen.defaultPortions;
  medicationEntry.value.name = chosen.name;
  medicationEntry.value.milligramsInPortion = chosen.milligramsInPortion;
  medicationEntry.value.portionType = chosen.portionType;
  closeChooser();
}

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
        <div class="d-flex">
          <b-form-input
            class="squared-input-field"
            id="name-input"
            key="name-input"
            type="text"
            v-model="medicationEntry.name"
          />
          <b-button
            variant="outline-success"
            squared
            @click="openChooser"
          >
            Препараты
          </b-button>
        </div>
        <b-form-invalid-feedback class="d-flex">
          <span v-for="(message, index) in fieldErrors.name" :key="index">
            {{ message }}
          </span>
        </b-form-invalid-feedback>
      </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="value"
      id="value"
      label="Количество"
      label-for="value-input"
      :state="getValidationState('value')"
    >
      <div class="d-flex">
        <b-form-input
          class="squared-input-field"
          key="value-input"
          id="value-input"
          type="number"
          v-model="medicationEntry.value"
        />
        <b-form-select
          class="squared-input-field"
          id="portion-type-selector"
          key="portion-type-selector"
          v-model="medicationEntry.portionType"
        >
          <b-form-select-option
            v-for="type in Object.entries(PortionType)"
            :key="type[0]"
            :value="type[0]"
          >
            {{ getPortionTypeShortName(type[1]) }}
          </b-form-select-option>
        </b-form-select>
      </div>
      <b-form-invalid-feedback class="d-flex">
        <span v-for="(message, index) in fieldErrors.value" :key="index">
          {{ message }}
        </span>
        <span v-for="(message, index) in fieldErrors.portionType" :key="`${index}-type`">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
        class="entry-form-group"
        key="milligrams"
        id="milligrams"
        label="Вещества в шт. [миллиграмм]"
        label-for="milligrams-input"
        :state="getValidationState('milligramsInPortion')"
    >
      <b-form-input
        class="squared-input-field"
        key="milligrams-input"
        id="milligrams-input"
        type="number"
        v-model="medicationEntry.milligramsInPortion"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.milligramsInPortion" :key="index">
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
  <base-modal :is-open="isChooserOpen" @close="closeChooser" title="Препараты">
    <template-chooser
      :patient-id="id"
      :type="TemplateType.MEDICATION"
      @choose="medicationChosen($event as Medication)"
    />
  </base-modal>
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
