<template>
  <p><slot></slot></p>

  <div class="app-section__textarea-wrapper">
    <textarea
      v-model="contentsModel"
      :placeholder="placeholder"
      :readonly="readonly"
    ></textarea>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, toRefs } from 'vue';

  export default defineComponent({

    emits: ['update:contents'],

    props: {
      contents: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        required: true,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },

    setup (props, { emit }) {
      const { contents } = toRefs(props);

      const contentsModel = computed({
        get: () => contents.value,
        set: val => {
          emit('update:contents', val);
        },
      });

      return {
        contentsModel,
      };
    },

  });
</script>

<style lang="scss">
  $easing: cubic-bezier(0.340, -0.015, 0.115, 0.945);

  p {
    margin: 0;
    font-size: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      margin-right: auto;
      margin-left: 4px;
      transform: translateY(1px);
    }
  }

  .app-section__textarea-wrapper {
    --border-radius: 4px;
    position: relative;
    margin-inline-start: calc(-1 * var(--page-padding-x) - var(--border-radius));
    padding-inline-start: calc(var(--page-padding-x) + var(--border-radius));
    border-radius: var(--border-radius);
    background-color: #222225;
    border: 2px solid hsla(var(--color-1-h), 100%, 90%, 0.2);
    transition: all .15s $easing;
    box-shadow: inset 0 0 5px -1px rgba(0, 0, 0, 0.2);

    &:focus-within {
      border: 2px solid hsla(var(--color-1-h), 100%, 84%, 0.6);
      box-shadow: inset 0 0 5px -1px rgba(0, 0, 0, 0.2), 0 0 30px 0 hsla(var(--color-1-h), 100%, 60%, 0.4);
    }

    &:nth-of-type(2) {
      direction: rtl;

      textarea {
        direction: ltr;
      }
    }

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 6px;
      bottom: 6px;
      width: 0;
      inset-inline-start: calc(var(--page-padding-x) + var(--border-radius - 1px));
      border-inline-start: 1px dashed hsla(var(--color-1-h), 100%, 95%, 0.15);
    }
  }

  textarea {
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
    font-family: "Droid Sans Mono", Consolas, "SF Mono", monospace;
    line-height: 1.3;
    padding: 15px 12px;
    background: none;
    border: none;
    color: white;
    resize: none;

    &:focus {
      outline: none;
    }
  }
</style>
