export default function Modal({
    open,
    onClose,
    children,
  }) {
    if (!open) return null
  
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#111',
            padding: 24,
            borderRadius: 12,
            minWidth: 320,
          }}
        >
          {children}
        </div>
      </div>
    )
  }