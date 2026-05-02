<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { registerSchema } from '@/api/auth'

const router = useRouter()
const auth   = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '', general: '' })
const loading  = ref(false)
const showPass = ref(false)

const strength = computed(() => {
  const p = form.password
  if (!p) return 0
  let s = 0
  if (p.length >= 8)          s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^a-zA-Z0-9]/.test(p)) s++
  return s
})

const strengthMeta = computed(() => {
  return [
    null,
    { label: 'Weak',   color: '#EF4444' },
    { label: 'Fair',   color: '#F59E0B' },
    { label: 'Good',   color: '#EAB308' },
    { label: 'Strong', color: '#22C55E' },
  ][strength.value]
})

function clearErrors() { Object.keys(errors).forEach((k) => (errors[k] = '')) }

async function handleRegister() {
  clearErrors()
  const result = registerSchema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach((e) => {
      const field = e.path[0]
      if (field in errors) errors[field] = e.message
    })
    return
  }
  loading.value = true
  try {
    await auth.register(form)
    router.push({ name: 'Overview' })
  } catch (err) {
    errors.general = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="heading">
      <h1>Create account</h1>
      <p>Set up your Kweek seller account</p>
    </div>

    <div v-if="errors.general" class="alert-error">
      <i class="pi pi-exclamation-circle" />
      {{ errors.general }}
    </div>

    <form @submit.prevent="handleRegister" novalidate>

      <div class="field">
        <label for="name">Full name</label>
        <div class="input-wrap">
          <i class="pi pi-user input-icon" />
          <input id="name" v-model="form.name" type="text" autocomplete="name"
            placeholder="Kwame Mensah"
            :class="['k-input has-icon', errors.name && 'error']" />
        </div>
        <span v-if="errors.name" class="field-error">
          <i class="pi pi-times-circle" /> {{ errors.name }}
        </span>
      </div>

      <div class="field">
        <label for="reg-email">Email address</label>
        <div class="input-wrap">
          <i class="pi pi-envelope input-icon" />
          <input id="reg-email" v-model="form.email" type="email" autocomplete="email"
            placeholder="you@example.com"
            :class="['k-input has-icon', errors.email && 'error']" />
        </div>
        <span v-if="errors.email" class="field-error">
          <i class="pi pi-times-circle" /> {{ errors.email }}
        </span>
      </div>

      <div class="field">
        <label for="reg-password">Password</label>
        <div class="input-wrap">
          <i class="pi pi-lock input-icon" />
          <input id="reg-password" v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            autocomplete="new-password" placeholder="••••••••"
            :class="['k-input has-icon has-icon-right', errors.password && 'error']" />
          <button type="button" class="toggle-pass" @click="showPass = !showPass" tabindex="-1">
            <i :class="showPass ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>

        <div v-if="form.password" class="strength-meter">
          <div class="strength-bars">
            <div v-for="i in 4" :key="i" class="strength-bar"
              :style="{ background: i <= strength ? strengthMeta?.color : 'var(--border)' }" />
          </div>
          <span v-if="strengthMeta" class="strength-label"
            :style="{ color: strengthMeta.color }">
            {{ strengthMeta.label }}
          </span>
        </div>

        <span v-if="errors.password" class="field-error">
          <i class="pi pi-times-circle" /> {{ errors.password }}
        </span>
      </div>

      <div class="field">
        <label for="confirm">Confirm password</label>
        <div class="input-wrap">
          <i class="pi pi-lock input-icon" />
          <input id="confirm" v-model="form.confirmPassword"
            :type="showPass ? 'text' : 'password'"
            autocomplete="new-password" placeholder="••••••••"
            :class="['k-input has-icon', errors.confirmPassword && 'error']" />
        </div>
        <span v-if="errors.confirmPassword" class="field-error">
          <i class="pi pi-times-circle" /> {{ errors.confirmPassword }}
        </span>
      </div>

      <button type="submit" class="k-btn-primary" :disabled="loading">
        <i v-if="loading" class="pi pi-spin pi-spinner" />
        {{ loading ? 'Creating account…' : 'Create account' }}
      </button>

    </form>

    <p class="switch-link">
      Already have an account?
      <RouterLink :to="{ name: 'Login' }">Sign in</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.heading {
  margin-bottom: 28px;
  padding-bottom: 20px;
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

.field { margin-bottom: 16px; }
.field label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.input-wrap { position: relative; }
.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-disabled);
  font-size: 12px;
  pointer-events: none;
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
  font-size: 12px;
}
.toggle-pass:hover { color: var(--text-primary); }

.strength-meter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar {
  height: 2px;
  flex: 1;
  border-radius: 999px;
  transition: background 0.2s;
}
.strength-label { font-size: 11px; font-weight: 500; min-width: 38px; }

.field-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--error-text);
  margin-top: 5px;
}

.k-btn-primary { margin-top: 8px; }

.switch-link {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 20px;
  margin-bottom: 0;
}
.switch-link a {
  color: var(--brand);
  text-decoration: none;
  font-weight: 500;
}
.switch-link a:hover { text-decoration: underline; }
</style>