export const statusMap = {
  pending: {
    label: 'Pending',
    bg:    'var(--bg-surface)',
    color: 'var(--text-muted)',
    border: 'var(--border)',
  },
  paid: {
    label: 'Paid',
    bg:    'var(--bg-surface)',
    color: 'var(--text-secondary)',
    border: 'var(--border-strong)',
  },
  preparing: {
    label: 'Preparing',
    bg:    'var(--bg-surface)',
    color: 'var(--text-secondary)',
    border: 'var(--border)',
  },
  ready: {
    label: 'Ready',
    bg:    'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: 'var(--border-strong)',
  },
  delivered: {
    label: 'Delivered',
    bg:    'color-mix(in srgb, var(--status-paid-bg) 35%, var(--bg-page))',
    color: 'var(--status-paid-text)',
    border: 'color-mix(in srgb, var(--status-paid-bg) 80%, transparent)',
  },
}

export function getStatus(status) {
  return statusMap[status] ?? statusMap.pending
}