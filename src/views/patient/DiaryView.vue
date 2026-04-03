<script setup lang="ts">

import FunctionalDiary from '@/components/patient-view/diary/FunctionalDiary.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const id = ref(useRoute().params.id as string);
</script>

<template>
  <functional-diary :patient-id="id"></functional-diary>
</template>

<style scoped>
</style>
