<!-- <script setup>
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
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import KToast from '@/components/ui/KToast.vue'
import { setToastInstance } from '@/composables/useToast'

const toastRef = ref(null)

onMounted(() => {
  if (toastRef.value) setToastInstance(toastRef.value)
  const saved = localStorage.getItem('kweek-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <RouterView />
  <KToast ref="toastRef" />
</template>