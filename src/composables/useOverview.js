import { ref, computed } from 'vue'
import { overviewApi }   from '@/api/overview'
import { useAuthStore }  from '@/stores/auth'
import { useToast }      from '@/composables/useToast'
import { useRouter }     from 'vue-router'

export function useOverview() {
  const auth   = useAuthStore()
  const toast  = useToast()
  const router = useRouter()

  const loading      = ref(false)
  const stats        = ref(null)
  const recentOrders = ref([])
  const activity     = ref([])
  const storeUrl     = ref('')
  const copying      = ref(false)

  async function fetchOverview() {
    loading.value = true
    try {
      const data     = await overviewApi.getOverview()
      stats.value        = data.stats
      recentOrders.value = data.recent_orders
      activity.value     = data.activity
      storeUrl.value     = data.store_url
    } catch (err) {
      toast.error(err.message)
    } finally {
      loading.value = false
    }
  }

  const ordersDelta = computed(() => {
    if (!stats.value) return null
    const diff = stats.value.orders_today - stats.value.orders_yesterday
    if (diff === 0) return { label: 'Same as yesterday', dir: 'neutral' }
    return diff > 0
      ? { label: `${diff} more than yesterday`, dir: 'up' }
      : { label: `${Math.abs(diff)} fewer than yesterday`, dir: 'down' }
  })

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${storeUrl.value}`)
      copying.value = true
      toast.success('Link copied to clipboard')
      setTimeout(() => copying.value = false, 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Shop from my store: https://${storeUrl.value}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function goToOrders() {
    router.push({ name: 'Orders' })
  }

  function goToProducts() {
    router.push({ name: 'Products' })
  }

  return {
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
  }
}