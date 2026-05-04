import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const total    = ref(0)
  const loading  = ref(false)

  const activeCount   = computed(() => products.value.filter(p => p.is_active).length)
  const inactiveCount = computed(() => products.value.filter(p => !p.is_active).length)
  const outOfStock    = computed(() => products.value.filter(p => p.stock === 0).length)

  function setProducts(data) {
    products.value = data.products
    total.value    = data.total
  }

  function upsertProduct(product) {
    const idx = products.value.findIndex(p => p.id === product.id)
    if (idx !== -1) products.value[idx] = product
    else products.value.unshift(product)
  }

  function removeProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
  }

  function toggleActive(id) {
    const p = products.value.find(p => p.id === id)
    if (p) p.is_active = !p.is_active
  }

  return {
    products, total, loading,
    activeCount, inactiveCount, outOfStock,
    setProducts, upsertProduct, removeProduct, toggleActive,
  }
})