<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SelectableAnalytics from '@/components/patient-view/SelectableAnalytics.vue'

const id = ref(useRoute().params.id as string);
</script>

<template>
  <div class="analytics-view-wrapper">
    <selectable-analytics :patient-id="id" :patient-view="true"/>
  </div>
</template>

<style scoped>
.analytics-view-wrapper {
  padding: 2rem;

  @media (max-width: 1080px) {
    padding-left: 5rem;
  }
}
</style>
