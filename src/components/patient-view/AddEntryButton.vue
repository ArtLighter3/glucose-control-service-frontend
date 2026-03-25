<script setup lang="ts">
import {
  BFormInput,
  BForm,
  BFormGroup, BFormSelect, BFormSelectOption,
  BButton,
  BSpinner,
  BCard, BFormInvalidFeedback
} from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import EntryTypeItem from '@/components/patient-view/EntryTypeItem.vue'
import AddEntryFormContent from '@/components/patient-view/AddEntryFormContent.vue'

const props = defineProps({
  patientId: {
    type: String,
    required: true
  }
});

const { isOpen: isSelectionOpen, openModal: openSelection, closeModal: closeSelection }
  = useModal();

const { isOpen: isEntryFormOpen, closeModal: closeEntryForm } = useModal();
const openEntryForm = () => {
  closeSelection();
  isEntryFormOpen.value = true;
};
</script>

<template>
  <b-button variant="success" class="circular-btn" size="lg" @click="openSelection">
    +
  </b-button>
  <base-modal :is-open="isSelectionOpen" @close="closeSelection" title="Тип новой записи">
    <div class="entry-type-select">
      <entry-type-item @click="openEntryForm" name="Глюкоза" icon-path="assets/icons/glucose-black.svg"/>
      <entry-type-item @click="" name="Инсулин" icon-path="assets/icons/insulin-black.svg"/>
      <entry-type-item @click="" name="Углеводы" icon-path="assets/icons/meal-black.svg"/>
      <entry-type-item @click="" name="Препарат" icon-path="assets/icons/medication-black.svg"/>
    </div>
  </base-modal>
  <base-modal :is-open="isEntryFormOpen" @close="closeEntryForm" title="">
    <add-entry-form-content :patient-id="props.patientId"/>
  </base-modal>
</template>

<style scoped>
.circular-btn {
  width: 40px;
  height: 40px;
  padding: 2rem;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}

.entry-type-select {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
