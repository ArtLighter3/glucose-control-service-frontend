import { ref } from 'vue';

export function useCopyToClipboard() {
  const isCopied = ref(false);

  const copyToClipboard = async (textToCopy: string | null | undefined) => {
    if (textToCopy === null || textToCopy === undefined) return;

    try {
      await navigator.clipboard.writeText(textToCopy);

      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false
      }, 2000);
    } catch (error) {
      console.error('Copy failed: ', error);
    }
  }

  return {
    isCopied, copyToClipboard
  };
}
