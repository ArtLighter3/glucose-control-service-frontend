<script setup lang="ts">
import SideBar, { type SidebarItem } from '@/components/SlidingSidebar.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { storeToRefs } from 'pinia'
import { useModal } from '@/composables/useModal.ts'
import UserLoginForm from '@/components/UserLoginForm.vue'
import BaseModal from '@/components/BaseModal.vue'

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
    }]);

const { isOpen, openModal, closeModal } = useModal();

const key = ref(0);

const authStore = useAuthStore();
const { userSession } = storeToRefs(authStore);
watch(userSession, (newValue) => {
  if (newValue === null) openModal();
});

const refresh = () => {
  closeModal()
  //Перемонтирование router-view с key
  if (key.value > 10) key.value -= 1;
  else key.value += 1;
};

</script>

<template>
  <base-modal :is-open="isOpen" title="ВХОД В СИСТЕМУ">
    <user-login-form @login:success="refresh"/>
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
