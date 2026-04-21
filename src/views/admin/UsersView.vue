<script setup lang="ts">

import FunctionalUsersList from '@/components/admin-view/FunctionalUsersList.vue'

</script>

<template>
  <div class="users-view">
    <functional-users-list />
  </div>
</template>

<style scoped>
.users-view {
  display: flex;
  flex-direction: column;
}
</style>
