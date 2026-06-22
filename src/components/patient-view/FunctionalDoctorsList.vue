<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import {
  BSpinner,
  BButton,
  BPagination,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback
} from 'bootstrap-vue-next'
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

 const {
   loading: attachDetachLoading,
   attachByCode,
   detachByCode,
   success: attachDetachSuccess,
   conflict: attachConflict
 } = useAttachDetachByCode(props.patientId);

watch((page), async (newPage) => {
  await fetch();
});

const codeToDetach = ref<string>();
const detach = async () => {
  if (codeToDetach.value === undefined) return;
  await detachByCode(codeToDetach.value);

  if (attachDetachSuccess.value) {
    codeToDetach.value = undefined;
    await fetch();
    closeDetach();
  }
};

const codeToAttach = ref<string>("");
const attach = async () => {
  codeToAttach.value = codeToAttach.value.toUpperCase();
  await attachByCode(codeToAttach.value);

  if (attachDetachSuccess.value) {
    await fetch();
    closeAttach();
    codeToAttach.value = "";
  }
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
        @doctor:detach="codeToDetach = $event.doctorCode; openDetach()"
        :doctors="doctors"
        :show-detach-buttons="true"
      />
    </div>
    <b-pagination v-if="totalElements > pageSize"
                  class="pages-wrapper"
                  v-model="page"
                  :total-rows="totalElements"
                  :per-page="pageSize"
                  size="md"
                  align="center"
    />
    <b-button
      class="attach-btn"
      variant="outline-success"
      squared
      size="lg"
      @click="attachDetachSuccess = true; openAttach()"
    >
      Добавить врача
    </b-button>
    <base-modal :is-open="isAttachOpen" @close="closeAttach" title="Добавление врача">
      <div class="">
        <b-form class="attach-form" @submit.prevent="attach">
          <b-form-group
            class="attach-form-group"
            key="code"
            id="code"
            label="Введите код, полученный от врача"
            label-for="code-input"
            :state="attachDetachSuccess ? null : false"
          >
            <b-form-input
              class="squared-input-field text-uppercase"
              key="code-input"
              id="code-input"
              type="text"
              v-model="codeToAttach"
              placeholder="0A0A0A0A"
            />
            <b-form-invalid-feedback>
              <span v-if="attachConflict" key="err1">
                Врач уже добавлен
              </span>
              <span v-else key="err2">
                Введен недействительный код
              </span>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit"
                    squared
                    variant="outline-success"
                    :loading="attachDetachLoading"
                    loading-fill
                    size="lg"
          >
            Добавить
          </b-button>
        </b-form>
      </div>
    </base-modal>
    <confirm-dialog-modal :is-open="isDetachOpen"
                          text="Врач больше не сможет получить доступ к вашим данным"
                          @cancel="closeDetach"
                          @confirm="detach"
                          :loading="attachDetachLoading"
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

  @media (max-width: 768px) {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 1rem;
    padding-right: 1rem;
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

.attach-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
</style>
