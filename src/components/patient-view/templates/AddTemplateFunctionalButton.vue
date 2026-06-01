<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { TemplateType } from '@/service/templateService.ts'
import TemplateFormContent from '@/components/patient-view/templates/TemplateFormContent.vue'

const props = defineProps<{
  patientId: string,
  type: TemplateType
}>();

const { isOpen, closeModal, openModal } = useModal();

const emit = defineEmits(['templates:added']);
</script>

<template>
  <b-button variant="success" class="circular-btn" size="lg" @click="openModal">+</b-button>
  <base-modal :is-open="isOpen" @close="closeModal" title="">
    <template-form-content
      :template-type="type"
      :patient-id="props.patientId"
      @templates:updated="$emit('templates:added'); closeModal()"
    />
  </base-modal>
</template>

<style scoped>

</style>
