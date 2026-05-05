<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter }      from 'vue-router'
import { storefrontApi }            from '@/api/storefront'
import { formatCurrency }           from '@/utils/formatCurrency'
import KSkeleton                    from '@/components/ui/KSkeleton.vue'
import {
  Search, X,
  ShoppingBag, MessageCircle,
  Tag, Package,
  ChevronRight, AlertCircle,
  Loader2,
} from 'lucide-vue-next'

const route  = useRoute()
const router = useRouter()

const { sellerId } = route.params

const store    = ref(null)
const products = ref([])
const loading  = ref(true)
const error    = ref(null)
const search   = ref('')

// ── Fetch ─────────────────────────────────────────────
async function fetchStore() {
  loading.value = true
  error.value   = null
  try {
    const data     = await storefrontApi.getStore(sellerId)
    store.value    = data.store
    products.value = data.products
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// ── Filtered ──────────────────────────────────────────
const filtered = computed(() => {
  if (!search.value.trim()) return products.value
  const q = search.value.trim().toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  )
})

const inStock    = computed(() => filtered.value.filter(p => p.stock !== 0))
const outOfStock = computed(() => filtered.value.filter(p => p.stock === 0))
const allSorted  = computed(() => [...inStock.value, ...outOfStock.value])

// ── Navigation ────────────────────────────────────────
function goToProduct(product) {
  router.push({
    name:   'ProductDetail',
    params: { sellerId, productId: product.id },
  })
}

function openWhatsApp() {
  if (!store.value?.whatsapp) return
  const phone = store.value.whatsapp.replace(/\D/g, '')
  const text  = encodeURIComponent(`Hi, I found your store on Kweek and I have a question.`)
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}

// ── Cover image ───────────────────────────────────────
function coverImage(product) {
  return product.images?.find(i => i.is_cover)?.url ??
         product.images?.[0]?.url ??
         null
}

onMounted(() => fetchStore())
</script>

<template>
  <div class="storefront">

    <!-- ── Loading ──────────────────────────────────── -->
    <div v-if="loading" class="state-center">
      <Loader2 :size="22" :stroke-width="1.5" class="spinning" />
    </div>

    <!-- ── Error ────────────────────────────────────── -->
    <div v-else-if="error" class="state-center">
      <AlertCircle :size="32" :stroke-width="1.5" class="error-icon" />
      <p class="state-title">Store not found</p>
      <p class="state-sub">This store may no longer be available.</p>
    </div>

    <!-- ── Store ─────────────────────────────────────── -->
    <template v-else>

      <!-- Header -->
      <header class="store-header">
        <!-- Banner -->
        <div class="store-banner">
          <img
            v-if="store.banner_url"
            :src="store.banner_url"
            :alt="store.name"
            class="banner-img"
          />
          <div v-else class="banner-placeholder" />
        </div>

        <!-- Identity bar -->
        <div class="identity-bar">
          <div class="identity-inner">
            <div class="store-logo-wrap">
              <img
                v-if="store.logo_url"
                :src="store.logo_url"
                :alt="store.name"
                class="store-logo"
              />
              <span v-else class="store-logo-initials">
                {{ store.name?.[0] ?? 'S' }}
              </span>
            </div>

            <div class="store-info">
              <h1 class="store-name">{{ store.name }}</h1>
              <p v-if="store.description" class="store-desc">
                {{ store.description }}
              </p>
              <div class="store-meta">
                <span class="meta-chip">
                  <Package :size="11" :stroke-width="2" />
                  {{ products.length }} products
                </span>
              </div>
            </div>

            <button
              v-if="store.whatsapp"
              class="whatsapp-btn"
              @click="openWhatsApp"
            >
              <MessageCircle :size="14" :stroke-width="2" />
              WhatsApp
            </button>
          </div>
        </div>
      </header>

      <!-- Search + content -->
      <div class="store-body">
        <div class="store-body-inner">

          <!-- Search bar -->
          <div class="search-bar">
            <div class="search-wrap">
              <Search :size="14" :stroke-width="1.8" class="search-icon" />
              <input
                v-model="search"
                type="search"
                :placeholder="`Search ${store.name}...`"
                class="search-input"
              />
              <button
                v-if="search"
                class="search-clear"
                @click="search = ''"
              >
                <X :size="13" :stroke-width="2" />
              </button>
            </div>
          </div>

          <!-- Empty search -->
          <div v-if="filtered.length === 0" class="empty-search">
            <ShoppingBag :size="28" :stroke-width="1.3" class="empty-icon" />
            <p class="empty-title">No products found</p>
            <p class="empty-sub">Try a different search term</p>
            <button class="empty-clear" @click="search = ''">Clear search</button>
          </div>

          <!-- Product grid -->
          <div v-else class="products-grid">
            <article
              v-for="product in allSorted"
              :key="product.id"
              :class="['product-card', product.stock === 0 && 'product-card--sold-out']"
              @click="product.stock !== 0 && goToProduct(product)"
            >
              <!-- Image -->
              <div class="card-image">
                <img
                  v-if="coverImage(product)"
                  :src="coverImage(product)"
                  :alt="product.name"
                  class="card-img"
                  loading="lazy"
                />
                <div v-else class="card-img-empty">
                  <ShoppingBag :size="24" :stroke-width="1.2" />
                </div>

                <!-- Sold out overlay -->
                <div v-if="product.stock === 0" class="sold-out-overlay">
                  <span class="sold-out-label">Out of stock</span>
                </div>

                <!-- Low stock badge -->
                <span
                  v-else-if="product.stock !== null && product.stock <= 3"
                  class="low-stock-badge"
                >
                  Only {{ product.stock }} left
                </span>

                <!-- Multi-image indicator -->
                <span
                  v-if="product.images?.length > 1"
                  class="img-count"
                >
                  <Tag :size="9" :stroke-width="2" />
                  {{ product.images.length }}
                </span>
              </div>

              <!-- Info -->
              <div class="card-body">
                <h2 class="card-name">{{ product.name }}</h2>
                <p v-if="product.description" class="card-desc">
                  {{ product.description }}
                </p>

                <!-- Variants -->
                <div v-if="product.sizes?.length || product.colors?.length" class="card-variants">
                  <span v-if="product.sizes?.length" class="variant-tag">
                    {{ product.sizes.length }} size{{ product.sizes.length > 1 ? 's' : '' }}
                  </span>
                  <span v-if="product.colors?.length" class="variant-tag">
                    {{ product.colors.length }} color{{ product.colors.length > 1 ? 's' : '' }}
                  </span>
                </div>

                <!-- Footer -->
                <div class="card-footer">
                  <span class="card-price">{{ formatCurrency(product.price) }}</span>
                  <div v-if="product.stock !== 0" class="card-cta">
                    Order
                    <ChevronRight :size="13" :stroke-width="2" />
                  </div>
                </div>
              </div>
            </article>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <footer class="store-footer">
        <p class="footer-text">
          Powered by <span class="footer-brand">Kweek</span>
        </p>
      </footer>

    </template>
  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────── */
.storefront {
  min-height: 100vh;
  background: var(--bg-sunken);
  display: flex;
  flex-direction: column;
}

/* ── States ──────────────────────────────────────────── */
.state-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  text-align: center;
}
.spinning {
  animation: spin 1s linear infinite;
  color: var(--text-muted);
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-icon { color: var(--text-disabled); }
.state-title { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0; }
.state-sub   { font-size: 13px; color: var(--text-muted); margin: 0; }

/* ── Store header ────────────────────────────────────── */
.store-header {
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
}

/* Banner */
.store-banner {
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--bg-surface) 0%,
    var(--bg-sunken)  100%
  );
}

