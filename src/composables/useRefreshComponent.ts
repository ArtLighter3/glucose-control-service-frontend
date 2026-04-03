import { ref } from 'vue'

export function useRefreshComponent() {
  const componentKey = ref(0);

  const refresh = () => {
    if (componentKey.value > 10) componentKey.value -= 1;
    else componentKey.value += 1;
  };

  return { componentKey, refresh };
}
