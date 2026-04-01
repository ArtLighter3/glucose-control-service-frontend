<script setup lang="ts">

import PatientProfileFormContent from '@/components/patient-view/PatientProfileFormContent.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import UserLoginForm from '@/components/UserLoginForm.vue'
import { useModal } from '@/composables/useModal.ts'

const id = ref(useRoute().params.id as string);

const { isOpen, openModal, closeModal } = useModal();
</script>

<template>
  <div class="profile-view-wrapper">
    <patient-profile-form-content :patientId="id"/>
    <base-modal :is-open="isOpen" title="ВХОД В СИСТЕМУ" @close="closeModal">
      <user-login-form/>
    </base-modal>
  </div>

</template>

<style scoped>
.profile-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem
}
</style>

