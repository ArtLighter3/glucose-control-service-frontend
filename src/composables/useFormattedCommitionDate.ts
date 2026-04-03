import { computed, ref } from 'vue'

export function useFormattedCommitionDate() {
  const datetime = ref(new Date());
  const commitedAtStr = ref(datetime.value.toISOString());

  const formattedDate = computed({
    get: () => {
      const offset = datetime.value.getTimezoneOffset() * 60000;
      const localISO = new Date(datetime.value.getTime() - offset).toISOString();
      return localISO.slice(0, 16);
    },
    set: (newValue: string) => {
      if (newValue) {
        datetime.value = new Date(newValue);
        commitedAtStr.value = datetime.value.toISOString();
      }
    }
  });

  return { commitedAtStr, formattedDate };
}
