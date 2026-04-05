import { computed, ref } from 'vue'

export function useFormattedDate(startDate: Date) {
  const datetime = ref(startDate);
  const dateISOString = ref(datetime.value.toISOString());

  const formattedDate = computed({
    get: () => {
      const offset = datetime.value.getTimezoneOffset() * 60000;
      const localISO = new Date(datetime.value.getTime() - offset).toISOString();
      return localISO.slice(0, 16);
    },
    set: (newValue: string) => {
      if (newValue) {
        datetime.value = new Date(newValue);
        dateISOString.value = datetime.value.toISOString();
      }
    }
  });

  return { dateISOString, formattedDate };
}
