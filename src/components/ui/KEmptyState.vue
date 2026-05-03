<script setup>
defineProps({
  icon:        { type: String, default: 'pi-inbox'       },
  title:       { type: String, default: 'Nothing here'   },
  description: { type: String, default: ''               },
  actionLabel: { type: String, default: null             },
})

defineEmits(['action'])
</script>

<template>
  <div class="k-empty">
    <div class="k-empty-icon">
      <i :class="['pi', icon]" />
    </div>
    <h3 class="k-empty-title">{{ title }}</h3>
    <p v-if="description" class="k-empty-desc">{{ description }}</p>
    <button
      v-if="actionLabel"
      class="k-empty-action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.k-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
}

.k-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.k-empty-icon .pi {
  font-size: 20px;
  color: var(--text-disabled);
}

.k-empty-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.2px;
}

.k-empty-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 20px;
  max-width: 280px;
  line-height: 1.6;
}

.k-empty-action {
  height: 34px;
  padding: 0 16px;
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.k-empty-action:hover { background: var(--brand-hover); }
</style>