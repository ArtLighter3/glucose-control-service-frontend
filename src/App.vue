<script setup lang="ts">
import { BOrchestrator } from 'bootstrap-vue-next'
</script>

<template>
  <header>
    <BOrchestrator></BOrchestrator>
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </header>
</template>

<style scoped>

</style>
