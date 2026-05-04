<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter }   from 'vue-router'
import { storefrontApi }         from '@/api/storefront'
import { useCartStore }          from '@/stores/cart'
import { formatCurrency }        from '@/utils/formatCurrency'
import { z }                     from 'zod'
import {
  ChevronLeft, ChevronRight,
  ShoppingBag, Check,
  Phone, MapPin, Truck,
  AlertCircle, Loader2,
  ZoomIn,
} from 'lucide-vue-next'

const route  = useRoute()
const router = useRouter()
const cart   = useCartStore()

const { sellerId, productId } = route.params

// ── Data ──────────────────────────────────────────────
const store   = ref(null)
const product = ref(null)
const loading = ref(true)
const error   = ref(null)

// ── Gallery ───────────────────────────────────────────
const activeImg   = ref(0)
const lightbox    = ref(false)

function prevImg() {
  activeImg.value = activeImg.value === 0
    ? product.value.images.length - 1
    : activeImg.value - 1
}
function nextImg() {
  activeImg.value = activeImg.value === product.value.images.length - 1
    ? 0
    : activeImg.value + 1
}

// ── Order form ────────────────────────────────────────
const orderSchema = z.object({
  buyer_name:  z.string().min(2, 'Please enter your name'),
  buyer_phone: z.string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  delivery_method: z.enum(['pickup', 'delivery'], {
    required_error: 'Please select a delivery method',
  }),
  notes: z.string().optional(),
})

const form = reactive({
  size:            null,
  color:           null,
  quantity:        1,
  buyer_name:      '',
  buyer_phone:     '',
  delivery_method: null,
  notes:           '',
})

const formErrors  = reactive({
  buyer_name: '', buyer_phone: '', delivery_method: '', general: '',
})

const submitting  = ref(false)
const submitted   = ref(false)
const orderId     = ref(null)

// ── Computed ──────────────────────────────────────────
const currentImage = computed(() =>
  product.value?.images?.[activeImg.value] ?? null
)

const lineTotal = computed(() =>
  (product.value?.price ?? 0) * form.quantity
)

const hasVariants = computed(() =>
  product.value?.sizes?.length || product.value?.colors?.length
)

const isOutOfStock = computed(() =>
  product.value?.stock !== null &&
  product.value?.stock !== undefined &&
  product.value?.stock === 0
)

const stockWarning = computed(() => {
  const s = product.value?.stock
  if (s === null || s === undefined) return null
  if (s === 0) return 'Out of stock'
  if (s <= 3)  return `Only ${s} left`
  return null
})

// ── Fetch ─────────────────────────────────────────────
async function fetchProduct() {
  loading.value = true
  error.value   = null
  try {
    const data     = await storefrontApi.getProduct(sellerId, productId)
    store.value    = data.store
    product.value  = data.product

    // Pre-select if only one variant
    if (product.value.sizes?.length === 1)  form.size  = product.value.sizes[0]
    if (product.value.colors?.length === 1) form.color = product.value.colors[0]
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// ── Submit ────────────────────────────────────────────
function clearErrors() {
  Object.keys(formErrors).forEach(k => formErrors[k] = '')
}

async function submitOrder() {
  clearErrors()

  const result = orderSchema.safeParse({
    buyer_name:      form.buyer_name,
    buyer_phone:     form.buyer_phone,
    delivery_method: form.delivery_method,
    notes:           form.notes,
  })

  if (!result.success) {
    result.error.errors.forEach(e => {
      const f = e.path[0]
      if (f in formErrors) formErrors[f] = e.message
    })
    return
  }

  // Scroll to top of form on mobile
  document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })

  submitting.value = true
  try {
    const payload = {
      product_id:      product.value.id,
      quantity:        form.quantity,
      size:            form.size,
      color:           form.color,
      buyer_name:      form.buyer_name.trim(),
      buyer_phone:     form.buyer_phone.trim(),
      delivery_method: form.delivery_method,
      notes:           form.notes.trim(),
      total:           lineTotal.value,
    }

    const order    = await storefrontApi.placeOrder(sellerId, payload)
    orderId.value  = order.id
    submitted.value = true
    cart.setItem(product.value, { size: form.size, color: form.color, quantity: form.quantity })
  } catch (err) {
    formErrors.general = err.message
  } finally {
    submitting.value = false
  }
}

onMounted(() => fetchProduct())
</script>

