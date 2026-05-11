export default function ProgressBar({ value = 0, max = 100, label, showPercent = false, color = 'brand', className = '' }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const colors = {
    brand:  'linear-gradient(90deg, #06d96e, #2df28a)',
    purple: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
    orange: 'linear-gradient(90deg, #f97316, #fb923c)',
    blue:   'linear-gradient(90deg, #3b82f6, #60a5fa)',
  }
  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-secondary">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-primary">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="xp-bar">
        <div
          className="xp-bar-fill"
          style={{ width: `${pct}%`, background: colors[color] || colors.brand }}
        />
      </div>
    </div>
  )
}