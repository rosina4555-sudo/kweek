<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/api/auth'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader } from 'lucide-vue-next'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const form     = reactive({ email: '', password: '' })
const errors   = reactive({ email: '', password: '', general: '' })
const loading  = ref(false)
const showPass = ref(false)

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
  <div class="login-wrap">

    <!-- Logo -->
    <RouterLink :to="{ name: 'Home' }" class="login-logo">
      <img src="/images/kweek_logo_1.png" alt="Kweek" class="login-logo-img" />
      <span class="login-logo-name">Kweek</span>
    </RouterLink>

    <!-- Card -->
    <div class="login-card">

      <!-- Head -->
      <div class="login-head">
        <h1 class="login-title">Sign in</h1>
        <p class="login-sub">Enter your credentials to access your dashboard</p>
      </div>

      <!-- General error -->
      <Transition name="t-alert">
        <div v-if="errors.general" class="login-alert">
          <AlertCircle :size="14" :stroke-width="2" class="login-alert-icon" />
          <span>{{ errors.general }}</span>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="handleLogin" novalidate class="login-form">

        <!-- Email -->
        <div class="field">
          <label for="login-email" class="field-label">Email address</label>
          <div class="input-wrap">
            <Mail :size="14" :stroke-width="1.8" class="input-icon" />
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="k-input"
              :class="{ 'k-input--error': errors.email }"
            />
          </div>
          <Transition name="t-err">
            <p v-if="errors.email" class="field-error">
              <AlertCircle :size="11" :stroke-width="2" />
              {{ errors.email }}
            </p>
          </Transition>
        </div>

        <!-- Password -->
        <div class="field">
          <label for="login-password" class="field-label">Password</label>
          <div class="input-wrap">
            <Lock :size="14" :stroke-width="1.8" class="input-icon" />
            <input
              id="login-password"
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="k-input k-input--padright"
              :class="{ 'k-input--error': errors.password }"
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
          <Transition name="t-err">
            <p v-if="errors.password" class="field-error">
              <AlertCircle :size="11" :stroke-width="2" />
              {{ errors.password }}
            </p>
          </Transition>
        </div>

        <!-- Submit -->
        <button type="submit" class="login-submit" :disabled="loading">
          <Loader v-if="loading" :size="14" :stroke-width="2" class="spin" />
          <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
          <ArrowRight v-if="!loading" :size="14" :stroke-width="2" />
        </button>

      </form>

      <!-- Switch -->
      <div class="login-switch-row">
        <span>Don't have an account?</span>
        <RouterLink :to="{ name: 'Register' }" class="login-switch-link">
          Create one →
        </RouterLink>
      </div>

    </div>

    <!-- Footer -->
    <p class="login-footer">© 2025 Kweek · v0.1 beta</p>

  </div>
</template>

<style scoped>
/* ── LAYOUT ──────────────────────────────────────────── */
.login-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  gap: 20px;
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── LOGO ────────────────────────────────────────────── */
.login-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.login-logo-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.login-logo-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.4px;
}

/* ── CARD ────────────────────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05);
}

/* ── HEAD ────────────────────────────────────────────── */
.login-head {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.login-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.4px;
  margin: 0 0 4px;
  line-height: 1.2;
}
.login-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ── ALERT ───────────────────────────────────────────── */
.login-alert {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  color: var(--error-text);
  font-size: 12px;
  line-height: 1.55;
  padding: 10px 13px;
  border-radius: 7px;
  margin-bottom: 18px;
}
.login-alert-icon { flex-shrink: 0; margin-top: 1px; }

/* ── FORM ────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── FIELD ───────────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.1px;
}

/* ── INPUT ───────────────────────────────────────────── */
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

.k-input {
  width: 100%;
  height: 42px;
  padding: 0 12px 0 34px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  display: block;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.k-input::placeholder { color: var(--text-disabled); }
.k-input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 3px rgba(26,25,22,0.06);
  background: var(--bg-card);
}
.k-input--error {
  border-color: var(--error-border);
  background: var(--error-bg);
}
.k-input--error:focus {
  box-shadow: 0 0 0 3px rgba(192,57,43,0.07);
}
.k-input--padright { padding-right: 38px; }

/* ── PASSWORD TOGGLE ─────────────────────────────────── */
.toggle-pass {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}
.toggle-pass:hover { color: var(--text-primary); }

/* ── FIELD ERROR ─────────────────────────────────────── */
.field-error {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--error-text);
  line-height: 1.4;
  margin: 0;
}

/* ── SUBMIT ──────────────────────────────────────────── */
.login-submit {
  width: 100%;
  height: 42px;
  margin-top: 4px;
  background: var(--text-primary);
  color: var(--bg-page);
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: opacity 0.15s;
}
.login-submit:hover:not(:disabled) { opacity: 0.82; }
.login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── SPINNER ─────────────────────────────────────────── */
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── SWITCH ROW ──────────────────────────────────────── */
.login-switch-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}
.login-switch-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.15s;
}
.login-switch-link:hover { opacity: 0.65; }

/* ── FOOTER ──────────────────────────────────────────── */
.login-footer {
  font-size: 11px;
  color: var(--text-disabled);
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
}

/* ── TRANSITIONS ─────────────────────────────────────── */
.t-alert-enter-active, .t-alert-leave-active { transition: opacity 0.2s, transform 0.2s; }
.t-alert-enter-from,  .t-alert-leave-to      { opacity: 0; transform: translateY(-4px); }

.t-err-enter-active, .t-err-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-err-enter-from,   .t-err-leave-to     { opacity: 0; transform: translateY(-3px); }

/* ── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 480px) {
  .login-card { padding: 24px 20px; border-radius: 10px; }
}
</style>