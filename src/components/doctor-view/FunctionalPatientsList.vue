<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type PatientInfo,
  getAttachedPatients, searchAttachedPatients
} from '@/service/doctorService.ts'
import PatientsList from '@/components/doctor-view/PatientsList.vue'
import { isAxiosError } from 'axios'
import BaseModal from '@/components/BaseModal.vue'
import PatientSummaryWithTabs from '@/components/doctor-view/PatientSummaryWithTabs.vue'
import { useModal } from '@/composables/useModal.ts'
import { BSpinner, BButton, BPagination } from 'bootstrap-vue-next'
import { usePagination } from '@/composables/usePagination'
import { useAttachedPatientsFetching } from '@/composables/fetching/useAttachedPatientsFetching'
import { watch } from 'vue'
import SearchField from '@/components/SearchField.vue'

const props = defineProps<{
  doctorId: string,
}>();

onMounted(async () => {
  await getPatients();
});

const { loading, patients, page, totalElements, pageSize, getPatients, searchPatients }
  = useAttachedPatientsFetching(props.doctorId);

const currentQuery = ref('');

watch((page), async (newPage) => {
  await searchPatients(currentQuery.value);
});

const showPatientSummary = ref(false);
const patientInfo = ref<PatientInfo | null>(null);
const openPatientSummary = (clickedPatientInfo: PatientInfo) => {
  patientInfo.value = clickedPatientInfo;
  showPatientSummary.value = true;
};
const closePatientSummary = () => {
  showPatientSummary.value = false;
};

</script>

<template>
  <div v-if="showPatientSummary" class="back-nav-link">
    <b-button variant="success" class="circular-btn" size="lg" @click="closePatientSummary">
      <img src="@/assets/icons/back-arrow.svg" alt="Назад" />
    </b-button>
  </div>
  <div v-if="!showPatientSummary" class="patients-list-wrapper">
    <search-field
      class="align-center"
      :loading="false"
      @search="currentQuery = $event; searchPatients($event)"
    />
    <b-spinner v-if="loading" variant="success" />
    <patients-list v-else
      @patient:click="openPatientSummary($event)"
      :patients="patients"
    />
    <b-pagination v-if="totalElements > pageSize"
      class="pages-wrapper"
      v-model="page"
      :total-rows="totalElements"
      :per-page="pageSize"
      size="lg"
      align="center"
    />
  </div>
  <div v-else class="patient-summary-outer-wrapper">
     <patient-summary-with-tabs v-if="patientInfo !== null" :patient-info="patientInfo"/>
  </div>
</template>

<style scoped>
.patients-list-wrapper {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  .align-center {
    align-self: center;
    border-color: var(--color-background-alt);
  }

  @media (max-width: 768px) {
    padding-left: 4.32rem;
    padding-right: 2rem;
  }

}

.patient-summary-outer-wrapper {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
      padding-left: 4rem;
  }
}

.back-nav-link {
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;

  @media (max-width: 768px) {
    right: 50px;
    bottom: 100px;
  }
}
</style>
