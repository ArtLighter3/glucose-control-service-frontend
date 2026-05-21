<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import UserCreationFormContent from '@/components/admin-view/UserCreationFormContent.vue'

const { isOpen, openModal, closeModal }
  = useModal();

const emit = defineEmits(['user:added']);
</script>

<template>
  <b-button variant="success" class="circular-btn" size="lg" @click="openModal">+</b-button>
  <base-modal :is-open="isOpen" @close="closeModal" title="Новый пользователь">
    <div class="scrollable-form">
      <user-creation-form-content @user:added="$emit('user:added'); closeModal()"/>
    </div>
  </base-modal>
</template>

<style scoped>
.scrollable-form {
  overflow-y: auto;
  height: 60vh;
}
</style>
