import { ref } from "vue";
import { usePagination } from "../usePagination";
import { isAxiosError } from "axios";
import type { UserDetailedInfo } from '@/service/userService.ts'
import { Role, searchUsers, searchUsersWithRole } from '@/service/userService.ts'

export function useUsersFetching(role: Role | undefined) {
  const loading = ref(false);
  const users = ref<UserDetailedInfo[]>([]);

  const { page, pageIndex, totalElements, pageSize } = usePagination(1);

  const fetch = async (query: string) => {
      loading.value = true;
        try {
          const response = role !== undefined ?
            await searchUsersWithRole(query, role, pageIndex.value) :
            await searchUsers(query, pageIndex.value);
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

  const search = async (query: string) => {
    page.value = 1;
    await fetch(query);
  };

  const turnPage = async (query: string) => {
    await fetch(query);
  };

  return { loading, users, page, totalElements, pageSize, role, search, turnPage }
}
