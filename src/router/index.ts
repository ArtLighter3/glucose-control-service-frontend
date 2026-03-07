import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PatientMainView from '@/views/patient/PatientMainView.vue'
import DiaryView from '@/views/patient/DiaryView.vue'
import InsulinProfileView from '@/views/patient/InsulinProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/patient',
      name: 'patient',
      component: PatientMainView,
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
        }
      ]
    },
  ],
})

export default router
