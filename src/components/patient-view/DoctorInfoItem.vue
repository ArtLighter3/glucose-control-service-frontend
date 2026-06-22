<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import type { AttachedDoctorInfo } from '@/service/patientProfileService.ts'

const props = defineProps<{
  doctorInfo: AttachedDoctorInfo,
  showDetachButton: boolean,
}>()

const emit = defineEmits<{
  (e: 'click', doctorInfo: AttachedDoctorInfo): void,
  (e: 'detach:click', doctorInfo: AttachedDoctorInfo): void,
}>();
</script>

<template>
  <div class="item-wrapper" @click="$emit('click', doctorInfo)">
    <div class="main-info-wrapper">
      <div class="full-name-info-wrapper">
        <div class="last-name">{{ doctorInfo.lastName }}</div>
        <div class="first-name">{{ doctorInfo.firstName }}</div>
        <div v-if="doctorInfo.middleName !== null" class="middle-name">
          {{ doctorInfo.middleName }}
        </div>
      </div>
    </div>
    <b-button
      v-if="showDetachButton"
      class="attach-detach-btn"
      variant="outline-danger"
      size="lg"
      @click="$emit('detach:click', doctorInfo)"
      squared
    >
      Отозвать доступ
    </b-button>
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

  @media (max-width: 768px) {
    padding: 0.5rem;
    flex-wrap: wrap;
    row-gap: 0.5rem;
  }

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
      overflow-wrap: break-word;
      word-break: break-word;
    }

  }

  .attach-detach-btn {
    margin-left: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
}
</style>
