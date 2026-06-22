<script setup lang="ts">
import { BTabs, BTab } from 'bootstrap-vue-next'
import FunctionalPatientsList from '@/components/doctor-view/FunctionalPatientsList.vue'
import { type UserDetailedInfo, Role } from '@/service/userService.ts'
import UserInfoFormContent from '@/components/UserInfoFormContent.vue'

const props = defineProps<{
  userDetailedInfo: UserDetailedInfo
}>();

const emit = defineEmits(['user:deleted']);
</script>

<template>
  <div class="user-settings-wrapper">
    <h2>{{ userDetailedInfo.lastName }}
      {{ userDetailedInfo.firstName }}
      {{ userDetailedInfo.middleName !== null ? userDetailedInfo.middleName : "" }}
    </h2>
    <b-tabs pills class="tabs-wrapper" justified>
      <b-tab title="Настройки аккаунта">
        <div class="account-wrapper">
            <user-info-form-content
              :user-id="userDetailedInfo.id"
              :show-delete-button="true"
              @user:deleted="$emit('user:deleted')"
            />
        </div>
      </b-tab>
      <b-tab
        v-if="userDetailedInfo.roles.includes(Role.ROLE_DOCTOR)"
        title="Прикрепленные пациенты"
        lazy
      >
        <functional-patients-list
            :admin-view="true"
            :doctor-id="userDetailedInfo.id"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<style scoped>
.user-settings-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;

  .tabs-wrapper {
    flex-grow: 1;
    width: 100%;

    .recent-tab-wrapper {
      padding-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
}

:deep(.nav-link) {
  border-radius: 0;
  color: var(--color-text);

  &.active {
    background-color: var(--color-background-alt-lite);
    color: var(--color-text);
  }
}
</style>
