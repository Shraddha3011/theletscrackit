import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, ChevronRight, Code2,
  Copy, Check, Zap, Trophy, Lightbulb, Target,
  Hammer, Lock, ArrowRight, Sparkles, RotateCcw,
} from 'lucide-react'
import { getProjectBySlugApi, completeStepApi } from '../api/projectApi'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { syncUserXp } from '../app/slices/authSlice'

/* ─── accent from slug ───────────────────────────────── */
const ACCENT_PALETTE = [
  '#06d96e', '#06b6d4', '#a78bfa', '#f472b6',
  '#fb923c', '#facc15', '#34d399', '#f87171',
]
function slugAccent(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length]
}

/* ─── parse step data safely ─────────────────────────── */
function safe(v, fallback) {
  try { return v ?? fallback } catch { return fallback }
}

/* ═══════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════ */
function Confetti() {
  const items = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.7,
    color: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
    size: 5 + Math.random() * 9,
    circle: Math.random() > 0.5,
    dur: 2.5 + Math.random() * 2,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', rotate: p.circle ? 360 : -360, opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.circle ? '50%' : 3,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   XP TOAST
═══════════════════════════════════════════════════════ */
function XpToast({ xp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.75 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div
        className="flex items-center gap-4 px-9 py-5 rounded-3xl font-black text-black"
        style={{
          background: 'linear-gradient(135deg,#f59e0b,#f97316)',
          boxShadow: '0 0 80px rgba(245,158,11,0.5), 0 24px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Zap className="h-8 w-8" />
        <span style={{ fontSize: 32, letterSpacing: '-0.04em' }}>+{xp} XP</span>
        <Trophy className="h-8 w-8" />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   PROGRESS RING
═══════════════════════════════════════════════════════ */
function ProgressRing({ pct, accent, size = 64 }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={accent} strokeWidth={8} strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${c}` }}
        animate={{ strokeDasharray: `${(pct / 100) * c} ${c}` }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        style={{ filter: `drop-shadow(0 0 8px ${accent})` }}
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   STEP MAP (left rail — the visual journey)
═══════════════════════════════════════════════════════ */
function StepMap({ steps, active, completed, accent, onSelect }) {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const isDone = completed.includes(i)
        const isActive = active === i
        const isLocked = !isDone && !isActive && i > active && !completed.includes(i - 1) && i !== 0

        return (
          <div key={step.id || i} className="relative">
            {/* connector line */}
            {i < steps.length - 1 && (
              <div
                className="absolute left-[17px] top-[38px] w-0.5 z-0"
                style={{
                  height: 'calc(100% + 4px)',
                  background: isDone
                    ? `linear-gradient(to bottom, ${accent}, ${accent}44)`
                    : 'rgba(255,255,255,0.05)',
                  transition: 'background 0.6s ease',
                }}
              />
            )}

            <motion.button
              onClick={() => onSelect(i)}
              whileHover={!isLocked ? { x: 4 } : {}}
              whileTap={!isLocked ? { scale: 0.97 } : {}}
              className="relative z-10 flex items-start gap-3 w-full text-left py-2.5 px-3 rounded-2xl transition-all duration-300"
              style={{
                background: isActive ? `${accent}12` : 'transparent',
                outline: isActive ? `1px solid ${accent}30` : '1px solid transparent',
                cursor: isLocked ? 'default' : 'pointer',
              }}
            >
              {/* Node bubble */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-300"
                style={{
                  background: isDone
                    ? `linear-gradient(135deg,${accent},${accent}88)`
                    : isActive ? `${accent}22` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isDone ? 'transparent' : isActive ? `${accent}50` : 'rgba(255,255,255,0.08)'}`,
                  color: isDone ? '#05050a' : isActive ? accent : 'rgba(148,163,184,0.35)',
                  boxShadow: isDone ? `0 0 14px ${accent}40` : 'none',
                  fontSize: isDone ? 13 : 11,
                }}
              >
                {isDone ? '✓' : String(i + 1).padStart(2, '0')}
              </div>

              <div className="min-w-0 pt-0.5">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5"
                  style={{ color: isDone ? accent : isActive ? accent : 'rgba(148,163,184,0.3)', fontFamily: 'monospace' }}
                >
                  {isDone ? 'Done' : isActive ? 'Active' : `Step ${i + 1}`}
                </p>
                <p
                  className="text-[13px] font-bold leading-snug truncate"
                  style={{ color: isActive ? '#f1f5f9' : isDone ? 'rgba(148,163,184,0.65)' : 'rgba(148,163,184,0.35)' }}
                >
                  {step.title}
                </p>
              </div>
            </motion.button>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CODE BLOCK
═══════════════════════════════════════════════════════ */
function CodeBlock({ code = '', language = 'java', filename }) {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-white/8" style={{ background: '#0d1117' }}>
      {/* chrome bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="ml-2 font-mono text-[11px] text-slate-500">
            {filename || `Main.${language}`}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-bold transition-all"
          style={{
            background: copied ? 'rgba(6,217,110,0.12)' : 'rgba(255,255,255,0.05)',
            color: copied ? '#06d96e' : 'rgba(148,163,184,0.5)',
            border: `1px solid ${copied ? 'rgba(6,217,110,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* code with line numbers */}
      <div className="flex overflow-x-auto">
        <div className="select-none py-5 px-3 text-right font-mono text-[12px] leading-7 text-slate-700 border-r border-white/5 shrink-0" style={{ minWidth: 44, background: 'rgba(0,0,0,0.2)' }}>
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="flex-1 py-5 px-5 font-mono text-[13px] leading-7 text-emerald-300 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   STEP CONTENT PANEL
═══════════════════════════════════════════════════════ */
function StepPanel({ step, index, total, completed, onComplete, canComplete, accent }) {
  const isDone = completed.includes(index)
  const [hintVisible, setHintVisible] = useState(false)
  const [taskChecked, setTaskChecked] = useState(false)

  // reset state on step change
  useEffect(() => {
    setHintVisible(false)
    setTaskChecked(false)
  }, [index])

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-[2rem] border"
      style={{
        borderColor: `${accent}18`,
        background: `radial-gradient(ellipse at 8% 0%, ${accent}07 0%, transparent 55%), rgba(255,255,255,0.02)`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* top accent strip */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: isDone ? 0.7 : 0.4 }}
      />

      {/* corner glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.07 }}
      />

      <div className="relative z-10 p-9 md:p-11 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <motion.div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black text-lg"
              style={{
                background: isDone ? `linear-gradient(135deg,${accent},${accent}88)` : `${accent}18`,
                border: `1px solid ${accent}40`,
                color: isDone ? '#05050a' : accent,
                boxShadow: isDone ? `0 0 24px ${accent}40` : `0 0 14px ${accent}18`,
              }}
              animate={{ scale: isDone ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              {isDone ? <CheckCircle2 className="h-6 w-6" /> : String(index + 1).padStart(2, '0')}
            </motion.div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 font-mono" style={{ color: accent }}>
                {isDone ? '✦ Completed ·' : ''} Step {index + 1} of {total}
              </p>
              <h2 className="text-[clamp(1.3rem,2.5vw,1.9rem)] font-black leading-tight tracking-tight text-white">
                {step.title}
              </h2>
            </div>
          </div>

          {/* XP badge */}
          <div className="flex items-center gap-2 rounded-full px-4 py-2 shrink-0"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">+{safe(step.xpReward, 50)} XP</span>
          </div>
        </div>

        {/* ── Description card ── */}
        <div
          className="relative rounded-[1.4rem] p-7 overflow-hidden"
          style={{
            background: `linear-gradient(135deg,${accent}07,rgba(255,255,255,0.015))`,
            border: `1px solid ${accent}18`,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-px opacity-60"
            style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />
          <p className="text-[16px] leading-[1.9] text-slate-200 whitespace-pre-wrap">
            {step.description}
          </p>
        </div>

        {/* ── Task block ── */}
        {step.task && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.4rem] p-6"
            style={{ background: `${accent}08`, border: `1px solid ${accent}28` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${accent}20` }}>
                <Target className="h-4 w-4" style={{ color: accent }} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-mono" style={{ color: accent }}>
                Your Task
              </p>
            </div>

            {/* Task checkbox */}
            <div className="flex items-start gap-4">
              <motion.button
                onClick={() => setTaskChecked((v) => !v)}
                whileTap={{ scale: 0.9 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5 transition-all"
                style={{
                  background: taskChecked ? accent : 'rgba(255,255,255,0.06)',
                  border: `2px solid ${taskChecked ? accent : 'rgba(255,255,255,0.15)'}`,
                  color: taskChecked ? '#05050a' : 'transparent',
                }}
              >
                {taskChecked && <Check className="h-3.5 w-3.5" />}
              </motion.button>
              <p className={`text-[15px] leading-[1.8] transition-colors ${taskChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {step.task}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Starter code ── */}
        {step.starterCode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3 font-mono flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5" /> Starter Code
            </p>
            <CodeBlock
              code={step.starterCode}
              language={step.language || 'java'}
              filename={step.filename}
            />
          </motion.div>
        )}

        {/* ── Explanation (reveal on demand) ── */}
        {step.explanation && (
          <div>
            <AnimatePresence mode="wait">
              {!hintVisible ? (
                <motion.button
                  key="hint-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setHintVisible(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed py-4 text-sm font-semibold transition-all"
                  style={{ borderColor: 'rgba(139,92,246,0.3)', color: 'rgba(139,92,246,0.7)' }}
                >
                  <Lightbulb className="h-4 w-4" />
                  Reveal hint / how it works
                </motion.button>
              ) : (
                <motion.div
                  key="hint-content"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="rounded-[1.4rem] p-6"
                  style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.22)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="h-5 w-5 text-violet-400" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400 font-mono">
                      How it works
                    </p>
                  </div>
                  <p className="text-[14px] leading-[1.85] text-slate-300">{step.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Progress mini-bar ── */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-slate-500">{index + 1}/{total}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${accent},${accent}66)`, boxShadow: `0 0 10px ${accent}40` }}
              initial={{ width: 0 }}
              animate={{ width: `${((index + 1) / total) * 100}%` }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold" style={{ color: accent }}>
            {Math.round(((index + 1) / total) * 100)}%
          </span>
        </div>

        {/* ── CTA ── */}
        {!isDone ? (
          <motion.button
            onClick={onComplete}
            disabled={!canComplete}
            whileHover={canComplete ? { scale: 1.02, y: -2 } : {}}
            whileTap={canComplete ? { scale: 0.97 } : {}}
            className="w-full rounded-2xl py-5 font-black text-[15px] flex items-center justify-center gap-3 transition-all duration-300"
            style={{
              background: canComplete
                ? `linear-gradient(135deg,${accent},${accent}99)`
                : 'rgba(255,255,255,0.04)',
              color: canComplete ? '#05050a' : 'rgba(148,163,184,0.3)',
              border: `1px solid ${canComplete ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: canComplete ? `0 0 40px ${accent}35, 0 12px 40px rgba(0,0,0,0.4)` : 'none',
              cursor: canComplete ? 'pointer' : 'not-allowed',
            }}
          >
            {canComplete ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Mark Complete · +{safe(step.xpReward, 50)} XP
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Sign in to track progress
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full rounded-2xl py-5 font-bold text-[15px] flex items-center justify-center gap-3"
            style={{ background: `${accent}10`, border: `1px solid ${accent}30`, color: accent }}
          >
            <Trophy className="h-5 w-5" />
            Completed · +{safe(step.xpReward, 50)} XP earned
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   STEP QUICK-JUMP DOTS
═══════════════════════════════════════════════════════ */
function JumpDots({ steps, active, completed, accent, onSelect }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((_, i) => {
        const isDone = completed.includes(i)
        const isActive = active === i
        return (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={steps[i]?.title}
            className="rounded-xl transition-all duration-200 font-black text-[10px]"
            style={{
              width: 32, height: 32,
              background: isActive ? `${accent}22` : isDone ? `${accent}0e` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? `${accent}60` : isDone ? `${accent}30` : 'rgba(255,255,255,0.08)'}`,
              color: isActive ? accent : isDone ? accent : 'rgba(148,163,184,0.35)',
              fontSize: isDone ? 11 : 10,
            }}
          >
            {isDone ? '✓' : i + 1}
          </motion.button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ALL-DONE COMPLETION SCREEN
═══════════════════════════════════════════════════════ */
function CompletionScreen({ totalXp, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-[2rem] border text-center py-20 px-10"
      style={{
        borderColor: `${accent}30`,
        background: `radial-gradient(ellipse at 50% 0%, ${accent}10, transparent 60%), rgba(255,255,255,0.02)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-8xl mb-8"
      >🏆</motion.div>

      <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-white mb-4">
        Project Complete!
      </h2>
      <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
        You earned{' '}
        <span className="font-black text-amber-400 text-xl">+{totalXp} XP</span>
        {' '}— incredible work! 🎉
      </p>

      <Link
        to="/projects"
        className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-black text-[15px] text-black transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg,${accent},${accent}99)`,
          boxShadow: `0 0 50px ${accent}40, 0 16px 40px rgba(0,0,0,0.4)`,
        }}
      >
        <Sparkles className="h-5 w-5" />
        View All Projects
        <ArrowRight className="h-5 w-5" />
      </Link>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function ProjectDetail() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [showXp, setShowXp] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setLoading(true)
    setActiveStep(0)
    setCompletedSteps([])
    getProjectBySlugApi(slug)
      .then(({ data }) => setProject(data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleComplete = async (stepIndex) => {
    if (!isAuthenticated || completedSteps.includes(stepIndex)) return
    const step = project?.steps?.[stepIndex]
    if (!step?.id) return
    try {
      const { data } = await completeStepApi(step.id)
      const xp = data?.xpEarned || 0
      setCompletedSteps((prev) => [...prev, stepIndex])
      if (xp > 0) {
        setXpEarned(xp)
        setShowXp(true)
        setShowConfetti(true)
        dispatch(syncUserXp({ xpPoints: data?.xpPoints }))
        setTimeout(() => { setShowXp(false); setShowConfetti(false) }, 4000)
      }
      if (project?.steps && stepIndex < project.steps.length - 1) {
        setTimeout(() => setActiveStep(stepIndex + 1), 1000)
      }
    } catch { /* noop */ }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#080809] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent"
          />
        </div>
      </PageWrapper>
    )
  }

  /* ── Not found ── */
  if (!project) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#080809] flex flex-col items-center justify-center gap-5 text-white">
          <span className="text-6xl">🔍</span>
          <h1 className="text-3xl font-black text-red-400">Project not found</h1>
          <Link to="/projects" className="text-emerald-400 hover:text-white transition-colors text-sm font-mono">
            ← Back to projects
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const accent = project.accent || slugAccent(project.slug || '')
  const steps = project.steps || []
  const completedCount = completedSteps.length
  const totalXp = steps.reduce((s, st) => s + (safe(st.xpReward, 50)), 0)
  const earnedXp = steps.reduce((s, st, i) => s + (completedSteps.includes(i) ? safe(st.xpReward, 50) : 0), 0)
  const pct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0
  const allDone = completedCount === steps.length && steps.length > 0
  const activeStepData = steps[activeStep]

  const diffColor = { Beginner: '#06d96e', Intermediate: '#f59e0b', Advanced: '#f472b6' }[project.difficulty] || '#06d96e'

  return (
    <PageWrapper>
      {showConfetti && <Confetti />}
      <AnimatePresence>{showXp && <XpToast xp={xpEarned} />}</AnimatePresence>

      <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: '#080809' }}>

        {/* ── Fixed background atmosphere ── */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(6,217,110,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,217,110,0.02) 1px,transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          {/* accent radials */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full" style={{ background: `radial-gradient(ellipse,${accent}0e 0%,transparent 65%)`, filter: 'blur(4px)' }} />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] rounded-full"
            style={{ background: 'radial-gradient(ellipse,rgba(139,92,246,0.06),transparent 65%)' }}
          />
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[-5%] left-[-8%] w-[450px] h-[450px] rounded-full"
            style={{ background: 'radial-gradient(ellipse,rgba(6,182,212,0.05),transparent 70%)' }}
          />
        </div>

        <div className="relative z-10">

          {/* ══ HERO ══════════════════════════════════════════ */}
        <div style={{ backdropFilter: 'blur(20px)', background: 'rgba(8,8,9,0.65)' }}>
            <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-12">

              {/* Breadcrumb */}
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Link>
              </motion.div>

              {/* Eyebrow badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                {/* live dot badge */}
                <span
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] font-mono"
                  style={{ background: `${accent}0c`, border: `1px solid ${accent}28`, color: accent }}
                >
                  <span className="relative flex h-2 w-2">
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: accent }}
                      animate={{ scale: [1, 2], opacity: [0.75, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
                  </span>
                  Project Lab
                </span>

                {project.difficulty && (
                  <span className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide font-mono"
                    style={{ background: `${diffColor}12`, border: `1px solid ${diffColor}28`, color: diffColor }}>
                    {project.difficulty}
                  </span>
                )}

                {earnedXp > 0 && (
                  <span className="rounded-full px-3 py-1.5 text-[11px] font-bold font-mono"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                    ⚡ {earnedXp} XP earned
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 font-black tracking-tight text-white leading-[1.06]"
                style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', maxWidth: 800 }}
              >
                {project.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8 text-[17px] leading-[1.8] text-slate-400 max-w-[600px]"
              >
                {project.description}
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-8 mb-8"
              >
                {[
                  { val: steps.length, label: 'Steps', color: 'rgba(148,163,184,0.9)' },
                  { val: completedCount, label: 'Done', color: '#06d96e' },
                  { val: `${pct}%`, label: 'Progress', color: accent },
                  { val: `${totalXp} XP`, label: 'Total', color: '#fbbf24' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="flex items-baseline gap-2">
                    <span className="text-[28px] font-black" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-slate-500">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Tech stack */}
              {project.techStack?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-full px-3 py-1 text-[12px] font-mono text-slate-400"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {t}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Overall progress bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg,${accent},${accent}66)`, boxShadow: `0 0 12px ${accent}50` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* ══ MAIN LAYOUT ════════════════════════════════════ */}
          <div className="mx-auto max-w-[1200px] px-6 py-12 pb-24"
            style={{ display: 'grid', gridTemplateColumns: 'min(280px, 100%) 1fr', gap: 36, alignItems: 'start' }}>

            {/* ── SIDEBAR ── */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 max-lg:hidden"
            >
              <div
                className="relative overflow-hidden rounded-[1.8rem] p-5"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />

                {/* Progress ring header */}
                <div className="flex items-center gap-4 pb-5 mb-5 border-b border-white/6">
                  <div className="relative w-14 h-14 shrink-0">
                    <ProgressRing pct={pct} accent={accent} size={56} />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono" style={{ color: accent }}>
                      {pct}%
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] font-mono mb-0.5" style={{ color: accent }}>Progress</p>
                    <p className="text-[18px] font-black text-white">
                      {completedCount}<span className="text-slate-600 text-sm">/{steps.length}</span>
                    </p>
                  </div>
                </div>

                {/* Step map */}
                <StepMap
                  steps={steps}
                  active={activeStep}
                  completed={completedSteps}
                  accent={accent}
                  onSelect={setActiveStep}
                />

                {/* XP tally */}
                <div className="mt-5 pt-4 border-t border-white/6">
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-amber-500 mb-0.5">XP Earned</p>
                      <p className="text-[15px] font-black text-amber-400">{earnedXp} / {totalXp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* ── MAIN CONTENT ── */}
            <motion.main
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="min-w-0"
            >
              <AnimatePresence mode="wait">
                {allDone ? (
                  <CompletionScreen key="done" totalXp={totalXp} accent={accent} />
                ) : activeStepData ? (
                  <StepPanel
                    key={activeStep}
                    step={activeStepData}
                    index={activeStep}
                    total={steps.length}
                    completed={completedSteps}
                    onComplete={() => handleComplete(activeStep)}
                    canComplete={isAuthenticated}
                    accent={accent}
                  />
                ) : null}
              </AnimatePresence>

              {/* Quick jump dots + prev/next */}
              {steps.length > 1 && !allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-6 flex items-center justify-between gap-4 flex-wrap"
                >
                  <JumpDots
                    steps={steps}
                    active={activeStep}
                    completed={completedSteps}
                    accent={accent}
                    onSelect={setActiveStep}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStep((v) => Math.max(0, v - 1))}
                      disabled={activeStep === 0}
                      className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all disabled:opacity-25"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.7)' }}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" /> Prev
                    </button>
                    <button
                      onClick={() => setActiveStep((v) => Math.min(steps.length - 1, v + 1))}
                      disabled={activeStep === steps.length - 1}
                      className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all disabled:opacity-25"
                      style={{ borderColor: `${accent}40`, color: accent }}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.main>
          </div>
        </div>

        {/* responsive: sidebar stacks on mobile */}
        <style>{`
          @media (max-width: 900px) {
            main { grid-column: 1 / -1 !important; }
            aside { display: none !important; }
          }
        `}</style>
      </div>
    </PageWrapper>
  )
}