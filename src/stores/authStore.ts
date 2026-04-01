import { defineStore } from 'pinia'
import type { UserSession } from '@/service/userService.ts'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userSession = ref<UserSession | null>
      (JSON.parse(localStorage.getItem("auth") || 'null') as UserSession | null);

  const isAuthenticated = computed(() => {
    return userSession.value !== null;
  });

  const setAuth = (newUserSession: UserSession) => {
    userSession.value = newUserSession;
    localStorage.setItem("auth", JSON.stringify(userSession.value));
  };
  const getId = () => {
    if (userSession.value === null) return null;
    return userSession.value.id;
  };

  const logout = () => {
    userSession.value = null;
    localStorage.removeItem("auth");
  };

  return { isAuthenticated, setAuth, getId, logout, userSession };
});
