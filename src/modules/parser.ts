import { ref, computed, watchEffect } from 'vue';

export function useParser () {
  const parser = ref<typeof import('kataw') | null>(null);
  const parserAvailable = computed<boolean>(() => parser.value != null);

  watchEffect(() => {
    switch (parserAvailable.value) {
      case false:
        console.log('Downloading parser');
        break;
      case true:
        console.log('Parser available:', parser.value);
        break;
    }
  });

  import('kataw').then(mod => {
    parser.value = mod;
  });

  return {
    parser,
    parserAvailable,
  };
}
