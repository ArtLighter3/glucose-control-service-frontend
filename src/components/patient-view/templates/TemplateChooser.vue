<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { BButton, BPagination, BSpinner } from 'bootstrap-vue-next'
import SearchField from '@/components/SearchField.vue'
import { useModal } from '@/composables/useModal'
import { useTemplatesFetching } from '@/composables/fetching/useTemplatesFetching.ts'
import { type Template, TemplateType } from '@/service/templateService.ts'
import TemplateInfoList from '@/components/patient-view/templates/TemplateInfoList.vue'
import TemplateFormContent from '@/components/patient-view/templates/TemplateFormContent.vue'

const props = defineProps<{
  patientId: string,
  type: TemplateType
}>()

const { loading, templates, page, totalElements, pageSize, fetchAll, search, turnPage } =
  useTemplatesFetching(props.patientId, props.type)

onMounted(async () => {
  await fetchAll()
})

const currentQuery = ref('')
const searchTemplates = async (newQuery: string) => {
  currentQuery.value = newQuery
  await search(currentQuery.value)
}

const { isOpen, openModal, closeModal } = useModal();
const showUpdateForm = ref(false);
const templateToUpdate = ref<Template>({
  name: ""
});
const openAddForm = () => {
  showUpdateForm.value = false;
  openModal();
};
const openUpdateForm = (clickedTemplate: Template) => {
  templateToUpdate.value = {... clickedTemplate};
  showUpdateForm.value = true;
  openModal();
};

watch(page, async (newPage) => {
  await turnPage(currentQuery.value)
})

const emit = defineEmits<{
  (e: 'choose', template: Template): void
}>();
</script>

<template>
  <div class="template-list-wrapper">
    <search-field class="align-center" :loading="false" @search="searchTemplates($event)" />
    <div class="scrollable-list">
      <b-spinner v-if="loading" variant="success" />
      <template-info-list v-else
        :show-choose-button="true"
        :type="type"
        :templates="templates"
        @template:click="openUpdateForm($event)"
        @template:choose:click="$emit('choose', $event)"
      />
    </div>
    <b-pagination
      v-if="totalElements > pageSize"
      class="pages-wrapper"
      v-model="page"
      :total-rows="totalElements"
      :per-page="pageSize"
      size="md"
      align="center"
    />
    <b-button variant="outline-success" class="add-btn" squared size="lg" @click="openAddForm">
      Добавить нов.
    </b-button>
    <base-modal :is-open="isOpen" @close="closeModal" title="">
      <template-form-content
        :patient-id="patientId"
        :template-type="type"
        :show-update-form="showUpdateForm"
        :template-to-update="templateToUpdate"
        @templates:updated="closeModal(); turnPage(currentQuery)"
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

  @media (max-width: 1080px) {
    padding-left: 4.32rem;
    padding-right: 2rem;
  }
}

.align-center {
  align-self: center;
  border-color: var(--color-background-alt);
}

.scrollable-list {
  height: 50vh;
  overflow-y: auto;
}
</style>
