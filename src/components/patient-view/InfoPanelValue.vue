<script setup lang="ts">

const props = defineProps({
  name: {
    type: [String, null],
    required: false,
  },
  value: {
    type: [Number, null],
    required: false,
  },
  units: {
    type: [String, null],
    required: false,
  },
})

</script>

<template>
  <div class="panel-item-wrapper">
    <span v-if="name" class="panel-name">{{ name }}</span>
    <span v-if="value !== null && value !== undefined"
          class="panel-value">{{ parseFloat(value.toFixed(2)) }}
    </span>
    <span v-else class="panel-value">--</span>

    <span v-if="units" class="panel-unit">{{ units }}</span>
    <span v-else class="panel-unit">Нет данных</span>
  </div>
</template>

<style scoped>
.panel-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .panel-value {
    font-size: 3rem;
  }
}
</style>
