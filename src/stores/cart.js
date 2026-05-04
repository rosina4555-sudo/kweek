import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const count = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  function setItem(product, options) {
    items.value = [{
      id:           product.id,
      name:         product.name,
      price:        product.price,
      image:        product.images?.find(i => i.is_cover)?.url ?? null,
      size:         options.size  ?? null,
      color:        options.color ?? null,
      quantity:     options.quantity,
    }]
  }

  function clear() { items.value = [] }

  return { items, total, count, setItem, clear }
})