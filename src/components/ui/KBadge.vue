<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    // pending | paid | preparing | ready | delivered
  },
})

const map = {
  pending:   { label: 'Pending',   class: 'badge--pending'   },
  paid:      { label: 'Paid',      class: 'badge--paid'      },
  preparing: { label: 'Preparing', class: 'badge--preparing' },
  ready:     { label: 'Ready',     class: 'badge--ready'     },
  delivered: { label: 'Delivered', class: 'badge--delivered' },
}
</script>

<template>
  <span :class="['k-badge', map[status]?.class ?? 'badge--pending']">
    <span class="badge-dot" />
    {{ map[status]?.label ?? status }}
  </span>
</template>

<style scoped>
.k-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.badge--pending   { background: var(--status-pending-bg);   color: var(--status-pending-text);   }
.badge--paid      { background: var(--status-paid-bg);      color: var(--status-paid-text);      }
.badge--preparing { background: var(--status-preparing-bg); color: var(--status-preparing-text); }
.badge--ready     { background: var(--status-ready-bg);     color: var(--status-ready-text);     }
.badge--delivered { background: var(--status-delivered-bg); color: var(--status-delivered-text); }

.badge--pending   .badge-dot { background: var(--status-pending-text);   }
.badge--paid      .badge-dot { background: var(--status-paid-text);      }
.badge--preparing .badge-dot { background: var(--status-preparing-text); }
.badge--ready     .badge-dot { background: var(--status-ready-text);     }
.badge--delivered .badge-dot { background: var(--status-delivered-text); }
</style>