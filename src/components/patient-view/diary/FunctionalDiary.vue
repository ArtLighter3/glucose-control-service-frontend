<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type DiaryEntryWithType, getDiaryEntries } from '@/service/diaryService.ts'
import { isAxiosError } from 'axios'
import DiaryEntriesList from '@/components/patient-view/diary/DiaryEntriesList.vue'

const props = defineProps({
  patientId: {
    type: String,
    required: true
  }
});

const loading = ref(false);
const entries = ref<DiaryEntryWithType[]>([]);

onMounted(async () => {
  loading.value = true;
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  try {
    const response = await getDiaryEntries(props.patientId, lastWeek, new Date());
    entries.value = response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.log(err);
    }
  }
  loading.value = false;
});

</script>

<template>
 <div class="diary-wrapper">
    <diary-entries-list :entries="entries"></diary-entries-list>
 </div>
</template>

<style scoped>
.diary-wrapper {
  padding: 3rem;

  @media (max-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
  }
}
</style>
