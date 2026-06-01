<script setup lang="ts">
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback
} from 'bootstrap-vue-next'
import { onMounted, ref } from 'vue'
import UpdateFormButtons from '@/components/UpdateFormButtons.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { FieldErrors } from '@/util/exception.ts'
import type { Medication } from '@/service/templateService.ts'

const props = defineProps<{
  success: boolean,
  objectErrors: string[],
  fieldErrors: FieldErrors,
  submitting: boolean,
  showUpdateForm: boolean,
  templateToUpdate?: Medication
}>()

const getValidationState = (fieldName: string) => {
  if (props.success) return true;
  if (props.fieldErrors[fieldName] && props.fieldErrors[fieldName].length > 0)
    return false;

  return null;
};

const medication = ref<Medication>({
  name: "",
  milligramsInPortion: 0.0,
  defaultPortions: 1,
});

onMounted(() => {
  if (props.showUpdateForm && props.templateToUpdate !== undefined) {
    medication.value = {...props.templateToUpdate};
  }
});

const emit = defineEmits<{
  (e: 'add', template: Medication): void
  (e: 'update', template: Medication): void
  (e: 'delete', name: string): void
}>();

const submit = () => {
  if (props.showUpdateForm) emit('update', medication.value);
  else emit('add', medication.value);
};
</script>

<template>
  <b-form class="entry-form" @submit.prevent="submit">
    <form-transition-group>
    <h4 key="header">Препарат</h4>
    <span
      v-for="(objectError, index) in objectErrors"
      :key="`error-${index}`"
      class="error-text">{{ objectError }}
    </span>
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
          v-model="medication.name"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.name" :key="index">
            {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="milligrams"
      id="milligrams"
      :label="`Вещества на порцию [миллиграмм]`"
      label-for="milligrams-input"
      :state="getValidationState('milligramsInPortion')"
    >
      <b-form-input
        class="squared-input-field"
        key="milligrams-input"
        id="milligrams-input"
        type="number"
        v-model="medication.milligramsInPortion"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.milligramsInPortion" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
        class="entry-form-group"
        key="default-portions"
        id="default-portions"
        :label="`Стандартное количество порций`"
        label-for="default-portions-input"
        :state="getValidationState('defaultPortions')"
    >
        <b-form-input
          class="squared-input-field"
          key="default-portions-input"
          id="default-portions-input"
          type="number"
          v-model="medication.defaultPortions"
        />
        <b-form-invalid-feedback>
          <span v-for="(message, index) in fieldErrors.defaultPortions" :key="index">
            {{ message }}
          </span>
        </b-form-invalid-feedback>
    </b-form-group>
    <update-form-buttons :submitting="submitting"
                        :show-delete-button="showUpdateForm"
                        @save="submit"
                        @delete="$emit('delete', medication.name)"
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
