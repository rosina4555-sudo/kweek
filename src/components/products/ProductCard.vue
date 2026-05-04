<script setup>
import { computed }                               from 'vue'
import { Share2, Pencil, Eye, EyeOff, Check }    from 'lucide-vue-next'
import { formatCurrency }                         from '@/utils/formatCurrency'

const props = defineProps({
  product:    { type: Object,  required: true },
  selected:   { type: Boolean, default: false },
  selectMode: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'share', 'toggle-active', 'select'])

const coverImage = computed(() =>
  props.product.images?.find(i => i.is_cover)?.url ??
  props.product.images?.[0]?.url ??
  null
)

const stockLabel = computed(() => {
  if (props.product.stock === null || props.product.stock === undefined) return 'Unlimited'
  if (props.product.stock === 0) return 'Out of stock'
  return `${props.product.stock} in stock`
})

const stockStatus = computed(() => {
  if (props.product.stock === 0) return 'empty'
  if (props.product.stock !== null && props.product.stock <= 3) return 'low'
  return 'ok'
})
</script>

<template>
  <div
    :class="[
      'product-card',
      !product.is_active && 'product-card--inactive',
      selected && 'product-card--selected',
    ]"
  >
    <!-- Thumbnail -->
    <div class="card-thumb" @click="selectMode ? emit('select') : emit('edit', product)">
      <img v-if="coverImage" :src="coverImage" :alt="product.name" class="thumb-img" />
      <div v-else class="thumb-empty">
        <Eye :size="20" :stroke-width="1.5" />
      </div>

      <!-- Image count badge -->
      <span v-if="product.images?.length > 1" class="img-count">
        {{ product.images.length }}
      </span>

      <!-- Inactive overlay -->
      <div v-if="!product.is_active" class="inactive-overlay">
        <EyeOff :size="14" :stroke-width="1.8" />
        Hidden
      </div>

      <!-- Select checkbox -->
      <div
        v-if="selectMode || selected"
        :class="['select-box', selected && 'select-box--checked']"
        @click.stop="emit('select')"
      >
        <Check v-if="selected" :size="11" :stroke-width="3" />
      </div>
    </div>

    <!-- Info -->
    <div class="card-body">
      <div class="card-name" :title="product.name">{{ product.name }}</div>
      <div class="card-price">{{ formatCurrency(product.price) }}</div>

      <!-- Variants row -->
      <div v-if="product.sizes?.length || product.colors?.length" class="card-variants">
        <span v-if="product.sizes?.length" class="variant-pill">
          {{ product.sizes.length }} size{{ product.sizes.length > 1 ? 's' : '' }}
        </span>
        <span v-if="product.colors?.length" class="variant-pill">
          {{ product.colors.length }} color{{ product.colors.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Stock -->
      <div :class="['card-stock', `card-stock--${stockStatus}`]">
        {{ stockLabel }}
      </div>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <button
        class="action-btn"
        :title="product.is_active ? 'Hide from store' : 'Show in store'"
        @click="emit('toggle-active', product)"
      >
        <EyeOff v-if="product.is_active"  :size="13" :stroke-width="1.8" />
        <Eye    v-else                     :size="13" :stroke-width="1.8" />
      </button>

      <button class="action-btn" title="Copy product link" @click="emit('share', product)">
        <Share2 :size="13" :stroke-width="1.8" />
      </button>

      <button class="action-btn action-btn--edit" title="Edit product" @click="emit('edit', product)">
        <Pencil :size="13" :stroke-width="1.8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s;
}
.product-card:hover { border-color: var(--border-strong); }
.product-card--inactive { opacity: 0.6; }
.product-card--selected { border-color: var(--brand); }

/* ── Thumbnail ───────────────────────────────────────── */
.card-thumb {
  position: relative;
  aspect-ratio: 1;
  background: var(--bg-surface);
  cursor: pointer;
  overflow: hidden;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}
.product-card:hover .thumb-img { transform: scale(1.03); }

.thumb-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
}

.img-count {
  position: absolute;
  bottom: 7px;
  right: 7px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.inactive-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
}

.select-box {
  position: absolute;
  top: 7px;
  left: 7px;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  color: #fff;
}
.select-box--checked {
  background: var(--brand);
  border-color: var(--brand);
}

/* ── Body ────────────────────────────────────────────── */
.card-body {
  padding: 12px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}
.card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.1px;
}
.card-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}
.card-variants {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.variant-pill {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.card-stock {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}
.card-stock--ok    { color: var(--text-disabled); }
.card-stock--low   { color: var(--status-pending-text); }
.card-stock--empty { color: var(--error-text); }

/* ── Actions ─────────────────────────────────────────── */
.card-actions {
  display: flex;
  align-items: center;
  gap: 0;
  border-top: 1px solid var(--border);
}
.action-btn {
  flex: 1;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  border-right: 1px solid var(--border);
  transition: background 0.15s, color 0.15s;
}
.action-btn:last-child { border-right: none; }
.action-btn:hover { background: var(--bg-surface); color: var(--text-primary); }
.action-btn--edit:hover { color: var(--brand); }
</style>