<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type PatientInfo
} from '@/service/doctorService.ts'
import PatientsList from '@/components/doctor-view/PatientsList.vue'
import PatientSummaryWithTabs from '@/components/doctor-view/PatientSummaryWithTabs.vue'
import UsersList from '@/components/admin-view/UsersList.vue'
import BaseModal from '@/components/BaseModal.vue'
import { BSpinner, BButton, BPagination } from 'bootstrap-vue-next'
import { useAttachedPatientsFetching } from '@/composables/fetching/useAttachedPatientsFetching'
import { watch } from 'vue'
import SearchField from '@/components/SearchField.vue'
import { usePatientsAttachDetach } from '@/composables/fetching/usePatientsAttachDetach'
import { useModal } from '@/composables/useModal'
import { useUsersFetching } from '@/composables/fetching/useUsersFetching'
import { Role } from '@/service/userService.ts'

const props = defineProps<{
  doctorId: string,
  adminView: boolean
}>();

onMounted(async () => {
  await getPatients();
});

const { loading: attachedPatientsLoading, patients: attachedPatients, page: attachedPage,
  totalElements: totalAttached, pageSize: attachedPageSize, getPatients,
  search: searchPatients, turnPage: turnPatientsPage }
  = useAttachedPatientsFetching(props.doctorId);

const { loading: attachDetachLoading, attach, detach, success: attachDetachSuccess }
  = usePatientsAttachDetach(props.doctorId);

const { loading: usersLoading, users, page: usersPage,
  totalElements: totalUsers, pageSize: usersPageSize, search: searchUsers, turnPage: turnUsersPage }
  = useUsersFetching(Role.ROLE_PATIENT);

const currentAttachedQuery = ref('');
const searchAttached = async (newQuery: string) => {
  currentAttachedQuery.value = newQuery;
  await searchPatients(currentAttachedQuery.value);
};

watch((attachedPage), async (newPage) => {
  await turnPatientsPage(currentAttachedQuery.value);
});

const currentPatientsQuery = ref('');
const searchPatientUsers = async (newQuery: string) => {
  currentPatientsQuery.value = newQuery;
  await searchUsers(currentPatientsQuery.value);
};

watch((usersPage), async (newPage) => {
  await turnUsersPage(currentPatientsQuery.value);
});

const showPatientSummary = ref(false);
const patientInfo = ref<PatientInfo | null>(null);
const openPatientSummary = (clickedPatientInfo: PatientInfo) => {
  if (props.adminView) return;

  patientInfo.value = clickedPatientInfo;
  showPatientSummary.value = true;
};
const closePatientSummary = () => {
  showPatientSummary.value = false;
};

const detachPatient = async (patientId: string) => {
  await detach(patientId);
  await searchPatients(currentAttachedQuery.value);
};
const attachPatient = async (patientId: string) => {
  await attach(patientId);
  await searchPatients(currentAttachedQuery.value);
  closeModal();
};

const { isOpen, openModal, closeModal } = useModal();

const emit = defineEmits<{
  (e: 'patient:detach', patientInfo: PatientInfo): void
}>();
</script>

<template>
  <div v-if="showPatientSummary" class="back-nav-link">
    <b-button variant="success" class="circular-btn" size="lg" @click="closePatientSummary">
      <img src="/assets/icons/back-arrow.svg" alt="Назад" />
    </b-button>
  </div>
  <div v-if="!showPatientSummary" class="patients-list-wrapper">
    <search-field
      class="align-center"
      :loading="false"
      @search="searchAttached($event)"
    />
    <b-spinner v-if="attachedPatientsLoading" variant="success" />
    <patients-list v-else
      @patient:click="openPatientSummary($event)"
      :patients="attachedPatients"
      :show-detach-buttons="adminView"
      :show-attach-buttons="false"
      @patient:detach="detachPatient($event.patientId)"
    />
    <b-button
      v-if="adminView"
      class="attach-btn"
      variant="outline-success"
      squared
      size="lg"
      @click="openModal"
    >
      Добавить пользователя
    </b-button>
    <b-pagination v-if="totalAttached > attachedPageSize"
      class="pages-wrapper"
      v-model="attachedPage"
      :total-rows="totalAttached"
      :per-page="attachedPageSize"
      size="lg"
      align="center"
    />
    <base-modal :is-open="isOpen" @close="closeModal" title="Прикрепление пользователя">
      <div class="all-patients-search-wrapper">
        <search-field
                class="align-center"
                :loading="false"
                @search="searchPatientUsers($event)"
        />
        <b-spinner v-if="usersLoading" variant="success" />
        <users-list v-else
                    @user:click="attachPatient($event.id)"
                    :users="users"
        />
        <b-pagination v-if="totalUsers > usersPageSize"
                    class="pages-wrapper"
                    v-model="usersPage"
                    :total-rows="totalUsers"
                    :per-page="usersPageSize"
                    size="lg"
                    align="center"
        />
      </div>
    </base-modal>
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

.all-patients-search-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.align-center {
    align-self: center;
    border-color: var(--color-background-alt);
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
