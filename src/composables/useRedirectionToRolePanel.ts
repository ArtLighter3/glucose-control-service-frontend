import { useAuthStore } from "@/stores/authStore";
import router from '@/router'

export function useRedirectionToRolePanel() {
  const authStore = useAuthStore();

  const redirectToHome = () => {
    let isPatient = false, isDoctor = false, isAdmin = false;
    authStore.userSession?.roles.forEach((role) => {
      switch (role) {
        case "ROLE_PATIENT": isPatient = true; break;
        case "ROLE_ADMIN": isAdmin = true; break;
        case "ROLE_DOCTOR": isDoctor = true; break;
    }});

    if (isAdmin)
      router.push({ name: "users", params: { id: `${authStore.getId()}` } });
    else if (isDoctor)
      router.push({ name: "attached-patients", params: { id: `${authStore.getId()}` } });
    else if (isPatient)
      router.push({ name: "patient-home", params: { id: `${authStore.getId()}` } });
  };

  return { redirectToHome };
}
