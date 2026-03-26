<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  iconPath: {
    type: String,
    required: false
  }
});

const emit = defineEmits<{
  (e: 'click'): void
}>();
</script>

<template>
  <button @click="$emit('click')" class="entry-type-item">
    <img :src="`/src/${props.iconPath}`"/>
    <span>{{ name }}</span>
  </button>
</template>

<style scoped>
.entry-type-item {
  display: flex;
  flex-direction: column;
  background: none;
  border-style: solid;
  border-color: var(--color-background-alt);
  border-width: 2px;
  align-items: center;
  transition: ease-out 0.1s;

  &:hover {
    border-color: var(--color-text-on-alt-background-hover);
  }
}
</style>
