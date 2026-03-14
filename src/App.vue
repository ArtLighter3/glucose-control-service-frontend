<script setup lang="ts">
import { BOrchestrator, BApp } from 'bootstrap-vue-next'
</script>

<template>
  <header>
    <BOrchestrator></BOrchestrator>
    <b-app class="wrapper">
      <router-view></router-view>
    </b-app>
  </header>
</template>

<style scoped>

</style>
