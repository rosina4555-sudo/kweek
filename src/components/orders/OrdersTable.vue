<script setup>
import { computed } from 'vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import KSkeleton        from '@/components/ui/KSkeleton.vue'
import KEmptyState      from '@/components/ui/KEmptyState.vue'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate }     from '@/utils/formatDate'

const props = defineProps({
  orders:     { type: Array,   required: true },
  loading:    { type: Boolean, default: false },
  selectedId: { type: Number,  default: null  },
})

const emit = defineEmits(['select'])

const skeletonRows = Array(6).fill(null)
</script>

<template>
  <div class="table-wrap">

    <!-- Loading state -->
    <table v-if="loading" class="orders-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Buyer</th>
          <th>Items</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(_, i) in skeletonRows" :key="i" class="skeleton-row">
          <td><KSkeleton width="48px" height="14px" /></td>
          <td>
            <KSkeleton width="120px" height="14px" />
            <KSkeleton width="90px"  height="11px" style="margin-top: 4px" />
          </td>
          <td><KSkeleton width="44px" height="14px" /></td>
          <td><KSkeleton width="72px" height="14px" /></td>
          <td><KSkeleton width="72px" height="20px" radius="5px" /></td>
          <td><KSkeleton width="60px" height="12px" /></td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state -->
    <KEmptyState
      v-else-if="orders.length === 0"
      icon="pi-receipt"
      title="No orders found"
      description="Orders will appear here once buyers place them through your storefront link."
    />

    <!-- Orders table -->
    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Buyer</th>
          <th>Items</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          :class="['order-row', selectedId === order.id && 'order-row--selected']"
          @click="emit('select', order.id)"
        >
          <!-- Selected indicator bar -->
          <td class="td-id">
            <span
              v-if="selectedId === order.id"
              class="selected-bar"
            />
            <span class="order-id">#{{ order.id }}</span>
          </td>

          <td class="td-buyer">
            <span class="buyer-name">{{ order.buyer_name }}</span>
            <span v-if="order.buyer_phone" class="buyer-phone">
              {{ order.buyer_phone }}
            </span>
          </td>

          <td class="td-items">
            {{ order.items?.length ?? 0 }}
            {{ order.items?.length === 1 ? 'item' : 'items' }}
          </td>

          <td class="td-amount">
            {{ formatCurrency(order.total) }}
          </td>

          <td class="td-status">
            <OrderStatusBadge :status="order.status" />
          </td>

          <td class="td-date">
            {{ formatDate(order.created_at) }}
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
.table-wrap {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
}

/* ── Table base ──────────────────────────────────────── */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

thead tr {
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-align: left;
  padding: 10px 16px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-page);
}

td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  font-size: 13px;
}

/* ── Row states ──────────────────────────────────────── */
.order-row {
  cursor: pointer;
  transition: background 0.12s;
}
.order-row:hover td {
  background: var(--bg-surface);
}
.order-row--selected td {
  background: color-mix(in srgb, var(--brand) 5%, transparent);
}
.order-row--selected:hover td {
  background: color-mix(in srgb, var(--brand) 8%, transparent);
}

/* ── Selected bar ────────────────────────────────────── */
.td-id { position: relative; }
.selected-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--brand);
  border-radius: 0 2px 2px 0;
}

/* ── Cell styles ─────────────────────────────────────── */
.order-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.td-buyer { min-width: 140px; }
.buyer-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.buyer-phone {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.td-items {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.td-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.td-date {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ── Skeleton rows ───────────────────────────────────── */
.skeleton-row td { padding: 14px 16px; }
</style>