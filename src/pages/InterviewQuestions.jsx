import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHomeApi } from '../api/homeApi'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'

/* ════════════════════════════════════════
   HOOKS
════════════════════════════════════════ */

function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    if (!words.length) return
    const current = words[wordIdx]
    const delay = deleting ? speed / 2 : speed
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause)
        else setCharIdx(p => p + 1)
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx(p => (p + 1) % words.length)
          setCharIdx(0)
        } else setCharIdx(p => p - 1)
      }
    }, delay)
    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx, words, speed, pause])
  return display
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCounter(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    const numeric = parseInt(String(target).replace(/\D/g, ''))
    if (!numeric) return
    const step = numeric / (duration / 16)
    let current = 0
    const t = setInterval(() => {
      current += step
      if (current >= numeric) { setCount(numeric); clearInterval(t) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(t)
  }, [target, duration, started])
  return count
}

/* ════════════════════════════════════════
   WORLD MAP TOPIC CONFIG
   Each topic = a "region" with its own personality
════════════════════════════════════════ */
const REGION_CONFIG = {
  java: {
    label: 'Java Kingdom',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.35)',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)',
    terrain: '🏰',
    tag: 'Kingdom',
  },
  dsa: {
    label: 'DSA Forest',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.35)',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    terrain: '🌲',
    tag: 'Forest',
  },
  javascript: {
    label: 'JS Coast',
    color: '#eab308',
    glow: 'rgba(234,179,8,0.35)',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.25)',
    terrain: '🌊',
    tag: 'Coast',
  },
  python: {
    label: 'Python Valley',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    terrain: '🏔️',
    tag: 'Valley',
  },
  react: {
    label: 'React Nebula',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.25)',
    terrain: '⚛️',
    tag: 'Nebula',
  },
  dbms: {
    label: 'Database Caves',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    terrain: '🗄️',
    tag: 'Caves',
  },
  os: {
    label: 'OS Mountains',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.35)',
    bg: 'rgba(244,63,94,0.08)',
    border: 'rgba(244,63,94,0.25)',
    terrain: '⛰️',
    tag: 'Mountains',
  },
  'system-design': {
    label: 'System Citadel',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.35)',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    terrain: '🏛️',
    tag: 'Citadel',
  },
}

const DEFAULT_REGION = {
  label: 'Unknown Territory',
  color: '#8b5cf6',
  glow: 'rgba(139,92,246,0.35)',
  bg: 'rgba(139,92,246,0.08)',
  border: 'rgba(139,92,246,0.25)',
  terrain: '🗺️',
  tag: 'Territory',
}

