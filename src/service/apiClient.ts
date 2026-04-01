import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      authStore.logout();

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
