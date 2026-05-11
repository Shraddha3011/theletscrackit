export const formatNumber = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n?.toString() || '0'
}

export const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return formatDate(dateStr)
}

export const truncate = (str, max = 120) =>
  str?.length > max ? str.slice(0, max) + '…' : str

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''

export const slugToTitle = (slug) =>
  slug?.split('-').map(capitalize).join(' ') || ''