<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/api/auth'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const form      = reactive({ email: '', password: '' })
const errors    = reactive({ email: '', password: '', general: '' })
const loading   = ref(false)
const showPass  = ref(false)

function clearErrors() {
  errors.email   = ''
  errors.password = ''
  errors.general  = ''
}

async function handleLogin() {
  clearErrors()
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach((e) => {
      const field = e.path[0]
      if (field in errors) errors[field] = e.message
    })
    return
  }
  loading.value = true
  try {
    await auth.login(form)
    const redirect = route.query.redirect || '/dashboard/overview'
    router.push(redirect)
  } catch (err) {
    errors.general = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-shell">

    <!-- ── LEFT — dark panel ───────────────────────── -->
    <div class="login-left">
      <div class="ll-grid" aria-hidden="true" />
      <div class="ll-content">
        <RouterLink :to="{ name: 'Home' }" class="ll-logo">
          <img src="/images/kweek_logo_1.png" alt="Kweek" class="ll-logo-img" />
          <span class="ll-logo-name">Kweek</span>
        </RouterLink>

        <div class="ll-body">
          <p class="ll-eyebrow">Social Seller Workspace</p>
          <h2 class="ll-title">Your orders,<br />organised.</h2>
          <p class="ll-sub">
            List products, capture buyer orders, and track every payment — without the WhatsApp chaos.
          </p>
        </div>

        <div class="ll-stats">
          <div class="ll-stat">
            <p class="ll-stat-val">120+</p>
            <p class="ll-stat-label">Sellers on waitlist</p>
          </div>
          <div class="ll-stat-sep" />
          <div class="ll-stat">
            <p class="ll-stat-val">2 min</p>
            <p class="ll-stat-label">To first listing</p>
          </div>
          <div class="ll-stat-sep" />
          <div class="ll-stat">
            <p class="ll-stat-val">Free</p>
            <p class="ll-stat-label">During beta</p>
          </div>
        </div>
      </div>
      <p class="ll-footer">© 2025 Kweek · v0.1 beta</p>
    </div>

    <!-- ── RIGHT — form ────────────────────────────── -->
    <div class="login-right">
      <div class="lr-wrap">

        <div class="heading">
          <h1>Sign in</h1>
          <p>Enter your credentials to access your dashboard</p>
        </div>

        <div v-if="errors.general" class="alert-error">
          <AlertCircle :size="14" :stroke-width="2" />
          {{ errors.general }}
        </div>

        <form @submit.prevent="handleLogin" novalidate>

          <div class="field">
            <label for="email">Email address</label>
            <div class="input-wrap">
              <Mail :size="14" :stroke-width="1.8" class="input-icon" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :class="['k-input has-icon', errors.email && 'error']"
              />
            </div>
            <span v-if="errors.email" class="field-error">
              <AlertCircle :size="11" :stroke-width="2" /> {{ errors.email }}
            </span>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="password">Password</label>
            </div>
            <div class="input-wrap">
              <Lock :size="14" :stroke-width="1.8" class="input-icon" />
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                :class="['k-input has-icon has-icon-right', errors.password && 'error']"
              />
              <button
                type="button"
                class="toggle-pass"
                @click="showPass = !showPass"
                tabindex="-1"
                :aria-label="showPass ? 'Hide password' : 'Show password'"
              >
                <EyeOff v-if="showPass" :size="14" :stroke-width="1.8" />
                <Eye    v-else          :size="14" :stroke-width="1.8" />
              </button>
            </div>
            <span v-if="errors.password" class="field-error">
              <AlertCircle :size="11" :stroke-width="2" /> {{ errors.password }}
            </span>
          </div>

          <button type="submit" class="k-btn-primary" :disabled="loading">
            <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
            <ArrowRight v-if="!loading" :size="14" :stroke-width="2" />
            <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </button>

        </form>

        <p class="switch-link">
          Don't have an account?
          <RouterLink :to="{ name: 'Register' }">Create one</RouterLink>
        </p>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── SHELL ───────────────────────────────────────────── */
.login-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* ── LEFT ────────────────────────────────────────────── */
.login-left {
  background: #1A1916;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
}

.ll-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.ll-content {
  display: flex;
  flex-direction: column;
  gap: 52px;
  position: relative;
  z-index: 1;
  flex: 1;
  justify-content: center;
}

.ll-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  position: absolute;
  top: 0;
  left: 0;
}
.ll-logo-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}
.ll-logo-name {
  font-size: 16px;
  font-weight: 600;
  color: #FAFAF9;
  letter-spacing: -0.4px;
}

.ll-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(250,250,249,0.35);
  margin: 0 0 16px;
}
.ll-title {
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 600;
  color: #FAFAF9;
  letter-spacing: -1.2px;
  line-height: 1.08;
  margin: 0 0 16px;
}
.ll-sub {
  font-size: 14px;
  color: rgba(250,250,249,0.45);
  line-height: 1.7;
  margin: 0;
  max-width: 320px;
}

.ll-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
}
.ll-stat { display: flex; flex-direction: column; gap: 4px; }
.ll-stat-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  color: #FAFAF9;
  letter-spacing: -0.8px;
  line-height: 1;
}
.ll-stat-label {
  font-size: 11px;
  color: rgba(250,250,249,0.35);
}
.ll-stat-sep {
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,0.1);
  flex-shrink: 0;
}

.ll-footer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(250,250,249,0.2);
  margin: 0;
  position: relative;
  z-index: 1;
}

/* ── RIGHT ───────────────────────────────────────────── */
.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--bg-page);
  border-left: 1px solid var(--border);
}

.lr-wrap {
  width: 100%;
  max-width: 360px;
  animation: fadeUp 0.35s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}

/* ── FORM STYLES — same tokens as before ─────────────── */
.heading {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.heading h1 {
  font-size: 19px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0 0 5px;
}
.heading p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  color: var(--error-text);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 7px;
  margin-bottom: 20px;
}

.field { margin-bottom: 18px; }

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.field label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.label-row label { margin-bottom: 0; }

.input-wrap { position: relative; }
.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-disabled);
  pointer-events: none;
  z-index: 1;
}
.k-input { display: block; }
.has-icon { padding-left: 34px !important; }
.has-icon-right { padding-right: 38px !important; }

.toggle-pass {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}
.toggle-pass:hover { color: var(--text-primary); }

.field-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--error-text);
  margin-top: 5px;
}

.k-btn-primary {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.switch-link {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 24px;
  margin-bottom: 0;
}
.switch-link a {
  color: var(--brand);
  text-decoration: none;
  font-weight: 500;
}
.switch-link a:hover { text-decoration: underline; }

/* ── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 900px) {
  .login-shell { grid-template-columns: 1fr; }
  .login-left  { display: none; }
  .login-right {
    border-left: none;
    padding: 40px 24px;
    align-items: flex-start;
    padding-top: 72px;
  }
  .lr-wrap { max-width: 100%; }
}

@media (max-width: 480px) {
  .login-right { padding: 56px 20px 40px; }
}
</style>