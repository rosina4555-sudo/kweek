<script setup>
import { computed, ref, watch } from 'vue'
import OrderStatusBadge    from './OrderStatusBadge.vue'
import OrderStatusDropdown from './OrderStatusDropdown.vue'
import KButton             from '@/components/ui/KButton.vue'
import KSkeleton           from '@/components/ui/KSkeleton.vue'
import { formatCurrency }  from '@/utils/formatCurrency'
import { formatDate }      from '@/utils/formatDate'

const props = defineProps({
  order:          { type: Object,  default: null  },
  loading:        { type: Boolean, default: false },
  updatingStatus: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'update-status', 'mark-paid'])

const localStatus = ref(props.order?.status ?? 'pending')

watch(() => props.order?.status, (val) => {
  if (val) localStatus.value = val
})

watch(() => props.order?.id, () => {
  localStatus.value = props.order?.status ?? 'pending'
})

function handleStatusChange(val) {
  localStatus.value = val
  emit('update-status', props.order.id, val)
}

function handleMarkPaid() {
  emit('mark-paid', props.order.id)
}

const deliveryLabel = computed(() => {
  const map = { pickup: 'Pickup', delivery: 'Delivery' }
  return map[props.order?.delivery_method] ?? props.order?.delivery_method ?? '—'
})

function openWhatsApp() {
  if (!props.order?.buyer_phone) return
  const phone = props.order.buyer_phone.replace(/\D/g, '')
  const text  = encodeURIComponent(`Hi ${props.order.buyer_name}, your Kweek order #${props.order.id} is ready.`)
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}
</script>

<template>
  <div class="panel">

    <!-- Header -->
    <div class="panel-header">
      <div class="panel-header-left">
        <h2 class="panel-title">Order #{{ order?.id }}</h2>
        <p class="panel-sub">
          {{ formatDate(order?.created_at) }} · {{ deliveryLabel }}
        </p>
      </div>
      <div class="panel-header-right">
        <OrderStatusBadge v-if="order" :status="order.status" />
        <button class="close-btn" @click="emit('close')" aria-label="Close panel">
          <i class="pi pi-times" />
        </button>
      </div>
    </div>

    <!-- Scrollable body -->
    <div class="panel-body">

      <!-- Loading -->
      <template v-if="loading">
        <div class="section">
          <div class="section-label">Buyer</div>
          <div class="info-grid">
            <div v-for="i in 4" :key="i">
              <KSkeleton width="60px"  height="10px" style="margin-bottom: 5px" />
              <KSkeleton width="110px" height="14px" />
            </div>
          </div>
        </div>
      </template>

      <!-- Content -->
      <template v-else-if="order">

        <!-- Buyer info -->
        <div class="section">
          <p class="section-label">Buyer</p>
          <div class="info-grid">
            <div class="info-cell">
              <span class="info-key">Name</span>
              <span class="info-val">{{ order.buyer_name || '—' }}</span>
            </div>
            <div class="info-cell">
              <span class="info-key">Phone</span>
              <span class="info-val">{{ order.buyer_phone || '—' }}</span>
            </div>
            <div class="info-cell">
              <span class="info-key">Delivery</span>
              <span class="info-val">{{ deliveryLabel }}</span>
            </div>
            <div class="info-cell">
              <span class="info-key">Order ID</span>
              <span class="info-val info-val--mono">#{{ order.id }}</span>
            </div>
          </div>

          <div v-if="order.notes" class="notes-row">
            <span class="info-key">Note from buyer</span>
            <p class="notes-text">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Items -->
        <div class="section">
          <p class="section-label">Items</p>
          <div class="items-list">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="item-row"
            >
              <div class="item-info">
                <span class="item-name">{{ item.product_name }}</span>
                <span class="item-meta">
                  <template v-if="item.size">Size {{ item.size }}</template>
                  <template v-if="item.size && item.color"> · </template>
                  <template v-if="item.color">{{ item.color }}</template>
                  · Qty {{ item.quantity }}
                </span>
              </div>
              <span class="item-price">{{ formatCurrency(item.price_at_time * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="total-row">
          <span class="total-label">Order total</span>
          <span class="total-val">{{ formatCurrency(order.total) }}</span>
        </div>

        <!-- Status controls -->
        <div class="section">
          <p class="section-label">Update status</p>
          <div class="status-controls">
            <OrderStatusDropdown
              :model-value="localStatus"
              :disabled="updatingStatus"
              style="flex: 1"
              @update:model-value="handleStatusChange"
            />
            <KButton
              variant="primary"
              size="sm"
              :disabled="order.status === 'paid' || updatingStatus"
              :loading="updatingStatus"
              @click="handleMarkPaid"
            >
              Mark as paid
            </KButton>
          </div>
        </div>

      </template>

    </div>

    <!-- Footer actions -->
    <div class="panel-footer">
      <KButton
        variant="secondary"
        size="sm"
        icon-left="pi-whatsapp"
        style="flex: 1"
        :disabled="!order?.buyer_phone"
        @click="openWhatsApp"
      >
        WhatsApp buyer
      </KButton>
      <KButton
        variant="danger"
        size="sm"
        style="flex: 1"
        :disabled="!order || order.status === 'delivered'"
      >
        Cancel order
      </KButton>
    </div>

  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-page);
}

/* ── Header ──────────────────────────────────────────── */
.panel-header {
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}
.panel-header-left { display: flex; flex-direction: column; gap: 2px; }
.panel-header-right { display: flex; align-items: center; gap: 10px; }

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  margin: 0;
}
.panel-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: background 0.15s, color 0.15s;
}
.close-btn:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* ── Body ────────────────────────────────────────────── */
.panel-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

/* ── Sections ────────────────────────────────────────── */
.section {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}
.section-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 14px;
}

/* ── Info grid ───────────────────────────────────────── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.info-cell { display: flex; flex-direction: column; gap: 3px; }
.info-key {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
}
.info-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.info-val--mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

/* ── Notes ───────────────────────────────────────────── */
.notes-row {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
.notes-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 4px 0 0;
  font-style: italic;
}

/* ── Items ───────────────────────────────────────────── */
.items-list { display: flex; flex-direction: column; }
.item-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.item-row:last-child { border-bottom: none; }

.item-info { display: flex; flex-direction: column; gap: 3px; }
.item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.item-meta {
  font-size: 11px;
  color: var(--text-muted);
}
.item-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

/* ── Total ───────────────────────────────────────────── */
.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.total-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}
.total-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

/* ── Status controls ─────────────────────────────────── */
.status-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Footer ──────────────────────────────────────────── */
.panel-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>