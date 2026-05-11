export default function Input({
  label,
  error,
  prefix,
  suffix,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-secondary">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{prefix}</span>
        )}
        <input
          className={`input-field ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:shadow-none' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}