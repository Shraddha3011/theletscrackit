/**
 * SlidePanel — a container that slides in from a direction
 * Used for: stack frames appearing, method calls, memory regions
 *
 * Props:
 *  from       'bottom'|'top'|'left'|'right'
 *  color      string   — accent hex
 *  label      string   — panel header label
 *  children   ReactNode
 *  delay      number
 *  visible    bool     — control visibility externally
 *  onExit     fn       — called when exit animation ends
 *  className  string
 */

import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_VARIANTS = {
  bottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  top: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
}

export default function SlidePanel({
  from = 'bottom',
  color = '#06d96e',
  label = '',
  children,
  delay = 0,
  visible = true,
  className = '',
}) {
  const variants = SLIDE_VARIANTS[from]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ type: 'spring', stiffness: 240, damping: 26, delay }}
          className={`relative overflow-hidden rounded-2xl ${className}`}
          style={{
            background: `${color}0e`,
            border: `1.5px solid ${color}40`,
          }}
        >
          {/* top accent bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          />

          {label && (
            <div
              className="px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] border-b"
              style={{ color, borderColor: `${color}25` }}
            >
              {label}
            </div>
          )}

          {/* inner glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: `${color}12` }}
          />

          <div className="relative z-10 p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}