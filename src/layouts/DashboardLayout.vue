<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/dashboard/AppSidebar.vue'
import AppTopbar  from '@/components/dashboard/AppTopbar.vue'

const collapsed  = ref(false)
const mobileOpen = ref(false)
</script>

<template>
  <div class="ds-shell">

    <AppSidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="collapsed = !collapsed"
      @close-mobile="mobileOpen = false"
    />

    <div class="ds-body">
      <AppTopbar @open-sidebar="mobileOpen = true" />
      <main class="ds-content">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<style scoped>
.ds-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-sunken);
}

.ds-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.ds-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

@media (max-width: 480px) {
  .ds-content { padding: 14px; }
}
</style>