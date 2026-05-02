import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import router from './router'
import App from './App.vue'
import './style.css'
import 'primeicons/primeicons.css'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(createHead())


app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutside)
  },
})

// ── Re-validate session when user returns to tab ─────────
// Silently refreshes the access token if the tab was idle
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      await auth.refreshAccessToken()
    }
  }
})

app.mount('#app')