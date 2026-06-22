<script setup lang="ts">
import { BButton, BFormCheckbox } from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import EntryTypeItem from '@/components/patient-view/diary/EntryTypeItem.vue'
import AddEntryFormContent from '@/components/patient-view/diary/EntryFormContent.vue'
import { DiaryEntryType } from '@/service/diaryService.ts'
import { ref, watch } from 'vue'
import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'

const props = defineProps<{
  patientId: string,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
}>();

const { isOpen: isSelectionOpen, openModal: openSelection, closeModal: closeSelection }
  = useModal();

const currentEntryType = ref<DiaryEntryType>(DiaryEntryType.GLUCOSE_ENTRY);

const { isOpen: isEntryFormOpen, closeModal: closeEntryForm } = useModal();
const openEntryForm = (type: DiaryEntryType) => {
  closeSelection();
  currentEntryType.value = type;
  isEntryFormOpen.value = true;
};

const closeOnSuccess =
  ref((localStorage.getItem("close-entry-form-on-success") ?? "true") === "true");
watch(closeOnSuccess, (newValue) => {
  localStorage.setItem("close-entry-form-on-success", newValue ? "true" : "false");
});
const closeEntryFormIfChecked = () => {
  if (closeOnSuccess.value) closeEntryForm();
}

const emit = defineEmits(['entries:added']);
</script>

<template>
  <b-button variant="success" class="circular-btn" size="lg" @click="openSelection">+</b-button>
  <base-modal :is-open="isSelectionOpen" @close="closeSelection" title="Тип новой записи">
    <div class="entry-type-select">
      <entry-type-item
        @click="openEntryForm(DiaryEntryType.GLUCOSE_ENTRY)"
        name="Глюкоза"
        icon-path="assets/icons/glucose-black.svg"
      />
      <entry-type-item
        @click="openEntryForm(DiaryEntryType.INSULIN_ENTRY)"
        name="Инсулин"
        icon-path="assets/icons/insulin-black.svg"
      />
      <entry-type-item
        @click="openEntryForm(DiaryEntryType.CARBS_ENTRY)"
        name="Углеводы"
        icon-path="assets/icons/meal-black.svg"
      />
      <entry-type-item
        @click="openEntryForm(DiaryEntryType.MEDICATION_ENTRY)"
        name="Препарат"
        icon-path="assets/icons/medication-black.svg"
      />
    </div>
  </base-modal>
  <base-modal :is-open="isEntryFormOpen" @close="closeEntryForm" title="">
    <add-entry-form-content
      :entry-type="currentEntryType"
      :patient-id="props.patientId"
      :glucose-unit="glucoseUnit"
      :carbs-unit="carbsUnit"
      @entries:updated="$emit('entries:added'); closeEntryFormIfChecked();"
    />
    <b-form-checkbox class="close-checkbox" v-model="closeOnSuccess">
      Закрыть при успешном сохранении
    </b-form-checkbox>
  </base-modal>
</template>

<style scoped>
.entry-type-select {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 1rem;
}

.close-checkbox {
  opacity: 60%;
  margin-top: 1rem;
}
</style>
