import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  const orders  = ref([])
  const total   = ref(0)
  const revenue = ref(0)
  const loading = ref(false)

  const pendingCount   = computed(() => orders.value.filter(o => o.status === 'pending').length)
  const paidCount      = computed(() => orders.value.filter(o => o.status === 'paid').length)
  const preparingCount = computed(() => orders.value.filter(o => o.status === 'preparing').length)
  const readyCount     = computed(() => orders.value.filter(o => o.status === 'ready').length)
  const deliveredCount = computed(() => orders.value.filter(o => o.status === 'delivered').length)

  function setOrders(data) {
    orders.value  = data.orders
    total.value   = data.total
    revenue.value = data.revenue
  }

  function updateOne(id, changes) {
    const idx = orders.value.findIndex(o => o.id === id)
    if (idx !== -1) orders.value[idx] = { ...orders.value[idx], ...changes }
  }

  return {
    orders, total, revenue, loading,
    pendingCount, paidCount, preparingCount, readyCount, deliveredCount,
    setOrders, updateOne,
  }
})