<script setup>
import { onMounted }       from 'vue'
import { useRouter }       from 'vue-router'
import { useOverview }     from '@/composables/useOverview'
import { useAuthStore }    from '@/stores/auth'
import { formatCurrency }  from '@/utils/formatCurrency'
import { formatDate }      from '@/utils/formatDate'
import { getStatus }       from '@/utils/orderStatus'
import KSkeleton           from '@/components/ui/KSkeleton.vue'
import OrderStatusBadge    from '@/components/orders/OrderStatusBadge.vue'

import {
  ShoppingBag,
  Wallet,
  Clock,
  PackageX,
  Copy,
  Check,
  QrCode,
  Share2,
  ArrowRight,
  Plus,
  BadgeCheck,
  Truck,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-vue-next'

const router = useRouter()
const auth   = useAuthStore()

const {
  loading,
  stats,
  recentOrders,
  activity,
  storeUrl,
  copying,
  ordersDelta,
  fetchOverview,
  copyLink,
  shareWhatsApp,
  goToOrders,
  goToProducts,
} = useOverview()

const statCards = [
  {
    key:     'orders_today',
    label:   'Orders today',
    icon:    ShoppingBag,
    theme:   'blue',
    action:  () => router.push({ name: 'Orders' }),
  },
  {
    key:     'revenue',
    label:   'Revenue',
    icon:    Wallet,
    theme:   'green',
    format:  'currency',
  },
  {
    key:     'pending',
    label:   'Pending orders',
    icon:    Clock,
    theme:   'amber',
    action:  () => router.push({ name: 'Orders' }),
  },
  {
    key:     'out_of_stock',
    label:   'Out of stock',
    icon:    PackageX,
    theme:   'red',
    action:  () => router.push({ name: 'Products' }),
  },
]

const activityIconMap = {
  new_order:     { icon: Plus,       theme: 'blue'  },
  marked_paid:   { icon: BadgeCheck, theme: 'green' },
  status_change: { icon: Truck,      theme: 'amber' },
}

function getActivityIcon(type) {
  return activityIconMap[type] ?? { icon: Plus, theme: 'blue' }
}

function statValue(card) {
  if (!stats.value) return '—'
  const val = stats.value[card.key]
  if (card.format === 'currency') return formatCurrency(val)
  return val
}

onMounted(() => fetchOverview())
</script>

<template>
  <div class="overview">

    <!-- ── Greeting ──────────────────────────────────── -->
    <div class="greeting">
      <div>
        <h1 class="greeting-title">
          Good {{ new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening' }},
          {{ auth.sellerName?.split(' ')[0] || 'Seller' }}
        </h1>
        <p class="greeting-sub">Here's what's happening with your store today.</p>
      </div>
    </div>

    <!-- ── Stat cards ────────────────────────────────── -->
    <div class="stat-grid">
      <div
        v-for="card in statCards"
        :key="card.key"
        :class="['stat-card', card.action && 'stat-card--clickable']"
        @click="card.action?.()"
      >
        <div class="stat-card-top">
          <span class="stat-label">{{ card.label }}</span>
          <div :class="['stat-icon', `stat-icon--${card.theme}`]">
            <component :is="card.icon" :size="17" :stroke-width="1.8" />
          </div>
        </div>

        <template v-if="loading">
          <KSkeleton width="80px" height="28px" radius="6px" style="margin-bottom: 8px" />
          <KSkeleton width="120px" height="12px" />
        </template>

        <template v-else>
          <div class="stat-value">{{ statValue(card) }}</div>

          <!-- Delta only for orders today -->
          <div v-if="card.key === 'orders_today' && ordersDelta" :class="['stat-delta', `stat-delta--${ordersDelta.dir}`]">
            <TrendingUp   v-if="ordersDelta.dir === 'up'"      :size="11" :stroke-width="2" />
            <TrendingDown v-if="ordersDelta.dir === 'down'"    :size="11" :stroke-width="2" />
            <Minus        v-if="ordersDelta.dir === 'neutral'" :size="11" :stroke-width="2" />
            {{ ordersDelta.label }}
          </div>

          <div v-else-if="card.key === 'pending'" class="stat-delta stat-delta--neutral">
            <Clock :size="11" :stroke-width="2" />
            Need your attention
          </div>

          <div v-else-if="card.key === 'out_of_stock'" class="stat-delta stat-delta--down">
            <PackageX :size="11" :stroke-width="2" />
            Tap to restock
          </div>

          <div v-else-if="card.key === 'revenue'" class="stat-delta stat-delta--neutral">
            <BadgeCheck :size="11" :stroke-width="2" />
            From paid orders only
          </div>
        </template>
      </div>
    </div>

    <!-- ── Storefront link ───────────────────────────── -->
    <div class="store-bar">
      <div class="store-bar-left">
        <Share2 :size="14" :stroke-width="1.8" class="store-bar-icon" />
        <div>
          <p class="store-bar-title">Your storefront</p>
          <p class="store-bar-url">{{ storeUrl }}</p>
        </div>
      </div>
      <div class="store-bar-actions">
        <button class="bar-btn" title="Download QR code">
          <QrCode :size="13" :stroke-width="1.8" />
          QR code
        </button>
        <button class="bar-btn" @click="copyLink" title="Copy link">
          <Check v-if="copying" :size="13" :stroke-width="2" style="color: var(--status-paid-text)" />
          <Copy  v-else          :size="13" :stroke-width="1.8" />
          {{ copying ? 'Copied' : 'Copy link' }}
        </button>
        <button class="bar-btn bar-btn--primary" @click="shareWhatsApp">
          <Share2 :size="13" :stroke-width="1.8" />
          Share
        </button>
      </div>
    </div>

    <!-- ── Main content row ──────────────────────────── -->
    <div class="content-row">

      <!-- Recent orders -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent orders</span>
          <button class="card-link" @click="goToOrders">
            View all
            <ArrowRight :size="12" :stroke-width="2" />
          </button>
        </div>

        <!-- Skeleton -->
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="order-row">
            <KSkeleton width="44px"  height="13px" />
            <KSkeleton width="110px" height="13px" />
            <KSkeleton width="70px"  height="13px" />
            <KSkeleton width="64px"  height="20px" radius="5px" />
          </div>
        </template>

        <template v-else>
          <div class="orders-table-head">
            <span>Order</span>
            <span>Buyer</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="order-row order-row--data"
            @click="goToOrders"
          >
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-buyer">{{ order.buyer_name }}</span>
            <span class="order-amount">{{ formatCurrency(order.total) }}</span>
            <OrderStatusBadge :status="order.status" />
          </div>
        </template>
      </div>

      <!-- Activity feed -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Activity</span>
        </div>

        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="activity-item">
            <KSkeleton width="28px" height="28px" radius="7px" style="flex-shrink:0" />
            <div style="flex:1;display:flex;flex-direction:column;gap:5px">
              <KSkeleton width="160px" height="13px" />
              <KSkeleton width="110px" height="11px" />
            </div>
          </div>
        </template>

        <template v-else>
          <div
            v-for="item in activity"
            :key="item.id"
            class="activity-item"
          >
            <div :class="['activity-icon', `activity-icon--${getActivityIcon(item.type).theme}`]">
              <component
                :is="getActivityIcon(item.type).icon"
                :size="15"
                :stroke-width="2"
              />
            </div>
            <div class="activity-body">
              <p class="activity-title">{{ item.title }}</p>
              <p class="activity-sub">{{ item.sub }}</p>
              <p class="activity-time">{{ formatDate(item.time) }}</p>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Greeting ────────────────────────────────────────── */
.greeting {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.greeting-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0 0 3px;
}
.greeting-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Stat cards ──────────────────────────────────────── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.15s;
}
.stat-card--clickable {
  cursor: pointer;
}
.stat-card--clickable:hover {
  border-color: var(--border-strong);
}

.stat-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/* .stat-icon--blue  { background: var(--brand-light);           color: var(--brand);                   }
.stat-icon--green { background: var(--status-paid-bg);        color: var(--status-paid-text);        }
.stat-icon--amber { background: var(--status-pending-bg);     color: var(--status-pending-text);     }
.stat-icon--red   { background: var(--error-bg);              color: var(--error-text);              } */

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.8px;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-delta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
}
.stat-delta--up      { color: var(--status-paid-text);    }
.stat-delta--down    { color: var(--error-text);           }
.stat-delta--neutral { color: var(--text-muted);           }

/* ── Store bar ───────────────────────────────────────── */
.store-bar {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.store-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.store-bar-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}
.store-bar-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 3px;
}
.store-bar-url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--brand);
  margin: 0;
}
.store-bar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.bar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.bar-btn:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}
.bar-btn--primary {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.bar-btn--primary:hover {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
  color: #fff;
}

/* ── Content row ─────────────────────────────────────── */
.content-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 12px;
  align-items: start;
}

