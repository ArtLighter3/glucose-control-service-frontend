<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type PatientInfo,
  getAttachedPatients, searchAttachedPatients
} from '@/service/doctorService.ts'
import PatientsList from '@/components/doctor-view/PatientsList.vue'
import { isAxiosError } from 'axios'
import BaseModal from '@/components/BaseModal.vue'
import { useModal } from '@/composables/useModal.ts'
import { BSpinner } from 'bootstrap-vue-next'
import { usePagination } from '@/composables/usePagination'
import { watch } from 'vue'

const props = defineProps<{
  doctorId: string,
}>();

const loading = ref(false);
const patients = ref<PatientInfo[]>([]);

const { page, pageCount } = usePagination(0);

onMounted(async () => {
  await getPatients();
});

const getPatients = async () => {
  loading.value = true;
    try {
      const response = await getAttachedPatients(props.doctorId, page.value);
      patients.value = response.data.content;
      if (response.data.totalPages !== undefined)
        pageCount.value = response.data.totalPages;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err);
      }
    }
    loading.value = false;
};

watch((page), async (newPage) => {
  await getPatients();
});

// const entryToUpdate = ref<DiaryEntryWithType>({
//   type: DiaryEntryType.GLUCOSE_ENTRY,
//   entryInfo: new DefaultGlucoseEntry()
// });
// const { isOpen: isEntryFormOpen, openModal: openEntryForm, closeModal: closeEntryForm }
//   = useModal();
// const openEntryUpdateForm = (entryWithType: DiaryEntryWithType) => {
//   entryToUpdate.value = entryWithType;
//   openEntryForm();
// };

//defineExpose(refreshDiary, loading);
</script>

<template>
  <div class="patients-list-wrapper">
    <b-spinner v-if="loading" variant="success"/>
    <patients-list v-else
      @patient:click=""
      :patients="patients"
    />
    <div v-if="pageCount > 1" class="pages-wrapper">
      <div v-for="pageIndex in pageCount"
           :key="pageIndex"
           class="page"
           @click="page = (pageIndex - 1)"
      >
        {{ pageIndex }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.patients-list-wrapper {
  padding: 3rem;

  @media (max-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
  }

  .pages-wrapper {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    align-items: center;

    .page {
      cursor: pointer;
    }
  }
}
</style>
