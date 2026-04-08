<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { BButton } from 'bootstrap-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "Вы уверены?"
  },
  text: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <base-modal :is-open="isOpen" :title="title" @close="$emit('cancel')">
    <div class="description-text">{{ text }}</div>
    <div class="button-row">
      <b-button
        class="button-row-item"
        variant="outline-success"
        squared
        size="lg"
        @click="$emit('confirm')"
      >
        Да
      </b-button>
      <b-button
        class="button-row-item"
        variant="outline-danger"
        squared
        size="lg"
        @click="$emit('cancel')"
      >
        Нет
      </b-button>
    </div>
  </base-modal>
</template>

<style scoped>
.description-text {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

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
