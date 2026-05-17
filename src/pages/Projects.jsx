import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getProjectsApi } from '../api/projectApi'
import PageWrapper from '../components/layout/PageWrapper'

/* ─── Palette matching home page accent system ─── */
const ACCENT_PALETTE = [
  { glow: '#06d96e', text: '#06d96e', pill: 'rgba(6,217,110,0.10)', border: 'rgba(6,217,110,0.22)' },
  { glow: '#7c6cfc', text: '#a89bff', pill: 'rgba(124,108,252,0.10)', border: 'rgba(124,108,252,0.25)' },
  { glow: '#06b6d4', text: '#4de8ff', pill: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.22)' },
  { glow: '#f59e0b', text: '#fbbf24', pill: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' },
  { glow: '#ec4899', text: '#f472b6', pill: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.22)' },
  { glow: '#8b5cf6', text: '#a78bfa', pill: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.22)' },
]

const DIFFICULTY_MAP = {
  Beginner:     { color: '#06d96e', bg: 'rgba(6,217,110,0.08)',   label: 'Beginner' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Intermediate' },
  Advanced:     { color: '#ec4899', bg: 'rgba(236,72,153,0.08)',  label: 'Advanced' },
}

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced']

const PROJECT_ICONS = ['⚡','🔥','🛠','🎯','🧠','🚀','💡','🌐','🔐','📡','⚙️','🧩']

function getAccent(i) { return ACCENT_PALETTE[i % ACCENT_PALETTE.length] }
function getIcon(i)   { return PROJECT_ICONS[i % PROJECT_ICONS.length] }

/* ─── useInView ─── */
function useInView(threshold = 0.15) {
  const ref  = useRef(null)
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

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 28,
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.025)',
      padding: 32,
      minHeight: 280,
      animation: 'shimmer 1.8s ease-in-out infinite',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:28 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.05)' }} />
        <div style={{ width:80, height:24, borderRadius:999, background:'rgba(255,255,255,0.04)' }} />
      </div>
      <div style={{ height:22, background:'rgba(255,255,255,0.06)', borderRadius:6, marginBottom:14, width:'60%' }} />
      <div style={{ height:14, background:'rgba(255,255,255,0.04)', borderRadius:6, marginBottom:9, width:'95%' }} />
      <div style={{ height:14, background:'rgba(255,255,255,0.04)', borderRadius:6, marginBottom:9, width:'80%' }} />
      <div style={{ height:14, background:'rgba(255,255,255,0.04)', borderRadius:6, width:'65%' }} />
    </div>
  )
}