<template>
  <div class="product-page">

    <!-- ── Loading ──────────────────────────────────── -->
    <div v-if="loading" class="state-center">
      <Loader2 :size="24" :stroke-width="1.5" class="spinning" />
    </div>

    <!-- ── Error ────────────────────────────────────── -->
    <div v-else-if="error" class="state-center">
      <AlertCircle :size="32" :stroke-width="1.5" class="error-icon" />
      <p class="state-title">Product not found</p>
      <p class="state-sub">This product may no longer be available.</p>
    </div>

    <!-- ── Success ───────────────────────────────────── -->
    <div v-else-if="submitted" class="success-page">
      <div class="success-card">
        <div class="success-icon">
          <Check :size="28" :stroke-width="2" />
        </div>
        <h1 class="success-title">Order placed</h1>
        <p class="success-sub">
          Your order has been received. The seller will contact you shortly
          {{ store?.whatsapp ? 'on WhatsApp' : '' }} to confirm.
        </p>

        <div class="success-detail">
          <div class="success-row">
            <span class="sr-label">Order ID</span>
            <span class="sr-val mono">#{{ orderId }}</span>
          </div>
          <div class="success-row">
            <span class="sr-label">Product</span>
            <span class="sr-val">{{ product?.name }}</span>
          </div>
          <div v-if="form.size" class="success-row">
            <span class="sr-label">Size</span>
            <span class="sr-val">{{ form.size }}</span>
          </div>
          <div v-if="form.color" class="success-row">
            <span class="sr-label">Color</span>
            <span class="sr-val">{{ form.color }}</span>
          </div>
          <div class="success-row">
            <span class="sr-label">Quantity</span>
            <span class="sr-val">{{ form.quantity }}</span>
          </div>
          <div class="success-row">
            <span class="sr-label">Total</span>
            <span class="sr-val mono">{{ formatCurrency(lineTotal) }}</span>
          </div>
          <div class="success-row">
            <span class="sr-label">Delivery</span>
            <span class="sr-val">{{ form.delivery_method === 'pickup' ? 'Pickup' : 'Delivery' }}</span>
          </div>
        </div>

        <p class="success-note">
          Payment will be arranged by the seller. Keep your order ID safe.
        </p>

          <a
          v-if="store?.whatsapp"
          :href="`https://wa.me/${store.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, I just placed order #${orderId} for ${product?.name}`)}`"
          target="_blank"
          class="whatsapp-btn"
        >
          Message seller on WhatsApp
        </a>

        <!-- after the whatsapp-btn -->
<RouterLink
  to="{ name: 'Overview', params: { sellerId } }"
  class="back-btn"
>
  Browse more products
</RouterLink>
      </div>
    </div>

    <!-- ── Product page ──────────────────────────────── -->
    <template v-else>

      <!-- Store bar -->
      <div class="store-bar">
        <div class="store-bar-inner">
          <!-- <RouterLink
  :to="{ name: 'Overview', params: { sellerId } }"
  class="store-back"
>
  <ChevronLeft :size="15" :stroke-width="2" />
