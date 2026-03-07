<script setup lang="ts">
import SideBar, { type SidebarItem } from '@/components/SlidingSidebar.vue'
  import { reactive } from 'vue'

  const sidebarItems: SidebarItem[] = reactive([{
    iconPath: "assets/icons/glucose.svg",
    text: "Glucose Diary",
    routeName: "diary"
  }, {
    iconPath: "assets/icons/insulin.svg",
    text: "Insulin Profile",
    routeName: "insulin"
    }])
</script>

<template>
  <div class="patient-view">
    <side-bar :items="sidebarItems">
    </side-bar>

    <router-view/>
  </div>
</template>

<style scoped>
.patient-view {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 6rem;
    }
  }
}
</style>
