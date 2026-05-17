import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHomeApi } from '../api/homeApi'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'
import { TOPIC_COLORS } from '../utils/constants'

/* ─── Typewriter hook ─── */
function useTypewriter(words, speed = 75, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return
    const current = words[wordIdx]
    const delay = deleting ? speed / 2 : speed
    const timer = setTimeout(() => {
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
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx, words, speed, pause])
  return display
}

/* ─── Counter hook ─── */
function useCounter(target, duration = 1500, started = false) {
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

/* ─── InView hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ─── Animated Stat ─── */
function Stat({ icon, value, label, delay, started }) {
  const count = useCounter(value, 1400, started)
  const suffix = String(value).replace(/[0-9]/g, '')
  return (
    <div className="flex flex-col items-center gap-2 text-center" style={{ animationDelay: `${delay}ms` }}>
      <span className="text-3xl">{icon}</span>
      <span className="font-display font-bold text-3xl lg:text-4xl" style={{ color: 'var(--brand)' }}>
        {started ? `${count}${suffix}` : '—'}
      </span>
      <span className="text-xs text-muted font-medium">{label}</span>
    </div>
  )
}

/* ─── Topic Bento Card ─── */

const FEATURED_INDEXES = [0, 4]

function TopicCard({ topic, index }) {
  const tc =
    TOPIC_COLORS[topic.slug] || {
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    }

  const featured = FEATURED_INDEXES.includes(index)

  return (
    <Link
      to={`/lessons/${topic.slug}`}
      className={`
        group
        relative
        overflow-hidden
        rounded-[28px]
        transition-all
        duration-500
      `}
      style={{
        minHeight: featured ? '260px' : '220px',

        background: `
          linear-gradient(
            180deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.03) 100%
          )
        `,

        border: '1px solid rgba(255,255,255,0.08)',

        backdropFilter: 'blur(18px)',

        boxShadow: `
          0 10px 30px rgba(0,0,0,0.28)
        `,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform =
          'translateY(-6px)'

        e.currentTarget.style.borderColor =
          `${tc.color}40`

        e.currentTarget.style.boxShadow = `
          0 20px 60px rgba(0,0,0,0.45),
          0 0 0 1px ${tc.color}15
        `
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform =
          'translateY(0px)'

        e.currentTarget.style.borderColor =
          'rgba(255,255,255,0.08)'

        e.currentTarget.style.boxShadow =
          '0 10px 30px rgba(0,0,0,0.28)'
      }}
    >
      {/* gradient glow */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-700
        "
        style={{
          background: `
            radial-gradient(
              circle at top right,
              ${tc.color}15,
              transparent 45%
            )
          `,
        }}
      />

      {/* top accent */}
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-[2px]
          opacity-70
        "
        style={{
          background: `
            linear-gradient(
              90deg,
              ${tc.color},
              transparent
            )
          `,
        }}
      />

      <div className="relative z-10 h-full p-6 flex flex-col">
        {/* top */}
        <div className="flex items-start justify-between">
          <div
            className="
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              text-3xl
              transition-transform
              duration-500
              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            {topic.icon || '✨'}
          </div>

          <div
            className="
              px-3
              py-1.5
              rounded-full
              text-[10px]
              uppercase
              tracking-[0.18em]
              font-bold
            "
            style={{
              background: `${tc.color}15`,
              color: tc.color,
              border: `1px solid ${tc.color}25`,
            }}
          >
            {featured ? 'Featured' : 'Popular'}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <h3
            className="
    relative
    inline-block
    w-fit
    font-display
    font-bold
    text-2xl
    leading-tight
    tracking-tight
  "
            style={{
              color: 'white',
            }}
          >
            {/* glow underline */}
            <span
              className="
      absolute
      left-0
      bottom-1
      h-[10px]
      rounded-full
    "
              style={{
                width: '100%',
                background: `
        linear-gradient(
          90deg,
          ${tc.color}55,
          transparent
        )
      `,
                filter: 'blur(10px)',
                opacity: 0.7,
              }}
            />

            {topic.title}
          </h3>

          <p
            className="
              mt-3
              text-sm
              leading-relaxed
              max-w-[90%]
            "
            style={{
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            {topic.description ||
              `Master ${topic.title} with notes, quizzes, interview prep and interactive learning.`}
          </p>
        </div>

        {/* footer */}
        <div
          className="
            flex
            items-center
            justify-between
            pt-5
            border-t
          "
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                px-3
                py-1.5
                rounded-xl
                text-xs
                font-semibold
                whitespace-nowrap
              "
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              {topic.moduleCount || 0} Modules
            </div>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              opacity-0
              translate-x-2
              group-hover:opacity-100
              group-hover:translate-x-0
              transition-all
              duration-300
            "
            style={{
              color: tc.color,
            }}
          >
            Explore

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── How-it-works step ─── */
function Step({ num, icon, title, desc, accent, isLast }) {
  return (
    <div className="flex gap-5 group">
      <div className="flex flex-col items-center">
        <div
          className="
    min-w-[72px]
    h-14
    px-4
    rounded-2xl
    flex
    items-center
    justify-center
    flex-shrink-0
    transition-transform
    duration-300
    group-hover:scale-105
  "
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}33`,
          }}
        >
          <span
            className="
      text-lg
      font-medium
      whitespace-nowrap
    "
            style={{
              color: 'white',
            }}
          >
            {icon}
          </span>
        </div>
        {!isLast && <div className="flex-1 w-px mt-3" style={{ background: 'rgba(255,255,255,0.05)' }} />}
      </div>
      <div className={!isLast ? 'pb-10' : ''}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold tabular-nums" style={{ color: accent }}>0{num}</span>
          <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function Home() {
  const { isAuthenticated } = useAuth()
  const [topics, setTopics] = useState([])
  const [stats, setStats] = useState([])
  const [steps, setSteps] = useState([])
  const [features, setFeatures] = useState([])
  const [typedWords, setTypedWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsRef, statsInView] = useInView(0.3)

  const typed = useTypewriter(typedWords)

  useEffect(() => {
    getHomeApi()
      .then(({ data }) => {
        setTopics(Array.isArray(data.topics) ? data.topics : [])
        setStats(Array.isArray(data.stats) ? data.stats : [])
        setSteps(Array.isArray(data.steps) ? data.steps : [])
        setFeatures(Array.isArray(data.features) ? data.features : [])
        setTypedWords(Array.isArray(data.typedWords) ? data.typedWords : [])
      })
      .catch(() => {
        setTopics([])
        setStats([])
        setSteps([])
        setFeatures([])
        setTypedWords([])
      })
      .finally(() => setLoading(false))
  }, [])

  const displayTopics = topics.filter(t => t.slug !== 'dsa').slice(0, 9)

  return (
    <PageWrapper>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden">

        {/* Layered background */}
        <div className="absolute inset-0" style={{ background: '#080809' }} />
        <div className="absolute inset-0 bg-grid-pattern" style={{ opacity: 0.6 }} />

        {/* Radial glows */}
        <div className="absolute pointer-events-none" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '700px', background: 'radial-gradient(ellipse, rgba(6,217,110,0.07) 0%, transparent 65%)', filter: 'blur(2px)' }} />
        <div className="absolute pointer-events-none" style={{ top: '20%', right: '-15%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-5%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)' }} />

        {/* Diagonal accent lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="absolute w-full h-px pointer-events-none" style={{
            top: `${18 + i * 14}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,217,110,0.07) 40%, rgba(6,217,110,0.12) 50%, rgba(6,217,110,0.07) 60%, transparent 100%)',
            transform: `rotate(${-2 + i}deg) scaleX(1.4)`,
          }} />
        ))}

        {/* Floating dots */}
        {[
          { top: '15%', left: '6%', w: 4, duration: 7, delay: 0 },
          { top: '60%', left: '4%', w: 6, duration: 9, delay: 2 },
          { top: '80%', left: '14%', w: 3, duration: 6, delay: 1 },
          { top: '22%', right: '9%', w: 5, duration: 8, delay: 3 },
          { top: '68%', right: '7%', w: 4, duration: 7, delay: 0.5 },
          { top: '40%', right: '20%', w: 7, duration: 10, delay: 1.5 },
        ].map((p, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full" style={{
            top: p.top, left: p.left, right: p.right,
            width: p.w, height: p.w,
            background: `radial-gradient(circle, rgba(6,217,110,0.7), transparent 70%)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}

        <div className="page-container relative z-10 py-24 w-full">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

            {/* ── Left copy ── */}
            <div className="space-y-7">
              {/* Eyebrow */}
              <div className="animate-fade-in">
                <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full"
                  style={{ background: 'rgba(6,217,110,0.08)', border: '1px solid rgba(6,217,110,0.2)', color: '#06d96e' }}>
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#06d96e' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#06d96e' }} />
                  </span>
                  Free · Open · CS-focused
                </span>
              </div>

              {/* Headline */}
{/* Headline */}
<div className="animate-slide-up">
  <h1
    className="font-display font-bold leading-[1.06] tracking-[-0.04em]"
    style={{
      fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
      color: 'var(--text-primary)',
    }}
  >
    Your Place to Learn
    <br />
    and Master{' '}

    <span className="relative inline-block">
      <span
        style={{
          background:
            'linear-gradient(135deg, #06d96e 0%, #2df28a 45%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {typed || '\u00A0'}
      </span>

      {/* Blinking cursor */}
      <span
        className="absolute -right-1 top-1 bottom-1 w-[3px] rounded-full animate-pulse"
        style={{ background: '#06d96e' }}
      />
    </span>
  </h1>
</div>

             {/* Sub */}
              <p
                className="fade-up-2 text-lg leading-relaxed max-w-xl"
                style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}
              >
                A place where learning tech actually feels interesting.
                <span className="block mt-1" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  Learn deeply. Build confidently. Practice endlessly.
                </span>
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 animate-slide-up animate-delay-200">
                {['📝 Rich Notes','⚡ Code Challenges', '💬 Projects', '🧪 Quizzes'].map(f => (
                  <span key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 animate-slide-up animate-delay-300">
                <Link
                  to="/topics"
                 className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #06d96e, #06b6d4)',color: '#05050a',
                    boxShadow: '0 0 40px rgba(6,217,110,0.3), 0 0 80px rgba(6,217,110,0.1)', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2df28a'; e.currentTarget.style.boxShadow = '0 0 55px rgba(6,217,110,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#06d96e'; e.currentTarget.style.boxShadow = '0 0 40px rgba(6,217,110,0.28)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Browse Topics
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* ── Right: Terminal card ── */}
            <div className="hidden lg:block animate-fade-in animate-delay-200 relative">
              <div className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(10,10,16,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(6,217,110,0.07)',
                  backdropFilter: 'blur(20px)',
                }}>

                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                  <span className="ml-2 text-[11px] text-muted font-mono">letscrack — learning session</span>
                </div>

                {/* Terminal body */}
                <div className="p-5 font-mono text-[11px] space-y-2.5" style={{ background: 'rgba(4,4,10,0.7)' }}>
                  <div style={{ color: '#4ade80' }}>
                    <span style={{ color: '#818cf8' }}>➜</span>{' '}
                    <span style={{ color: '#c084fc' }}>~/letscrack</span>{' '}
                    <span style={{ color: '#94a3b8' }}>start</span>
                  </div>

                  <div className="space-y-1" style={{ color: '#475569' }}>
                    {[
                      { lbl: '✓ Topics indexed', val: `${topics.length || '...'} ready`, c: '#4ade80' },
                      { lbl: '✓ XP engine', val: 'active', c: '#4ade80' },
                      { lbl: '✓ Project paths', val: 'active', c: '#4ade80' },
                      { lbl: '⟳ Community sync', val: 'live', c: '#facc15' },
                      { lbl: '⟳ Quiz engine', val: 'loaded', c: '#facc15' },
                    ].map(r => (
                      <div key={r.lbl} className="flex items-center gap-1.5">
                        <span style={{ color: r.c }}>{r.lbl}</span>
                        <span className="flex-1 opacity-30" style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)' }} />
                        <span style={{ color: '#64748b' }}>{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-3 mt-3" style={{ background: 'rgba(6,217,110,0.06)', border: '1px solid rgba(6,217,110,0.14)' }}>
                    <div className="text-[10px] mb-2" style={{ color: 'var(--brand)' }}>{'// your session'}</div>
                    {[
                      { k: 'notes_read', v: '—', vc: '#94a3b8' },
                      { k: 'xp_earned', v: '0', vc: '#4ade80' },
                      { k: 'streak_days', v: '🔥 login', vc: '#fb923c' },
                    ].map(r => (
                      <div key={r.k} className="flex justify-between text-[10px]" style={{ color: '#475569' }}>
                        <span>{r.k}</span><span style={{ color: r.vc }}>{r.v}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span style={{ color: '#818cf8' }}>$</span>{' '}
                    <span style={{ color: '#94a3b8' }}>status: </span>
                    <span style={{ color: 'var(--brand)' }}>ready</span>{' '}
                    <span className="animate-pulse" style={{ color: 'var(--brand)' }}>█</span>
                  </div>
                </div>

                {/* Inner glow */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse at top right, rgba(6,217,110,0.04) 0%, transparent 60%)' }} />
              </div>

              {/* Floating badges */}
              <div className="absolute -right-5 top-1/4 px-3.5 py-2.5 rounded-xl text-xs font-bold animate-float"
                style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa', backdropFilter: 'blur(12px)', animationDelay: '1.2s' }}>
                🏆 +20 XP earned
              </div>
              <div className="absolute -left-8 bottom-1/3 px-3.5 py-2.5 rounded-xl text-xs font-bold animate-float"
                style={{ background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.35)', color: '#fb923c', backdropFilter: 'blur(12px)', animationDelay: '2.8s' }}>
                🚀 Build mode activated!
              </div>
              <div className="absolute -left-6 top-10 px-3.5 py-2.5 rounded-xl text-xs font-bold animate-float"
                style={{ background: 'rgba(6,217,110,0.12)', border: '1px solid rgba(6,217,110,0.3)', color: '#06d96e', backdropFilter: 'blur(12px)', animationDelay: '0.5s' }}>
                ⚡ Level 3 unlocked
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #080809, transparent)' }} />
      </section>


      {/* ══════ STATS ══════ */}
      <section ref={statsRef} className="py-16">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl px-8 py-12"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(6,217,110,0.04) 0%, transparent 70%)' }} />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l rounded-tl-lg" style={{ borderColor: 'rgba(6,217,110,0.25)' }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r rounded-br-lg" style={{ borderColor: 'rgba(6,217,110,0.25)' }} />

            <div className="grid grid-cols-3 gap-10 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <Stat
                  key={s.label || i}
                  {...s}
                  delay={i * 100}
                  started={statsInView}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════ TOPICS BENTO GRID ══════ */}
      <section className="py-20 relative"> <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 40%, rgba(139,92,246,0.05) 0%, transparent 55%)' }} /> <div className="page-container relative"> {/* Header */} <div className="flex items-end justify-between mb-10 gap-4 flex-wrap"> <div> <p className="section-label mb-2">Explore the library</p> <h2 className="font-display font-bold text-3xl lg:text-4xl" style={{ color: 'var(--text-primary)' }}> What will you{' '} <span style={{ background: 'linear-gradient(135deg, #06d96e, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', }}>master</span> next? </h2> </div> <Link to="/topics" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} > View all <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"> <path d="M5 12h14M12 5l7 7-7 7" /> </svg> </Link> </div>

        {/* GRID */}
        {loading ? (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns:
                'repeat(auto-fill,minmax(240px,1fr))',
              gridAutoRows: '180px',
            }}
          >
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="
                rounded-[30px]
                animate-pulse
              "
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                />
              ))}
          </div>
        ) : (
          <div
            className="
    grid
    gap-5
  "
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {displayTopics.map((topic, i) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={i}
              />
            ))}

            {topics.length > 9 && (
              <Link
                to="/topics"
                className="
        group
        rounded-[28px]
        flex
        flex-col
        items-center
        justify-center
        text-center
        p-8
        min-h-[220px]
        transition-all
        duration-500
      "
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',

                  border:
                    '1px dashed rgba(255,255,255,0.1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform =
                    'translateY(-6px)'

                  e.currentTarget.style.borderColor =
                    'rgba(6,217,110,0.25)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform =
                    'translateY(0px)'

                  e.currentTarget.style.borderColor =
                    'rgba(255,255,255,0.1)'
                }}
              >
                <div
                  className="
          w-20
          h-20
          rounded-3xl
          flex
          items-center
          justify-center
          text-4xl
          mb-5
          transition-transform
          duration-500
          group-hover:scale-110
          group-hover:rotate-6
        "
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  ✨
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Explore More
                </h3>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  +{topics.length - 9} more topics waiting
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
      </section>


      {/* ══════ HOW IT WORKS + FEATURES ══════ */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16">

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
                {steps.map((s, i) => (
                  <Step
                    key={s.title || i}
                    num={i + 1}
                    {...s}
                    isLast={i === steps.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Feature cards */}
            <div className="space-y-3.5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-5 rounded-2xl transition-all duration-200 group cursor-default animate-slide-up"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: `${i * 70}ms` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.accent + '40'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                >
                  <div
                    className="
    min-w-[72px]
    h-14
    px-3
    rounded-2xl
    flex
    items-center
    justify-center
    flex-shrink-0
    transition-transform
    duration-300
    group-hover:scale-105
  "
                    style={{
                      background: `${f.accent}18`,
                      border: `1px solid ${f.accent}30`,
                    }}
                  >
                    <span
                      className="
      text-sm
      font-semibold
      whitespace-nowrap
    "
                      style={{
                        color: f.accent,
                      }}
                    >
                      {f.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}

              {/* CTA inside the features column */}
              <div className="p-5 rounded-2xl mt-2"
                style={{ background: 'linear-gradient(135deg, rgba(6,217,110,0.08) 0%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(6,217,110,0.18)' }}>
                <p className="font-semibold text-sm text-primary mb-1">Ready to actually understand CS?</p>
                <p className="text-xs text-muted mb-3">No credit card. No BS. Just learning.</p>
                <Link to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold"
                  style={{ background: 'var(--brand)', color: '#080809' }}>
                  {isAuthenticated ? '→ Dashboard' : '→ Begin Journey Free'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════ FINAL CTA ══════ */}
      <section className="py-20">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)' }}>

            <div className="absolute inset-0 bg-grid-pattern opacity-60" />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,217,110,0.6), rgba(139,92,246,0.4), transparent)' }} />
            <div className="absolute pointer-events-none" style={{
              top: '-30%', left: '50%', transform: 'translateX(-50%)',
              width: '600px', height: '400px',
              background: 'radial-gradient(ellipse, rgba(6,217,110,0.09) 0%, transparent 70%)', filter: 'blur(20px)',
            }} />

            <div className="relative z-10 px-8 py-16 lg:py-20">
              {/* Emoji cluster */}
              <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                {['🧮', '⚛️', '🟨', '☕', '🐍', '🗄️'].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg animate-float"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${i * 0.4}s` }}>
                    {e}
                  </div>
                ))}
              </div>

