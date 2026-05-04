<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['open-sidebar'])

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const pageMeta = {
  Overview:   { title: 'Overview',   crumb: 'Dashboard' },
  Products:   { title: 'Products',   crumb: 'Dashboard' },
  Orders:     { title: 'Orders',     crumb: 'Dashboard' },
  Storefront: { title: 'Storefront', crumb: 'Store'     },
  Analytics:  { title: 'Analytics',  crumb: 'Store'     },
  Settings:   { title: 'Settings',   crumb: 'Account'   },
}

const page = computed(() => pageMeta[route.name] ?? { title: 'Dashboard', crumb: '' })

const initials = computed(() => {
  const name = auth.sellerName
  if (!name) return 'K'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
})

// Theme
const isDark = ref(document.documentElement.classList.contains('dark'))
function toggleTheme() {
  isDark.value = document.documentElement.classList.toggle('dark')
  localStorage.setItem('kweek-theme', isDark.value ? 'dark' : 'light')
}

// User dropdown
const dropdownOpen = ref(false)
function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function closeDropdown()  { dropdownOpen.value = false }

async function handleLogout() {
  closeDropdown()
  await auth.logout()
}
</script>

<template>
  <header class="topbar">

    <!-- Left -->
    <div class="tb-left">
      <!-- Hamburger — mobile only -->
      <button class="tb-hamburger" @click="emit('open-sidebar')" aria-label="Open menu">
        <i class="pi pi-bars" />
      </button>

      <!-- Page identity -->
      <div class="tb-page">
        <span class="tb-crumb">{{ page.crumb }}</span>
        <h1 class="tb-title">{{ page.title }}</h1>
      </div>
    </div>

    <!-- Right -->
    <div class="tb-right">

      <!-- Theme toggle -->
      <button class="tb-action" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
        <i :class="['pi', isDark ? 'pi-sun' : 'pi-moon']" />
      </button>

      <div class="tb-divider" />

      <!-- Avatar + dropdown -->
      <div class="tb-user" v-click-outside="closeDropdown">
        <button class="tb-avatar" @click="toggleDropdown" :title="auth.sellerName">
          {{ initials }}
        </button>

        <Transition name="t-drop">
          <div v-if="dropdownOpen" class="tb-dropdown">
            <div class="tdd-header">
              <span class="tdd-name">{{ auth.sellerName || 'Seller' }}</span>
              <span class="tdd-email">{{ auth.user?.email }}</span>
            </div>

            <div class="tdd-sep" />

            <RouterLink :to="{ name: 'Settings' }" class="tdd-item" @click="closeDropdown">
              <i class="pi pi-cog" />
              <span>Settings</span>
            </RouterLink>
            <RouterLink :to="{ name: 'Storefront' }" class="tdd-item" @click="closeDropdown">
              <i class="pi pi-globe" />
              <span>My storefront</span>
            </RouterLink>

            <div class="tdd-sep" />

            <button class="tdd-item tdd-item--danger" @click="handleLogout">
              <i class="pi pi-sign-out" />
              <span>Sign out</span>
            </button>
          </div>
        </Transition>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* ── Topbar shell ────────────────────────────────────── */
.topbar {
  height: 56px;
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

/* ── Left ────────────────────────────────────────────── */
.tb-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tb-hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
}
.tb-hamburger:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}
@media (min-width: 768px) {
  .tb-hamburger { display: none; }
}

.tb-page {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.tb-crumb {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  line-height: 1;
}
.tb-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  margin: 0;
  line-height: 1;
}

/* ── Right ───────────────────────────────────────────── */
.tb-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tb-action {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.tb-action:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.tb-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 2px;
}

/* ── Avatar ──────────────────────────────────────────── */
.tb-user { position: relative; }

.tb-avatar {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #1E1B4B;
  border: 3px solid #312E81;
  color: #A5B4FC;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}
.tb-avatar:hover { opacity: 0.8; }

/* ── Dropdown ────────────────────────────────────────── */
.tb-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 210px;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 5px;
  z-index: 100;
}

.tdd-header {
  padding: 9px 10px 11px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.tdd-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.tdd-email {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tdd-sep {
  height: 1px;
  background: var(--border);
  margin: 3px 0;
}

.tdd-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.tdd-item:hover { background: var(--bg-surface); }
.tdd-item i {
  font-size: 12px;
  color: var(--text-muted);
  width: 14px;
  text-align: center;
}
.tdd-item--danger { color: var(--error-text); }
.tdd-item--danger i { color: var(--error-text); }
.tdd-item--danger:hover { background: var(--error-bg); }

/* ── Transition ──────────────────────────────────────── */
.t-drop-enter-active,
.t-drop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-drop-enter-from,
.t-drop-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>