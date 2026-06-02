<script setup lang="ts">
import {
  type Meal,
  type Medication,
  type Template,
  TemplateType
} from '@/service/templateService.ts'
import { getPortionTypeShortName } from '../../../util/enumToStringLiterals.ts'

const props = defineProps<{
  template: Template,
  type: TemplateType,
  showAddButton?: boolean,
}>()

const emit = defineEmits<{
  (e: 'click', template: Template): void,
  (e: 'add:click', template: Template): void
}>();
</script>

<template>
  <div class="item-wrapper" @click="$emit('click', template)">
    <div class="main-info-wrapper">
        <div class="name">{{ template.name }}</div>
        <div v-if="type === TemplateType.MEAL" class="carbs detail">
          Углеводы: {{ (template as Meal).carbsPer100Grams }} г
        </div>
        <div v-else-if="type === TemplateType.MEDICATION" class="detail">
          <div class="d-flex g-1">
            <span>{{ (template as Medication).defaultPortions }}
              {{getPortionTypeShortName((template as Medication).portionType)}}
            </span>
            <span>, {{ (template as Medication).milligramsInPortion }} мг в шт.</span>
          </div>
        </div>
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
  cursor: pointer;
  transition: ease-out 0.1s;

  &:hover {
    background-color: var(--color-background-alt-lite);
  }

  .main-info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;


    .value-info-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;

      .value {
        font-size: 3rem;
      }
    }


    .detail {
      opacity: 60%;
    }
  }
  .additional-info-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    align-self: end;
  }
}
</style>
