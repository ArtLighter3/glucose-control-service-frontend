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

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  filtered: {
    type: Boolean,
    required: false,
    default: false,
  },
  from: {
    type: Date,
    required: false,
  },
  to: {
    type: Date,
    required: false,
  },
});

const loading = ref(false);
const entries = ref<DiaryEntryWithType[]>([]);

onMounted(async () => {
  loading.value = true
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  try {
    const response = await getDiaryEntries(props.patientId, lastWeek, new Date())
    entries.value = response.data
  } catch (err) {
    if (isAxiosError(err)) {
      console.log(err)
    }
  }
  loading.value = false
});

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
      @entries:updated="$emit('entries:updated')"
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
