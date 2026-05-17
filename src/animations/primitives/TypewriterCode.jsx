/**
 * TypewriterCode — code block where lines appear one at a time
 * synced with lesson step progression
 *
 * Props:
 *  lines        string[]    — each line of code
 *  activeIndex  number      — which line to highlight (0-based)
 *  language     string      — 'java'|'python'|'js' (for label)
 *  color        string      — accent hex
 *  autoPlay     bool        — automatically advance through lines
 *  speed        number      — ms between lines if autoPlay
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* minimal keyword coloring for Java */
function colorizeJava(line) {
  const keywords = ['public', 'private', 'static', 'void', 'class', 'new', 'return', 'int', 'String', 'boolean', 'null', 'this', 'super', 'extends', 'implements', 'interface', 'abstract', 'final', 'for', 'while', 'if', 'else', 'try', 'catch', 'finally', 'throw', 'throws']
  const types = ['User', 'Stack', 'Queue', 'LinkedList', 'ArrayList', 'HashMap']

  /* simple token split */
  const tokens = line.split(/(\s+|[(){};,.<>"])/)

  return tokens.map((token, i) => {
    if (keywords.includes(token.trim())) {
      return <span key={i} style={{ color: '#c084fc' }}>{token}</span>
    }
    if (types.some(t => token.includes(t))) {
      return <span key={i} style={{ color: '#38bdf8' }}>{token}</span>
    }
    if (/^".*"$/.test(token.trim())) {
      return <span key={i} style={{ color: '#fbbf24' }}>{token}</span>
    }
    if (/\/\//.test(token)) {
      return <span key={i} style={{ color: '#4b5563' }}>{token}</span>
    }
    return <span key={i} style={{ color: '#e2e8f0' }}>{token}</span>
  })
}

export default function TypewriterCode({
  lines = [],
  activeIndex = 0,
  language = 'java',
  color = '#06d96e',
  autoPlay = false,
  speed = 1200,
  onLineChange,
}) {
  const [revealed, setRevealed] = useState(autoPlay ? 0 : lines.length)
  const [active, setActive] = useState(activeIndex)

  useEffect(() => {
    if (!autoPlay) {
      setActive(activeIndex)
      setRevealed(activeIndex + 1)
      return
    }
    const timer = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % lines.length
        setRevealed(next + 1)
        onLineChange?.(next)
        return next
      })
    }, speed)
    return () => clearInterval(timer)
    // onLineChange is intentionally omitted: callers often pass inline fns; including would reset the timer every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable timer driven by autoPlay / activeIndex / speed / lines.length
  }, [autoPlay, activeIndex, speed, lines.length])

  return (
    <div
      className="relative overflow-hidden rounded-2xl font-mono text-sm"
      style={{
        background: '#07111f',
        border: `1px solid ${color}30`,
        boxShadow: `0 0 40px ${color}10`,
      }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: `${color}20`, background: 'rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] uppercase tracking-widest" style={{ color }}>
          {language.toUpperCase()}
        </span>
        <div className="w-12" />
      </div>

      {/* code area */}
      <div className="p-5 space-y-1 leading-7">
        {lines.map((line, i) => {
          const isActive = i === active
          const isRevealed = i < revealed

          return (
            <AnimatePresence key={i}>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0 }}
                  className="flex items-center gap-4 rounded-lg px-3 py-0.5 transition-all duration-300"
                  style={
                    isActive
                      ? {
                          background: `${color}15`,
                          borderLeft: `3px solid ${color}`,
                          boxShadow: `0 0 20px ${color}15`,
                        }
                      : { borderLeft: '3px solid transparent' }
                  }
                >
                  {/* line number */}
                  <span className="text-[10px] w-5 text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {i + 1}
                  </span>

                  {/* execution cursor */}
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                  )}

                  {/* code */}
                  <pre className="flex-1 overflow-x-auto whitespace-pre">
                    {colorizeJava(line)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </div>
    </div>
  )
}