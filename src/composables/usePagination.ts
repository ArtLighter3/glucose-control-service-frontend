import { ref } from 'vue';

export function usePagination(initialPage: number) {
  const page = ref(initialPage);
  const pageCount = ref(1);
  return { page, pageCount };
}
