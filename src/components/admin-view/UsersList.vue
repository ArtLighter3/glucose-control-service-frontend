<script setup lang="ts">
import FormTransitionGroup from '@/components/FormTransitionGroup.vue'
import type { UserDetailedInfo } from '@/service/userService.ts'
import UserInfoItem from '@/components/admin-view/UserInfoItem.vue'

const props = defineProps<{
  users: UserDetailedInfo[],
}>();

const emit = defineEmits<{
  (e: 'user:click', userDetailedInfo: UserDetailedInfo): void
}>();
</script>

<template>
  <div class="users-wrapper">
    <form-transition-group>
      <user-info-item class="user-info-item"
                      v-for="(user, index) in users"
                      :key="index"
                      :user-detailed-info="user"
                      @click="$emit('user:click', user)"
      />
    </form-transition-group>
  </div>
</template>

<style scoped>
.users-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>
