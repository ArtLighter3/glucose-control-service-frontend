<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import type { UserDetailedInfo } from '@/service/userService.ts'
import { getRoleName } from '@/util/enumToStringLiterals.ts'

const props = defineProps<{
  userDetailedInfo: UserDetailedInfo,
}>()

const formattedBirthDate = computed(() => {
  if (props.userDetailedInfo.birthDate === null || props.userDetailedInfo.birthDate === undefined)
    return null;

  const date = new Date(props.userDetailedInfo.birthDate);
  return format(date, "d MMM yyyy", {
    locale: ru
  });
});

const emit = defineEmits<{
  (e: 'click', userDetailedInfo: UserDetailedInfo): void
}>();
</script>

<template>
  <div class="item-wrapper" @click="$emit('click', userDetailedInfo)">
    <div class="main-info-wrapper">
      <div class="full-name-info-wrapper">
        <div class="last-name">{{ userDetailedInfo.lastName }}</div>
        <div class="first-name">{{ userDetailedInfo.firstName }}</div>
        <div v-if="userDetailedInfo.middleName !== null" class="middle-name">
          {{ userDetailedInfo.middleName }}
        </div>
      </div>
    </div>
    <div class="additional-info-wrapper">
      <div class="id">{{ userDetailedInfo.id }}</div>
      <div class="roles">
        <div v-for="(role, index) in userDetailedInfo.roles" :key="role" class="role">
          {{ getRoleName(role) }}{{ index < userDetailedInfo.roles.length - 1 ? ", " : "" }}
        </div>
      </div>
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
    gap: 1rem;
    opacity: 60%;
  }
}
</style>
