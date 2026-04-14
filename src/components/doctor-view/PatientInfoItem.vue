<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { type PatientInfo } from '@/service/doctorService.ts'

const props = defineProps<{
  patientInfo: PatientInfo,
}>()

const formattedBirthDate = computed(() => {
  if (props.patientInfo.birthDate === null || props.patientInfo.birthDate === undefined)
    return null;

  const date = new Date(props.patientInfo.birthDate);
  return format(date, "d MMM yyyy", {
    locale: ru
  });
});

const emit = defineEmits<{
  (e: 'click', patientInfo: PatientInfo): void
}>();
</script>

<template>
  <div class="item-wrapper" @click="$emit('click', entry)">
    <div class="main-info-wrapper">
      <div class="full-name-info-wrapper">
        <div class="last-name">{{ patientInfo.lastName }}</div>
        <div class="first-name">{{ patientInfo.firstName }}</div>
        <div v-if="patientInfo.middleName !== null" class="middle-name">
          {{ patientInfo.middleName }}
        </div>
      </div>
    </div>
    <div class="additional-info-wrapper">
      <div class="birthdate" v-if="formattedBirthDate !== null">{{ formattedBirthDate }}</div>
    </div>
  </div>
</template>

<style scoped>
.item-wrapper {
  display: flex;
  gap: 1.5rem;
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

    .full-name-info-wrapper {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

  }
  .additional-info-wrapper {
    display: flex;
    align-items: center;
    opacity: 60%;
  }
}
</style>