</RouterLink> -->
          <div class="store-identity">
            <div class="store-logo">
              <img v-if="store?.logo_url" :src="store.logo_url" :alt="store?.name" />
              <span v-else>{{ store?.name?.[0] ?? 'S' }}</span>
            </div>
            <span class="store-name">{{ store?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Main layout -->
      <div class="product-layout">

        <!-- ── Left: gallery ──────────────────────────── -->
        <div class="gallery-col">

          <!-- Main image -->
          <div class="main-image-wrap" @click="lightbox = true">
            <img
              v-if="currentImage"
              :src="currentImage.url"
              :alt="product?.name"
              class="main-image"
            />
            <div v-else class="main-image-empty">
              <ShoppingBag :size="40" :stroke-width="1.2" />
            </div>

            <!-- Nav arrows -->
            <template v-if="product?.images?.length > 1">
              <button class="img-nav img-nav--prev" @click.stop="prevImg">
                <ChevronLeft :size="16" :stroke-width="2" />
              </button>
              <button class="img-nav img-nav--next" @click.stop="nextImg">
                <ChevronRight :size="16" :stroke-width="2" />
              </button>
              <span class="img-counter">{{ activeImg + 1 }} / {{ product.images.length }}</span>
            </template>

            <!-- Zoom hint -->
            <div class="zoom-hint">
              <ZoomIn :size="12" :stroke-width="2" />
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="product?.images?.length > 1" class="thumbs">
            <button
              v-for="(img, idx) in product.images"
              :key="img.id"
              :class="['thumb', activeImg === idx && 'thumb--active']"
              @click="activeImg = idx"
            >
              <img :src="img.url" :alt="`View ${idx + 1}`" />
            </button>
          </div>

          <!-- Product info below gallery — desktop only -->
          <div class="product-meta">
            <h1 class="product-name">{{ product?.name }}</h1>
            <p class="product-price">{{ formatCurrency(product?.price ?? 0) }}</p>
            <p v-if="product?.description" class="product-desc">
              {{ product.description }}
            </p>

            <div v-if="stockWarning" :class="['stock-badge', isOutOfStock && 'stock-badge--empty']">
              <AlertCircle :size="12" :stroke-width="2" />
              {{ stockWarning }}
            </div>
          </div>
        </div>

        <!-- ── Right: order form ──────────────────────── -->
        <div class="form-col" id="order-form">

          <!-- Product info — mobile only -->
          <div class="product-meta-mobile">
            <h1 class="product-name">{{ product?.name }}</h1>
            <p class="product-price">{{ formatCurrency(product?.price ?? 0) }}</p>
            <p v-if="product?.description" class="product-desc">
              {{ product.description }}
            </p>
            <div v-if="stockWarning" :class="['stock-badge', isOutOfStock && 'stock-badge--empty']">
              <AlertCircle :size="12" :stroke-width="2" />
              {{ stockWarning }}
            </div>
          </div>

          <div class="order-card">

            <!-- General error -->
            <div v-if="formErrors.general" class="form-error-banner">
              <AlertCircle :size="13" :stroke-width="2" />
              {{ formErrors.general }}
            </div>

            <!-- Size selection -->
            <div v-if="product?.sizes?.length" class="form-section">
              <p class="form-label">Size</p>
              <div class="option-grid">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  :class="['option-btn', form.size === size && 'option-btn--active']"
                  @click="form.size = size"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Color selection -->
            <div v-if="product?.colors?.length" class="form-section">
              <p class="form-label">Color</p>
              <div class="option-grid">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  :class="['option-btn', form.color === color && 'option-btn--active']"
                  @click="form.color = color"
                >
                  {{ color }}
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="form-section">
              <p class="form-label">Quantity</p>
              <div class="qty-control">
                <button
                  class="qty-btn"
                  :disabled="form.quantity <= 1"
                  @click="form.quantity = Math.max(1, form.quantity - 1)"
                >
                  <span>−</span>
                </button>
                <span class="qty-val">{{ form.quantity }}</span>
                <button
                  class="qty-btn"
                  :disabled="product?.stock !== null && form.quantity >= product?.stock"
                  @click="form.quantity++"
                >
                  <span>+</span>
                </button>
              </div>
            </div>

            <div class="divider" />

            <!-- Buyer name -->
            <div class="form-section">
              <label class="form-label" for="buyer-name">Your name <span class="req">*</span></label>
              <div :class="['form-input-wrap', formErrors.buyer_name && 'form-input-wrap--error']">
                <input
                  id="buyer-name"
                  v-model="form.buyer_name"
                  type="text"
                  placeholder="Full name"
                  class="form-input"
                  autocomplete="name"
                />
              </div>
              <p v-if="formErrors.buyer_name" class="field-error">
                {{ formErrors.buyer_name }}
              </p>
            </div>

            <!-- Phone -->
            <div class="form-section">
              <label class="form-label" for="buyer-phone">Phone number</label>
              <div :class="['form-input-wrap', formErrors.buyer_phone && 'form-input-wrap--error']">
                <Phone :size="13" :stroke-width="1.8" class="input-icon" />
                <input
                  id="buyer-phone"
                  v-model="form.buyer_phone"
                  type="tel"
                  placeholder="+233 24 000 0000"
                  class="form-input form-input--icon"
                  autocomplete="tel"
                />
              </div>
              <p v-if="formErrors.buyer_phone" class="field-error">
                {{ formErrors.buyer_phone }}
              </p>
            </div>

            <!-- Delivery method -->
            <div class="form-section">
              <p class="form-label">Delivery method <span class="req">*</span></p>
              <div class="delivery-options">
                <button
                  :class="['delivery-opt', form.delivery_method === 'pickup' && 'delivery-opt--active']"
                  @click="form.delivery_method = 'pickup'"
                >
                  <div class="delivery-opt-icon">
                    <MapPin :size="15" :stroke-width="1.8" />
                  </div>
                  <div>
                    <span class="delivery-opt-label">Pickup</span>
                    <span class="delivery-opt-sub">Collect from seller</span>
                  </div>
                  <div v-if="form.delivery_method === 'pickup'" class="delivery-check">
                    <Check :size="11" :stroke-width="2.5" />
                  </div>
                </button>

                <button
                  :class="['delivery-opt', form.delivery_method === 'delivery' && 'delivery-opt--active']"
                  @click="form.delivery_method = 'delivery'"
                >
                  <div class="delivery-opt-icon">
                    <Truck :size="15" :stroke-width="1.8" />
                  </div>
                  <div>
                    <span class="delivery-opt-label">Delivery</span>
                    <span class="delivery-opt-sub">Delivered to you</span>
                  </div>
                  <div v-if="form.delivery_method === 'delivery'" class="delivery-check">
                    <Check :size="11" :stroke-width="2.5" />
                  </div>
                </button>
              </div>
              <p v-if="formErrors.delivery_method" class="field-error">
                {{ formErrors.delivery_method }}
              </p>
            </div>

            <!-- Notes -->
            <div class="form-section">
              <label class="form-label" for="notes">Note to seller</label>
              <textarea
                id="notes"
                v-model="form.notes"
                class="form-textarea"
                rows="2"
                placeholder="Delivery address, special requests..."
              />
            </div>

            <!-- Order summary -->
            <div class="order-summary">
              <div class="summary-row">
                <span class="summary-label">{{ product?.name }}</span>
                <span class="summary-val">{{ formatCurrency(product?.price ?? 0) }}</span>
              </div>
              <div v-if="form.quantity > 1" class="summary-row">
                <span class="summary-label">Quantity</span>
                <span class="summary-val">× {{ form.quantity }}</span>
              </div>
              <div class="summary-divider" />
              <div class="summary-row summary-row--total">
                <span class="summary-label">Total</span>
                <span class="summary-val summary-val--total">{{ formatCurrency(lineTotal) }}</span>
              </div>
              <p class="summary-note">
                Payment is arranged separately by the seller after your order is confirmed.
              </p>
            </div>

            <!-- Submit -->
            <button
              class="submit-btn"
              :disabled="submitting || isOutOfStock"
              @click="submitOrder"
            >
              <Loader2 v-if="submitting" :size="15" :stroke-width="2" class="spinning" />
              <ShoppingBag v-else :size="15" :stroke-width="2" />
              {{ submitting ? 'Placing order…' : isOutOfStock ? 'Out of stock' : 'Place order' }}
            </button>

          </div>
        </div>
      </div>
    </template>

    <!-- Lightbox -->
    <Transition name="t-lightbox">
      <div v-if="lightbox" class="lightbox" @click="lightbox = false">
        <button class="lightbox-close" @click="lightbox = false">
          <ChevronLeft :size="16" :stroke-width="2" />
          Close
        </button>
        <img
          :src="currentImage?.url"
          :alt="product?.name"
          class="lightbox-img"
          @click.stop
        />
        <div class="lightbox-nav" @click.stop>
          <button class="lightbox-btn" @click="prevImg">
            <ChevronLeft :size="18" :stroke-width="2" />
          </button>
          <span class="lightbox-counter">{{ activeImg + 1 }} / {{ product?.images?.length }}</span>
          <button class="lightbox-btn" @click="nextImg">
            <ChevronRight :size="18" :stroke-width="2" />
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────── */
.product-page {
  min-height: 100vh;
  background: var(--bg-sunken);
}

/* ── States ──────────────────────────────────────────── */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 100vh;
  padding: 40px;
  text-align: center;
}
.spinning {
  animation: spin 1s linear infinite;
  color: var(--text-muted);
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-icon { color: var(--text-disabled); }
.state-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.state-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Store bar ───────────────────────────────────────── */

.store-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-decoration: none;
  margin-right: 10px;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.store-back:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.store-bar {
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 20;
}
.store-bar-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
}
.store-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}
.store-logo {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  /* background: #1E1B4B; */
  border: 1px solid #312E81;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* color: #A5B4FC; */
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}
.store-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.store-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

