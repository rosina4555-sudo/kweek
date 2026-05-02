<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/api/auth'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const form      = reactive({ email: '', password: '' })
const errors    = reactive({ email: '', password: '', general: '' })
const loading   = ref(false)
const showPass  = ref(false)

function clearErrors() {
  errors.email = ''
  errors.password = ''
  errors.general = ''
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
  <div>
    <div class="heading">
      <h1>Sign in</h1>
      <p>Enter your credentials to access your dashboard</p>
    </div>

    <div v-if="errors.general" class="alert-error">
      <i class="pi pi-exclamation-circle" />
      {{ errors.general }}
    </div>

    <form @submit.prevent="handleLogin" novalidate>

      <div class="field">
        <label for="email">Email address</label>
        <div class="input-wrap">
          <i class="pi pi-envelope input-icon" />
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
          <i class="pi pi-times-circle" /> {{ errors.email }}
        </span>
      </div>

      <div class="field">
        <div class="label-row">
          <label for="password">Password</label>
        </div>
        <div class="input-wrap">
          <i class="pi pi-lock input-icon" />
          <input
            id="password"
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            :class="['k-input has-icon has-icon-right', errors.password && 'error']"
          />
          <button type="button" class="toggle-pass" @click="showPass = !showPass" tabindex="-1">
            <i :class="showPass ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>
        <span v-if="errors.password" class="field-error">
          <i class="pi pi-times-circle" /> {{ errors.password }}
        </span>
      </div>

      <button type="submit" class="k-btn-primary" :disabled="loading">
        <i v-if="loading" class="pi pi-spin pi-spinner" />
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

    </form>

    <p class="switch-link">
      Don't have an account?
      <RouterLink :to="{ name: 'Register' }">Create one</RouterLink>
    </p>
  </div>
</template>

<style scoped>
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
  line-height: 1;
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

.k-btn-primary { margin-top: 6px; }

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
</style>