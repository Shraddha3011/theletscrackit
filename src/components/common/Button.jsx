// Button.jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = variant === 'primary' ? 'btn-primary'
             : variant === 'secondary' ? 'btn-secondary'
             : 'btn-ghost'

  const sizeClass = size === 'sm' ? 'text-xs px-3 py-2'
                  : size === 'lg' ? 'text-base px-7 py-3.5'
                  : ''

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizeClass} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
}