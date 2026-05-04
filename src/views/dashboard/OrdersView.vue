<script setup>
import { onMounted, ref }     from 'vue'
import { useOrders }          from '@/composables/useOrders'
import OrdersTable            from '@/components/orders/OrdersTable.vue'
import OrderDetailPanel       from '@/components/orders/OrderDetailPanel.vue'
import KInput                 from '@/components/ui/KInput.vue'
import KButton                from '@/components/ui/KButton.vue'
import { formatCurrency }     from '@/utils/formatCurrency'

const {
  search, activeStatus, selectedId, selectedOrder,
  filtered, loading, total, revenue,
  counts, statusOptions,
  fetchOrders, selectOrder, clearSelection,
  updateStatus, markPaid, exportCSV,
} = useOrders()

const updatingStatus = ref(false)

const tabs = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'paid',      label: 'Paid'      },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready',     label: 'Ready'     },
  { key: 'delivered', label: 'Delivered' },
]

async function handleUpdateStatus(id, status) {
  updatingStatus.value = true
  await updateStatus(id, status)
  updatingStatus.value = false
}

async function handleMarkPaid(id) {
  updatingStatus.value = true
  await markPaid(id)
  updatingStatus.value = false
}

onMounted(() => fetchOrders())
</script>

<template>
  <div class="orders-page">

    <!-- Left: table panel -->
    <div class="orders-left">

      <!-- Page header -->
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">Orders</h1>
          <p class="page-sub">
            <span class="mono">{{ total }}</span> orders ·
            <span class="mono">{{ formatCurrency(revenue) }}</span> revenue
          </p>
        </div>
        <div class="page-header-right">
          <KButton variant="secondary" size="sm" icon-left="pi-calendar">
            Date range
          </KButton>
          <KButton
            variant="secondary"
            size="sm"
            icon-left="pi-download"
            @click="exportCSV()"
          >
            Export CSV
          </KButton>
        </div>
      </div>

      <!-- Filters bar -->
      <div class="filters-bar">
        <KInput
          v-model="search"
          placeholder="Search buyer, order ID, phone..."
          icon-left="pi-search"
          size="sm"
          style="max-width: 260px; flex-shrink: 0"
        />

        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab', activeStatus === tab.key && 'tab--active']"
            @click="activeStatus = tab.key; clearSelection()"
          >
            {{ tab.label }}
            <span class="tab-count">
              {{ counts[tab.key]?.value ?? 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <OrdersTable
        :orders="filtered"
        :loading="loading"
        :selected-id="selectedId"
        @select="selectOrder"
      />

    </div>

    <!-- Right: detail panel -->
    <Transition name="t-panel">
      <div v-if="selectedId" class="orders-right">
        <OrderDetailPanel
          :order="selectedOrder"
          :updating-status="updatingStatus"
          @close="clearSelection"
          @update-status="handleUpdateStatus"
          @mark-paid="handleMarkPaid"
        />
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Page shell ──────────────────────────────────────── */
.orders-page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  height: 100%;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

/* When detail panel is open — two columns */
.orders-page:has(.orders-right) {
  grid-template-columns: 1fr 420px;
}

/* ── Left panel ──────────────────────────────────────── */
.orders-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* ── Page header ─────────────────────────────────────── */
.page-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  background: var(--bg-page);
}
.page-header-left { display: flex; flex-direction: column; gap: 3px; }
.page-header-right { display: flex; align-items: center; gap: 8px; }

.page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  margin: 0;
}
.page-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

/* ── Filters bar ─────────────────────────────────────── */
.filters-bar {
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  background: var(--bg-page);
  overflow-x: auto;
  scrollbar-width: none;
}
.filters-bar::-webkit-scrollbar { display: none; }

/* ── Status tabs ─────────────────────────────────────── */
.tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.tab:hover {
  background: var(--bg-surface);
  color: var(--text-secondary);
}
.tab--active {
  background: var(--bg-surface);
  border-color: var(--border);
  color: var(--text-primary);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 4px;
  border-radius: 4px;
  background: var(--bg-sunken);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
}
.tab--active .tab-count {
  background: var(--border);
  color: var(--text-secondary);
}

/* ── Right detail panel ──────────────────────────────── */
.orders-right {
  border-left: 1px solid var(--border);
  overflow: hidden;
  height: 100%;
}

/* ── Transition ──────────────────────────────────────── */
.t-panel-enter-active { transition: opacity 0.18s, transform 0.2s; }
.t-panel-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-panel-enter-from   { opacity: 0; transform: translateX(20px); }
.t-panel-leave-to     { opacity: 0; transform: translateX(20px); }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 860px) {
  .orders-page:has(.orders-right) {
    grid-template-columns: 1fr;
  }
  .orders-right {
    position: fixed;
    inset: 0;
    z-index: 60;
    border-left: none;
    border-radius: 0;
  }
}

@media (max-width: 540px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .page-header-right { width: 100%; }
  .page-header-right .k-btn { flex: 1; }
}
</style>