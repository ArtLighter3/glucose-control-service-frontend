<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.ts'
import { onMounted } from 'vue'
import router from '@/router'

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({name: "patient-home", params: { id: `${authStore.getId()}` } });
  } else router.push({name: "login"});;
});
</script>

<template>
  <div></div>
</template>

<style scoped>

</style>
