<script setup lang="ts">
import {
  type CarbsEntry,
  DefaultCarbsEntry
} from '@/service/diaryService.ts'
import {
  BButton,
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
import type { CarbsUnit } from '@/service/patientProfileService.ts'
import { getCarbsUnitShortName } from '@/util/enumToStringLiterals.ts'
import { useModal } from '@/composables/useModal.ts'
import {
  calculateCarbs,
  type Meal,
  type MealWeights,
  TemplateType
} from '@/service/templateService.ts'
import TemplateChooser from '@/components/patient-view/templates/TemplateChooser.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useRoute } from 'vue-router'
import MealWeightsList from '@/components/patient-view/templates/MealWeightsList.vue'

const props = defineProps<{
  success: boolean,
  objectErrors: string[],
  fieldErrors: FieldErrors,
  submitting: boolean,
  carbsUnit?: CarbsUnit,
  showUpdateForm: boolean,
  entryToUpdate?: CarbsEntry
}>()

const getValidationState = (fieldName: string) => {
  if (props.success) return true;
  if (props.fieldErrors[fieldName] && props.fieldErrors[fieldName].length > 0)
    return false;

  return null;
};

const {dateISOString: commitedAtStr, formattedDate} = useFormattedDate(new Date());

const carbsEntry = ref<CarbsEntry>(new DefaultCarbsEntry());

onMounted(() => {
  if (props.showUpdateForm && props.entryToUpdate !== undefined) {
    carbsEntry.value = {...props.entryToUpdate};
    formattedDate.value = carbsEntry.value.commitedAt;
  }
});

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

const { isOpen: isChooserOpen, closeModal: closeChooser, openModal: openChooser } = useModal();
const id = ref(useRoute().params.id as string);
const chosenMeals = ref<Meal[]>([]);
const mealChosen = (chosen: Meal) => {
  chosenMeals.value.push(chosen);
};

const calcLoading = ref(false);
const setFromMeals = async (mealWeights: MealWeights) => {
  // let carbs = 0;
  // for (const weightedMeal in weightedMeals) {
  //   carbs += weightedMeal.weight / weightedMeal.mealInfo.carbsPer100Grams;
  // }
  //
  // carbsEntry.value.value = carbs;
  try {
    calcLoading.value = true;
    const response = await calculateCarbs(id.value, mealWeights);
    calcLoading.value = false;

    carbsEntry.value.value = response.data.overallCarbs;
    closeChooser();
  } catch (err) {
    console.log(err);
  }
}

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
      :label="`Количество углеводов [${getCarbsUnitShortName(carbsUnit)}]`"
      label-for="value-input"
      :state="getValidationState('value')"
    >
      <div class="d-flex">
        <b-form-input
          class="squared-input-field"
          key="value-input"
          id="value-input"
          type="number"
          v-model="carbsEntry.value"
        />
        <b-button
          variant="outline-success"
          squared
          @click="openChooser"
        >
          Еда
        </b-button>
      </div>
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
        v-model="carbsEntry.notes"
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
  <base-modal :is-open="isChooserOpen" @close="closeChooser" title="">
    <div class="text-center d-flex flex-column gap-2">
      <h6>Доступная еда</h6>
      <div class="scrollable-area">
        <template-chooser
          :patient-id="id"
          :type="TemplateType.MEAL"
          @choose="mealChosen($event as Meal)"
        />
      </div>
      <h6>Настройка веса</h6>
      <div class="scrollable-area">
        <meal-weights-list :meals="chosenMeals"
                           @delete="chosenMeals.splice($event, 1)"
                           @calculate="setFromMeals($event)"
        />
      </div>
    </div>
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

.scrollable-area {
  height: 40vh;
  overflow-y: auto;
  border-style: solid;
  border-width: 1px;
  border-color: var(--color-background-alt)
}
</style>
