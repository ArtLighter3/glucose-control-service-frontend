import { useFormattedDate } from '@/composables/useFormattedDate.ts'

export function useDatePeriodFilter(fromStorageVarName: string, toStorageVarName: string) {
  const defaultFromString = localStorage.getItem(fromStorageVarName);
  const defaultFrom = defaultFromString !== null ? new Date(defaultFromString) : new Date();
  if (defaultFromString === null) {
    defaultFrom.setDate(defaultFrom.getDate() - 7);
  }

  const defaultToString = localStorage.getItem(toStorageVarName);
  const defaultTo = defaultToString !== null ? new Date(defaultToString) : new Date();

  const { dateISOString: fromISOString, formattedDate: fromFormatted, date: from }
    = useFormattedDate(defaultFrom);
  const { dateISOString: toISOString, formattedDate: toFormatted, date: to }
    = useFormattedDate(defaultTo);

  const saveFilterValues = () => {
    localStorage.setItem(fromStorageVarName, fromISOString.value);
    localStorage.setItem(toStorageVarName, toISOString.value);
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
    from, to,
   // filtered,
    saveFilterValues
  };
}
