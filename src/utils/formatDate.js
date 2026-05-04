export function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)

  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hrs  < 24)  return `Today ${date.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}`

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })
}