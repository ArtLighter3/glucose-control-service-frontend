<script setup lang="ts">
import {
  type Meal
} from '@/service/templateService.ts'
import {BButton, BFormInput} from 'bootstrap-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  meal: Meal,
}>()

const emit = defineEmits<{
  (e: 'delete'): void,
  (e: 'weight:input', weight: number | null): void
}>();

const weightInputState = ref<boolean | null>(null);
const inputUpdated = (input: number | null) => {
  weightInputState.value = null;

  if (input === null) emit('weight:input', null);
  const weight = Number(input);

  if (!Number.isNaN(weight) && weight >= 0) {
    emit('weight:input', weight);
  } else weightInputState.value = false;
}
</script>

<template>
  <div class="item-wrapper">
    <div class="main-info-wrapper">
        <div class="name">{{ meal.name }}</div>
        <div class="carbs detail">
          Углеводы: {{ meal.carbsPer100Grams }} г (на 100 г)
        </div>
    </div>
    <div class="config-items-wrapper">
      <span class="detail">Вес</span>
      <b-form-input class="squared-input-field"
                    type="number"
                    number
                    @update:model-value="inputUpdated($event === null ? null : Number($event))"
                    :state="weightInputState"
      />
      <span class="detail">г</span>
      <b-button variant="outline-danger" squared @click="$emit('delete')">
        -
      </b-button>
    </div>
  </div>
</template>

<style scoped>
.item-wrapper {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
  border-style: solid;
  border-width: 1px;
  border-color: var(--color-background-alt);
  transition: ease-out 0.1s;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }

  &:hover {
    background-color: var(--color-background-alt-lite);
  }

  .main-info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .config-items-wrapper {
    margin-left: auto;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
}

.detail {
  opacity: 60%;
}
</style>
