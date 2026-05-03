<script setup>
defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type:        { type: String, default: 'text' },
  iconLeft:    { type: String, default: null },
  iconRight:   { type: String, default: null },
  error:       { type: String, default: null },
  disabled:    { type: Boolean, default: false },
  size:        { type: String, default: 'md' }, // sm | md
})

defineEmits(['update:modelValue', 'clear'])
</script>

<template>
  <div class="k-input-wrap">
    <div :class="['k-input-inner', error && 'k-input-inner--error', `k-input-inner--${size}`]">
      <i v-if="iconLeft" :class="['pi', iconLeft, 'k-input-icon k-input-icon--left']" />

      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'k-input-el',
          iconLeft  && 'k-input-el--pl',
          iconRight && 'k-input-el--pr',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <i
        v-if="iconRight"
        :class="['pi', iconRight, 'k-input-icon k-input-icon--right']"
        @click="$emit('clear')"
      />
    </div>

    <p v-if="error" class="k-input-error">
      <i class="pi pi-times-circle" /> {{ error }}
    </p>
  </div>
</template>

<style scoped>
.k-input-wrap { display: flex; flex-direction: column; gap: 5px; }

.k-input-inner {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 7px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-input-inner:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.k-input-inner--error {
  border-color: var(--error-border);
  background: var(--error-bg);
}
.k-input-inner--error:focus-within {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--error-border) 20%, transparent);
}

/* Sizes */
.k-input-inner--sm { height: 32px; }
.k-input-inner--md { height: 36px; }

.k-input-el {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
  padding: 0 12px;
  outline: none;
  width: 100%;
}
.k-input-el::placeholder { color: var(--text-disabled); }
.k-input-el--pl { padding-left: 34px; }
.k-input-el--pr { padding-right: 34px; }

.k-input-icon {
  position: absolute;
  font-size: 12px;
  color: var(--text-disabled);
  pointer-events: none;
}
.k-input-icon--left  { left: 11px; }
.k-input-icon--right {
  right: 11px;
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.15s;
}
.k-input-icon--right:hover { color: var(--text-muted); }

.k-input-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--error-text);
  margin: 0;
}
</style>