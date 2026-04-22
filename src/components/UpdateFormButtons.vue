<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import { useModal } from '@/composables/useModal.ts'
import ConfirmDialogModal from '@/components/ConfirmDialogModal.vue'

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
  <confirm-dialog-modal :is-open="isOpen"
                        title="Удаление"
                        text="Вы уверены?"
                        @confirm="confirmDeletion"
                        @cancel="closeModal"
  />
</template>

<style scoped>
.button-row {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;

  .button-row-item {

  }
}
</style>
