import { ref, computed, watchEffect } from 'vue';

export function useParser () {
  const parser = ref(null);
  const parserAvailable = computed(() => parser.value != null);

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

  import('https://cdn.skypack.dev/kataw').then(mod => {
    parser.value = mod;
  });

  return {
    parser,
    parserAvailable,
  };
}