/* ── Layout ──────────────────────────────────────────── */
.product-layout {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 40px;
  align-items: start;
}

/* ── Gallery ─────────────────────────────────────────── */
.gallery-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 72px;
}

.main-image-wrap {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  cursor: zoom-in;
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}
.main-image-wrap:hover .main-image { transform: scale(1.02); }

.main-image-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
}

.img-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;
}
.main-image-wrap:hover .img-nav { opacity: 1; }
.img-nav--prev { left: 10px; }
.img-nav--next { right: 10px; }
.img-nav:hover { background: var(--bg-surface); }

.img-counter {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
}

.zoom-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.main-image-wrap:hover .zoom-hint { opacity: 1; }

.thumbs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--border);
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.15s;
  flex-shrink: 0;
}
.thumb--active { border-color: var(--brand); }
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Product meta (desktop — below gallery) ──────────── */
.product-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.product-meta-mobile { display: none; }

.product-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.4px;
  margin: 0;
  line-height: 1.3;
}
.product-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin: 0;
}
.product-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--status-pending-text);
}
.stock-badge--empty { color: var(--error-text); }

/* ── Order card ──────────────────────────────────────── */
.form-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.order-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Form sections ───────────────────────────────────── */
.form-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}
.req { color: var(--error-text); }

.form-error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--error-bg);
  border-bottom: 1px solid var(--error-border);
  font-size: 12px;
  color: var(--error-text);
}

