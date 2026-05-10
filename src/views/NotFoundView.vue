<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Home } from 'lucide-vue-next'

const router = useRouter()
const seconds = ref(10)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    seconds.value--
    if (seconds.value <= 0) {
      clearInterval(interval)
      router.push({ name: 'Home' })
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="not-found">
    <div class="nf-grid" aria-hidden="true" />

    <div class="nf-inner">

      <!-- Top bar -->
      <div class="nf-topbar">
        <span class="nf-logo">Kweek</span>
        <span class="nf-badge mono">404</span>
      </div>

      <!-- Main content -->
      <div class="nf-body">

        <div class="nf-code-wrap">
          <span class="nf-code mono">404</span>
        </div>

        <div class="nf-text">
          <h1 class="nf-title">
            Page not found.
          </h1>
          <p class="nf-sub">
            The page you're looking for doesn't exist or has been moved.
            You'll be taken home in
            <span class="nf-countdown mono">{{ seconds }}s</span>
          </p>
        </div>

        <div class="nf-actions">
          <button class="nf-btn-primary" @click="router.push({ name: 'Home' })">
            <Home :size="14" :stroke-width="2" />
            Back to home
          </button>
          <button class="nf-btn-ghost" @click="router.back()">
            <ArrowLeft :size="14" :stroke-width="2" />
            Go back
          </button>
        </div>

        <!-- Divider -->
        <div class="nf-divider" />

        <!-- Helpful links -->
        <div class="nf-links-wrap">
          <p class="nf-links-label mono">Maybe you were looking for</p>
          <div class="nf-links">
            <button class="nf-link" @click="router.push({ name: 'Login' })">
              Sign in to your account
            </button>
            <button class="nf-link" @click="router.push({ name: 'Register' })">
              Create an account
            </button>
            <button class="nf-link" @click="router.push({ name: 'Overview' })">
              Your dashboard
            </button>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="nf-footer">
        <span class="mono nf-footer-copy">© 2025 Kweek · v0.1 beta</span>
        <span class="nf-footer-tag">Efficiency is simplicity.</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.not-found {
  --bg-page:        #FAFAF9;
  --bg-surface:     #F4F3F1;
  --bg-card:        #FFFFFF;
  --border:         #E5E4E1;
  --border-strong:  #CFCECA;
  --text-primary:   #1A1916;
  --text-secondary: #4A4945;
  --text-muted:     #8A8984;
  --text-disabled:  #BEBCB9;

  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  font-family: 'Geist', 'Noto Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.mono { font-family: 'JetBrains Mono', monospace; }

/* ── GRID BG ─────────────────────────────────────────── */
.nf-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 100%);
  pointer-events: none;
}

/* ── LAYOUT ──────────────────────────────────────────── */
.nf-inner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ── TOP BAR ─────────────────────────────────────────── */
.nf-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nf-logo {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.4px;
  color: var(--text-primary);
}
.nf-badge {
  font-size: 9px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  letter-spacing: 0.3px;
}

/* ── BODY ────────────────────────────────────────────── */
.nf-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 0 40px;
}

/* ── BIG 404 ─────────────────────────────────────────── */
.nf-code-wrap {
  margin-bottom: 28px;
}
.nf-code {
  font-size: clamp(80px, 18vw, 160px);
  font-weight: 600;
  letter-spacing: -6px;
  line-height: 1;
  color: var(--border-strong);
  display: block;
  animation: fadeUp 0.6s ease both;
}

/* ── TEXT ────────────────────────────────────────────── */
.nf-text {
  margin-bottom: 36px;
  animation: fadeUp 0.6s ease 0.1s both;
}
.nf-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: -0.8px;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.1;
}
.nf-sub {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
}
.nf-countdown {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 6px;
}

/* ── ACTIONS ─────────────────────────────────────────── */
.nf-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  animation: fadeUp 0.6s ease 0.2s both;
}
.nf-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 18px;
  background: var(--text-primary);
  color: var(--bg-page);
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
  letter-spacing: -0.1px;
}
.nf-btn-primary:hover { opacity: 0.82; }

.nf-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 16px;
  background: none;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}
.nf-btn-ghost:hover { color: var(--text-primary); border-color: var(--text-muted); }

/* ── DIVIDER ─────────────────────────────────────────── */
.nf-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 28px;
  animation: fadeUp 0.6s ease 0.25s both;
}

/* ── HELPFUL LINKS ───────────────────────────────────── */
.nf-links-wrap {
  animation: fadeUp 0.6s ease 0.3s both;
}
.nf-links-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  display: block;
}
.nf-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nf-link {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: background 0.12s, color 0.12s;
  width: fit-content;
}
.nf-link:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* ── FOOTER ──────────────────────────────────────────── */
.nf-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.nf-footer-copy { font-size: 10px; color: var(--text-disabled); }
.nf-footer-tag  {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-disabled);
}

/* ── ANIMATION ───────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 480px) {
  .nf-inner   { padding: 28px 24px; }
  .nf-code    { letter-spacing: -3px; }
  .nf-actions { flex-direction: column; align-items: flex-start; }
  .nf-btn-primary,
  .nf-btn-ghost { width: 100%; justify-content: center; }
}
</style>