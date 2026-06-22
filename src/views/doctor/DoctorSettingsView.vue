<script setup lang="ts">

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { BButton, BSpinner } from 'bootstrap-vue-next'
import UserInfoFormContent from '@/components/UserInfoFormContent.vue'
import { useModal } from '@/composables/useModal.ts'
import { useDoctorProfileFetching } from '@/composables/fetching/useDoctorProfileFetching.ts'
import BaseModal from '@/components/BaseModal.vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard.ts'

const id = ref(useRoute().params.id as string);

const { isOpen, openModal, closeModal } = useModal();
const { doctorProfile, fetch, fetchingError, loading } = useDoctorProfileFetching(id.value);

const { isCopied, copyToClipboard } = useCopyToClipboard();

</script>

<template>
  <div class="settings-view-wrapper">
    <div class="tabs-wrapper">
      <div class="tab-wrapper">
        <user-info-form-content :user-id="id"/>
        <b-button class="code-btn" variant="outline-dark" squared @click="fetch(); openModal();">
          Личный код врача
        </b-button>
        <base-modal title="Личный код" @close="closeModal" :is-open="isOpen">
          <b-spinner v-if="loading" variant="success"/>
          <div v-else
               class="doctor-code-wrapper"
               @click="copyToClipboard(doctorProfile?.personalCode)"
          >
            {{ doctorProfile?.personalCode }}
          </div>
          <div class="description-text">
            Код используется пользователями для самостоятельного прикрепления и обмена данными
          </div>
        </base-modal>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;

  .tabs-wrapper {
    flex-grow: 1;

    .tab-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  }
}

.code-btn {
  align-self: center;
}

.doctor-code-wrapper {
  cursor: pointer;
  color: var(--color-background-alt);
  font-size: 3rem;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 2rem;
}

.description-text {
  text-align: center;
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt-lite);
    color: var(--color-text);
  }
}

</style>