/* ── Options ─────────────────────────────────────────── */
.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.option-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.option-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
.option-btn--active {
  border-color: var(--brand);
  background: var(--brand-light);
  color: var(--brand);
}

/* ── Quantity ────────────────────────────────────────── */
.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.qty-btn:hover:not(:disabled) { background: var(--bg-sunken); }
.qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-val {
  width: 44px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Divider ─────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--border);
}

/* ── Inputs ──────────────────────────────────────────── */
.form-input-wrap {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-page);
  display: flex;
  align-items: center;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input-wrap:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.form-input-wrap--error { border-color: var(--error-border); }

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--text-disabled);
  pointer-events: none;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  height: 40px;
  border: none;
  background: transparent;
  padding: 0 14px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
}
.form-input--icon { padding-left: 36px; }
.form-input::placeholder { color: var(--text-disabled); }

.form-textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  background: var(--bg-page);
  outline: none;
  resize: none;
  line-height: 1.6;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.form-textarea::placeholder { color: var(--text-disabled); }

.field-error {
  font-size: 11px;
  color: var(--error-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Delivery options ────────────────────────────────── */
.delivery-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.delivery-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}
.delivery-opt:hover { border-color: var(--border-strong); }
.delivery-opt--active {
  border-color: var(--brand);
  background: var(--brand-light);
}

.delivery-opt-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}
.delivery-opt--active .delivery-opt-icon {
  background: var(--brand);
  color: #fff;
}

.delivery-opt-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 3px;
}
.delivery-opt-sub {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
}

.delivery-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}




/* ── Order summary ───────────────────────────────────── */
.order-summary {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.summary-label {
  font-size: 12px;
  color: var(--text-muted);
}
.summary-val {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}
.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 2px 0;
}
.summary-row--total .summary-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.summary-val--total {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.3px;
}
.summary-note {
  font-size: 11px;
  color: var(--text-disabled);
  margin: 0;
  line-height: 1.5;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42px;
  background: none;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.back-btn:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* ── Submit button ───────────────────────────────────── */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 50px;
  background: var(--brand);
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.1px;
  transition: background 0.15s, opacity 0.15s;
}
.submit-btn:hover:not(:disabled) { background: var(--brand-hover); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* ── Success page ────────────────────────────────────── */
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-sunken);
}
.success-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}
.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 24px;
  background: var(--status-paid-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  /* color: var(--status-paid-text); */
}
.success-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
}
.success-sub {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}
.success-detail {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 9px;
  overflow: hidden;
}
.success-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}
.success-row:last-child { border-bottom: none; }
.sr-label {
  font-size: 12px;
  color: var(--text-muted);
}
.sr-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.sr-val.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.success-note {
  font-size: 11px;
  color: var(--text-disabled);
  margin: 0;
  line-height: 1.5;
}
.whatsapp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42px;
  background: #25D366;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}
.whatsapp-btn:hover { opacity: 0.9; }

/* ── Lightbox ────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}
.lightbox-close {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 7px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.18); }
.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}
.lightbox-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}
.lightbox-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.lightbox-btn:hover { background: rgba(255,255,255,0.2); }
.lightbox-counter { font-size: 13px; color: rgba(255,255,255,0.6); }

.t-lightbox-enter-active, .t-lightbox-leave-active { transition: opacity 0.2s; }
.t-lightbox-enter-from,  .t-lightbox-leave-to     { opacity: 0; }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .product-layout {
    grid-template-columns: 1fr;
    padding: 0 0 60px;
    gap: 0;
  }
  .gallery-col {
    position: static;
    gap: 8px;
    padding: 16px 16px 0;
  }
  .main-image-wrap { border-radius: 10px; }
  .product-meta    { display: none; }
  .product-meta-mobile {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 16px 0;
  }
  .form-col { padding: 16px; }
  .order-card { border-radius: 10px; }
  .success-card { padding: 28px 20px; }
}

@media (max-width: 420px) {
  .delivery-options { grid-template-columns: 1fr; }
  .store-bar-inner  { padding: 10px 16px; }
}
</style>