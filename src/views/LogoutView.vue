<script setup lang="ts">
import { onMounted } from 'vue'
import router from '@/router'
import { useLogin } from '@/composables/fetching/useLogin.ts'

const { submitLogout } = useLogin();

onMounted(async () => {
  await submitLogout();
  await router.push({ name: "login" });
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
