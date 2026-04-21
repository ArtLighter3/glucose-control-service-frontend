<script setup lang="ts">
import { ref } from 'vue'
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
import { computed } from 'vue'

const props = defineProps<{
  patientId: string,
  glucoseUnit?: GlucoseUnit,
  carbsUnit?: CarbsUnit,
}>();

const { fromISOString, fromFormatted, toISOString, toFormatted, filtered, saveFilterValues }
  = useDatePeriodFilter();
const from: Date = computed(() => {
  return new Date(fromISOString.value);
});
const to: Date = computed(() => {
  return new Date(toISOString.value);
});

const { loading, entries, refreshDiary }
  = useDiaryEntriesFetching(props.patientId,
    (filtered.value) ? from.value : undefined,
    (filtered.value) ? to.value : undefined);

const refresh = async () => {
  await refreshDiary(from.value, to.value);
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
    <b-card class="filter-wrapper">
          <b-form class="filter-form"
                  @submit.prevent="saveFilterValues(); filtered = true; refresh()"
          >
            <div class="filter-first-row">
              <b-form-group
                class="filter-form-group"
                key="from"
                id="from"
                label="C"
                label-for="from-input"
              >
                <b-form-input
                  class="squared-input-field"
                  id="from-input"
                  key="from-input"
                  type="datetime-local"
                  v-model="fromFormatted"
                />
              </b-form-group>
              <b-form-group
                class="filter-to-group"
                key="to"
                id="to"
                label="по"
                label-for="to-input"
              >
                <b-form-input
                  class="squared-input-field"
                  id="to-input"
                  key="to-input"
                  type="datetime-local"
                  v-model="toFormatted"
                />
              </b-form-group>
            </div>
            <b-button class="filter-btn"
                      variant="outline-success"
                      type="submit"
                      loading-fill
                      squared
                      size="lg">
              Показать
            </b-button>
          </b-form>
    </b-card>
    <div class="entries-list-wrapper">
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
          @entries:updated="filtered = false; refresh(); closeEntryForm()"
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

      .filter-form {
        display: flex;
        flex-direction: column;

        .filter-first-row {
          display: flex;
          flex-direction: row;
        }
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
