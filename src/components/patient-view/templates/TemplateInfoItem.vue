<script setup lang="ts">
import {
  type Meal,
  type Medication,
  type Template,
  TemplateType
} from '@/service/templateService.ts'
import { getPortionTypeShortName } from '@/util/enumToStringLiterals.ts'
import {BButton} from 'bootstrap-vue-next'

const props = defineProps<{
  template: Template,
  type: TemplateType,
  showChooseButton?: boolean,
}>()

const emit = defineEmits<{
  (e: 'click', template: Template): void,
  (e: 'choose:click', template: Template): void
}>();
</script>

<template>
  <div class="item-outer-wrapper">
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
    <b-button v-if="showChooseButton"
              class="choose-btn"
              size="lg"
              variant="outline-success"
              squared
              @click="$emit('choose:click', template)"
    >
      +
    </b-button>
  </div>
</template>

<style scoped>

.item-outer-wrapper {
  display: flex;
  gap: 1rem;
  align-items: stretch;

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
    flex-grow: 1;

    &:hover {
      background-color: var(--color-background-alt-lite);
    }

    .main-info-wrapper {
      display: flex;
      flex-direction: column;
      align-items: start;


      .detail {
        opacity: 60%;
      }
    }

    .choose-btn {
      margin-left: auto;
    }
  }
}
</style>
