<template>
  <img
    src="https://openmoji.org/data/color/svg/2699.svg"
    loading="lazy"
    height="100"
    class="loading-spinner"
  />
</template>

<style lang="scss">
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0turn); }
    100% { transform: translate(-50%, -50%) rotate(1turn); }
  }

  .loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    animation: spin 1.5s infinite linear; // steps(36)
    transform-origin: 49.6% 48.8%;
  }
</style>
