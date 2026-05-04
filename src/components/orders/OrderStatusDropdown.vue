<script setup>
import KDropdown from '@/components/ui/KDropdown.vue'

defineProps({
  modelValue: { type: String, required: true },
  disabled:   { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const options = [
  { value: 'pending',   label: 'Pending'   },
  { value: 'paid',      label: 'Paid'      },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready',     label: 'Ready'     },
  { value: 'delivered', label: 'Delivered' },
]
</script>

<template>
  <KDropdown
    :model-value="modelValue"
    :options="options"
    :disabled="disabled"
    size="sm"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>