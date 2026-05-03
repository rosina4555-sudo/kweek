<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    // primary | secondary | ghost | danger
  },
  size: {
    type: String,
    default: 'md',
    // sm | md
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  iconLeft:  { type: String, default: null },
  iconRight: { type: String, default: null },
})

defineEmits(['click'])
</script>

<template>
  <button
    :class="['k-btn', `k-btn--${variant}`, `k-btn--${size}`]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <i v-if="loading" class="pi pi-spin pi-spinner" />
    <i v-else-if="iconLeft" :class="['pi', iconLeft]" />
    <slot />
    <i v-if="iconRight && !loading" :class="['pi', iconRight]" />
  </button>
</template>

<style scoped>
.k-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 7px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  font-family: inherit;
}
.k-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Sizes ───────────────────────────────────────────── */
.k-btn--sm { height: 30px; padding: 0 12px; font-size: 12px; }
.k-btn--md { height: 36px; padding: 0 16px; }

/* ── Variants ────────────────────────────────────────── */
.k-btn--primary {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.k-btn--primary:hover:not(:disabled) {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}

.k-btn--secondary {
  background: var(--bg-page);
  color: var(--text-secondary);
  border-color: var(--border);
}
.k-btn--secondary:hover:not(:disabled) {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.k-btn--ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: transparent;
}
.k-btn--ghost:hover:not(:disabled) {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.k-btn--danger {
  background: var(--error-bg);
  color: var(--error-text);
  border-color: var(--error-border);
}
.k-btn--danger:hover:not(:disabled) {
  background: var(--error-border);
  color: var(--error-text);
}

/* ── Icon sizing ─────────────────────────────────────── */
.k-btn .pi { font-size: 12px; }
</style>