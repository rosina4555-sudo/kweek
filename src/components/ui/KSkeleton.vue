<script setup>
defineProps({
  width:  { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  radius: { type: String, default: '6px'  },
})
</script>

<template>
  <span
    class="k-skeleton"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style scoped>
.k-skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-sunken)  50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>