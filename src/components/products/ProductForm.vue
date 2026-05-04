<script setup>
import { X }               from 'lucide-vue-next'
import KInput              from '@/components/ui/KInput.vue'
import KButton             from '@/components/ui/KButton.vue'
import ProductImageUpload  from './ProductImageUpload.vue'

const props = defineProps({
  form:       { type: Object,  required: true },
  formErrors: { type: Object,  required: true },
  editingId:  { type: Number,  default: null  },
  saving:     { type: Boolean, default: false },
  deleting:   { type: Boolean, default: false },
  sizeInput:  { type: String,  default: ''    },
  colorInput: { type: String,  default: ''    },
  maxImages:  { type: Number,  default: 5     },
  maxSizeMb:  { type: Number,  default: 3     },
})

const emit = defineEmits([
  'save', 'delete', 'cancel',
  'add-size', 'remove-size', 'update:sizeInput',
  'add-color', 'remove-color', 'update:colorInput',
  'add-images', 'remove-image', 'set-cover', 'reorder-images',
])

function onSizeKey(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    emit('add-size')
  }
}
function onColorKey(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    emit('add-color')
  }
}
</script>

<template>
  <div class="product-form">

    <!-- Images -->
    <div class="form-section">
      <p class="form-section-label">Product images</p>
      <ProductImageUpload
        :images="form.images"
        :max-images="maxImages"
        :max-size-mb="maxSizeMb"
        @add="emit('add-images', $event)"
        @remove="emit('remove-image', $event)"
        @set-cover="emit('set-cover', $event)"
        @reorder="emit('reorder-images', $event[0], $event[1])"
      />
    </div>

    <!-- Basic info -->
    <div class="form-section">
      <p class="form-section-label">Basic info</p>

      <div class="field">
        <label>Product name <span class="required">*</span></label>
        <KInput
          v-model="form.name"
          placeholder="e.g. Ankara Wrap Dress"
          :error="formErrors.name"
        />
      </div>

      <div class="field">
        <label>Description</label>
        <textarea
          v-model="form.description"
          class="k-textarea"
          rows="3"
          placeholder="Describe your product — material, style, what makes it special..."
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Price (GH₵) <span class="required">*</span></label>
          <KInput
            v-model="form.price"
            type="number"
            placeholder="0.00"
            :error="formErrors.price"
          />
        </div>
        <div class="field">
          <label>Stock quantity</label>
          <KInput
            v-model="form.stock"
            type="number"
            placeholder="Leave blank if unlimited"
            :error="formErrors.stock"
          />
        </div>
      </div>
    </div>

    <!-- Variants -->
    <div class="form-section">
      <p class="form-section-label">Variants</p>
      <p class="form-section-hint">
        Add the options buyers can choose from. Type and press Enter or comma to add.
      </p>

      <!-- Sizes -->
      <div class="field">
        <label>Sizes</label>
        <div class="tag-input-wrap">
          <div class="tags" v-if="form.sizes.length">
            <span v-for="size in form.sizes" :key="size" class="tag">
              {{ size }}
              <button type="button" class="tag-remove" @click="emit('remove-size', size)">
                <X :size="10" :stroke-width="2.5" />
              </button>
            </span>
          </div>
          <input
            class="tag-input"
            :value="sizeInput"
            placeholder="e.g. S, M, L, XL or 38, 39, 40..."
            @input="emit('update:sizeInput', $event.target.value)"
            @keydown="onSizeKey"
            @blur="emit('add-size')"
          />
        </div>
        <span class="field-hint">e.g. XS · S · M · L · XL or 38 · 39 · 40</span>
      </div>

      <!-- Colors -->
      <div class="field">
        <label>Colors</label>
        <div class="tag-input-wrap">
          <div class="tags" v-if="form.colors.length">
            <span v-for="color in form.colors" :key="color" class="tag">
              {{ color }}
              <button type="button" class="tag-remove" @click="emit('remove-color', color)">
                <X :size="10" :stroke-width="2.5" />
              </button>
            </span>
          </div>
          <input
            class="tag-input"
            :value="colorInput"
            placeholder="e.g. Red, Blue, Black & Gold..."
            @input="emit('update:colorInput', $event.target.value)"
            @keydown="onColorKey"
            @blur="emit('add-color')"
          />
        </div>
        <span class="field-hint">Press Enter or comma after each option</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <KButton
        v-if="editingId"
        variant="danger"
        size="sm"
        :loading="deleting"
        @click="emit('delete')"
      >
        Delete product
      </KButton>
      <div class="form-actions-right">
        <KButton variant="ghost" size="sm" @click="emit('cancel')">
          Cancel
        </KButton>
        <KButton
          variant="primary"
          size="sm"
          :loading="saving"
          @click="emit('save')"
        >
          {{ editingId ? 'Save changes' : 'Add product' }}
        </KButton>
      </div>
    </div>

  </div>
</template>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Section ─────────────────────────────────────────── */
.form-section {
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-section:first-child { padding-top: 4px; }
.form-section:last-of-type { border-bottom: none; }

.form-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0;
}
.form-section-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: -6px 0 0;
  line-height: 1.5;
}

/* ── Fields ──────────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.required { color: var(--error-text); }
.field-hint {
  font-size: 11px;
  color: var(--text-disabled);
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ── Textarea ────────────────────────────────────────── */
.k-textarea {
  width: 100%;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.k-textarea::placeholder { color: var(--text-disabled); }

/* ── Tag input ───────────────────────────────────────── */
.tag-input-wrap {
  min-height: 38px;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 6px 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  cursor: text;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tag-input-wrap:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}
.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.12s;
}
.tag-remove:hover { color: var(--error-text); }

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  padding: 0;
}
.tag-input::placeholder { color: var(--text-disabled); }

/* ── Form actions ────────────────────────────────────── */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}
.form-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
</style>