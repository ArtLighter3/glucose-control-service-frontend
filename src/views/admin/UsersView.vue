<script setup lang="ts">

import FunctionalUsersList from '@/components/admin-view/FunctionalUsersList.vue'

</script>

<template>
  <div class="users-view">
    <h2>Пользователи системы</h2>
    <functional-users-list />
  </div>
</template>

<style scoped>
.users-view {
  display: flex;
  flex-direction: column;
  padding: 2rem;

  h2 {
    text-align: center;
  }
}
</style>
