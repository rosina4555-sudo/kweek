<script setup>
import { ref }     from 'vue'
import { ImagePlus, X, Star, GripVertical } from 'lucide-vue-next'

const props = defineProps({
  images:    { type: Array,  required: true },
  maxImages: { type: Number, default: 5     },
  maxSizeMb: { type: Number, default: 3     },
})

const emit = defineEmits(['add', 'remove', 'set-cover', 'reorder'])

const dropzone   = ref(null)
const fileInput  = ref(null)
const isDragging = ref(false)
const draggingIdx = ref(null)
const overIdx     = ref(null)

function onFileChange(e) {
  if (e.target.files?.length) emit('add', e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) emit('add', files)
}

// Drag-to-reorder
function onDragStart(idx) { draggingIdx.value = idx }
function onDragOver(idx)  { overIdx.value = idx }
function onDragEnd() {
  if (draggingIdx.value !== null && overIdx.value !== null && draggingIdx.value !== overIdx.value) {
    emit('reorder', draggingIdx.value, overIdx.value)
  }
  draggingIdx.value = null
  overIdx.value     = null
}

const remaining = (n) => props.maxImages - n
</script>

<template>
  <div class="image-upload">

    <!-- Uploaded images -->
    <div v-if="images.length > 0" class="gallery">
      <div
        v-for="(img, idx) in images"
        :key="img.id"
        :class="['gallery-item', img.is_cover && 'gallery-item--cover', overIdx === idx && draggingIdx !== idx && 'gallery-item--over']"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragover.prevent="onDragOver(idx)"
        @dragend="onDragEnd"
      >
        <img :src="img.url" :alt="`Image ${idx + 1}`" class="gallery-img" />

        <div class="gallery-overlay">
          <button
            v-if="!img.is_cover"
            class="ov-btn ov-btn--star"
            title="Set as cover"
            @click="emit('set-cover', img.id)"
          >
            <Star :size="12" :stroke-width="2" />
          </button>
          <button
            class="ov-btn ov-btn--remove"
            title="Remove"
            @click="emit('remove', img.id)"
          >
            <X :size="12" :stroke-width="2.5" />
          </button>
        </div>

        <!-- Cover label -->
        <span v-if="img.is_cover" class="cover-label">Cover</span>

        <!-- Drag handle -->
        <div class="drag-handle" title="Drag to reorder">
          <GripVertical :size="12" :stroke-width="2" />
        </div>
      </div>

      <!-- Add more slot -->
      <button
        v-if="images.length < maxImages"
        class="gallery-add"
        @click="fileInput.click()"
        :title="`Add up to ${remaining(images.length)} more`"
      >
        <ImagePlus :size="18" :stroke-width="1.5" />
        <span>Add more</span>
      </button>
    </div>

    <!-- Empty dropzone -->
    <div
      v-else
      :class="['dropzone', isDragging && 'dropzone--active']"
      @click="fileInput.click()"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
    >
      <div class="dropzone-inner">
        <div class="dropzone-icon">
          <ImagePlus :size="22" :stroke-width="1.5" />
        </div>
        <p class="dropzone-title">Drop images here or click to upload</p>
        <p class="dropzone-hint">
          JPG, PNG or WebP · Max {{ maxSizeMb }}MB each · Up to {{ maxImages }} images
        </p>
      </div>
    </div>

    <!-- Limits row -->
    <div v-if="images.length > 0" class="limits-row">
      <span class="limit-text">
        {{ images.length }} / {{ maxImages }} images
        <template v-if="images.length >= maxImages"> · Limit reached</template>
      </span>
      <span class="limit-hint">Drag images to reorder · First image is the cover</span>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped>
.image-upload { display: flex; flex-direction: column; gap: 8px; }

/* ── Dropzone ────────────────────────────────────────── */
.dropzone {
  border: 1.5px dashed var(--border-strong);
  border-radius: 9px;
  background: var(--bg-surface);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  padding: 32px 20px;
}
.dropzone:hover,
.dropzone--active {
  border-color: var(--brand);
  background: var(--brand-light);
}
.dropzone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.dropzone-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-page);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.dropzone-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.dropzone-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Gallery ─────────────────────────────────────────── */
.gallery {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--border);
  cursor: grab;
  transition: border-color 0.15s, transform 0.15s;
}
.gallery-item:active { cursor: grabbing; }
.gallery-item--cover { border-color: var(--brand); }
.gallery-item--over  { transform: scale(1.03); border-color: var(--brand); }

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Overlay — shown on hover */
.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 4px;
  padding: 5px;
  opacity: 0;
  transition: opacity 0.15s;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }

.ov-btn {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.ov-btn--star   { background: rgba(255,255,255,0.2); color: #FCD34D; }
.ov-btn--star:hover   { background: rgba(255,255,255,0.35); }
.ov-btn--remove { background: rgba(220,38,38,0.8);  color: #fff; }
.ov-btn--remove:hover { background: rgba(220,38,38,1); }

.cover-label {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: var(--brand);
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.drag-handle {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: rgba(255,255,255,0.5);
  opacity: 0;
  transition: opacity 0.15s;
}
.gallery-item:hover .drag-handle { opacity: 1; }

/* Add more button */
.gallery-add {
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1.5px dashed var(--border-strong);
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.gallery-add:hover {
  border-color: var(--brand);
  color: var(--brand);
  background: var(--brand-light);
}

/* Limits row */
.limits-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.limit-text {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
.limit-hint {
  font-size: 11px;
  color: var(--text-disabled);
}
</style>