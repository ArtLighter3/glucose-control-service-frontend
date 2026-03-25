<script setup lang="ts">

</script>

<template>
 <transition-group>
   <slot></slot>
 </transition-group>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: ease-out 0.1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
