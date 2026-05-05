<script setup>
import { onMounted, computed }  from 'vue'
import { useAnalytics }         from '@/composables/useAnalytics'
import { formatCurrency }       from '@/utils/formatCurrency'
import KSkeleton                from '@/components/ui/KSkeleton.vue'
import {
  Line, Bar, Doughnut,
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, ArcElement,
  Tooltip, Legend, Filler,
} from 'chart.js'
import {
  TrendingUp, TrendingDown,
  ShoppingBag, Wallet,
  ReceiptText, BadgePercent,
} from 'lucide-vue-next'

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, ArcElement,
  Tooltip, Legend, Filler,
)

const {
  loading, period, periods, data,
  fetchAnalytics, changePeriod,
  revenueChartData, ordersChartData,
  statusChartData, topProductsChartData,
  dayChartData,
  baseLineOptions, donutOptions,
  hBarOptions, vBarOptions,
} = useAnalytics()

const summaryCards = computed(() => {
  if (!data.value) return []
  const s = data.value.summary
  return [
    {
      label:   'Total revenue',
      value:   formatCurrency(s.total_revenue),
      change:  s.revenue_change,
      icon:    Wallet,
    },
    {
      label:   'Total orders',
      value:   s.total_orders,
      change:  s.orders_change,
      icon:    ShoppingBag,
    },
    {
      label:   'Avg. order value',
      value:   formatCurrency(s.avg_order_value),
      change:  s.aov_change,
      icon:    ReceiptText,
    },
    {
      label:   'Payment rate',
      value:   `${s.conversion_rate}%`,
      change:  s.conversion_change,
      icon:    BadgePercent,
    },
  ]
})

onMounted(() => fetchAnalytics())
</script>

