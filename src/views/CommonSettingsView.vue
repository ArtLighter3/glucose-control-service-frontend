<script setup lang="ts">

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import UserInfoFormContent from '@/components/UserInfoFormContent.vue'

const id = ref(useRoute().params.id as string);

</script>

<template>
  <div class="settings-view-wrapper">
    <div class="tabs-wrapper">
        <user-info-form-content :user-id="id" />
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
  }
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt);
  }
}

</style>

