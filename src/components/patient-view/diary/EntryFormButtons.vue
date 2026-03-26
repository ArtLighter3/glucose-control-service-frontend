<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'

const props = defineProps({
  showDeleteButton: {
    type: Boolean,
    required: false,
    default: false
  },
  submitting: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['save', 'delete']);

const {isOpen, openModal, closeModal} = useModal();

const confirmDeletion = () => {
  closeModal();
  emit('delete');
}
</script>

<template>
  <div key="entry-form-buttons" class="button-row">
    <b-button
      class="button-row-item"
      variant="outline-success"
      :loading="props.submitting"
      loading-fill
      squared
      size="lg"
      @click="$emit('save')"
    >
      Сохранить
    </b-button>
    <b-button v-if="showDeleteButton"
      class="button-row-item"
      variant="outline-danger"
      :loading="props.submitting"
      loading-fill
      squared
      size="lg"
      @click="openModal()"
    >
      Удалить
    </b-button>
  </div>
  <base-modal v-if="showDeleteButton" :is-open="isOpen" title="Удалить запись?">
    <div class="button-row">
      <b-button
        class="button-row-item"
        variant="outline-success"
        squared
        size="lg"
        @click="confirmDeletion()"
      >
        Да
      </b-button>
      <b-button
        class="button-row-item"
        variant="outline-danger"
        squared
        size="lg"
        @click="closeModal()"
      >
        Нет
      </b-button>
    </div>
  </base-modal>
</template>

<style scoped>
.button-row {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;

  .button-row-item {
    width: 40%;
  }
}
</style>
