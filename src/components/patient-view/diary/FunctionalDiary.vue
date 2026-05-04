<script setup lang="ts">
import { ref, useTemplateRef, computed } from 'vue'
import {
  DefaultGlucoseEntry,
  DiaryEntryType,
  type DiaryEntryWithType
} from '@/service/diaryService.ts'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'
import AddEntryFormContent from '@/components/patient-view/diary/EntryFormContent.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { CarbsUnit, type GlucoseUnit } from '@/service/patientProfileService.ts'
import { BSpinner, BCard, BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
import { useDiaryEntriesFetching } from '@/composables/fetching/useDiaryEntriesFetching'
import { useDatePeriodFilter } from '@/composables/useDatePeriodFilter'
import DateFilterForm from '@/components/DateFilterForm.vue'
//import { useInfiniteScroll } from '@vueuse/core'

const props = defineProps<{
  patientId: string,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
}>();

const { fromISOString, fromFormatted, toISOString, toFormatted, filtered, saveFilterValues }
  = useDatePeriodFilter();
const from = computed(() => {
  return new Date(fromISOString.value);
});
const to = computed(() => {
  return new Date(toISOString.value);
});

const { loading, entries, refreshDiary, loadMore }
  = useDiaryEntriesFetching(props.patientId);

const refresh = async () => {
  await refreshDiary((filtered.value) ? from.value : undefined,
                     (filtered.value) ? to.value : undefined);
};

const applyFilter = async () => {
  saveFilterValues();

  filtered.value = true;

  refresh();
}
// const entryListElement = useTemplateRef('entry-list');
// const { reset } = useInfiniteScroll(
//   entryListElement,
//   () => {
//     loadMore();
//   },
//   {
//     distance: 10,
//     canLoadMore: () => {
//       return !filtered;
//     }
//   }
// );

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
    <b-card class="filter-wrapper">
      <date-filter-form
        v-model:from="fromFormatted"
        v-model:to="toFormatted"
        @apply="applyFilter"
      />
    </b-card>
    <div
      class="entries-list-wrapper"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="filtered"
      infinite-scroll-distance="10"
    >
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
  </div>
</template>

<style scoped>
.diary-wrapper {
  display: flex;
  flex-direction: column;

  .filter-wrapper {
      display: flex;
      align-self: center;
      background-color: white;

      @media (max-width: 768px) {
        padding-left: 2rem;
      }
    }

  .entries-list-wrapper {
    padding: 3rem;

    @media (max-width: 768px) {
      padding-left: 4rem;
      padding-right: 1rem;
    }
  }
}
</style>
