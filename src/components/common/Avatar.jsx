const SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

const GRADIENT_PALETTE = [
  'linear-gradient(135deg, #06d96e, #2df28a)',
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  'linear-gradient(135deg, #3b82f6, #60a5fa)',
  'linear-gradient(135deg, #f97316, #fb923c)',
  'linear-gradient(135deg, #ec4899, #f472b6)',
  'linear-gradient(135deg, #06b6d4, #22d3ee)',
  'linear-gradient(135deg, #eab308, #facc15)',
]

function getGradient(name = '') {
  const idx = name.charCodeAt(0) % GRADIENT_PALETTE.length
  return GRADIENT_PALETTE[idx]
}

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?'
  const sizeClass = SIZES[size] || SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
      style={{ background: getGradient(name), color: '#0c0c12' }}
    >
      {initial}
    </div>
  )
}