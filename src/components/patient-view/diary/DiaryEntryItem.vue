<script setup lang="ts">
import {
  type CarbsEntry,
  DiaryEntryType,
  type DiaryEntryWithType,
  type GlucoseEntry, type InsulinEntry, type MedicationEntry
} from '@/service/diaryService.ts'
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import {
  getCarbsUnitShortName,
  getGlucoseUnitName,
  getInsulinTypeName, getMeasurementTypeName, getPortionTypeShortName
} from '@/util/enumToStringLiterals.ts'

const props = defineProps<{
  entry: DiaryEntryWithType
}>()

const iconPath = computed(() => {
  switch (props.entry.type) {
    case DiaryEntryType.CARBS_ENTRY:
      return 'assets/icons/meal-black.svg'
    case DiaryEntryType.GLUCOSE_ENTRY:
      return 'assets/icons/glucose-black.svg'
    case DiaryEntryType.INSULIN_ENTRY:
      return 'assets/icons/insulin-black.svg'
    case DiaryEntryType.MEDICATION_ENTRY:
      return 'assets/icons/medication-black.svg'
  }
  return null
})

const unit = computed(() => {
  switch (props.entry.type) {
    case DiaryEntryType.CARBS_ENTRY:
      const carbsUnit = (props.entry.entryInfo as CarbsEntry).carbsUnits
      if (carbsUnit !== null) return getCarbsUnitShortName(carbsUnit);
      return "";
    case DiaryEntryType.GLUCOSE_ENTRY:
      const glucoseUnit = (props.entry.entryInfo as GlucoseEntry).glucoseUnits;
      if (glucoseUnit !== null) return getGlucoseUnitName(glucoseUnit)
      return "";
    case DiaryEntryType.MEDICATION_ENTRY:
      return getPortionTypeShortName((props.entry.entryInfo as MedicationEntry).portionType);
    case DiaryEntryType.INSULIN_ENTRY:
      return 'ед'
  }
  return ''
});

const formattedDate = computed(() => {
  const date = props.entry.entryInfo.commitedAt;
  return format(date, "eeee, d MMM yyyy, HH:mm", {
    locale: ru
  });
});

const emit = defineEmits<{
  (e: 'click', entry: DiaryEntryWithType): void
}>();
</script>

<template>
  <div class="item-wrapper" @click="$emit('click', entry)">
    <img v-if="iconPath !== null" :src="`/${iconPath}`" alt="" class="entry-icon" />
    <div class="main-info-wrapper">
      <div class="value-info-wrapper">
        <div class="value">{{ entry.entryInfo.value }}</div>
        <div class="unit">{{ unit }}</div>
        <div v-if="entry.type === DiaryEntryType.INSULIN_ENTRY" class="detail">
          {{ getInsulinTypeName((entry.entryInfo as InsulinEntry).insulinType) }}
        </div>
        <div v-else-if="entry.type === DiaryEntryType.MEDICATION_ENTRY" class="detail">
          {{ (entry.entryInfo as MedicationEntry).name }}
          <div v-if="(entry.entryInfo as MedicationEntry).milligramsInPortion !== null">
            ({{ (entry.entryInfo as MedicationEntry).milligramsInPortion * entry.entryInfo.value }}
            мг)
          </div>
        </div>
        <div v-else-if="entry.type === DiaryEntryType.GLUCOSE_ENTRY" class="detail">
          {{ getMeasurementTypeName((entry.entryInfo as GlucoseEntry).category) }}
        </div>
      </div>
      <div class="date-info-wrapper">{{ formattedDate }}</div>
    </div>
    <div class="additional-info-wrapper">
      <img v-if="entry.entryInfo.notes !== null"
           :src="`/assets/icons/note.svg`"
           alt="" class="note-icon" />
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
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

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
      flex-wrap: wrap;

      @media (max-width: 768px) {
        row-gap: 0.5rem;
        column-gap: 0.5rem;
      }

      .value {
        font-size: 3rem;

        @media (max-width: 768px) {
          font-size: 2rem;
        }
      }
    }


    .date-info-wrapper, .detail {
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
