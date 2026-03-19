<script setup lang="ts">
import SideBar, { type SidebarItem } from '@/components/SlidingSidebar.vue'
  import { reactive } from 'vue'

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
      iconPath: "assets/icons/settings.svg",
      text: "Настройки профиля",
      routeName: "patient-profile"
    }])
</script>

<template>
  <div class="patient-view">
    <side-bar :items="sidebarItems"/>
    <router-view class="page-content-wrapper"/>
  </div>
</template>

<style scoped>
.patient-view {
  display: flex;

  .page-content-wrapper {
    flex-grow: 1;
  }
  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }
  }
}
</style>