/* ════════════════════════════════════════
   STAR FIELD BACKGROUND
════════════════════════════════════════ */
function StarField() {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))
  ).current

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'white',
            opacity: s.opacity,
            animation: `pulse ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

/* ════════════════════════════════════════
   TRAIN TRACK PROGRESS (Topic Journey Preview)
════════════════════════════════════════ */
function TrainTrack({ lessons = [], color = '#06d96e' }) {
  const sample = lessons.length
    ? lessons.slice(0, 5)
    : ['Intro', 'Core', 'Advanced', 'Practice', 'Master']

  return (
    <div className="relative flex items-center gap-0 w-full mt-4 px-2">
      {/* Track line */}
      <div
        className="absolute left-4 right-4 h-px top-1/2 -translate-y-1/2"
        style={{ background: `linear-gradient(90deg, ${color}60, ${color}20)` }}
      />
      {/* Rail ties */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-px"
          style={{
            left: `${10 + i * 11}%`,
            top: 'calc(50% - 4px)',
            background: `${color}25`,
          }}
        />
      ))}
      {/* Stations */}
      <div className="relative flex justify-between w-full z-10">
        {sample.map((lesson, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border-2 transition-all duration-300"
              style={{
                background: i === 0 ? color : 'transparent',
                borderColor: i === 0 ? color : `${color}40`,
                boxShadow: i === 0 ? `0 0 8px ${color}80` : 'none',
              }}
            />
            <span
              className="text-[8px] font-medium text-center max-w-[40px] leading-tight hidden sm:block"
              style={{ color: i === 0 ? color : 'rgba(255,255,255,0.3)' }}
            >
              {typeof lesson === 'string' ? lesson : lesson.title || `Stop ${i + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   WORLD MAP REGION CARD
════════════════════════════════════════ */
function RegionCard({ topic, index }) {
  const region = REGION_CONFIG[topic.slug] || DEFAULT_REGION
  const [hovered, setHovered] = useState(false)

  const isFeatured = index === 0
  const isWide = index === 1 || index === 4

  return (
    <Link
      to={`/topics/${topic.slug}`}
      className="group relative overflow-hidden rounded-3xl block"
      style={{
        minHeight: isFeatured ? '320px' : isWide ? '260px' : '220px',
        background: 'rgba(8,8,14,0.9)',
        border: `1px solid ${hovered ? region.border : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${region.glow}`
          : '0 4px 24px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Atmospheric background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${region.bg} 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Top border accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${region.color}, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
      />

      {/* Fog-of-war overlay (uncompleted) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Terrain emoji floating in corner */}
      <div
        className="absolute top-4 right-5 text-4xl transition-all duration-500"
        style={{
          opacity: hovered ? 1 : 0.3,
          transform: hovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
          filter: `drop-shadow(0 0 12px ${region.glow})`,
        }}
      >
        {region.terrain}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Region tag */}
        <div className="flex items-center gap-2 mb-auto">
          <span
            className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{
              background: `${region.color}15`,
              color: region.color,
              border: `1px solid ${region.color}30`,
            }}
          >
            {region.tag}
          </span>
          {isFeatured && (
            <span
              className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Start Here
            </span>
          )}
        </div>

        {/* Topic icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mt-6 mb-3 transition-transform duration-400"
          style={{
            background: `${region.color}12`,
            border: `1px solid ${region.color}25`,
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {topic.icon || '📚'}
        </div>

        {/* Name */}
        <h3
          className="font-black text-xl leading-tight mb-1.5 tracking-tight"
          style={{ color: 'white' }}
        >
          {topic.title}
        </h3>

        {/* Subtitle — region name */}
        <p className="text-[11px] font-semibold mb-2" style={{ color: region.color }}>
          {region.label}
        </p>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {topic.description ||
            `Begin your journey through ${topic.title}. Master concepts from ground up.`}
        </p>

        {/* Train track preview */}
        <TrainTrack color={region.color} />

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4 mt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex gap-2">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }}
            >
              {topic.noteCount || 0} Lessons
            </span>
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }}
            >
              {topic.quizCount || 0} Quizzes
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 text-xs font-black transition-all duration-300"
            style={{
              color: region.color,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(8px)',
            }}
          >
            Enter
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ════════════════════════════════════════
   ANIMATED STAT COUNTER
════════════════════════════════════════ */
function StatCounter({ icon, value, label, color, started, delay }) {
  const numeric = parseInt(String(value).replace(/\D/g, ''))
  const suffix = String(value).replace(/[0-9]/g, '')
  const count = useCounter(numeric, 1600, started)

  return (
    <div
      className="flex flex-col items-center text-center gap-2 py-6 px-4 rounded-2xl group"
      style={{
        animationDelay: `${delay}ms`,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}08`
        e.currentTarget.style.borderColor = `${color}25`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${color}12`, border: `1px solid ${color}20` }}
      >
        {icon}
      </div>
      <span
        className="font-black text-3xl tabular-nums"
        style={{ color, textShadow: `0 0 20px ${color}50` }}
      >
        {started ? `${count}${suffix}` : '—'}
      </span>
      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════
   HOW IT WORKS — JOURNEY STEP
════════════════════════════════════════ */
function JourneyStep({ num, icon, title, desc, color, isLast }) {
  const [ref, inView] = useInView(0.2)
  return (
    <div
      ref={ref}
      className="flex gap-5 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-20px)',
        transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${num * 100}ms`,
      }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${color}12`,
            border: `1px solid ${color}30`,
            boxShadow: `0 0 20px ${color}15`,
          }}
        >
          {icon}
        </div>
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{ background: `linear-gradient(to bottom, ${color}30, transparent)`, minHeight: 40 }}
          />
        )}
      </div>
      <div className={!isLast ? 'pb-8' : ''}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black tabular-nums" style={{ color }}>
            0{num}
          </span>
          <h4 className="font-bold text-sm text-white">{title}</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   AI FEATURE PILL
