import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import PatientMainView from '@/views/patient/PatientMainView.vue'
import DiaryView from '@/views/patient/DiaryView.vue'
import InsulinProfileView from '@/views/patient/InsulinProfileView.vue'
import HomeView from '@/views/patient/HomeView.vue'
import ProfileSettingsView from '@/views/patient/ProfileSettingsView.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import RedirectingWelcomeView from '@/views/RedirectingWelcomeView.vue'
import LogoutView from '@/views/LogoutView.vue'
import RegisterView from '@/views/RegisterView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RedirectingWelcomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/patient/:id',
      name: 'patient',
      component: PatientMainView,
     // props: true,
      children: [
        {
          path: "diary",
          name: "diary",
          component: DiaryView
        },
        {
          path: "insulin",
          name: "insulin",
          component: InsulinProfileView
        },
        {
          path: "settings",
          name: "patient-settings",
          component: ProfileSettingsView,
        },
        {
          path: "home",
          name: "patient-home",
          component: HomeView
        }
      ]
    },
  ],
})

export default router
