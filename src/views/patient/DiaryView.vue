<script setup lang="ts">

import FunctionalDiary from '@/components/patient-view/diary/FunctionalDiary.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddEntryButton from '@/components/patient-view/diary/AddEntryButton.vue'
import { useRefreshComponent } from '@/composables/useRefreshComponent.ts'
import { usePatientProfileFetching } from '@/composables/fetching/usePatientProfileFetching.ts'
import { BButton, BForm, BFormGroup, BFormInput, BCard } from 'bootstrap-vue-next'
import { useDatePeriodFilter } from '@/composables/useDatePeriodFilter.ts'

const id = ref(useRoute().params.id as string);

const { patientProfile } = usePatientProfileFetching(id.value);
const { componentKey, refresh } = useRefreshComponent();

const {fromISOString, fromFormatted, toISOString, toFormatted, filtered, saveFilterValues}
  = useDatePeriodFilter();
</script>

<template>
  <div class="diary-view">
    <b-card class="filter-wrapper">
      <b-form class="filter-form" @submit.prevent="saveFilterValues(); filtered = true; refresh()">
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
    <functional-diary :key="componentKey"
                      :patient-id="id"
                      :carbs-unit="patientProfile.carbsUnit"
                      :glucose-unit="patientProfile.glucoseUnit"
                      :from="new Date(fromISOString)"
                      :to="new Date(toISOString)"
                      :filtered="filtered"
    />
    <div class="add-button-wrapper">
      <add-entry-button @entries:added="filtered = false; refresh()"
                        :glucose-unit="patientProfile.glucoseUnit"
                        :carbs-unit="patientProfile.carbsUnit"
                        :patient-id="id"></add-entry-button>
    </div>
  </div>
</template>

<style scoped>
.diary-view {
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

  .add-button-wrapper {
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 999;

    @media (max-width: 768px) {
      right: 50px;
      bottom: 100px;
    }
  }
}
</style>
