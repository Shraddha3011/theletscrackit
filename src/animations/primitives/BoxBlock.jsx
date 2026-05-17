/**
 * BoxBlock — core animation primitive
 *
 * Props:
 *  label      string   — text inside the box
 *  sublabel   string   — smaller text below label
 *  color      string   — accent hex color
 *  size       'sm'|'md'|'lg'
 *  variant    'solid'|'ghost'|'glow'
 *  animate    'pop'|'slide-up'|'slide-left'|'none'
 *  delay      number   — framer delay (seconds)
 *  pulse      bool     — continuous glow pulse
 *  highlight  bool     — active/selected state
 *  onClick    fn
 */

import { motion } from 'framer-motion'

const SIZES = {
  sm: 'w-16 h-16 text-sm',
  md: 'w-24 h-24 text-base',
  lg: 'w-32 h-32 text-xl',
}

const ENTER_VARIANTS = {
  pop: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
  'slide-up': {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 22 },
  },
  'slide-left': {
    initial: { x: -80, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 22 },
  },
  none: {
    initial: {},
    animate: {},
    transition: {},
  },
}

export default function BoxBlock({
  label = '',
  sublabel = '',
  color = '#06d96e',
  size = 'md',
  variant = 'ghost',
  animate = 'pop',
  delay = 0,
  pulse = false,
  highlight = false,
  onClick,
  className = '',
}) {
  const { initial, animate: anim, transition } = ENTER_VARIANTS[animate]

  const bgStyle =
    variant === 'solid'
      ? { background: color }
      : variant === 'glow'
      ? {
          background: `${color}18`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 24px ${color}55, 0 0 8px ${color}33`,
        }
      : {
          background: `${color}12`,
          border: `1.5px solid ${color}45`,
        }

  if (highlight) {
    bgStyle.boxShadow = `0 0 32px ${color}80, 0 0 12px ${color}55`
    bgStyle.border = `2px solid ${color}`
  }

  return (
    <motion.div
      initial={initial}
      animate={anim}
      transition={{ ...transition, delay }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        rounded-2xl font-bold text-white select-none
        ${SIZES[size]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={bgStyle}
      whileHover={onClick ? { scale: 1.06 } : undefined}
    >
      {/* pulse ring */}
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ boxShadow: [`0 0 0px ${color}00`, `0 0 24px ${color}88`, `0 0 0px ${color}00`] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <span className="relative z-10 leading-tight text-center px-1">{label}</span>
      {sublabel && (
        <span className="relative z-10 text-[10px] mt-1 opacity-60 font-normal">{sublabel}</span>
      )}
    </motion.div>
  )
}