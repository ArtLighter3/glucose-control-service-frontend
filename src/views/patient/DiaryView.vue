<script setup lang="ts">

import FunctionalDiary from '@/components/patient-view/diary/FunctionalDiary.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddEntryButton from '@/components/patient-view/diary/AddEntryButton.vue'
import { useRefreshComponent } from '@/composables/useRefreshComponent.ts'

const id = ref(useRoute().params.id as string);

const { componentKey, refresh } = useRefreshComponent();
</script>

<template>
  <div class="diary-view">
    <functional-diary :key="componentKey" :patient-id="id"></functional-diary>
    <div class="add-button-wrapper">
      <add-entry-button @entries:updated="refresh" :patient-id="id"></add-entry-button>
    </div>
  </div>
</template>

<style scoped>
.add-button-wrapper {
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;

  @media (max-width: 768px) {
    right: 50px;
    bottom: 100px;
  }
}
</style>
