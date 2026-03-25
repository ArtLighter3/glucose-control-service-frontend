<script setup lang="ts">
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
  BFormSelectOption
} from 'bootstrap-vue-next'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import { useSubmittableForm } from '@/composables/useSubmittableForm.ts'
import { computed, ref } from 'vue'
import {
  DiaryEntryType,
  type GlucoseEntry,
  MeasurementType,
  postDiaryEntry, putDiaryEntry
} from '@/service/diaryService.ts'
import { type AxiosResponse, isAxiosError } from 'axios'
import type { ApiExceptionResponse } from '@/util/exception.ts'
import BaseModal from '@/components/BaseModal.vue'

const props = defineProps({
  patientId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ""
  }
});

const { submitting, success, fieldErrors, objectErrors, getValidationState}
  = useSubmittableForm();

const glucoseEntry = ref<GlucoseEntry>({
  value: 0.0,
  commitedAt: "",
  notes: null,
  type: null,
  glucoseUnits: null
});

const datetime = ref(new Date());
const formattedDate = computed({
  get: () => {
    const offset = datetime.value.getTimezoneOffset() * 60000;
    const localISO = new Date(datetime.value.getTime() - offset).toISOString();
    return localISO.slice(0, 16);
  },
  set: (newValue: string) => {
    if (newValue) {
      datetime.value = new Date(newValue);
    }
  }
});

const conflict = ref(false);

const submit = async (alreadyExists: boolean) => {
  submitting.value = true;
  conflict.value = false;
  try {
    fieldErrors.value = {};
    objectErrors.value = [];
    glucoseEntry.value.commitedAt = datetime.value.toISOString();
    const response = alreadyExists ?
      await putDiaryEntry(props.patientId, glucoseEntry.value, DiaryEntryType.GLUCOSE_ENTRY) :
      await postDiaryEntry(props.patientId, glucoseEntry.value, DiaryEntryType.GLUCOSE_ENTRY);
    success.value = true;
  } catch (err) {
    success.value = false;
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 400 && err.response.data) {
        const exceptionResponse = err.response as AxiosResponse<ApiExceptionResponse>;
        fieldErrors.value = exceptionResponse.data.fieldErrors;
        objectErrors.value = exceptionResponse.data.objectErrors;
      } else if (err.response.status === 409) {
        conflict.value = true;
      }
    }
  }
  submitting.value = false;
};
</script>

<template>
  <div class="entry-form-outer-wrapper">
      <b-form class="entry-form" @submit.prevent="">
        <form-transition-group>
        <h4 key="header">{{ title }}</h4>
        <span
          v-for="(objectError, index) in objectErrors"
          :key="`error-${index}`"
          class="error-text"
          >{{ objectError }}</span
        >
        <b-form-group
          class="entry-form-group"
          key="value"
          id="value"
          label="Значение глюкозы [ммоль/л]"
          label-for="value-input"
          :state="getValidationState('value')"
        >
          <b-form-input
            class="squared-input-field"
            key="value-input"
            id="value-input"
            type="number"
            v-model="glucoseEntry.value"
          />
          <b-form-invalid-feedback>
            <span v-for="(message, index) in fieldErrors.value" :key="index">
              {{ message }}
            </span>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          class="entry-form-group"
          key="category"
          id="category"
          label="Категория"
          label-for="category-selector"
          :state="getValidationState('measurementType')"
        >
          <b-form-select
            class="squared-input-field"
            id="category-selector"
            key="category-selector"
            v-model="glucoseEntry.type"
          >
            <b-form-select-option key="null" :value="null">Нет</b-form-select-option>
            <b-form-select-option
              v-for="type in Object.entries(MeasurementType)"
              :key="type[0]"
              :value="type[0]"
            >
              {{ type[1] }}
            </b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            <span v-for="(message, index) in fieldErrors.type" :key="index">
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
            v-model="glucoseEntry.notes"
          />
          <b-form-invalid-feedback>
            <span v-for="(message, index) in fieldErrors.notes" :key="index">
              {{ message }}
            </span>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-button
          class="submit-entry-btn"
          variant="outline-success"
          key="button"
          type="submit"
          :loading="submitting"
          loading-fill
          squared
          size="lg"
          @click="submit(false)"
        >
          Сохранить
        </b-button>
        </form-transition-group>
      </b-form>
  </div>
  <base-modal :is-open="conflict"
              title="Запись на это время уже существует. Перезаписать?">
    <div class="update-prompt">
      <b-button class="update-prompt-btn" variant="outline-success" size="lg" squared
                @click="submit(true)">Да</b-button>
      <b-button class="update-prompt-btn" variant="outline-danger" size="lg" squared
                @click="conflict = false">Нет</b-button>
    </div>
  </base-modal>
</template>

<style scoped>
.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .submit-entry-btn {
    margin-top: 1rem;
  }
}

.update-prompt {
  display: flex;
  justify-content: space-evenly;

  .update-prompt-btn {
    width: 40%;
  }
}
</style>
