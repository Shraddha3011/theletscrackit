const VARIANTS = {
  brand:  { bg: 'var(--brand-dim)',            color: 'var(--brand)',   border: 'var(--brand-border)' },
  purple: { bg: 'var(--purple-dim)',           color: 'var(--purple)',  border: 'rgba(139,92,246,0.3)' },
  orange: { bg: 'rgba(249,115,22,0.1)',        color: '#f97316',        border: 'rgba(249,115,22,0.3)' },
  red:    { bg: 'rgba(239,68,68,0.1)',         color: '#ef4444',        border: 'rgba(239,68,68,0.3)' },
  blue:   { bg: 'rgba(59,130,246,0.1)',        color: '#3b82f6',        border: 'rgba(59,130,246,0.3)' },
  yellow: { bg: 'rgba(234,179,8,0.1)',         color: '#eab308',        border: 'rgba(234,179,8,0.3)' },
  gray:   { bg: 'rgba(255,255,255,0.06)',      color: 'var(--text-secondary)', border: 'var(--border)' },
}

export default function Badge({ children, variant = 'brand', className = '' }) {
  const v = VARIANTS[variant] || VARIANTS.gray
  return (
    <span
      className={`badge ${className}`}
      style={{ background: v.bg, color: v.color, border: `1px solid ${v.border}` }}
    >
      {children}
    </span>
  )
}