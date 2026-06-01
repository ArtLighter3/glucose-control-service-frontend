<script setup lang="ts">
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { Template, TemplateType } from '@/service/templateService.ts'
import TemplateInfoItem from '@/components/patient-view/templates/TemplateInfoItem.vue'

const props = defineProps<{
  templates: Template[],
  type: TemplateType,
  showAddButton: boolean
}>();

const emit = defineEmits<{
  (e: 'template:click', template: Template): void,
  (e: 'template:add', template: Template): void
}>();
</script>

<template>
  <div class="templates-wrapper">
    <form-transition-group>
      <template-info-item class="template-info-item"
                          v-for="(template, index) in templates"
                          :key="index"
                          :template="template"
                          :type="type"
                          @click="$emit('template:click', template)"
                          @add:click="$emit('template:add', template)"
                          :show-add-button="showAddButton"
      />
    </form-transition-group>
  </div>
</template>

<style scoped>
.templates-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>
