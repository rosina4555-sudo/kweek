<script setup>
import { computed } from 'vue'
import { getStatus } from '@/utils/orderStatus'

const props = defineProps({
  status: { type: String, required: true },
})

const meta = computed(() => getStatus(props.status))
</script>

<template>
  <span
    class="badge"
    :style="{
      background:   meta.bg,
      color:        meta.color,
      borderColor:  meta.border,
    }"
  >
    {{ meta.label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 5px;
  /* border: 0px solid; */
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.1px;
}
</style>