import { ref, computed } from 'vue';

export function usePagination(initialPage: number) {
  if (initialPage < 1) initialPage = 1;
  const page = ref(initialPage);

  const pageSize = ref(0);
  const totalElements = ref(0);

  const pageIndex = computed({
    get: () => {
      return page.value - 1;
    },
    set: (newPage: number) => {
      if (newPage < 1) page.value = 1;
      page.value = newPage;
    }
  });

  return { page, pageIndex, pageSize, totalElements };
}