/* ── Cards ───────────────────────────────────────────── */
.card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.1px;
}
.card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--brand);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  transition: opacity 0.15s;
}
.card-link:hover { opacity: 0.75; }

/* ── Orders table ────────────────────────────────────── */
.orders-table-head {
  display: grid;
  grid-template-columns: 0.7fr 1.2fr 1fr 0.9fr;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}
.orders-table-head span {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-row {
  display: grid;
  grid-template-columns: 0.7fr 1.2fr 1fr 0.9fr;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  gap: 8px;
}
.order-row:last-child { border-bottom: none; }
.order-row--data {
  cursor: pointer;
  transition: background 0.12s;
}
.order-row--data:hover { background: var(--bg-surface); }

.order-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
.order-buyer {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.order-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

/* ── Activity feed ───────────────────────────────────── */
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
}
.activity-item:last-child { border-bottom: none; }

.activity-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  /* font-size: 15px; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
/* .activity-icon--blue  { background: var(--brand-light);       color: var(--brand);               }
.activity-icon--green { background: var(--status-paid-bg);    color: var(--status-paid-text);    }
.activity-icon--amber { background: var(--status-pending-bg); color: var(--status-pending-text); } */

.activity-body { flex: 1; min-width: 0; }
.activity-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0 0 3px;
}
.activity-time {
  font-size: 10px;
  color: var(--text-disabled);
  margin: 0;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1024px) {
  .stat-grid    { grid-template-columns: repeat(2, 1fr); }
  .content-row  { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .store-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .store-bar-actions { width: 100%; }
  .bar-btn { flex: 1; justify-content: center; }
}

@media (max-width: 400px) {
  .stat-grid { grid-template-columns: 1fr; }
}
</style>