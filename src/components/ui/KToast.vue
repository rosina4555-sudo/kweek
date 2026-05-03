<script setup>
import { ref } from 'vue'

const toasts = ref([])
let counter = 0

function add({ type = 'info', message, duration = 3500 }) {
  const id = ++counter
  toasts.value.push({ id, type, message })
  setTimeout(() => remove(id), duration)
}

function remove(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Expose so composable can call it
defineExpose({ add })

const iconMap = {
  success: 'pi-check-circle',
  error:   'pi-times-circle',
  info:    'pi-info-circle',
  warning: 'pi-exclamation-triangle',
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="t-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
        >
          <i :class="['pi', iconMap[toast.type], 'toast-icon']" />
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="remove(toast.id)">
            <i class="pi pi-times" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 999;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  min-width: 280px;
  max-width: 360px;
  pointer-events: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}

.toast-icon { font-size: 14px; flex-shrink: 0; }
.toast-msg  { flex: 1; font-size: 13px; color: var(--text-primary); line-height: 1.4; }

.toast--success .toast-icon { color: var(--status-paid-text); }
.toast--error   .toast-icon { color: var(--error-text); }
.toast--info    .toast-icon { color: var(--brand); }
.toast--warning .toast-icon { color: var(--status-pending-text); }

.toast-close {
  background: none;
  border: none;
  color: var(--text-disabled);
  cursor: pointer;
  padding: 0;
  font-size: 11px;
  flex-shrink: 0;
  transition: color 0.15s;
}
.toast-close:hover { color: var(--text-muted); }

.t-toast-enter-active { transition: opacity 0.2s, transform 0.2s; }
.t-toast-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-toast-enter-from   { opacity: 0; transform: translateY(8px); }
.t-toast-leave-to     { opacity: 0; transform: translateX(16px); }
</style>