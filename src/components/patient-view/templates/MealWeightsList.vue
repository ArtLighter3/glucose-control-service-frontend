<script setup lang="ts">
import type { Meal, MealWeights } from '@/service/templateService.ts'
import MealConfigurableItem from '@/components/patient-view/templates/MealConfigurableItem.vue'
import { BButton } from 'bootstrap-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  meals: Meal[]
}>();

const mealWeights = ref<MealWeights>({});
// //onMounted(() => {
// watch(() => props.meals, (newMeals) => {
//  // mealWeights.value = [];
//   newMeals.forEach((meal) => {
//     // mealWeights.value.push({
//     //   mealInfo: meal,
//     //   weight: 0,
//     // });
//     const mealWeight = mealWeights.value[meal.name];
//     if (mealWeight !== undefined) continue;
//
//     mealWeights.value[meal.name] = 0;
//   });
// }, {immediate: true, deep: true});

const setWeight = (name: string, weight: number) => {
  // const mealWeight = mealWeights.value[meal.name];
  // if (mealWeight !== undefined) continue;

  mealWeights.value[name] = weight;
}
//});

const emit = defineEmits<{
  (e: 'delete', index: number): void
  (e: 'calculate', mealWeights: MealWeights): void
}>();
</script>

<template>
  <div class="meal-weights-wrapper">
    <meal-configurable-item
      v-for="(meal, index) in meals"
      :key="index"
      :meal="meal"
      @delete="delete mealWeights[meal.name]; $emit('delete', index)"
      @weight:input="setWeight(meal.name, $event)"
    />
    <b-button squared variant="outline-success" @click="$emit('calculate', mealWeights)">
      Рассчитать
    </b-button>
  </div>
</template>

<style scoped>
.meal-weights-wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
</style>
