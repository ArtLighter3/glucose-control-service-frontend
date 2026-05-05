import { useFormattedDate } from '@/composables/useFormattedDate.ts'
import { ref, watch } from 'vue'

export function useDatePeriodFilter() {
  const defaultFromString = localStorage.getItem("diary-from");
  const defaultFrom = defaultFromString !== null ? new Date(defaultFromString) : new Date();
  if (defaultFromString === null) {
    defaultFrom.setDate(defaultFrom.getDate() - 7);
  }

  const defaultToString = localStorage.getItem("diary-to");
  const defaultTo = defaultToString !== null ? new Date(defaultToString) : new Date();

  const { dateISOString: fromISOString, formattedDate: fromFormatted }
    = useFormattedDate(defaultFrom);
  const { dateISOString: toISOString, formattedDate: toFormatted }
    = useFormattedDate(defaultTo);

  const saveFilterValues = () => {
    localStorage.setItem("diary-from", fromISOString.value);
    localStorage.setItem("diary-to", toISOString.value);
  };
  // watch(fromISOString, (newValue) => {
  //   localStorage.setItem("diary-from", newValue);
  // });
  // watch(toISOString, (newValue) => {
  //   localStorage.setItem("diary-to", newValue);
  // });

 // const filtered = ref(false);

  return {
    fromISOString, fromFormatted,
    toISOString, toFormatted,
   // filtered,
    saveFilterValues
  };
}
