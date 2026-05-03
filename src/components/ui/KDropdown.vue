<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: null },
  options: {
    type: Array,
    required: true,
    // [{ value: 'pending', label: 'Pending' }, ...]
  },
  placeholder: { type: String, default: 'Select...' },
  size:        { type: String, default: 'md' }, // sm | md
  disabled:    { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const selected = computed(() =>
  props.options.find(o => o.value === props.modelValue)
)

function select(option) {
  emit('update:modelValue', option.value)
  open.value = false
}

function toggle() {
  if (!props.disabled) open.value = !open.value
}
</script>

<template>
  <div class="k-dd-wrap" v-click-outside="() => open = false">
    <button
      type="button"
      :class="['k-dd-trigger', `k-dd-trigger--${size}`, disabled && 'k-dd-trigger--disabled']"
      @click="toggle"
    >
      <span :class="['k-dd-value', !selected && 'k-dd-placeholder']">
        {{ selected?.label ?? placeholder }}
      </span>
      <i :class="['pi', open ? 'pi-chevron-up' : 'pi-chevron-down', 'k-dd-arrow']" />
    </button>

    <Transition name="t-dd">
      <div v-if="open" class="k-dd-menu">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="['k-dd-option', option.value === modelValue && 'k-dd-option--active']"
          @click="select(option)"
        >
          <i v-if="option.value === modelValue" class="pi pi-check k-dd-check" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.k-dd-wrap { position: relative; display: inline-block; }

.k-dd-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
}
.k-dd-trigger:hover:not(.k-dd-trigger--disabled) {
  border-color: var(--border-strong);
  background: var(--bg-surface);
}
.k-dd-trigger--disabled { opacity: 0.5; cursor: not-allowed; }
.k-dd-trigger--sm { height: 30px; padding: 0 10px; font-size: 12px; }
.k-dd-trigger--md { height: 36px; padding: 0 12px; }

.k-dd-value    { flex: 1; text-align: left; }
.k-dd-placeholder { color: var(--text-disabled); }
.k-dd-arrow    { font-size: 11px; color: var(--text-muted); flex-shrink: 0; }

/* Menu */
.k-dd-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  min-width: 100%;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 4px;
  z-index: 200;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.k-dd-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}
.k-dd-option:hover { background: var(--bg-surface); color: var(--text-primary); }
.k-dd-option--active { color: var(--brand); font-weight: 500; }

.k-dd-check { font-size: 11px; color: var(--brand); }

/* Transition */
.t-dd-enter-active, .t-dd-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-dd-enter-from,  .t-dd-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>