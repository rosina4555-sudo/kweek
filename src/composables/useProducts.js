import { ref, computed }      from 'vue'
import { productsApi }        from '@/api/products'
import { useProductsStore }   from '@/stores/products'
import { useToast }           from '@/composables/useToast'
import { useAuthStore }       from '@/stores/auth'

const MAX_IMAGES    = 5
const MAX_SIZE_MB   = 3
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function useProducts() {
  const store = useProductsStore()
  const toast = useToast()
  const auth  = useAuthStore()

  // ── Drawer state ──────────────────────────────────────
  const drawerOpen   = ref(false)
  const editingId    = ref(null)
  const saving       = ref(false)
  const deleting     = ref(false)

  // ── Filter / select ───────────────────────────────────
  const search       = ref('')
  const filterStatus = ref('all') // all | active | inactive
  const selected     = ref(new Set())
  const selectMode   = ref(false)

  // ── Form state ────────────────────────────────────────
  const emptyForm = () => ({
    name:        '',
    description: '',
    price:       '',
    stock:       '',
    sizes:       [],
    colors:      [],
    images:      [],
  })

  const form       = ref(emptyForm())
  const formErrors = ref({})
  const sizeInput  = ref('')
  const colorInput = ref('')

  // ── Filtered products ─────────────────────────────────
  const filtered = computed(() => {
    let list = store.products

    if (filterStatus.value === 'active')   list = list.filter(p => p.is_active)
    if (filterStatus.value === 'inactive') list = list.filter(p => !p.is_active)

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }

    return list
  })

  // ── Fetch ─────────────────────────────────────────────
  async function fetchProducts() {
    store.loading = true
    try {
      const data = await productsApi.getProducts()
      store.setProducts(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      store.loading = false
    }
  }

  // ── Drawer ────────────────────────────────────────────
  function openCreate() {
    editingId.value  = null
    form.value       = emptyForm()
    formErrors.value = {}
    sizeInput.value  = ''
    colorInput.value = ''
    drawerOpen.value = true
  }

  function openEdit(product) {
    editingId.value  = product.id
    form.value = {
      name:        product.name,
      description: product.description,
      price:       product.price,
      stock:       product.stock,
      sizes:       [...product.sizes],
      colors:      [...product.colors],
      images:      [...product.images],
    }
    formErrors.value = {}
    sizeInput.value  = ''
    colorInput.value = ''
    drawerOpen.value = true
  }

  function closeDrawer() {
    drawerOpen.value = false
  }

  // ── Variants ──────────────────────────────────────────
  function addSize() {
    const val = sizeInput.value.trim().toUpperCase()
    if (!val || form.value.sizes.includes(val)) return
    form.value.sizes.push(val)
    sizeInput.value = ''
  }

  function removeSize(size) {
    form.value.sizes = form.value.sizes.filter(s => s !== size)
  }

  function addColor() {
    const val = colorInput.value.trim()
    if (!val || form.value.colors.includes(val)) return
    form.value.colors.push(val)
    colorInput.value = ''
  }

  function removeColor(color) {
    form.value.colors = form.value.colors.filter(c => c !== color)
  }

  // ── Image handling ────────────────────────────────────
  function validateImages(files) {
    const errors = []
    const current = form.value.images.length
    const incoming = Array.from(files)

    if (current + incoming.length > MAX_IMAGES) {
      errors.push(`You can upload a maximum of ${MAX_IMAGES} images per product`)
      return errors
    }

    incoming.forEach(f => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        errors.push(`${f.name} is not a supported format. Use JPG, PNG or WebP`)
      }
      if (f.size > MAX_SIZE_BYTES) {
        errors.push(`${f.name} exceeds the ${MAX_SIZE_MB}MB size limit`)
      }
    })

    return errors
  }

  function addImages(files) {
    const errors = validateImages(files)
    if (errors.length) { errors.forEach(e => toast.error(e)); return }

    Array.from(files).forEach(file => {
      form.value.images.push({
        id:       Date.now() + Math.random(),
        url:      URL.createObjectURL(file),
        file,
        is_cover: form.value.images.length === 0,
      })
    })
  }

  function removeImage(id) {
    form.value.images = form.value.images.filter(img => img.id !== id)
    if (form.value.images.length > 0 && !form.value.images.some(i => i.is_cover)) {
      form.value.images[0].is_cover = true
    }
  }

  function setCover(id) {
    form.value.images.forEach(img => img.is_cover = img.id === id)
  }

  function reorderImages(from, to) {
    const imgs = [...form.value.images]
    imgs.splice(to, 0, imgs.splice(from, 1)[0])
    form.value.images = imgs
  }

  // ── Validation ────────────────────────────────────────
  function validate() {
    const errors = {}
    if (!form.value.name.trim())            errors.name  = 'Product name is required'
    if (!form.value.price || isNaN(form.value.price) || Number(form.value.price) <= 0)
                                             errors.price = 'Enter a valid price'
    if (form.value.stock !== '' && isNaN(form.value.stock))
                                             errors.stock = 'Enter a valid stock number'
    return errors
  }

  // ── Save ──────────────────────────────────────────────
  async function saveProduct() {
    const errors = validate()
    if (Object.keys(errors).length) { formErrors.value = errors; return }

    saving.value = true
    try {
      const payload = {
        name:        form.value.name.trim(),
        description: form.value.description.trim(),
        price:       Number(form.value.price),
        stock:       form.value.stock !== '' ? Number(form.value.stock) : null,
        sizes:       form.value.sizes,
        colors:      form.value.colors,
      }

      let product
      if (editingId.value) {
        product = await productsApi.updateProduct(editingId.value, payload)
      } else {
        product = await productsApi.createProduct(payload)
      }

      store.upsertProduct(product)
      toast.success(editingId.value ? 'Product updated' : 'Product created')
      closeDrawer()
    } catch (err) {
      toast.error(err.message)
    } finally {
      saving.value = false
    }
  }

  // ── Delete ────────────────────────────────────────────
  async function deleteProduct(id) {
    deleting.value = true
    try {
      await productsApi.deleteProduct(id)
      store.removeProduct(id)
      toast.success('Product deleted')
      if (drawerOpen.value) closeDrawer()
    } catch (err) {
      toast.error(err.message)
    } finally {
      deleting.value = false
    }
  }

  // ── Toggle active ─────────────────────────────────────
  async function toggleActive(product) {
    store.toggleActive(product.id)
    try {
      await productsApi.updateProduct(product.id, { is_active: !product.is_active })
      toast.success(product.is_active ? 'Product hidden from store' : 'Product now visible in store')
    } catch (err) {
      store.toggleActive(product.id) // rollback
      toast.error(err.message)
    }
  }

  // ── Share ─────────────────────────────────────────────
  const storeBase = computed(() => {
    const id = auth.sellerId
    return `https://kweek.app/store/${id}`
  })

  async function shareProduct(product) {
    const url = `${storeBase.value}/product/${product.id}`
    await navigator.clipboard.writeText(url)
    toast.success(`Link for "${product.name}" copied`)
  }

  async function shareSelected() {
    const ids   = [...selected.value]
    const names = store.products
      .filter(p => ids.includes(p.id))
      .map(p => `• ${p.name} — ${storeBase.value}/product/${p.id}`)
      .join('\n')

    const text = `Check out my products:\n\n${names}`
    await navigator.clipboard.writeText(text)
    toast.success(`${ids.length} product links copied`)
    clearSelection()
  }

  function shareSelectedWhatsApp() {
    const ids   = [...selected.value]
    const names = store.products
      .filter(p => ids.includes(p.id))
      .map(p => `• ${p.name}: ${storeBase.value}/product/${p.id}`)
      .join('\n')

    const text = encodeURIComponent(`Check out my products:\n\n${names}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
    clearSelection()
  }

  // ── Selection ─────────────────────────────────────────
  function toggleSelect(id) {
    const s = new Set(selected.value)
    s.has(id) ? s.delete(id) : s.add(id)
    selected.value = s
    if (s.size === 0) selectMode.value = false
  }

  function clearSelection() {
    selected.value = new Set()
    selectMode.value = false
  }

  return {
    // state
    drawerOpen, editingId, saving, deleting,
    search, filterStatus, selected, selectMode,
    form, formErrors, sizeInput, colorInput,
    filtered,
    loading:      computed(() => store.loading),
    total:        computed(() => store.total),
    activeCount:  computed(() => store.activeCount),
    outOfStock:   computed(() => store.outOfStock),
    // constants
    MAX_IMAGES, MAX_SIZE_MB,
    // actions
    fetchProducts,
    openCreate, openEdit, closeDrawer,
    addSize, removeSize,
    addColor, removeColor,
    addImages, removeImage, setCover, reorderImages,
    saveProduct, deleteProduct, toggleActive,
    shareProduct, shareSelected, shareSelectedWhatsApp,
    toggleSelect, clearSelection,
  }
}