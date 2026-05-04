<script setup>
import { onMounted, computed } from 'vue'
import { useProducts }         from '@/composables/useProducts'
import ProductCard             from '@/components/products/ProductCard.vue'
import ProductForm             from '@/components/products/ProductForm.vue'
import KDrawer                 from '@/components/ui/KDrawer.vue'
import KButton                 from '@/components/ui/KButton.vue'
import KInput                  from '@/components/ui/KInput.vue'
import KSkeleton               from '@/components/ui/KSkeleton.vue'
import KEmptyState             from '@/components/ui/KEmptyState.vue'
import {
  Plus, Share2, X,
  LayoutGrid, List,
} from 'lucide-vue-next'

const {
  drawerOpen, editingId, saving, deleting,
  search, filterStatus, selected, selectMode,
  form, formErrors, sizeInput, colorInput,
  filtered, loading, total, activeCount, outOfStock,
  MAX_IMAGES, MAX_SIZE_MB,
  fetchProducts,
  openCreate, openEdit, closeDrawer,
  addSize, removeSize,
  addColor, removeColor,
  addImages, removeImage, setCover, reorderImages,
  saveProduct, deleteProduct, toggleActive,
  shareProduct, shareSelected, shareSelectedWhatsApp,
  toggleSelect, clearSelection,
} = useProducts()

const drawerTitle = computed(() =>
  editingId.value ? 'Edit product' : 'Add new product'
)

const tabs = [
  { key: 'all',      label: 'All'      },
  { key: 'active',   label: 'Active'   },
  { key: 'inactive', label: 'Hidden'   },
]

function onSelectMode() {
  selectMode.value = true
}

onMounted(() => fetchProducts())
</script>

<template>
  <div class="products-page">

    <!-- Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Products</h1>
        <p class="page-sub">
          {{ total }} products · {{ activeCount }} active
          <template v-if="outOfStock > 0">
            · <span class="out-stock">{{ outOfStock }} out of stock</span>
          </template>
        </p>
      </div>
      <div class="page-header-right">
        <KButton
          v-if="!selectMode"
          variant="secondary"
          size="sm"
          @click="onSelectMode"
        >
          <Share2 :size="13" :stroke-width="1.8" />
          Share multiple
        </KButton>
        <KButton variant="primary" size="sm" @click="openCreate">
          <Plus :size="14" :stroke-width="2" />
          Add product
        </KButton>
      </div>
    </div>

    <!-- Select mode banner -->
    <Transition name="t-banner">
      <div v-if="selectMode" class="select-banner">
        <span class="select-count">
          {{ selected.size }} product{{ selected.size !== 1 ? 's' : '' }} selected
        </span>
        <div class="select-actions">
          <KButton
            variant="secondary"
            size="sm"
            :disabled="selected.size === 0"
            @click="shareSelected"
          >
            <Share2 :size="13" :stroke-width="1.8" />
            Copy links
          </KButton>
          <KButton
            variant="primary"
            size="sm"
            :disabled="selected.size === 0"
            @click="shareSelectedWhatsApp"
          >
            Share on WhatsApp
          </KButton>
          <KButton variant="ghost" size="sm" @click="clearSelection">
            <X :size="13" :stroke-width="2" />
            Cancel
          </KButton>
        </div>
      </div>
    </Transition>

    <!-- Filters -->
    <div class="filters-bar">
      <KInput
        v-model="search"
        placeholder="Search products..."
        size="sm"
        style="max-width: 240px"
      >
        <template #icon-left>
          <List :size="13" :stroke-width="1.8" />
        </template>
      </KInput>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', filterStatus === tab.key && 'tab--active']"
          @click="filterStatus = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="products-grid">

      <!-- Skeleton -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <KSkeleton width="100%" height="200px" radius="10px 10px 0 0" />
          <div style="padding: 12px; display: flex; flex-direction: column; gap: 8px">
            <KSkeleton width="80%"  height="14px" />
            <KSkeleton width="50%"  height="13px" />
            <KSkeleton width="60%"  height="11px" />
          </div>
        </div>
      </template>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="empty-wrap">
        <KEmptyState
          icon="pi-box"
          title="No products yet"
          description="Add your first product and share it with buyers through your storefront link."
          action-label="Add product"
          @action="openCreate"
        />
      </div>

      <!-- Cards -->
      <ProductCard
        v-else
        v-for="product in filtered"
        :key="product.id"
        :product="product"
        :selected="selected.has(product.id)"
        :select-mode="selectMode"
        @edit="openEdit"
        @share="shareProduct"
        @toggle-active="toggleActive"
        @select="toggleSelect(product.id)"
      />
    </div>

    <!-- Drawer -->
    <KDrawer
      :open="drawerOpen"
      :title="drawerTitle"
      width="520px"
      @close="closeDrawer"
    >
      <ProductForm
        :form="form"
        :form-errors="formErrors"
        :editing-id="editingId"
        :saving="saving"
        :deleting="deleting"
        :size-input="sizeInput"
        :color-input="colorInput"
        :max-images="MAX_IMAGES"
        :max-size-mb="MAX_SIZE_MB"
        @save="saveProduct"
        @delete="deleteProduct(editingId)"
        @cancel="closeDrawer"
        @add-size="addSize"
        @remove-size="removeSize"
        @update:size-input="sizeInput = $event"
        @add-color="addColor"
        @remove-color="removeColor"
        @update:color-input="colorInput = $event"
        @add-images="addImages"
        @remove-image="removeImage"
        @set-cover="setCover"
        @reorder-images="reorderImages"
      />
    </KDrawer>

  </div>
</template>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Header ──────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.page-header-left { display: flex; flex-direction: column; gap: 3px; }
.page-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
}
.page-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.out-stock { color: var(--error-text); font-weight: 500; }

/* ── Select banner ───────────────────────────────────── */
.select-banner {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.select-count {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.select-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-banner-enter-active, .t-banner-leave-active { transition: opacity 0.2s, transform 0.2s; }
.t-banner-enter-from,  .t-banner-leave-to     { opacity: 0; transform: translateY(-8px); }

/* ── Filters ─────────────────────────────────────────── */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 2px;
}
.tab {
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.tab:hover { background: var(--bg-surface); color: var(--text-secondary); }
.tab--active {
  background: var(--bg-surface);
  border-color: var(--border);
  color: var(--text-primary);
}

/* ── Grid ────────────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.skeleton-card {
  border-radius: 10px;
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg-page);
}

.empty-wrap {
  grid-column: 1 / -1;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 640px) {
  .page-header { flex-direction: column; }
  .page-header-right { width: 100%; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .filters-bar { flex-wrap: wrap; }
}

@media (max-width: 380px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>