<template>
  <button
    type="button"
    class="copy-button"
    :disabled="!contents"
    :class="{
      'button--animated': animated && animateNow,
    }"
    @animationend.self="animateNow = false"
    @click.stop="copy"
  >
    Copy
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({

    emits: ['copied'],

    props: {
      contents: {
        type: String,
        required: true,
      },
      animated: {
        type: Boolean,
        default: true,
      },
    },

    data () {
      return {
        animateNow: false,
      };
    },

    methods: {
      async copy () {
        try {
          if (this.contents) {
            await navigator.clipboard.writeText(this.contents);

            // If animated, animate now
            if (this.animated) {
              this.animateNow = true;
            }

            // Parent element can decide what to do, but we at least show a small animation to indicate that the link has been copied
            this.$emit('copied');
          }
        }
        catch (err) {
          console.error(err);
        }
      },
    },

  });
</script>
