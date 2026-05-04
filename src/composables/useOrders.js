import { ref, computed } from 'vue'
import { ordersApi } from '@/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { useToast } from '@/composables/useToast'

export function useOrders() {
  const store  = useOrdersStore()
  const toast  = useToast()

  const search       = ref('')
  const activeStatus = ref('all')
  const selectedId   = ref(null)

  const statusOptions = [
    { value: 'pending',   label: 'Pending'   },
    { value: 'paid',      label: 'Paid'      },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready',     label: 'Ready'     },
    { value: 'delivered', label: 'Delivered' },
  ]

  // ── Filtered orders ──────────────────────────────────
  const filtered = computed(() => {
    let list = store.orders

    if (activeStatus.value !== 'all') {
      list = list.filter(o => o.status === activeStatus.value)
    }

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      list = list.filter(o =>
        o.buyer_name?.toLowerCase().includes(q) ||
        o.id?.toString().includes(q) ||
        o.buyer_phone?.includes(q)
      )
    }

    return list
  })

  const selectedOrder = computed(() =>
    store.orders.find(o => o.id === selectedId.value) ?? null
  )

  // ── Fetch ─────────────────────────────────────────────
  async function fetchOrders(params = {}) {
    store.loading = true
    try {
      const data = await ordersApi.getOrders(params)
      store.setOrders(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      store.loading = false
    }
  }

  // ── Select ────────────────────────────────────────────
  function selectOrder(id) {
    selectedId.value = selectedId.value === id ? null : id
  }

  function clearSelection() {
    selectedId.value = null
  }

  // ── Update status ─────────────────────────────────────
  async function updateStatus(id, status) {
    const prev = store.orders.find(o => o.id === id)?.status
    store.updateOne(id, { status }) // optimistic
    try {
      await ordersApi.updateOrder(id, { status })
      toast.success('Order status updated')
    } catch (err) {
      store.updateOne(id, { status: prev }) // rollback
      toast.error(err.message)
    }
  }

  // ── Mark paid ─────────────────────────────────────────
  async function markPaid(id) {
    await updateStatus(id, 'paid')
  }

  // ── Export CSV ────────────────────────────────────────
  async function exportCSV(params = {}) {
    try {
      const blob = await ordersApi.exportCSV(params)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `kweek-orders-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return {
    // state
    search,
    activeStatus,
    selectedId,
    selectedOrder,
    filtered,
    loading: computed(() => store.loading),
    total:   computed(() => store.total),
    revenue: computed(() => store.revenue),
    // counts
    counts: {
      all:       computed(() => store.orders.length),
      pending:   computed(() => store.pendingCount),
      paid:      computed(() => store.paidCount),
      preparing: computed(() => store.preparingCount),
      ready:     computed(() => store.readyCount),
      delivered: computed(() => store.deliveredCount),
    },
    // options
    statusOptions,
    // actions
    fetchOrders,
    selectOrder,
    clearSelection,
    updateStatus,
    markPaid,
    exportCSV,
  }
}