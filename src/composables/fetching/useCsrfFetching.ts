import { onMounted } from 'vue'
import { getCsrf } from '@/service/userService.ts'

export function useCsrfFetching() {
  onMounted(async () => {
    await getCsrf();
  });
}
