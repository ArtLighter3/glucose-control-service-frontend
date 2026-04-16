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
import { BSpinner, BButton } from 'bootstrap-vue-next'
import { usePagination } from '@/composables/usePagination'
import { watch } from 'vue'

const props = defineProps<{
  doctorId: string,
}>();

const loading = ref(false);
const patients = ref<PatientInfo[]>([]);

const { page, pageCount } = usePagination(0);

onMounted(async () => {
  await getPatients();
});

const getPatients = async () => {
  loading.value = true;
    try {
      const response = await getAttachedPatients(props.doctorId, page.value);
      patients.value = response.data.content;
      if (response.data.totalPages !== undefined)
        pageCount.value = response.data.totalPages;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
      }
    }
    loading.value = false;
};

watch((page), async (newPage) => {
  await getPatients();
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
    <b-spinner v-if="loading" variant="success"/>
    <patients-list v-else
      @patient:click="openPatientSummary($event)"
      :patients="patients"
    />
    <div v-if="pageCount > 1" class="pages-wrapper">
      <div v-for="pageIndex in pageCount"
           :key="pageIndex"
           class="page"
           @click="page = (pageIndex - 1)"
      >
        {{ pageIndex }}
      </div>
    </div>
  </div>
  <div v-else class="patient-summary-outer-wrapper">
     <patient-summary-with-tabs v-if="patientInfo !== null" :patient-info="patientInfo"/>
  </div>
</template>

<style scoped>
.patients-list-wrapper {
  padding: 3rem;

  @media (max-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
  }

  .pages-wrapper {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;

    .page {
      cursor: pointer;
    }
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