<h2
  className="font-display font-bold mb-4"
  style={{
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  }}
>
  Keep learning and building
  <br />
  <span
    style={{
      background:
        'linear-gradient(135deg, #06d96e 0%, #2df28a 50%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    Every day.
  </span>
</h2>
<p
  className="text-base mb-10 max-w-md mx-auto"
  style={{ color: 'var(--text-secondary)' }}
>
  A place to learn, practice, explore, and grow at your own pace.
</p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--brand)', color: '#080809', boxShadow: '0 0 45px rgba(6,217,110,0.28)', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2df28a'; e.currentTarget.style.boxShadow = '0 0 60px rgba(6,217,110,0.45)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(6,217,110,0.28)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {isAuthenticated ? '→ Open Dashboard' : '🚀 Create Free Account'}
                </Link>
                <Link to="/topics"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Browse Topics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════ FOOTER ══════ */}
      <footer className="hidden border-t py-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ background: 'var(--brand)', color: '#080809' }}>LC</div>
            <span className="font-display font-bold text-sm text-primary">The LetsCrackIT</span>
            <span className="text-muted text-xs">· For CS students</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            {[['Topics', '/topics'],['Interview', '/interview-questions'], ['Quiz' , '/quiz'],['Sign Up', '/signup']].map(([label, to]) => (
              <Link key={to} to={to}
                className="transition-colors duration-200 hover:text-brand-400"
                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
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
