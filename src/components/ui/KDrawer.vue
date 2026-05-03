<script setup>
defineProps({
  open:  { type: Boolean, required: true },
  title: { type: String,  default: ''    },
  width: { type: String,  default: '480px' },
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="t-fade">
      <div
        v-if="open"
        class="drawer-backdrop"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="t-drawer">
      <div
        v-if="open"
        class="drawer-panel"
        :style="{ width }"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="drawer-header">
          <h2 class="drawer-title">{{ title }}</h2>
          <button class="drawer-close" @click="$emit('close')" aria-label="Close">
            <i class="pi pi-times" />
          </button>
        </div>

        <!-- Body -->
        <div class="drawer-body">
          <slot />
        </div>

        <!-- Footer slot (optional) -->
        <div v-if="$slots.footer" class="drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  max-width: 100vw;
  background: var(--bg-page);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 101;
  overflow: hidden;
}

/* Mobile — full width */
@media (max-width: 540px) {
  .drawer-panel { width: 100% !important; }
}

/* Header */
.drawer-header {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.drawer-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  margin: 0;
}
.drawer-close {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.15s, color 0.15s;
}
.drawer-close:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* Body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Footer */
.drawer-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  background: var(--bg-page);
}

/* Transitions */
.t-fade-enter-active, .t-fade-leave-active { transition: opacity 0.2s; }
.t-fade-enter-from,  .t-fade-leave-to     { opacity: 0; }

.t-drawer-enter-active, .t-drawer-leave-active { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.t-drawer-enter-from,   .t-drawer-leave-to     { transform: translateX(100%); }
</style>