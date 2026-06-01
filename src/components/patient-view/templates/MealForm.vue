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
import type { CarbsUnit } from '@/service/patientProfileService.ts'
import type { Meal } from '@/service/templateService.ts'

const props = defineProps<{
  success: boolean,
  objectErrors: string[],
  fieldErrors: FieldErrors,
  submitting: boolean,
  carbsUnit?: CarbsUnit,
  showUpdateForm: boolean,
  templateToUpdate?: Meal
}>()

const getValidationState = (fieldName: string) => {
  if (props.success) return true;
  if (props.fieldErrors[fieldName] && props.fieldErrors[fieldName].length > 0)
    return false;

  return null;
};

const meal = ref<Meal>({
  name: "",
  carbsPer100Grams: 0.0
});

onMounted(() => {
  if (props.showUpdateForm && props.templateToUpdate !== undefined) {
    meal.value = {...props.templateToUpdate};
  }
});

const emit = defineEmits<{
  (e: 'add', template: Meal): void
  (e: 'update', template: Meal): void
  (e: 'delete', name: string): void
}>();

const submit = () => {
  if (props.showUpdateForm) emit('update', meal.value);
  else emit('add', meal.value);
};
</script>

<template>
  <b-form class="entry-form" @submit.prevent="submit">
    <form-transition-group>
    <h4 key="header">Еда</h4>
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
          v-model="meal.name"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.name" :key="index">
            {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
      class="entry-form-group"
      key="carbs"
      id="carbs"
      :label="`Углеводов на 100 грамм [граммы]`"
      label-for="carbs-input"
      :state="getValidationState('carbsPer100Grams')"
    >
      <b-form-input
        class="squared-input-field"
        key="carbs-input"
        id="carbs-input"
        type="number"
        v-model="meal.carbsPer100Grams"
      />
      <b-form-invalid-feedback>
        <span v-for="(message, index) in fieldErrors.carbsPer100Grams" :key="index">
          {{ message }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <update-form-buttons :submitting="submitting"
                        :show-delete-button="showUpdateForm"
                        @save="submit"
                        @delete="$emit('delete', meal.name)"
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
