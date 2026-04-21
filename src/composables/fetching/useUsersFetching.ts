import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";
import type { UserDetailedInfo } from '@/service/userService.ts'
import { searchUsers } from '@/service/userService.ts'

export function useUsersFetching() {
  const loading = ref(false);
  const users = ref<UserDetailedInfo[]>([]);

  const { page, pageIndex, totalElements, pageSize } = usePagination(1);

  const search = async (query: string) => {
    loading.value = true;
      try {
        const response = await searchUsers(query, pageIndex.value);
        users.value = response.data.content;
        pageSize.value = response.data.size;
        if (response.data.totalElements !== undefined)
          totalElements.value = response.data.totalElements;
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err);
        }
      }
      loading.value = false;
  };

  return { loading, users, page, totalElements, pageSize, search }
}