/* ─── Project Card ─── */
function ProjectCard({ project, index, appeared }) {
  const [hovered, setHovered] = useState(false)
  const accent = getAccent(index)
  const icon   = getIcon(index)
  const diff   = DIFFICULTY_MAP[project.difficulty] || DIFFICULTY_MAP['Beginner']

  return (
    <Link
      to={`/projects/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 28,
        border: `1px solid ${hovered ? accent.border : 'rgba(255,255,255,0.07)'}`,
        background: hovered
          ? `radial-gradient(ellipse at 20% 10%, ${accent.glow}12 0%, transparent 55%), rgba(255,255,255,0.04)`
          : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(18px)',
        boxShadow: hovered
          ? `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px ${accent.glow}15`
          : '0 10px 32px rgba(0,0,0,0.28)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: appeared ? 1 : 0,
        transform: appeared
          ? hovered ? 'translateY(-8px)' : 'translateY(0)'
          : 'translateY(32px)',
        transition: appeared
          ? 'all 0.45s cubic-bezier(0.23,1,0.32,1)'
          : `opacity 0.6s ease ${index * 60}ms, transform 0.6s ease ${index * 60}ms`,
      }}
    >
      {/* Top accent line (home page pattern) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent.glow}, transparent)`,
        opacity: hovered ? 0.9 : 0.5,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Corner glow orb */}
      <div style={{
        position: 'absolute', top: -70, right: -70,
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent.glow}20 0%, transparent 70%)`,
        transform: hovered ? 'scale(1.6)' : 'scale(1)',
        transition: 'transform 0.7s ease',
        pointerEvents: 'none',
      }} />

      {/* Scanline on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(105deg, transparent 35%, ${accent.glow}07 50%, transparent 65%)`,
          animation: 'scanline 1.3s linear infinite',
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1, padding: 32 }}>
        {/* Header row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: accent.pill,
            border: `1px solid ${accent.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
            transform: hovered ? 'scale(1.1) rotate(4deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.4s ease',
          }}>{icon}</div>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {/* difficulty badge */}
            <span style={{
              background: diff.bg,
              color: diff.color,
              border: `1px solid ${diff.color}30`,
              borderRadius: 999, padding: '4px 13px',
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
            }}>{diff.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
          fontWeight: 600,
          color: '#f1f5f9',
          marginBottom: 10,
          lineHeight: 1.2,
          fontFamily: "'Syne', sans-serif",
          letterSpacing: '-0.02em',
        }}>
          {/* glow underline (from home page TopicCard) */}
          <span style={{ position:'relative', display:'inline-block' }}>
            <span style={{
              position: 'absolute', left: 0, bottom: 2,
              width: '100%', height: 8, borderRadius: 999,
              background: `linear-gradient(90deg, ${accent.glow}50, transparent)`,
              filter: 'blur(8px)', opacity: hovered ? 0.8 : 0,
              transition: 'opacity 0.4s ease',
            }} />
            {project.title}
          </span>
        </h3>

        {/* Description */}
        <p style={{
          color: 'rgba(148,163,184,0.82)',
          fontSize: 14, lineHeight: 1.78,
          marginBottom: 24,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{project.description}</p>

        {/* Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 18,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          gap: 10,
        }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {project.stepCount != null && (
              <span style={{
                background: accent.pill, color: accent.text,
                border: `1px solid ${accent.border}`,
                borderRadius: 999, padding: '3px 12px',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
              }}>{project.stepCount} steps</span>
            )}
            {project.techStack?.slice(0, 2).map(tech => (
              <span key={tech} style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(148,163,184,0.65)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 999, padding: '3px 10px',
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{tech}</span>
            ))}
          </div>

          {/* Arrow (home page explore pattern) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: accent.text, fontSize: 13, fontWeight: 700,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(8px)',
            transition: 'all 0.3s ease',
          }}>
            Open
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Stat item (mirrors home stats) ─── */
function StatPill({ value, label, color }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:7 }}>
      <span style={{
        fontSize: 28, fontWeight: 800,
        color: color,
        fontFamily: "'Syne', sans-serif",
      }}>{value}</span>
      <span style={{
        fontSize: 11, color: 'rgba(148,163,184,0.5)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        fontFamily: "'JetBrains Mono', monospace",
      }}>{label}</span>
    </div>
  )
}