<template>
  <div class="analytics">

    <!-- ── Header ──────────────────────────────────── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Analytics</h1>
        <p class="page-sub">Track your store performance over time</p>
      </div>

      <!-- Period selector -->
      <div class="period-tabs">
        <button
          v-for="p in periods"
          :key="p.key"
          :class="['period-tab', period === p.key && 'period-tab--active']"
          @click="changePeriod(p.key)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- ── Summary cards ───────────────────────────── -->
    <div class="summary-grid">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="summary-card">
          <div class="summary-card-top">
            <KSkeleton width="80px"  height="11px" />
            <KSkeleton width="30px"  height="30px" radius="8px" />
          </div>
          <KSkeleton width="100px" height="26px" radius="6px" style="margin-bottom:6px" />
          <KSkeleton width="80px"  height="11px" />
        </div>
      </template>

      <template v-else>
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="summary-card"
        >
          <div class="summary-card-top">
            <span class="summary-label">{{ card.label }}</span>
            <div class="summary-icon">
              <component :is="card.icon" :size="14" :stroke-width="1.8" />
            </div>
          </div>
          <div class="summary-value">{{ card.value }}</div>
          <div
            :class="[
              'summary-change',
              card.change > 0 && 'summary-change--up',
              card.change < 0 && 'summary-change--down',
              card.change === 0 && 'summary-change--neutral',
            ]"
          >
            <TrendingUp   v-if="card.change > 0" :size="11" :stroke-width="2" />
            <TrendingDown v-if="card.change < 0" :size="11" :stroke-width="2" />
            {{ card.change > 0 ? '+' : '' }}{{ card.change }}% vs previous period
          </div>
        </div>
      </template>
    </div>

    <!-- ── Revenue chart ───────────────────────────── -->
    <div class="chart-card chart-card--full">
      <div class="chart-header">
        <div>
          <p class="chart-title">Revenue</p>
          <p class="chart-sub">Daily revenue over the selected period</p>
        </div>
      </div>
      <div class="chart-body chart-body--lg">
        <template v-if="loading">
          <KSkeleton width="100%" height="100%" radius="0" />
        </template>
        <Line
          v-else-if="revenueChartData"
          :data="revenueChartData"
          :options="baseLineOptions"
        />
      </div>
    </div>

    <!-- ── Orders + Status row ─────────────────────── -->
    <div class="chart-row">

      <!-- Orders over time -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <p class="chart-title">Orders</p>
            <p class="chart-sub">Daily order count</p>
          </div>
        </div>
        <div class="chart-body chart-body--md">
          <template v-if="loading">
            <KSkeleton width="100%" height="100%" radius="0" />
          </template>
          <Line
            v-else-if="ordersChartData"
            :data="ordersChartData"
            :options="baseLineOptions"
          />
        </div>
      </div>

      <!-- Order status donut -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <p class="chart-title">Order status</p>
            <p class="chart-sub">Breakdown by current status</p>
          </div>
        </div>
        <div class="chart-body chart-body--md chart-body--center">
          <template v-if="loading">
            <KSkeleton width="180px" height="180px" radius="50%" />
          </template>
          <Doughnut
            v-else-if="statusChartData"
            :data="statusChartData"
            :options="donutOptions"
          />
        </div>
      </div>
    </div>

    <!-- ── Products + Day row ──────────────────────── -->
    <div class="chart-row">

      <!-- Top products -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <p class="chart-title">Top products</p>
            <p class="chart-sub">Ranked by number of orders</p>
          </div>
        </div>
        <div class="chart-body chart-body--md">
          <template v-if="loading">
            <KSkeleton width="100%" height="100%" radius="0" />
          </template>
          <Bar
            v-else-if="topProductsChartData"
            :data="topProductsChartData"
            :options="hBarOptions"
          />
        </div>

        <!-- Table below chart -->
        <div v-if="!loading && data" class="product-table">
          <div class="pt-header">
            <span>Product</span>
            <span>Orders</span>
            <span>Revenue</span>
          </div>
          <div
            v-for="(p, idx) in data.top_products"
            :key="p.name"
            class="pt-row"
          >
            <div class="pt-name">
              <span class="pt-rank">{{ idx + 1 }}</span>
              {{ p.name }}
            </div>
            <span class="pt-orders mono">{{ p.orders }}</span>
            <span class="pt-revenue mono">{{ formatCurrency(p.revenue) }}</span>
          </div>
        </div>
      </div>

      <!-- Orders by day of week -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <p class="chart-title">Busiest days</p>
            <p class="chart-sub">Orders by day of the week</p>
          </div>
        </div>
        <div class="chart-body chart-body--md">
          <template v-if="loading">
            <KSkeleton width="100%" height="100%" radius="0" />
          </template>
          <Bar
            v-else-if="dayChartData"
            :data="dayChartData"
            :options="vBarOptions"
          />
        </div>

        <!-- Best day callout -->
        <div v-if="!loading && data" class="best-day">
          <div class="best-day-inner">
            <p class="best-day-label">Best day to post</p>
            <p class="best-day-val">
              {{
                data.by_day.reduce((a, b) => a.orders > b.orders ? a : b).day
              }}day
            </p>
            <p class="best-day-sub">
              Most orders come in on this day — plan your posts accordingly
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Header ──────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0 0 3px;
}
.page-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Period tabs ─────────────────────────────────────── */
.period-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}
.period-tab {
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.period-tab:hover { color: var(--text-secondary); }
.period-tab--active {
  background: var(--bg-page);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* ── Summary cards ───────────────────────────────────── */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.summary-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
}
.summary-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.summary-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.summary-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  /* background: var(--bg-surface); */
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  /* color: var(--text-muted); */
}
.summary-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.6px;
  line-height: 1;
  margin-bottom: 8px;
}
.summary-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
}
.summary-change--up      { color: var(--status-paid-text); }
.summary-change--down    { color: var(--error-text); }
.summary-change--neutral { color: var(--text-disabled); }

/* ── Chart cards ─────────────────────────────────────── */
.chart-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chart-card--full { width: 100%; }

.chart-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border);
}
.chart-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.1px;
  margin: 0 0 2px;
}
.chart-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}

.chart-body {
  padding: 20px;
  position: relative;
}
.chart-body--lg  { height: 220px; }
.chart-body--md  { height: 200px; }
.chart-body--center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Chart row ───────────────────────────────────────── */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ── Product table ───────────────────────────────────── */
.product-table {
  border-top: 1px solid var(--border);
}
.pt-header {
  display: grid;
  grid-template-columns: 1fr 60px 100px;
  padding: 8px 16px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.pt-header span {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pt-row {
  display: grid;
  grid-template-columns: 1fr 60px 100px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  align-items: center;
}
.pt-row:last-child { border-bottom: none; }
.pt-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pt-rank {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}
.pt-orders,
.pt-revenue {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

/* ── Best day callout ────────────────────────────────── */
.best-day {
  border-top: 1px solid var(--border);
  padding: 16px 20px;
  background: var(--bg-surface);
}
.best-day-inner { display: flex; flex-direction: column; gap: 4px; }
.best-day-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}
.best-day-val {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
}
.best-day-sub {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* ── Mono ────────────────────────────────────────────── */
.mono { font-family: 'JetBrains Mono', monospace; }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1024px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .chart-row    { grid-template-columns: 1fr; }
  .page-header  { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  .summary-grid { grid-template-columns: 1fr; }
}
</style>