════════════════════════════════════════ */
function AiFeaturePill({ icon, label, color }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-default transition-all duration-300"
      style={{
        background: hov ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? color + '35' : 'rgba(255,255,255,0.07)'}`,
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-semibold" style={{ color: hov ? color : 'rgba(255,255,255,0.6)' }}>
        {label}
      </span>
    </div>
  )
}

/* ════════════════════════════════════════
   FLOATING BADGE
════════════════════════════════════════ */
function FloatingBadge({ icon, text, color, style }) {
  return (
    <div
      className="absolute flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}35`,
        color,
        backdropFilter: 'blur(12px)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 20,
        ...style,
      }}
    >
      {icon} {text}
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN HOME PAGE
════════════════════════════════════════ */
export default function Home() {
  const { isAuthenticated } = useAuth()
  const [topics, setTopics] = useState([])
  const [stats, setStats] = useState([])
  const [steps, setSteps] = useState([])
  const [typedWords, setTypedWords] = useState([])
  const [loading, setLoading] = useState(true)

  const [statsRef, statsInView] = useInView(0.2)
  const [mapRef, mapInView] = useInView(0.1)

  const typed = useTypewriter(typedWords.length ? typedWords : ['Java', 'DSA', 'System Design', 'React', 'Python'])

  useEffect(() => {
    getHomeApi()
      .then(({ data }) => {
        setTopics(Array.isArray(data.topics) ? data.topics : [])
        setStats(Array.isArray(data.stats) ? data.stats : [])
        setSteps(Array.isArray(data.steps) ? data.steps : [])
        setTypedWords(Array.isArray(data.typedWords) ? data.typedWords : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayTopics = topics.slice(0, 8)

  /* ── Inline keyframes injected once ── */
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes orbit {
        0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes train-move {
        0%   { transform: translateX(-8px); }
        100% { transform: translateX(8px); }
      }
      .fade-up { animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) both; }
      .fade-up-1 { animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) 0.1s both; }
      .fade-up-2 { animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) 0.2s both; }
      .fade-up-3 { animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) 0.3s both; }
      .fade-up-4 { animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) 0.4s both; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <PageWrapper>

      {/* ══════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: '#05050a' }}
      >
        {/* Deep space starfield */}
        <StarField />

        {/* Scanline effect — subtle */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Atmospheric orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-20%', left: '30%', width: 800, height: 800,
            background: 'radial-gradient(ellipse, rgba(6,217,110,0.06) 0%, transparent 60%)',
            filter: 'blur(40px)',
            animation: 'glow-pulse 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-10%', right: '-10%', width: 600, height: 600,
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '40%', left: '-5%', width: 400, height: 400,
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 60%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Horizon line */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '65%',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,217,110,0.15) 30%, rgba(6,217,110,0.25) 50%, rgba(6,217,110,0.15) 70%, transparent 100%)',
          }}
        />

        {/* Main content */}
        <div className="page-container relative z-10 py-32 w-full">
          <div className="grid lg:grid-cols-[1fr_480px] gap-20 items-center">

            {/* ── Left: Copy ── */}
            <div className="space-y-8">

              {/* Eyebrow */}
              <div className="fade-up">
                <div
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(6,217,110,0.06)',
                    border: '1px solid rgba(6,217,110,0.18)',
                    color: '#06d96e',
                  }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: '#06d96e', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
                    />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#06d96e' }} />
                  </span>
                  One Platform · Every Developer Need
                </div>
              </div>

              {/* Headline */}
              <div className="fade-up-1">
                <h1
                  className="font-black leading-[1.0] tracking-tighter"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'white' }}
                >
                  Learn CS like
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #06d96e 0%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    never before.
                  </span>
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7em' }}>
                    Master{' '}
                  </span>
                  <span
                    className="relative"
                    style={{ color: 'white', fontSize: '0.7em' }}
                  >
                    {typed || '\u00A0'}
                    <span
                      className="absolute -right-1 top-1 bottom-1 w-[3px] rounded-full"
                      style={{ background: '#06d96e', animation: 'glow-pulse 1s ease-in-out infinite' }}
                    />
                  </span>
                </h1>
              </div>

              {/* Sub */}
              <p
                className="fade-up-2 text-lg leading-relaxed max-w-xl"
                style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}
              >
                Visual explanations. A place where learning tech actually feels organized.
                <span className="block mt-1" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  From what is Java to job-ready. Under one roof.
                </span>
              </p>

              {/* Feature pills */}
              <div className="fade-up-3 flex flex-wrap gap-2">
                {[
                  { icon: '🎬', label: 'Visual Lessons', color: '#06d96e' },
                  { icon: '🤖', label: 'AI Doubt Solver', color: '#06b6d4' },
                  { icon: '🏗️', label: 'Project Builder', color: '#f97316' },
                  { icon: '🔥', label: 'Daily Streaks', color: '#fb923c' },
                  { icon: '🏆', label: 'XP & Ranks', color: '#eab308' },
                ].map(p => (
                  <AiFeaturePill key={p.label} {...p} />
                ))}
              </div>

              {/* CTAs */}
              <div className="fade-up-4 flex flex-wrap gap-4">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #06d96e, #06b6d4)',
                    color: '#05050a',
                    boxShadow: '0 0 40px rgba(6,217,110,0.3), 0 0 80px rgba(6,217,110,0.1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 0 60px rgba(6,217,110,0.5), 0 0 120px rgba(6,217,110,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(6,217,110,0.3), 0 0 80px rgba(6,217,110,0.1)'
                  }}
                >
                  {isAuthenticated ? '→ Open Dashboard' : '🚀 Start for Free'}
                </Link>
                <Link
                  to="/topics"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Explore World Map
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* ── Right: Cinematic World Preview Card ── */}
            <div className="hidden lg:block relative fade-up-2">

              {/* Floating badges */}
              <FloatingBadge icon="⚡" text="Level 3 unlocked" color="#eab308" style={{ top: -16, left: -24, animationDelay: '0s' }} />
              <FloatingBadge icon="🔥" text="7-day streak!" color="#f97316" style={{ bottom: '30%', left: -32, animationDelay: '2s' }} />
              <FloatingBadge icon="🏆" text="+50 XP earned" color="#a78bfa" style={{ top: '20%', right: -24, animationDelay: '1s' }} />

              {/* Main card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(8,8,16,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(6,217,110,0.06)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      java-kingdom · lesson 3
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-black px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(6,217,110,0.1)', color: '#06d96e' }}
                  >
                    LIVE
                  </span>
                </div>

                {/* Lesson preview */}
                <div className="p-5">
                  {/* Topic breadcrumb */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Java Kingdom</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
                    <span className="text-[10px]" style={{ color: '#f97316' }}>Stack vs Queue</span>
                  </div>

                  {/* Visual animation preview — Stack demo */}
                  <div
                    className="relative rounded-2xl p-4 mb-4"
                    style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.12)' }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#f97316' }}>
                      ▶ Visual Playing
                    </p>

                    {/* Stack visualization */}
                    <div className="flex gap-6 items-end justify-center py-2">
                      {/* Stack */}
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-[9px] text-center mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>STACK</p>
                        {['🟥 C', '🟧 B', '🟩 A'].map((item, i) => (
                          <div
                            key={i}
                            className="w-20 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background: i === 0 ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${i === 0 ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)'}`,
                              color: i === 0 ? '#f97316' : 'rgba(255,255,255,0.5)',
                              boxShadow: i === 0 ? '0 0 12px rgba(249,115,22,0.2)' : 'none',
                              animation: i === 0 ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                            }}
                          >
                            {item}
                          </div>
                        ))}
                        <div
                          className="w-20 h-1 rounded-full mt-1"
                          style={{ background: 'rgba(249,115,22,0.3)' }}
                        />
                        <p className="text-[8px]" style={{ color: 'rgba(249,115,22,0.6)' }}>← POP first</p>
                      </div>

                      {/* vs */}
                      <div className="text-center mb-6">
                        <span className="text-xs font-black" style={{ color: 'rgba(255,255,255,0.2)' }}>vs</span>
                      </div>

                      {/* Queue */}
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-[9px] text-center mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>QUEUE</p>
                        {['🟩 A →', '🟧 B →', '🟥 C →'].map((item, i) => (
                          <div
                            key={i}
                            className="w-20 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background: i === 2 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${i === 2 ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.06)'}`,
                              color: i === 2 ? '#22c55e' : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {item}
                          </div>
                        ))}
                        <div
                          className="w-20 h-1 rounded-full mt-1"
                          style={{ background: 'rgba(34,197,94,0.3)' }}
                        />
                        <p className="text-[8px]" style={{ color: 'rgba(34,197,94,0.6)' }}>FIFO order</p>
                      </div>
                    </div>
                  </div>

                  {/* Train journey progress */}
                  <div
                    className="rounded-xl p-3 mb-4"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        🚂 Journey Progress
                      </span>
                      <span className="text-[9px] font-bold" style={{ color: '#f97316' }}>3 / 10</span>
                    </div>
                    <TrainTrack
                      lessons={['JVM', 'Memory', 'Stack', 'OOP', 'Arrays']}
                      color="#f97316"
                    />
                  </div>

                  {/* AI corner */}
                  <div
                    className="flex items-center gap-2.5 rounded-xl p-3"
                    style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: 'rgba(6,182,212,0.15)' }}
                    >
                      🤖
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: '#06b6d4' }}>
                        AI Doubt Solver
                      </p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Why does stack use LIFO? → Ask anything...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card glow overlay */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                  style={{ background: 'radial-gradient(ellipse at top right, rgba(249,115,22,0.04) 0%, transparent 60%)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom atmospheric fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #05050a, transparent)' }}
        />
      </section>


      {/* ══════════════════════════════════════
          SECTION 2 — STATS COUNTER BAR
      ══════════════════════════════════════ */}
      <section className="py-6" style={{ background: '#05050a' }}>
        <div className="page-container">
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {(stats.length
              ? stats
              : [
                  { icon: '🎓', value: '12000+', label: 'Learners', color: '#06d96e' },
                  { icon: '📚', value: '150+', label: 'Lessons', color: '#06b6d4' },
                  { icon: '🧪', value: '500+', label: 'Quiz Questions', color: '#f97316' },
                  { icon: '🔥', value: '98%', label: 'Love It', color: '#eab308' },
                ]
            ).map((s, i) => (
              <StatCounter key={i} {...s} color={s.color || '#06d96e'} started={statsInView} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          SECTION 3 — WORLD MAP (Topic Explorer)
      ══════════════════════════════════════ */}
      <section className="py-24 relative" style={{ background: '#05050a' }}>
        {/* Background nebula */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 60% 50%, rgba(6,217,110,0.03) 0%, transparent 55%)',
          }}
        />

        <div className="page-container relative" ref={mapRef}>
          {/* Section header */}
          <div
            className="text-center mb-16"
            style={{
              opacity: mapInView ? 1 : 0,
              transform: mapInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-[0.3em] mb-4"
              style={{ color: '#06d96e' }}
            >
              🗺️ World Map
            </p>
            <h2
              className="font-black leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'white' }}
            >
              Choose your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #06d96e, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                destination.
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Each region is a world of knowledge. Click to begin your journey.
              <span className="block mt-1" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                Complete lessons → train reaches destination → region unlocked.
              </span>
            </p>
          </div>

          {/* World map grid */}
          {loading ? (
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {Array(6).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl animate-pulse"
                  style={{
                    minHeight: 220,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}
            >
              {displayTopics.map((topic, i) => (
                <div
                  key={topic.id}
                  style={{
                    opacity: mapInView ? 1 : 0,
                    transform: mapInView ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
                  }}
                >
                  <RegionCard topic={topic} index={i} />
                </div>
              ))}

              {/* View all card */}
              {topics.length > 8 && (
                <Link
                  to="/topics"
                  className="group rounded-3xl flex flex-col items-center justify-center text-center p-8 transition-all duration-400"
                  style={{
                    minHeight: 220,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.borderColor = 'rgba(6,217,110,0.3)'
                    e.currentTarget.style.background = 'rgba(6,217,110,0.03)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-400 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    🌍
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">More Territories</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    +{topics.length - 8} regions to explore
                  </p>
                </Link>
              )}
            </div>
          )}

          {/* View all link */}
          <div className="text-center mt-10">
            <Link
              to="/topics"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#06d96e' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
            >
              View full world map
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          SECTION 4 — HOW THE JOURNEY WORKS
      ══════════════════════════════════════ */}
      <section className="py-24" style={{ background: '#05050a' }}>
        <div className="page-container">
          {/* Divider */}
          <div
            className="h-px mb-20"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
          />

          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Steps */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#06d96e' }}>
                The Journey
              </p>
              <h2
                className="font-black leading-tight mb-12"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'white' }}
              >
                Not just learning.
                <br />
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>An actual journey.</span>
              </h2>
              <div>
                {(steps.length
                  ? steps
                  : [
                      { icon: '🗺️', title: 'Choose your region', desc: 'Pick a topic from the world map. Each region has its own personality, difficulty, and destination.', accent: '#06d96e' },
                      { icon: '🚂', title: 'Board the train', desc: 'Every topic is a train journey. Each lesson is a station. You move forward as you learn — one station at a time.', accent: '#06b6d4' },
                      { icon: '🎬', title: 'See it, don\'t just read it', desc: 'Animated visuals show exactly how things work internally. No walls of text. No memorizing. Actual understanding.', accent: '#f97316' },
                      { icon: '🤖', title: 'AI answers your doubts', desc: 'Stuck on a concept? Ask the AI. It knows which lesson you are on and gives a pinpoint explanation instantly.', accent: '#a78bfa' },
                      { icon: '🏗️', title: 'Build a real project', desc: 'After the journey ends, build something real. Platform breaks it into tasks and guides you step by step.', accent: '#eab308' },
                    ]
                ).map((s, i, arr) => (
                  <JourneyStep
                    key={i}
                    num={i + 1}
                    icon={s.icon}
                    title={s.title}
                    desc={s.desc}
                    color={s.accent || '#06d96e'}
                    isLast={i === arr.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Right: AI + Features showcase */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#06b6d4' }}>
                🤖 AI Superpowers
              </p>
              <h2
                className="font-black leading-tight mb-8"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'white' }}
              >
                AI everywhere,
                <br />
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>not just a chatbot.</span>
              </h2>

              {[
                {
                  icon: '💬', title: 'Doubt Solver',
                  desc: 'Ask anything mid-lesson. AI knows exactly which concept you are on.',
                  color: '#06b6d4', sample: '"Why does this throw NullPointerException?" → Answered in 2 seconds.',
                },
                {
                  icon: '🔍', title: 'Code Explainer',
                  desc: 'Every code block has a "Why does this work?" button. AI explains each line.',
                  color: '#06d96e', sample: 'Click any line → get plain English explanation instantly.',
                },
                {
                  icon: '🏗️', title: 'Project Breakdown',
                  desc: 'Pick a project. AI breaks it into daily tasks so you never stare at a blank screen.',
                  color: '#f97316', sample: '"Build a grade calculator" → Week-by-week guided plan.',
                },
                {
                  icon: '🧠', title: 'Blind Spot Scanner',
                  desc: 'Diagnostic quiz that finds what you think you know but actually do not.',
                  color: '#a78bfa', sample: 'Red zones = concepts you are confidently wrong about.',
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group flex gap-4 p-5 rounded-2xl transition-all duration-300 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${f.color}06`
                    e.currentTarget.style.borderColor = `${f.color}20`
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-0.5">{f.title}</h4>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                    <p className="text-[10px] font-mono px-2 py-1 rounded-lg inline-block" style={{ background: `${f.color}10`, color: f.color }}>
                      {f.sample}
                    </p>
                  </div>
                </div>
              ))}

              {/* Bottom CTA */}
              <div
                className="p-5 rounded-2xl mt-2"
                style={{ background: 'linear-gradient(135deg, rgba(6,217,110,0.06), rgba(6,182,212,0.04))', border: '1px solid rgba(6,217,110,0.15)' }}
              >
                <p className="font-black text-sm text-white mb-1">Ready to actually understand CS?</p>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  No credit card. No BS. Start your first journey in 30 seconds.
                </p>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #06d96e, #06b6d4)', color: '#05050a' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {isAuthenticated ? '→ Open Dashboard' : '→ Begin Journey Free'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          SECTION 5 — FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24" style={{ background: '#05050a' }}>
        <div className="page-container">
          <div
            className="relative overflow-hidden rounded-3xl text-center px-8 py-20"
            style={{ background: 'rgba(6,217,110,0.03)', border: '1px solid rgba(6,217,110,0.1)' }}
          >
            {/* Corner lines */}
            <div className="absolute top-5 left-5 w-10 h-10 border-t border-l rounded-tl-xl" style={{ borderColor: 'rgba(6,217,110,0.2)' }} />
            <div className="absolute bottom-5 right-5 w-10 h-10 border-b border-r rounded-br-xl" style={{ borderColor: 'rgba(6,217,110,0.2)' }} />

            {/* Top shimmer */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,217,110,0.5), rgba(6,182,212,0.3), transparent)' }}
            />

            {/* Glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-30%', left: '50%', transform: 'translateX(-50%)',
                width: 500, height: 400,
                background: 'radial-gradient(ellipse, rgba(6,217,110,0.08) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Emoji train row */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              {['🏰', '🌲', '🌊', '🏔️', '⚛️', '🗄️', '⛰️', '🏛️'].map((e, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    animation: `float ${4 + i * 0.3}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>

            {/* Headline */}
            <h2
              className="font-black mb-4 relative z-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'white', lineHeight: 1.1 }}
            >
              Your CS journey starts
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #06d96e 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                with one click.
              </span>
            </h2>
            <p
              className="text-base mb-10 max-w-sm mx-auto relative z-10"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Every expert was once a beginner who chose to keep going.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link
                to={isAuthenticated ? '/dashboard' : '/signup'}
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-sm transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #06d96e, #06b6d4)',
                  color: '#05050a',
                  boxShadow: '0 0 50px rgba(6,217,110,0.25)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 0 80px rgba(6,217,110,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(6,217,110,0.25)'
                }}
              >
                {isAuthenticated ? '→ Open Dashboard' : '🚀 Start Journey — Free'}
              </Link>
              <Link
                to="/topics"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Explore World Map
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer
        className="py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05050a' }}
      >
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs"
              style={{ background: 'linear-gradient(135deg, #06d96e, #06b6d4)', color: '#05050a' }}
            >
              LC
            </div>
            <div>
              <span className="font-black text-sm text-white">LetsCrackIT</span>
              <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                · One roof for every developer
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {[['Topics', '/topics'], ['Interview', '/interview-questions'], ['Quiz', '/quiz'], ['Sign Up', '/signup']].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="transition-colors duration-200"
                onMouseEnter={e => { e.currentTarget.style.color = '#06d96e' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </PageWrapper>
  )
}