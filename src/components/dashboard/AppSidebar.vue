<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  collapsed:  { type: Boolean, default: false },
  mobileOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-collapse', 'close-mobile'])

const route = useRoute()
const auth  = useAuthStore()

const initials = computed(() => {
  const name = auth.sellerName
  if (!name) return 'K'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
})

const navGroups = [
  {
    section: 'Main',
    items: [
      { label: 'Overview',   name: 'Overview',   icon: 'pi-th-large' },
      { label: 'Products',   name: 'Products',   icon: 'pi-box'      },
      { label: 'Orders',     name: 'Orders',     icon: 'pi-receipt'  },
    ],
  },
  {
    section: 'Store',
    items: [
      { label: 'Storefront', name: 'Storefront', icon: 'pi-globe'     },
      { label: 'Analytics',  name: 'Analytics',  icon: 'pi-chart-bar' },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Settings',   name: 'Settings',   icon: 'pi-cog' },
    ],
  },
]

function isActive(routeName) {
  return route.name === routeName
}
</script>

<template>
  <!-- Backdrop — mobile only -->
  <Transition name="t-fade">
    <div
      v-if="mobileOpen"
      class="sb-backdrop"
      @click="emit('close-mobile')"
    />
  </Transition>

  <aside :class="['sidebar', collapsed && 'sidebar--collapsed', mobileOpen && 'sidebar--open']">

    <!-- Head -->
    <div class="sb-head">
      <div class="sb-logo-wrap">
        <img src="/images/logo_kweek.png" alt="Kweek" class="sb-logo" />
      </div>
      <span v-if="!collapsed" class="sb-wordmark">Kweek</span>
    </div>

    <!-- Nav -->
    <nav class="sb-nav">
      <template v-for="group in navGroups" :key="group.section">

        <span v-if="!collapsed" class="sb-section">{{ group.section }}</span>

        <RouterLink
          v-for="item in group.items"
          :key="item.name"
          :to="{ name: item.name }"
          :class="['nav-item', isActive(item.name) && 'nav-item--active']"
          :title="collapsed ? item.label : undefined"
          @click="emit('close-mobile')"
        >
          <span class="nav-icon-wrap">
            <i :class="['pi', item.icon]" />
          </span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </RouterLink>

      </template>
    </nav>

    <!-- Footer -->
    <div class="sb-foot">
      <!-- User row -->
      <div class="sb-user" :title="collapsed ? auth.sellerName : undefined">
        <span class="sb-avatar">{{ initials }}</span>
        <div v-if="!collapsed" class="sb-user-text">
          <span class="sb-user-name">{{ auth.sellerName || 'Seller' }}</span>
          <span class="sb-user-role">Seller account</span>
        </div>
      </div>

      <!-- Collapse button — desktop only -->
      <button
        class="collapse-btn"
        @click="emit('toggle-collapse')"
        :title="collapsed ? 'Expand' : 'Collapse'"
      >
        <span class="nav-icon-wrap">
          <i :class="['pi', collapsed ? 'pi-chevron-right' : 'pi-chevron-left']" />
        </span>
        <span v-if="!collapsed" class="nav-label">Collapse</span>
      </button>
    </div>

  </aside>
</template>

<style scoped>
/* ── Backdrop ────────────────────────────────────────── */
.sb-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 40;
}

/* ── Sidebar ─────────────────────────────────────────── */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 216px;
  background: #0F1117;
  border-right: 1px solid #1E2130;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transform: translateX(-100%);
  transition:
    transform 0.24s cubic-bezier(0.4, 0, 0.2, 1),
    width     0.22s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@media (min-width: 768px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
    flex-shrink: 0;
    height: 100%;
  }
  .sidebar--collapsed { width: 58px; }
}

.sidebar--open { transform: translateX(0); }

/* ── Head ────────────────────────────────────────────── */
.sb-head {
  height: 56px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #1E2130;
  flex-shrink: 0;
  overflow: hidden;
}

.sb-logo-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  /* background: #4F46E5; */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sb-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sb-wordmark {
  font-size: 15px;
  font-weight: 600;
  color: #F9FAFB;
  letter-spacing: -0.4px;
  white-space: nowrap;
}

/* ── Nav ─────────────────────────────────────────────── */
.sb-nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}
.sb-nav::-webkit-scrollbar { display: none; }

.sb-section {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #2D3340;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 12px 10px 4px;
  white-space: nowrap;
}

/* ── Nav item ────────────────────────────────────────── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 7px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
  overflow: hidden;
  white-space: nowrap;
}
.nav-item:hover { background: #161A23; }
.nav-item--active { background: #161A23; }

/* Icon container */
.nav-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: #161A23;
  border: 1px solid #1E2130;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 13px;
  color: #6B7280;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.nav-item:hover .nav-icon-wrap {
  border-color: #2D3340;
  color: #9CA3AF;
}
.nav-item--active .nav-icon-wrap {
  background: #4F46E5;
  border-color: #4F46E5;
  color: #fff;
}

.nav-label {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  white-space: nowrap;
  transition: color 0.15s;
}
.nav-item:hover .nav-label  { color: #9CA3AF; }
.nav-item--active .nav-label { color: #E5E7EB; }

/* ── Footer ──────────────────────────────────────────── */
.sb-foot {
  border-top: 1px solid #1E2130;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

/* User row */
.sb-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 7px;
  overflow: hidden;
}
.sb-avatar {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: #161A23;
  border: 1px solid #1E2130;
  color: #6B7280;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sb-user-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sb-user-name {
  font-size: 12px;
  font-weight: 500;
  color: #9CA3AF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-user-role {
  font-size: 10px;
  color: #374151;
  white-space: nowrap;
}

/* Collapse button */
.collapse-btn {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 7px;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  transition: background 0.15s;
}
.collapse-btn:hover { background: #161A23; }
.collapse-btn .nav-icon-wrap {
  color: #374151;
  background: transparent;
  border-color: #1E2130;
}
.collapse-btn:hover .nav-icon-wrap { color: #6B7280; }
.collapse-btn .nav-label { color: #374151; font-size: 12px; }
.collapse-btn:hover .nav-label { color: #6B7280; }

@media (min-width: 768px) {
  .collapse-btn { display: flex; }
}

/* ── Transitions ─────────────────────────────────────── */
.t-fade-enter-active,
.t-fade-leave-active { transition: opacity 0.2s; }
.t-fade-enter-from,
.t-fade-leave-to     { opacity: 0; }
</style>