/* ══════════════════════ MAIN ══════════════════════ */
export default function Projects() {
  const [projects,     setProjects]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [search,       setSearch]       = useState('')
  const [appeared,     setAppeared]     = useState(false)

  const [heroRef,  heroInView]  = useInView(0.1)
  const [statsRef, statsInView] = useInView(0.2)

  useEffect(() => {
    getProjectsApi()
      .then(({ data }) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => { setLoading(false); setTimeout(() => setAppeared(true), 80) })
  }, [])

  const filtered = projects
    .filter(p => activeFilter === 'All' || p.difficulty === activeFilter)
    .filter(p => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.techStack?.some(t => t.toLowerCase().includes(q))
      )
    })

  const stats = {
    total:        projects.length,
    beginner:     projects.filter(p => p.difficulty === 'Beginner').length,
    intermediate: projects.filter(p => p.difficulty === 'Intermediate').length,
    advanced:     projects.filter(p => p.difficulty === 'Advanced').length,
  }

  return (
    <PageWrapper>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

        @keyframes shimmer   { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes scanline  { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }

        .project-search:focus {
          outline: none;
          border-color: rgba(6,217,110,0.45) !important;
          background: rgba(6,217,110,0.04) !important;
          box-shadow: 0 0 0 3px rgba(6,217,110,0.08);
        }
        .filter-pill { transition: all 0.25s ease; }
        .filter-pill:hover { background: rgba(255,255,255,0.07) !important; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080809',
        color: '#f1f5f9',
        fontFamily: "'Syne', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Background grid (home page pattern) ── */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(6,217,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,217,110,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* ── Ambient glows (same as hero section) ── */}
        <div style={{
          position: 'fixed', top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 900, height: 700, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6,217,110,0.06) 0%, transparent 65%)',
          filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
          animation: 'float 9s ease-in-out infinite',
        }} />
        <div style={{
          position: 'fixed', top: '20%', right: '-15%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'float 12s ease-in-out 2s infinite reverse',
        }} />
        <div style={{
          position: 'fixed', bottom: '-5%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'float 10s ease-in-out 1s infinite',
        }} />

        {/* ── Diagonal accent lines (home hero pattern) ── */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: 'fixed', width: '100%', height: 1,
            top: `${18 + i * 14}%`, pointerEvents: 'none', zIndex: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,217,110,0.06) 40%, rgba(6,217,110,0.11) 50%, rgba(6,217,110,0.06) 60%, transparent 100%)',
            transform: `rotate(${-2 + i}deg) scaleX(1.4)`,
          }} />
        ))}

        {/* ── Floating dots ── */}
        {[
          { top:'14%', left:'5%',  w:4, dur:7,  del:0 },
          { top:'62%', left:'3%',  w:6, dur:9,  del:2 },
          { top:'82%', left:'13%', w:3, dur:6,  del:1 },
          { top:'20%', right:'8%', w:5, dur:8,  del:3 },
          { top:'70%', right:'6%', w:4, dur:7,  del:0.5 },
          { top:'42%', right:'19%',w:7, dur:11, del:1.5 },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'fixed',
            top: p.top, left: p.left, right: p.right,
            width: p.w, height: p.w, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,217,110,0.7), transparent 70%)',
            animation: `float ${p.dur}s ease-in-out ${p.del}s infinite`,
            pointerEvents: 'none', zIndex: 0,
          }} />
        ))}

        {/* ══ CONTENT ══ */}
        <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto', padding:'0 24px 100px' }}>

          {/* ──────────── HERO ──────────── */}
<div
  style={{
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 20px',
    opacity: appeared ? 1 : 0,
    transform: appeared
      ? 'translateY(0)'
      : 'translateY(30px)',
    transition:
      'all .8s cubic-bezier(0.23,1,0.32,1)',
  }}
