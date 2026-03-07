<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: true,
    }
  })

</script>

<template>
  <div class="sidebar-item-wrapper">
    <img v-if="icon" :src="icon" alt="" class="sidebar-item-icon"/>
    <span class="sidebar-item-text">{{ text }}</span>
  </div>
</template>

<style scoped>
  .sidebar-item-wrapper {
    display: flex;
    flex-direction: row;
    transition: 0.3s ease-out;
  }
</style>
