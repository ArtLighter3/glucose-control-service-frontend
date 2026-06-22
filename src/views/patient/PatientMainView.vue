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
      iconPath: "assets/icons/main-page.svg",
      text: "Домашняя страница",
      routeName: "patient-home"
    },
    {
      iconPath: "assets/icons/diary.svg",
      text: "Дневник самоконтроля",
      routeName: "diary"
    },
    {
      iconPath: "assets/icons/insulin.svg",
      text: "Инсулиновый режим",
      routeName: "insulin"
    },
    {
      iconPath: "assets/icons/analytics.svg",
      text: "Графики и диаграммы",
      routeName: "analytics"
    },
    {
      iconPath: "assets/icons/templates.svg",
      text: "Еда и препараты",
      routeName: "templates"
    },
    {
      iconPath: "assets/icons/settings.svg",
      text: "Настройки профиля",
      routeName: "patient-settings"
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
  <div class="patient-view">
    <side-bar :items="sidebarItems"/>
    <router-view :key="key" class="page-content-wrapper"/>
  </div>
</template>

<style scoped>
.patient-view {
  display: flex;

  .page-content-wrapper {
    flex-grow: 1;

    @media (max-width: 768px) {
      padding-left: 48px;
      padding-right: 0;
      max-width: 100vw;
    }

  }
  main {
    flex: 1 1 0;
    padding: 2rem;
  }
}
</style>
