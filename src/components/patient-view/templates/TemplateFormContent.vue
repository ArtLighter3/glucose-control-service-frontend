<script setup lang="ts">
import { watch } from 'vue'
import ConfirmDialogModal from '@/components/ConfirmDialogModal.vue'
import {
  type Meal,
  type Medication,
  type Template,
  TemplateType
} from '@/service/templateService.ts'
import { useTemplateSubmitting } from '@/composables/fetching/useTemplateSubmitting.ts'
import MealForm from '@/components/patient-view/templates/MealForm.vue'
import MedicationForm from '@/components/patient-view/templates/MedicationForm.vue'

const props = defineProps<{
  patientId: string
  templateType: TemplateType,
  showUpdateForm?: boolean,
  templateToUpdate?: Template
}>();

const { conflict, setAndSubmit, submit, remove, submitting,
  success, fieldErrors, objectErrors }
  = useTemplateSubmitting(props.patientId, props.templateType);

const emit = defineEmits(['templates:updated']);
watch(success, (newValue) => {
  if (newValue) {
    emit('templates:updated');
  }
});
</script>

<template>
  <div class="entry-form-outer-wrapper">
    <meal-form
      v-if="templateType === TemplateType.MEAL"
      key="meal-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :template-to-update="templateToUpdate as Meal"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
    <medication-form
      v-else-if="templateType === TemplateType.MEDICATION"
      key="medication-form"
      :success="success"
      :submitting="submitting"
      :object-errors="objectErrors"
      :field-errors="fieldErrors"
      :show-update-form="showUpdateForm !== undefined ? showUpdateForm : false"
      :template-to-update="templateToUpdate as Medication"
      @add="setAndSubmit(false, $event)"
      @update="setAndSubmit(true, $event)"
      @delete="remove($event)"
    />
  </div>
  <confirm-dialog-modal :is-open="conflict"
                        text="Заготовка с таким наименованием уже существует. Перезаписать?"
                        title="Обновление"
                        @confirm="submit(true)"
                        @cancel="conflict = false"
  />
</template>

<style scoped>

</style>
