<script setup lang="ts">
import SideBar, { type SidebarItem } from '@/components/SlidingSidebar.vue'
import { reactive, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { storeToRefs } from 'pinia'
import { useModal } from '@/composables/useModal.ts'
import UserLoginForm from '@/components/UserLoginForm.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useRefreshComponent } from '@/composables/useRefreshComponent.ts'
import { useRedirectionToRolePanel } from '@/composables/useRedirectionToRolePanel.ts'

  const sidebarItems: SidebarItem[] = reactive([
    {
      iconPath: "assets/icons/users.svg",
      text: "Пользователи",
      routeName: "users"
    },
    {
      iconPath: "assets/icons/settings.svg",
      text: "Настройки аккаунта",
      routeName: "admin-settings"
    },
  ]);

const { isOpen, openModal, closeModal } = useModal();

const { componentKey: key, refresh } = useRefreshComponent();

const authStore = useAuthStore();
const { userSession } = storeToRefs(authStore);
watch(userSession, (newValue) => {
  if (newValue === null) openModal();
});
const { redirectToHome } = useRedirectionToRolePanel();

</script>

<template>
  <base-modal :is-open="isOpen" title="ВХОД В СИСТЕМУ">
    <user-login-form @login:success="closeModal(); redirectToHome()"/>
  </base-modal>
  <div class="admin-view">
    <side-bar :items="sidebarItems"/>
    <router-view :key="key" class="page-content-wrapper"/>
  </div>
</template>

<style scoped>
.admin-view {
  display: flex;

  .page-content-wrapper {
    flex-grow: 1;
  }
  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1080px) {
      padding-left: 6rem;
    }
  }
}
</style>
