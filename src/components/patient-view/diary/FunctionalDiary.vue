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

const props = defineProps<{
  patientId: string,
  filtered?: boolean,
  from?: Date,
  to?: Date,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
}>();

const loading = ref(false);
const entries = ref<DiaryEntryWithType[]>([]);

onMounted(async () => {
  await refreshDiary();
});
const refreshDiary = async () => {
  loading.value = true
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  try {
    const response = await getDiaryEntries(props.patientId,
      (!props.filtered || props.from === undefined) ? lastWeek : props.from,
      (!props.filtered || props.to === undefined) ? new Date() : props.to)
    entries.value = response.data
  } catch (err) {
    if (isAxiosError(err)) {
      console.log(err)
    }
  }
  loading.value = false
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
    <diary-entries-list
      @entry:click="openEntryUpdateForm($event)"
      :entries="entries"
    ></diary-entries-list>
  </div>
  <base-modal :is-open="isEntryFormOpen" @close="closeEntryForm" title="">
    <add-entry-form-content
      :entry-type="entryToUpdate.type"
      :show-update-form="true"
      :entry-to-update="entryToUpdate.entryInfo"
      :patient-id="props.patientId"
      :glucose-unit="glucoseUnit"
      :carbs-unit="carbsUnit"
      @entries:updated="refreshDiary(); closeEntryForm()"
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
