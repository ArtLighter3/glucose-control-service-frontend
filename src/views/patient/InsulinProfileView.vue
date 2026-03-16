<script setup lang="ts">

import { useRoute } from 'vue-router'
import { ref } from 'vue'
import InsulinProfileFormContent from '@/components/InsulinProfileFormContent.vue'

const id = ref(useRoute().params.id as string);

</script>

<template>
  <div class="insulin-profile-view-wrapper">
    <insulin-profile-form-content :patientId="id"/>
  </div>
</template>

<style scoped>
.insulin-profile-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

