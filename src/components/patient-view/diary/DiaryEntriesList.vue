<script setup lang="ts">
import type { DiaryEntryWithType } from '@/service/diaryService.ts'
import DiaryEntryItem from '@/components/patient-view/diary/DiaryEntryItem.vue'
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

interface EntriesByDay {
  [key: string]: DiaryEntryWithType[];
}

const props = defineProps<{
  entries: DiaryEntryWithType[],
}>();

const entryListByDay = computed(() => {
  const map: EntriesByDay = {};

  //Собираем входные записи по временной отметке
  props.entries.forEach((entry) => {
    const day = entry.entryInfo.commitedAt.slice(0, 10);
    let list: DiaryEntryWithType[] | undefined = map[day];
    if (list === undefined) {
      list = [];
      map[day] = list;
    }
    list.push(entry);
  });

  return map;
});

const entryListSortedKeys = computed(() => {
  return Object.keys(entryListByDay.value).sort((a, b) => b.localeCompare(a));
});

const emit = defineEmits<{
  (e: 'entry:click', entry: DiaryEntryWithType): void
}>();
</script>

<template>
  <div class="entries-wrapper">
    <div class="one-day-entries" v-for="(day) in entryListSortedKeys" :key="day">
      <h3> {{ format(day, "eeee, d MMM, yyyy", { locale: ru }) }}</h3>
      <diary-entry-item v-for="(entry, index) in entryListByDay[day]"
                        class="entry-item"
                        :key="`${day}-${index}`"
                        :entry="entry"
                        @click="$emit('entry:click', $event)"/>
    </div>
  </div>
</template>

<style scoped>
.entries-wrapper{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .one-day-entries {
    display: flex;
    flex-direction: column;

    .entry-item {
      margin-bottom: 1rem;
    }
  }
}
</style>