>
            {/* Eyebrow — same style as home */}
            <div style={{ marginBottom: 28 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                borderRadius: 999,
                border: '1px solid rgba(6,217,110,0.2)',
                background: 'rgba(6,217,110,0.06)',
                padding: '8px 18px',
                fontSize: 11, fontWeight: 700,
                color: '#06d96e',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {/* ping dot */}
                <span style={{ position:'relative', display:'flex', width:8, height:8, flexShrink:0 }}>
                  <span style={{
                    position:'absolute', inset:0, borderRadius:'50%',
                    background:'#06d96e', opacity:0.75,
                    animation:'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
                  }} />
                  <span style={{ position:'relative', borderRadius:'50%', width:8, height:8, background:'#06d96e' }} />
                </span>
                🔨 Project Lab
              </span>
            </div>

            {/* Headline — topics page style */}
            <h1 className="
                font-display
                font-bold
                leading-[1.08]
                text-[clamp(2.4rem,4vw,4rem)]
                text-white
              ">
              Build while you
              <br />
              <span className="
                  relative
                  inline-block
                  bg-gradient-to-r
                  from-[#06d96e]
                  via-[#2df28a]
                  to-cyan-400
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_0_28px_rgba(6,217,110,0.2)]
                ">
                crack it.
              </span>
            </h1>

            {/* Sub — topics page pattern */}
            <p className="
              mx-auto
              mb-10
              mt-6
              max-w-[720px]
              text-[1.05rem]
              leading-[1.8]
              text-[#97a0cb]
            ">
              Every project is broken into tiny steps, connected to real concepts.
              Make big builds feel obvious.
            </p>

            {/* Feature pills — same as hero */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
              {['📦 Step-by-step','⚡ XP rewards','🛠 Real code','🎯 Beginner-friendly'].map(f => (
                <span key={f} style={{
                  padding:'6px 14px', borderRadius:10, fontSize:12, fontWeight:500,
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  color:'rgba(148,163,184,0.8)',
                }}>{f}</span>
              ))}
            </div>

            {/* Stats row */}
            {!loading && projects.length > 0 && (
              <div
                ref={statsRef}
                style={{
                  display:'flex', gap:32, flexWrap:'wrap',
                  opacity: statsInView ? 1 : 0,
                  transform: statsInView ? 'none' : 'translateY(12px)',
                  transition: 'all 0.6s ease 0.2s',
                }}
              >
                <StatPill value={stats.total}        label="Projects"     color="rgba(148,163,184,0.9)" />
                <StatPill value={stats.beginner}      label="Beginner"     color="#06d96e" />
                <StatPill value={stats.intermediate}  label="Intermediate" color="#f59e0b" />
                <StatPill value={stats.advanced}      label="Advanced"     color="#ec4899" />
              </div>
            )}
          </div>

          {/* ──────────── CONTROLS ──────────── */}
          <div style={{
            display:'flex', flexWrap:'wrap', gap:12,
            alignItems:'center', marginBottom:44,
            opacity: appeared ? 1 : 0,
            transform: appeared ? 'none' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.23,1,0.32,1) 0.15s',
          }}>
            {/* Search — same style as home's terminal inputs */}
            <div style={{ position:'relative', flex:'1 1 220px' }}>
              <svg style={{
                position:'absolute', left:14, top:'50%',
                transform:'translateY(-50%)',
                color:'rgba(148,163,184,0.4)', pointerEvents:'none',
              }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="project-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects…"
                style={{
                  width:'100%', boxSizing:'border-box',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.09)',
                  borderRadius:14, padding:'11px 14px 11px 40px',
                  color:'#f1f5f9', fontSize:14,
                  fontFamily:'inherit',
                  transition:'border 0.2s, background 0.2s, box-shadow 0.2s',
                }}
              />
            </div>

            {/* Filter pills — home page pill style */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {FILTERS.map(f => {
                const active = activeFilter === f
                return (
                  <button
                    key={f}
                    className="filter-pill"
                    onClick={() => setActiveFilter(f)}
                    style={{
                      borderRadius: 999,
                      padding: '9px 20px',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      fontFamily: "'JetBrains Mono', monospace",
                      cursor: 'pointer',
                      border: active
                        ? '1px solid rgba(6,217,110,0.45)'
                        : '1px solid rgba(255,255,255,0.09)',
                      background: active
                        ? 'rgba(6,217,110,0.10)'
                        : 'rgba(255,255,255,0.04)',
                      color: active ? '#06d96e' : 'rgba(148,163,184,0.65)',
                      boxShadow: active ? '0 0 20px rgba(6,217,110,0.12)' : 'none',
                    }}
                  >{f}</button>
                )
              })}
            </div>
          </div>

          {/* ──────────── GRID ──────────── */}
          {loading ? (
            <div style={{ display:'grid', gap:22, gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              padding:'96px 24px', gap:16,
            }}>
              {/* Empty state card matching home aesthetic */}
              <div style={{
                width:72, height:72, borderRadius:24, fontSize:32,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.07)',
                marginBottom:8,
              }}>🔍</div>
              <p style={{
                fontFamily:"'Syne', sans-serif", fontSize:22,
                fontWeight:800, color:'#f1f5f9',
              }}>Nothing found</p>
              <p style={{
                fontSize:14, color:'rgba(148,163,184,0.5)',
                fontFamily:"'JetBrains Mono', monospace",
              }}>
                Try a different keyword or filter
              </p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('All') }}
                style={{
                  marginTop:8, padding:'9px 22px', borderRadius:12,
                  background:'rgba(6,217,110,0.08)',
                  border:'1px solid rgba(6,217,110,0.25)',
                  color:'#06d96e', fontSize:13, fontWeight:700,
                  cursor:'pointer', fontFamily:"'JetBrains Mono', monospace",
                  letterSpacing:'0.08em',
                }}
              >Clear filters</button>
            </div>
          ) : (
            <>
              {/* Section label (home page pattern) */}
              <div style={{ marginBottom:28 }}>
                <p style={{
                  fontSize:10, fontWeight:900, textTransform:'uppercase',
                  letterSpacing:'0.3em', color:'#06d96e',
                  fontFamily:"'JetBrains Mono', monospace",
                  marginBottom:4,
                }}>Project Library</p>
                
<h2
  style={{
    fontFamily: "'Syne', sans-serif",
fontSize: 'clamp(1.6rem,3vw,2.5rem)',
    letterSpacing: '-0.05em',
    lineHeight: 1,
    color: '#f1f5f9',
          fontWeight:'700'
  }}
>
  {filtered.length}{' '}
  {activeFilter !== 'All' ? activeFilter : ''} project
  {filtered.length !== 1 ? 's' : ''}{' '}

  <span
    style={{
          fontFamily: "'Syne', sans-serif",
fontSize: 'clamp(1.6rem,3vw,2.5rem)',
      color: 'rgba(255,255,255,0.28)',
      letterSpacing: '-0.05em',
      fontWeight:'700'
    }}
  >
    ready to build
  </span>
</h2>
              </div>

              <div style={{
                display:'grid', gap:22,
                gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))',
              }}>
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} appeared={appeared} />
                ))}
              </div>
            </>
          )}

          {/* ──────────── BOTTOM CTA (home page final-cta pattern) ──────────── */}
          {!loading && projects.length > 0 && (
            <div style={{
              marginTop: 80, position: 'relative', overflow: 'hidden',
              borderRadius: 28, textAlign: 'center',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '64px 32px',
              opacity: appeared ? 1 : 0,
              transform: appeared ? 'none' : 'translateY(24px)',
              transition: 'all 0.7s ease 0.3s',
            }}>
              {/* top line accent */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:1,
                background:'linear-gradient(90deg, transparent, rgba(6,217,110,0.6), rgba(139,92,246,0.4), transparent)',
              }} />
              {/* glow */}
              <div style={{
                position:'absolute', top:'-30%', left:'50%',
                transform:'translateX(-50%)', width:600, height:400,
                background:'radial-gradient(ellipse, rgba(6,217,110,0.08) 0%, transparent 70%)',
                filter:'blur(20px)', pointerEvents:'none',
              }} />

              {/* Emoji cluster */}
              <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:24, flexWrap:'wrap' }}>
                {['🛠','🚀','🧠','⚡','🎯','💡'].map((e, i) => (
                  <div key={i} style={{
                    width:44, height:44, borderRadius:14,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:20,
                    background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.08)',
                    animation:`float ${6 + i}s ease-in-out ${i * 0.4}s infinite`,
                  }}>{e}</div>
                ))}
              </div>

              <h2 style={{
                fontFamily:"'Syne', sans-serif",
                fontSize:'clamp(1.8rem,4vw,3rem)',
                fontWeight:700, lineHeight:1.1,
                letterSpacing:'-0.03em',
                color:'#f1f5f9', marginBottom:14,
                position:'relative', zIndex:1,
              }}>
                Stop reading about it.
                <br />
                <span style={{
                  background:'linear-gradient(135deg, #06d96e 0%, #2df28a 50%, #06b6d4 100%)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>Start building it.</span>
              </h2>
              <p style={{
                color:'rgba(255,255,255,0.45)', fontSize:15,
                maxWidth:400, margin:'0 auto 32px', lineHeight:1.7,
                position:'relative', zIndex:1,
              }}>
                Pick a project. Follow the steps. Ship something real.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:1 }}>
                <Link to="/topics" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'12px 28px', borderRadius:14,
                  background:'linear-gradient(135deg, #06d96e, #06b6d4)',
                  color:'#05050a', fontWeight:700, fontSize:14,
                  textDecoration:'none',
                  boxShadow:'0 0 45px rgba(6,217,110,0.28)',
                  transition:'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 60px rgba(6,217,110,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';  e.currentTarget.style.boxShadow='0 0 45px rgba(6,217,110,0.28)' }}
                >
                  Browse Topics
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'12px 28px', borderRadius:14,
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  color:'#f1f5f9', fontWeight:600, fontSize:14,
                  textDecoration:'none', transition:'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}