import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../../app/slices/uiSlice'

const ICONS = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
}

const COLORS = {
  success: { bg: 'rgba(6,217,110,0.1)', border: 'rgba(6,217,110,0.3)', color: '#06d96e' },
  error:   { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
  info:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' },
  warning: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', color: '#f97316' },
}

function ToastItem({ toast }) {
  const dispatch = useDispatch()
  const c = COLORS[toast.type] || COLORS.info

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration || 4000)
    return () => clearTimeout(t)
  }, [toast.id, toast.duration, dispatch])

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl animate-slide-in-right max-w-sm"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
    >
      <span>{ICONS[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => dispatch(removeToast(toast.id))} className="opacity-60 hover:opacity-100 ml-2 text-xs">✕</button>
    </div>
  )
}

export default function Toast() {
  const toasts = useSelector((s) => s.ui.toasts)
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}