/**
 * SplitScreen — divides into two panels with a glowing divider
 * Used for: Stack vs Heap, Array vs LinkedList, Single vs Multi-thread
 *
 * Props:
 *  left       { label, color, children }
 *  right      { label, color, children }
 *  animate    bool    — stagger reveal
 */

import { motion } from 'framer-motion'

export default function SplitScreen({ left, right, animate = true }) {
  const panelVariant = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  }

  return (
    <div className="flex gap-0 w-full rounded-3xl overflow-hidden relative" style={{ minHeight: 320 }}>
      {/* Left panel */}
      <motion.div
        variants={panelVariant}
        initial={animate ? 'initial' : false}
        animate="animate"
        transition={{ duration: 0.6, delay: 0 }}
        className="flex-1 flex flex-col"
        style={{
          background: `${left.color}08`,
          borderTop: `2px solid ${left.color}50`,
          borderLeft: `2px solid ${left.color}30`,
          borderBottom: `2px solid ${left.color}30`,
        }}
      >
        {/* panel header */}
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{
            background: `${left.color}12`,
            borderBottom: `1px solid ${left.color}25`,
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: left.color }} />
          <span
            className="text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ color: left.color }}
          >
            {left.label}
          </span>
        </div>
        <div className="flex-1 p-5">{left.children}</div>
      </motion.div>

      {/* Glowing divider */}
      <div className="w-[2px] relative flex-shrink-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          initial={animate ? { scaleY: 0 } : {}}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 blur-md"
          style={{ background: `linear-gradient(180deg, ${left.color}80, ${right.color}80)` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Right panel */}
      <motion.div
        variants={panelVariant}
        initial={animate ? 'initial' : false}
        animate="animate"
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex-1 flex flex-col"
        style={{
          background: `${right.color}08`,
          borderTop: `2px solid ${right.color}50`,
          borderRight: `2px solid ${right.color}30`,
          borderBottom: `2px solid ${right.color}30`,
        }}
      >
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{
            background: `${right.color}12`,
            borderBottom: `1px solid ${right.color}25`,
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: right.color }} />
          <span
            className="text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ color: right.color }}
          >
            {right.label}
          </span>
        </div>
        <div className="flex-1 p-5">{right.children}</div>
      </motion.div>
    </div>
  )
}