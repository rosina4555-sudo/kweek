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
  display: grid;
  grid-template-columns: 216px 1fr;
  min-height: 100vh;
  background: var(--bg-sunken);
  transition: grid-template-columns 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Collapsed state — grid column shrinks with the sidebar */
.ds-shell:has(.sidebar--collapsed) {
  grid-template-columns: 58px 1fr;
}

/* Mobile — sidebar is overlaid, body takes full width */
@media (max-width: 767px) {
  .ds-shell {
    grid-template-columns: 1fr;
  }
  .ds-shell:has(.sidebar--collapsed) {
    grid-template-columns: 1fr;
  }
}

.ds-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

.ds-content {
  flex: 1;
  padding: 24px 20px;
}

@media (max-width: 480px) {
  .ds-content { padding: 16px 14px; }
}
</style>