/* Identity bar */
.identity-bar {
  border-top: 1px solid var(--border);
}
.identity-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* Logo */
.store-logo-wrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: var(--bg-surface);
  overflow: hidden;
  flex-shrink: 0;
  margin-top: -38px;
  position: relative;
  z-index: 1;
}
.store-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.store-logo-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--brand);
  background: var(--brand-light);
}

/* Info */
.store-info { flex: 1; min-width: 0; }
.store-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.4px;
  margin: 0 0 4px;
  line-height: 1.2;
}
.store-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 10px;
  max-width: 520px;
}
.store-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
}

/* WhatsApp */
.whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #25D366;
  background: none;
  color: #25D366;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.whatsapp-btn:hover {
  background: #25D366;
  color: #fff;
}

/* ── Store body ──────────────────────────────────────── */
.store-body { flex: 1; }
.store-body-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Search ──────────────────────────────────────────── */
.search-bar { width: 100%; max-width: 440px; }
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-disabled);
  pointer-events: none;
  flex-shrink: 0;
}
.search-input {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--bg-page);
  padding: 0 40px 0 38px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.search-input::placeholder { color: var(--text-disabled); }
.search-clear {
  position: absolute;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  border: none;
  background: var(--bg-surface);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.search-clear:hover { background: var(--border); }

/* ── Empty search ────────────────────────────────────── */
.empty-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 20px;
  text-align: center;
}
.empty-icon  { color: var(--text-disabled); margin-bottom: 4px; }
.empty-title { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0; }
.empty-sub   { font-size: 13px; color: var(--text-muted); margin: 0; }
.empty-clear {
  height: 34px;
  padding: 0 16px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  transition: background 0.15s;
}
.empty-clear:hover { background: var(--bg-surface); }

/* ── Product grid ────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

/* ── Product card ────────────────────────────────────── */
.product-card {
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 11px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
  display: flex;
  flex-direction: column;
}
.product-card:not(.product-card--sold-out):hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
.product-card--sold-out {
  cursor: default;
  opacity: 0.65;
}

/* Image */
.card-image {
  position: relative;
  aspect-ratio: 1;
  background: var(--bg-surface);
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}
.product-card:not(.product-card--sold-out):hover .card-img {
  transform: scale(1.04);
}
.card-img-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
}

.sold-out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sold-out-label {
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}

.low-stock-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--status-pending-bg);
  color: var(--status-pending-text);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid var(--status-pending-text);
}

.img-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 10px;
}

/* Card body */
.card-body {
  padding: 13px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Variants */
.card-variants {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.variant-tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
.card-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}
.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--brand);
}

/* ── Footer ──────────────────────────────────────────── */
.store-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}
.footer-text {
  font-size: 12px;
  color: var(--text-disabled);
  margin: 0;
}
.footer-brand {
  font-weight: 600;
  color: var(--brand);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .store-banner { height: 120px; }
  .identity-inner { padding: 16px; gap: 12px; }
  .store-logo-wrap {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-top: -28px;
  }
  .store-logo-initials { font-size: 18px; }
  .store-name { font-size: 16px; }
  .whatsapp-btn { display: none; }
  .store-body-inner { padding: 16px 14px 40px; }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .card-body { padding: 10px 11px 11px; }
  .card-name { font-size: 13px; }
}

@media (max-width: 360px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>