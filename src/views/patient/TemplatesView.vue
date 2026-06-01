<script setup lang="ts">
import { BTabs, BTab } from 'bootstrap-vue-next'
import FunctionalTemplateInfoList
  from '@/components/patient-view/templates/FunctionalTemplateInfoList.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRefreshComponent } from '@/composables/useRefreshComponent.ts'
import { TemplateType } from '@/service/templateService.ts'
import AddTemplateFunctionalButton
  from '@/components/patient-view/templates/AddTemplateFunctionalButton.vue'

const id = ref(useRoute().params.id as string);
const { componentKey: mealListKey, refresh: refreshMealList } = useRefreshComponent();
const { componentKey: medListKey, refresh: refreshMedList } = useRefreshComponent();
</script>

<template>
  <div class="templates-view-wrapper">
    <b-tabs pills class="tabs-wrapper" justified>
      <b-tab title="Еда">
        <functional-template-info-list
          :key="mealListKey"
          :patient-id="id"
          :type="TemplateType.MEAL"
        />
        <div class="add-button-wrapper">
          <add-template-functional-button
            :patient-id="id"
            :type="TemplateType.MEAL"
            @templates:added="refreshMealList"
          />
        </div>
      </b-tab>
      <b-tab title="Препараты" lazy>
        <functional-template-info-list
          :key="medListKey"
          :patient-id="id"
          :type="TemplateType.MEDICATION"
        />
        <div class="add-button-wrapper">
          <add-template-functional-button
            :patient-id="id"
            :type="TemplateType.MEDICATION"
            @templates:added="refreshMedList"
          />
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<style scoped>
.templates-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;

  .tabs-wrapper {
    flex-grow: 1;
    width: 100%;

    .add-button-wrapper {
      position: fixed;
      bottom: 100px;
      right: 100px;
      z-index: 999;

      @media (max-width: 1080px) {
        right: 50px;
        bottom: 100px;
      }
    }

  }
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt);
  }
}
</style>
