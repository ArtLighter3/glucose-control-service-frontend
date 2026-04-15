<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DefaultGlucoseEntry,
  DiaryEntryType,
  type DiaryEntryWithType,
  getDiaryEntries
} from '@/service/diaryService.ts'
import { isAxiosError } from 'axios'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'
import AddEntryFormContent from '@/components/patient-view/diary/EntryFormContent.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'
import { BSpinner } from 'bootstrap-vue-next'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching'

const props = defineProps<{
  patientId: string,
  filtered?: boolean,
  from?: Date,
  to?: Date,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
}>();


const { loading, entries, refreshDiary }
  = useDiaryEntriesFetching(props.patientId,
    (props.filtered) ? props.from : undefined,
    (props.filtered) ? props.to : undefined);

const refresh = async () => {
  await refreshDiary(props.from, props.to);
};

const entryToUpdate = ref<DiaryEntryWithType>({
  type: DiaryEntryType.GLUCOSE_ENTRY,
  entryInfo: new DefaultGlucoseEntry()
});
const { isOpen: isEntryFormOpen, openModal: openEntryForm, closeModal: closeEntryForm }
  = useModal();
const openEntryUpdateForm = (entryWithType: DiaryEntryWithType) => {
  entryToUpdate.value = entryWithType;
  openEntryForm();
};

//defineExpose(refreshDiary, loading);
</script>

<template>
  <div class="diary-wrapper">
    <b-spinner v-if="loading" variant="success"/>
    <diary-entries-list v-else
      @entry:click="openEntryUpdateForm($event)"
      :entries="entries"
    />
  </div>
  <base-modal :is-open="isEntryFormOpen" @close="closeEntryForm" title="">
    <add-entry-form-content
      :entry-type="entryToUpdate.type"
      :show-update-form="true"
      :entry-to-update="entryToUpdate.entryInfo"
      :patient-id="props.patientId"
      :glucose-unit="glucoseUnit"
      :carbs-unit="carbsUnit"
      @entries:updated="refresh(); closeEntryForm()"
    />
  </base-modal>
</template>

<style scoped>
.diary-wrapper {
  padding: 3rem;

  @media (max-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
  }
}
</style>
