<template>
  <button
    type="button"
    class="copy-button"
    :disabled="!contents"
    @click.stop="copy"
    ref="button"
  >
    Copy
  </button>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs } from 'vue';

  export default defineComponent({

    props: {
      contents: {
        type: String,
        required: true,
      },
    },

    emits: ['copied'],

    setup (props, { emit }) {
      const { contents } = toRefs(props);

      // After mount, this will be template ref 'button'.
      const button = ref<HTMLElement | null>(null);

      /**
       * Copies prop `contents` to clipboard.
       */
      const copy = async () => {
        await navigator.clipboard.writeText(contents.value);
        console.log(button.value);
        button.value?.animate([
          {
            offset: 0,
            transform: 'none',
          },
          {
            offset: 0.1,
            transform: 'scale(1.3)',
          },
          {
            offset: 1,
            transform: 'none',
          },
        ], { duration: 700, easing: 'ease-out' });

        // Parent element can decide what to do, but we at least show a small
        // animation to indicate that the link has been copied.
        emit('copied');
      };

      return {
        copy,
        button,
      };
    },

  });
</script>
