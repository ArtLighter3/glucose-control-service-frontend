<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { BSpinner, BPagination } from 'bootstrap-vue-next'
import { watch } from 'vue'
import SearchField from '@/components/SearchField.vue'
import { useModal } from '@/composables/useModal'
import { useTemplatesFetching } from '@/composables/fetching/useTemplatesFetching.ts'
import type { Template, TemplateType } from '@/service/templateService.ts'
import TemplateInfoList from '@/components/patient-view/templates/TemplateInfoList.vue'
import TemplateFormContent from '@/components/patient-view/templates/TemplateFormContent.vue'

const props = defineProps<{
  patientId: string,
  type: TemplateType,
}>();

const { loading, templates, page, totalElements,
  pageSize, fetchAll, search, turnPage }
  = useTemplatesFetching(props.patientId, props.type);

onMounted(async () => {
  await fetchAll();
});

const currentQuery = ref('');
const searchTemplates = async (newQuery: string) => {
  currentQuery.value = newQuery;
  await search(currentQuery.value);
};

watch((page), async (newPage) => {
  await turnPage(currentQuery.value);
});

const { isOpen, openModal, closeModal } = useModal();
const templateToUpdate = ref<Template>({
  name: ""
});
const openTemplateUpdateForm = (template: Template) => {
  templateToUpdate.value = template;
  openModal();
};

// const emit = defineEmits<{
//   (e: 'patient:detach', patientInfo: PatientInfo): void
// }>();
</script>

<template>
  <div class="template-list-wrapper">
    <search-field
      class="align-center"
      :loading="false"
      @search="searchTemplates($event)"
    />
    <div class="scrollable-list">
      <b-spinner v-if="loading" variant="success" />
      <template-info-list
        v-else
        :show-choose-button="false"
        :type="type"
        :templates="templates"
        @template:click="openTemplateUpdateForm($event)"
      />
    </div>
    <b-pagination v-if="totalElements > pageSize"
      class="pages-wrapper"
      v-model="page"
      :total-rows="totalElements"
      :per-page="pageSize"
      size="md"
      align="center"
    />
    <base-modal :is-open="isOpen" @close="closeModal" title="">
      <template-form-content
        :patient-id="patientId"
        :template-type="type"
        :show-update-form="true"
        :template-to-update="templateToUpdate"
        @templates:updated="turnPage(currentQuery)"
      />
    </base-modal>
  </div>
</template>

<style scoped>
.template-list-wrapper {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

}

.align-center {
    align-self: center;
    border-color: var(--color-background-alt);
}

.scrollable-list {
  height: 60vh;
  overflow-y: auto;
}
</style>
