<script setup lang="ts">

</script>

<template>
  <div class="border-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped>
 .border-wrapper {
   border-width: 1px;
   border-style: solid;
   border-color: var(--color-background-alt);
 }
</style>
