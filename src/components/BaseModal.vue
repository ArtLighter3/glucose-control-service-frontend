<template>
  <Teleport to="body">
    <modal-transition-group>
      <div v-if="isOpen" class="modal-overlay" key="overlay" @click.self="$emit('close')">
        <div class="modal-content" key="content">
          <form-transition-group>
            <div class="modal-header" key="header">
              <h3>{{ title }}</h3>
            </div>
            <div class="modal-body" key="body">
              <slot></slot>
            </div>
          </form-transition-group>
        </div>
      </div>
    </modal-transition-group>
  </Teleport>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import ModalTransitionGroup from '@/components/ModalTransitionGroup.vue'
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal Title'
  }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 0;
  border-style: solid;
  border-width: 1px;
  border-color: var(--color-background-alt);
  max-width: 500px;
  width: 100%;
  z-index: 1001;

  @media (max-width: 768px) {
    width: 80%;
    padding: 15px;
  }
}

.modal-header {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
</style>
