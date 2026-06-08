<script setup lang="ts">
import { onMounted } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { BSpinner, BButton, BPagination } from 'bootstrap-vue-next'
import { watch } from 'vue'
import { useModal } from '@/composables/useModal'
import { useAttachedDoctorsFetching } from '@/composables/fetching/useAttachedDoctorsFetching.ts'
import type { AttachedDoctorInfo } from '@/service/patientProfileService.ts'
import DoctorsList from '@/components/patient-view/DoctorsList.vue'
import ConfirmDialogModal from '@/components/ConfirmDialogModal.vue'
import { useAttachDetachByCode } from '@/composables/fetching/useAttachDetachByCode.ts'

const props = defineProps<{
  patientId: string,
}>();

const { loading, doctors, page, totalElements, pageSize, fetch}
  = useAttachedDoctorsFetching(props.patientId);
onMounted(async () => {
  await fetch();
});

 const { loading: attachDetachLoading, attachByCode, detachByCode, success: attachDetachSuccess }
   = useAttachDetachByCode(props.patientId);

watch((page), async (newPage) => {
  await fetch();
});

const detach = async (doctorCode: string) => {
  await detachByCode(doctorCode);
  await fetch();
  closeDetach();
};
const attach = async (doctorCode: string) => {
  await attachByCode(doctorCode);
  await fetch();
  closeAttach();
};

const { isOpen: isDetachOpen, openModal: openDetach, closeModal: closeDetach }
  = useModal();
const { isOpen: isAttachOpen, openModal: openAttach, closeModal: closeAttach }
  = useModal();

const emit = defineEmits<{
  (e: 'doctor:detach', doctorInfo: AttachedDoctorInfo): void
}>();
</script>

<template>
  <h2 class="align-center">Врачи, имеющие доступ к данным</h2>
  <div class="doctors-list-wrapper">
<!--    <search-field-->
<!--      class="align-center"-->
<!--      :loading="false"-->
<!--      @search="searchAttached($event)"-->
<!--    />-->

    <div class="scrollable-list">
      <b-spinner v-if="loading" variant="success" />
      <doctors-list v-else
        @doctor:detach="openDetach"
        :doctors="doctors"
        :show-detach-buttons="true"
      />
    </div>
    <b-pagination v-if="totalElements > pageSize"
                  class="pages-wrapper"
                  v-model="page"
                  :total-rows="totalElements"
                  :per-page="pageSize"
                  size="lg"
                  align="center"
    />
    <b-button
      class="attach-btn"
      variant="outline-success"
      squared
      size="lg"
      @click="openAttach"
    >
      Добавить врача
    </b-button>
    <base-modal :is-open="isAttachOpen" @close="closeAttach" title="Добавление врача">
      <div class="">

      </div>
    </base-modal>
    <confirm-dialog-modal :is-open="isDetachOpen"
                          text="Врач больше не сможет получить доступ к вашим данным"
                          @cancel="closeDetach"
    />
  </div>
</template>

<style scoped>
.doctors-list-wrapper {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  @media (max-width: 1080px) {
    padding-left: 4.32rem;
    padding-right: 2rem;
  }
}

.align-center {
  align-self: center;
  border-color: var(--color-background-alt);
  text-align: center;
}

.back-nav-link {
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;

  @media (max-width: 1080px) {
    right: 50px;
    bottom: 100px;
  }
}

.scrollable-list {
  height: 60vh;
  overflow-y: auto;
}
</style>
