<script setup lang="ts">

</script>

<template>
 <transition-group>
   <slot></slot>
 </transition-group>
</template>

<style>
.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-active {
  position: absolute;
}
</style>
