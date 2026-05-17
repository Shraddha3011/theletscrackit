/**
 * ArrowConnector — animated SVG arrow between two elements
 *
 * Props:
 *  direction  'right'|'down'|'left'|'up'
 *  color      string   — hex color
 *  length     number   — px length
 *  label      string   — optional label above arrow
 *  delay      number   — animation delay seconds
 *  dashed     bool     — dashed stroke
 *  animate    bool     — draw-in animation
 */

import { motion } from 'framer-motion'

export default function ArrowConnector({
  direction = 'right',
  color = '#06d96e',
  length = 80,
  label = '',
  delay = 0,
  dashed = false,
  animate = true,
}) {
  const isHorizontal = direction === 'right' || direction === 'left'
  const isReversed = direction === 'left' || direction === 'up'

  const w = isHorizontal ? length : 24
  const h = isHorizontal ? 24 : length

  /* SVG path for the line */
  const lineProps = isHorizontal
    ? { x1: isReversed ? length - 4 : 4, y1: 12, x2: isReversed ? 4 : length - 4, y2: 12 }
    : { x1: 12, y1: isReversed ? length - 4 : 4, x2: 12, y2: isReversed ? 4 : length - 4 }

  /* arrowhead marker */
  const markerId = `arrow-${color.replace('#', '')}-${direction}`

  const pathLength = isHorizontal ? length : length

  return (
    <div className="relative flex flex-col items-center">
      {label && (
        <span
          className="mb-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </span>
      )}
      <svg width={w} height={h} overflow="visible">
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill={color} />
          </marker>
        </defs>
        <motion.line
          {...lineProps}
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={dashed ? '6 4' : `${pathLength}`}
          strokeDashoffset={animate ? pathLength : 0}
          markerEnd={`url(#${markerId})`}
          initial={animate ? { strokeDashoffset: pathLength, opacity: 0 } : { opacity: 1 }}
          animate={{ strokeDashoffset: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
    </div>
  )
}