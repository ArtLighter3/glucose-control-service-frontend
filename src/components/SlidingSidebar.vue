<script setup lang="ts">
import { h, onMounted, ref } from 'vue'

export interface SidebarItem {
  iconPath: string,
  text: string,
  routeName: string
}

interface Props {
  items: SidebarItem[];
}

const isExpanded = ref(localStorage.getItem("isExpanded") === "true");
//const isExpanded = ref(false);

const props = defineProps<Props>();
const baseURL = ref("");

const toggleSideBar = () => {
  isExpanded.value = !isExpanded.value;

  localStorage.setItem("isExpanded", isExpanded.value.toString())
};

onMounted(() => {
  baseURL.value = window.location.origin;
});

defineExpose({isExpanded});
</script>

<template>
 <aside :class="`${isExpanded && 'is-expanded'}`">
   <div class="toggle-sidebar-wrapper" @click="toggleSideBar">
     <button class="toggle-sidebar-button">
       <img class="toggle-sidebar-icon"
            src="@/assets/icons/double-arrow.svg" alt="Toggle full sidebar"/>
     </button>
   </div>

   <div class="sidebar-menu">
     <slot></slot>
     <router-link class="sidebar-item" v-for="(item, index) in items"
                  :key="index" :to="{name:item.routeName}">
       <img class="sidebar-item-icon" :src="`/src/${item.iconPath}`" alt="">
       <span class="sidebar-item-text">{{ item.text }}</span>
     </router-link>
     <router-link class="sidebar-item logout-item"
                  :to="{name:'logout'}"
                  key="logout"
     >
       <img class="sidebar-item-icon" :src="`/src/assets/icons/logout.svg`" alt="">
       <span class="sidebar-item-text">Выйти из аккаунта</span>
     </router-link>
   </div>
 </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(1rem + 32px);
  min-height: 100vh;
  overflow: hidden;


  background-color: var(--color-background-alt);
  color: var(--color-text-on-alt-background);

  transition: 0.2s ease-out;

  .toggle-sidebar-wrapper {
    display: flex;
    cursor: pointer;
    transition: 0.2s ease-out;
    margin-bottom: 0.5rem;

    .toggle-sidebar-button {
      display: flex;
      transition: 0.2s ease-out;

      .toggle-sidebar-icon {
        width: 100%;
        transition: 0.2s ease-out;
      }
    }

    &:hover {
      .toggle-sidebar-button {
        transform: translateX(0.5rem);
      }
    }
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;

    .sidebar-item {
      display: flex;
      width: 100%;
      transition: 0.3s ease-out;
      align-items: center;
      text-decoration: none;
      white-space: nowrap;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;

      &.logout-item {
        margin-top: auto;
      }

      .sidebar-item-text {
        transition: 0.1s ease-out;
        color: var(--color-text-on-alt-background);
        font-size: 1.2rem;
        opacity: 0;
        margin-left: 1rem;
      }

      &:hover, &.router-link-exact-active {
        background: var(--color-text-on-alt-background-hover);
      }
    }

  }

  &.is-expanded {
    width: calc(10rem + 150px);
    .toggle-sidebar-icon {
      transform: rotate(180deg);
    }

    .sidebar-menu .sidebar-item-text {
      transition: 0.5s ease-out;
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}

button {
  display: flex;

  cursor: pointer;
  appearance: none;
  outline: none;
  background: none;
  border: none;
  padding: 0;
}


</style>
