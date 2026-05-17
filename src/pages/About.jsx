import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'

/* ── useInView ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) obs.observe(ref.current)

    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView]
}

/* ── Typewriter ── */
function useTypewriter(words, speed = 70, pause = 1600) {
  const [display, setDisplay] = useState('')
  const [wIdx, setWIdx] = useState(0)
  const [cIdx, setCIdx] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    if (!words.length) return

    const cur = words[wIdx]

    const t = setTimeout(() => {
      if (!del) {
        setDisplay(cur.slice(0, cIdx + 1))

        if (cIdx + 1 === cur.length) {
          setTimeout(() => setDel(true), pause)
        } else {
          setCIdx((p) => p + 1)
        }
      } else {
        setDisplay(cur.slice(0, cIdx - 1))

        if (cIdx - 1 === 0) {
          setDel(false)
          setWIdx((p) => (p + 1) % words.length)
          setCIdx(0)
        } else {
          setCIdx((p) => p - 1)
        }
      }
    }, del ? speed / 2 : speed)

    return () => clearTimeout(t)
  }, [cIdx, del, wIdx, words, speed, pause])

  return display
}

function FeatureCard({ icon, title, desc, accent }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 28,
        border: `1px solid ${
          hovered ? `${accent}40` : 'rgba(255,255,255,0.08)'
        }`,
        background: hovered
          ? `radial-gradient(circle at top left, ${accent}18 0%, transparent 50%), rgba(255,255,255,0.05)`
          : 'rgba(255,255,255,0.03)',
        padding: 30,
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />

      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: 22,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.45rem',
          fontWeight: 700,
          color: '#f8fafc',
          marginBottom: 12,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: 'rgba(148,163,184,0.78)',
          lineHeight: 1.8,
          fontSize: 14,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  )
}

export default function About() {
  const typed = useTypewriter(
    ['differently.', 'visually.', 'confidently.', 'deeply.'],
    70,
    1800
  )

  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const FEATURES = [
    {
      icon: '🎬',
      title: 'Cinematic Learning',
      desc: 'Beautiful visuals and immersive lessons that make complex concepts easy to understand.',
      accent: '#06d96e',
    },
    {
      icon: '🧠',
      title: 'Concept First',
      desc: 'Understand deeply before memorizing. We teach intuition before implementation.',
      accent: '#8b5cf6',
    },
    {
      icon: '🔥',
      title: 'Build Real Projects',
      desc: 'Everything connects to practical coding projects you can actually showcase.',
      accent: '#f59e0b',
    },
    {
      icon: '⚡',
      title: 'Gamified Experience',
      desc: 'Earn XP, maintain streaks, and stay motivated while learning consistently.',
      accent: '#06b6d4',
    },
  ]

  return (
    <PageWrapper>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        @keyframes ping {
          75%,100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#080809',
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(6,217,110,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,217,110,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />

        {/* GLOWS */}
        <div
          style={{
            position: 'fixed',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(6,217,110,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px 100px',
          }}
        >
          {/* HERO */}
          <section
            style={{
              minHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? 'translateY(0)'
                  : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {/* PILL */}
              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 20px',
                    borderRadius: 999,
                    border: '1px solid rgba(6,217,110,0.22)',
                    background: 'rgba(6,217,110,0.08)',
                    color: '#06d96e',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#06d96e',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: '#06d96e',
                        animation:
                          'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      }}
                    />
                  </span>

                  About Let's Crack IT
                </span>
              </div>

              {/* HEADLINE */}
<h1
  style={{
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(3rem,7vw,6.5rem)',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.05em',
    marginBottom: 26,
    color: '#f8fafc',
  }}
>
  Learn{' '}

  <span
    style={{
      background:
        'linear-gradient(135deg, #06d96e 0%, #2df28a 45%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    {typed}
  </span>
</h1>

              {/* SUBTEXT */}
              <p
                style={{
                  maxWidth: 700,
                  margin: '0 auto 18px',
                  fontSize: 18,
                  lineHeight: 1.8,
                  color: 'rgba(148,163,184,0.72)',
                }}
              >
                We're building a cinematic learning platform for developers.
              </p>

              <p
                style={{
                  maxWidth: 700,
                  margin: '0 auto 40px',
                  fontSize: 18,
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                }}
              >
                Every concept explained visually. Every lesson designed to make
                complex things feel obvious.
              </p>

              {/* BUTTONS */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 14,
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  to="/topics"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 30px',
                    borderRadius: 16,
                    textDecoration: 'none',
                    background:
                      'linear-gradient(135deg, #06d96e, #06b6d4)',
                    color: '#05050a',
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: '0 0 50px rgba(6,217,110,0.25)',
                  }}
                >
                  🚀 Start Learning
                </Link>

                <Link
                  to="/projects"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 30px',
                    borderRadius: 16,
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  🛠 View Projects
                </Link>
              </div>
            </div>
          </section>

          {/* CREATOR */}
          <section >
            <div
              style={{
                borderRadius: 34,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                padding: '60px 40px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    'linear-gradient(90deg, transparent, #06d96e, transparent)',
                }}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 50,
                  alignItems: 'center',
                }}
              >
                {/* LEFT */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 34,
                      margin: '0 auto 22px',
                      background:
                        'linear-gradient(135deg, #06d96e, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 38,
                      color: '#05050a',
                      boxShadow: '0 0 60px rgba(6,217,110,0.3)',
                    }}
                  >
                    SJ
                  </div>

                  <p
                    style={{
                      fontSize: 10,
                      color: '#06d96e',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: 10,
                    }}
                  >
                    Created by
                  </p>

                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 'clamp(2rem,4vw,3rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      margin: 0,
                      color: '#f8fafc',
                    }}
                  >
                    Shraddha Jadhav
                  </h2>
                </div>

                {/* RIGHT */}
                <div>
                  <p
                    style={{
                      color: 'rgba(203,213,225,0.78)',
                      lineHeight: 1.9,
                      fontSize: 15,
                      marginBottom: 28,
                    }}
                  >
                    Software Engineer<br></br>
                    JAVA | AWS | React | SpringBoot
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 14,
                    }}
                  >
                    <a
                      href="https://www.linkedin.com/in/shraddha-jadhav-a9a762224/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 22px',
                        borderRadius: 14,
                        textDecoration: 'none',
                        background: 'rgba(59,130,246,0.12)',
                        border:
                          '1px solid rgba(59,130,246,0.25)',
                        color: '#60a5fa',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      💼 LinkedIn
                    </a>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 22px',
                        borderRadius: 14,
                        textDecoration: 'none',
                        background: 'rgba(255,255,255,0.05)',
                        border:
                          '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      🐙 GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div
            style={{
              marginTop: 80,
              paddingTop: 30,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'rgba(148,163,184,0.4)',
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              © {new Date().getFullYear()} Let's Crack IT · Built for developers
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}