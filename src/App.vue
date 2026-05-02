<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const saved = localStorage.getItem('kweek-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
})
</script>


<template>
  <RouterView />
</template>