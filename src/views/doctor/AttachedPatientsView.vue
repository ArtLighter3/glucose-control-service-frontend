<script setup lang="ts">

import FunctionalPatientsList from '@/components/doctor-view/FunctionalPatientsList.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const id = ref(useRoute().params.id as string);
</script>

<template>
  <div class="attached-patients-view">
    <functional-patients-list :doctor-id="id" />
  </div>
</template>

<style scoped>
.attached-patients-view {
  display: flex;
  flex-direction: column;
}
</style>
