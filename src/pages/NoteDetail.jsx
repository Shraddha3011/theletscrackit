import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  Prism as SyntaxHighlighter,
} from 'react-syntax-highlighter'

import {
  oneDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

import {
  getNoteBySlugApi,
  markNoteCompleteApi,
  toggleBookmarkApi,
  getBookmarksApi,
} from '../api/notesApi'

import PageWrapper from '../components/layout/PageWrapper'

import Skeleton from '../components/common/Skeleton'

import CommentSection from '../components/community/CommentSection'

import { useAuth } from '../hooks/useAuth'

import {
  DIFFICULTY_COLORS,
} from '../utils/constants'

import {
  formatDate,
} from '../utils/formatters'

import {
  useDispatch,
} from 'react-redux'

import {
  addToast,
} from '../app/slices/uiSlice'

import {
  syncUserXp,
} from '../app/slices/authSlice'

import {
  Eye,
  Heart,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Clock3,
  ArrowLeft,
  Copy,
} from 'lucide-react'

const CopyIcon = () => (

  <Copy
    size={14}
    strokeWidth={2}
  />

)

function CodeBlock({
  inline,
  className,
  children,
  ...props
}) {

  const [copied, setCopied] =
    useState(false)

  const match =
    /language-(\w+)/.exec(
      className || ''
    )

  const code =
    String(children).replace(
      /\n$/,
      ''
    )

  const handleCopy = () => {

    navigator.clipboard.writeText(
      code
    )

    setCopied(true)

    setTimeout(() => {

      setCopied(false)

    }, 2000)
  }

  if (inline) {

    return (

      <code
        className="inline-code"
        {...props}
      >

        {children}

      </code>
    )
  }

  return (

    <div className="code-block-wrap">

      <div className="code-topbar">

        <div className="code-lang">

          {match?.[1] || 'code'}

        </div>

        <button
          onClick={handleCopy}
          className="copy-btn"
        >

          <CopyIcon />

          {copied
            ? 'Copied'
            : 'Copy'}

        </button>

      </div>

      <SyntaxHighlighter
        style={oneDark}
        language={
          match?.[1] || 'text'
        }
        PreTag="div"
        customStyle={{
          margin: 0,
          background:
            'transparent',
          padding: '22px',
          fontSize: '0.9rem',
          borderRadius: 0,
        }}
        {...props}
      >

        {code}

      </SyntaxHighlighter>

    </div>
  )
}

function FloatingParticles() {

  return (

    <div className="particles-layer">

      {Array.from({
        length: 20,
      }).map((_, i) => (

        <span
          key={i}
          className="particle"
          style={{
            '--i': i,
          }}
        />

      ))}

    </div>
  )
}

export default function NoteDetail() {

  const { slug } =
    useParams()

  const dispatch =
    useDispatch()

  const { isAuthenticated } =
    useAuth()

  const [note, setNote] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [bookmarked,
    setBookmarked] =
    useState(false)

  const [completed,
    setCompleted] =
    useState(false)

  const [completing,
    setCompleting] =
    useState(false)

  const [liked,
    setLiked] =
    useState(false)

  const [likes,
    setLikes] =
    useState(12)

  useEffect(() => {

    setLoading(true)

    getNoteBySlugApi(slug)

      .then(({ data }) => {

        setNote(data)

      })

      .catch(() => { /* ignore */ })

      .finally(() => {

        setLoading(false)

      })

    if (isAuthenticated) {

      getBookmarksApi()

        .then(({ data }) => {

          setBookmarked(

            data.some(
              (b) =>
                b.slug === slug
            )
          )
        })

        .catch(() => { /* ignore */ })
    }

  }, [
    slug,
    isAuthenticated,
  ])

  const handleComplete =
    async () => {

      if (
        !isAuthenticated ||
        completed ||
        completing
      )
        return

      setCompleting(true)

      try {

        const { data } = await markNoteCompleteApi(
          note.id
        )

        setCompleted(true)

        dispatch(
          syncUserXp({
            xpPoints: data.xpPoints,
          })
        )

        dispatch(
          addToast({
            type: 'success',
            message:
              data.xpEarned > 0
                ? `+${data.xpEarned} XP Earned`
                : 'Already completed',
          })
        )

      } catch {
        /* optional: surface toast on failure */
      }

      setCompleting(false)
    }

  const handleBookmark =
    async () => {

      if (!isAuthenticated)
        return

      try {

        await toggleBookmarkApi(
          note.id
        )

        setBookmarked(
          (p) => !p
        )

      } catch {
        /* bookmark toggle failed */
      }
    }

  if (loading) {

    return (

      <PageWrapper>

        <div className="note-page">

          <div className="note-shell">

            <Skeleton
              className="h-10 w-72 mb-4"
            />

            <Skeleton
              className="h-5 w-96 mb-10"
            />

            <Skeleton
              lines={10}
              height="h-5"
            />

          </div>

        </div>

      </PageWrapper>
    )
  }

  if (!note) {

    return (

      <PageWrapper>

        <div className="note-page">

          <div className="empty-note">

            <h2>

              Note Not Found

            </h2>

          </div>

        </div>

      </PageWrapper>
    )
  }

  const dc =
    DIFFICULTY_COLORS[
    note.difficulty
    ] ||
    DIFFICULTY_COLORS.BEGINNER

  return (

    <PageWrapper>

      <div className="note-page">

        <FloatingParticles />

        <div className="note-shell">

          {/* HERO */}

          <div className="note-hero">

            <div className="hero-glow hero-glow-1" />

            <div className="hero-glow hero-glow-2" />

            <div className="hero-grid" />

            <div className="hero-top">

              <Link
                to="/topics"
                className="back-link"
              >

                <ArrowLeft size={15} />

                Back

              </Link>

              <div className="hero-badges">

                <div
                  className="difficulty-pill"
                  style={{
                    background:
                      dc.bg,
                    color:
                      dc.text,
                    border:
                      `1px solid ${dc.border}`,
                  }}
                >

                  <Sparkles size={13} />

                  {note.difficulty}

                </div>

                <div className="xp-pill">

                  ⚡ +{note.xpReward} XP

                </div>

              </div>

            </div>

            <div className="hero-main">

              <div className="hero-left">

                <div className="title-line" />

                <h1>

                  {note.title}

                </h1>

                <div className="note-meta">

                  <span>

                    <Eye size={14} />

                    {note.viewCount || 0} views

                  </span>

                  <span>

                    <Clock3 size={14} />

                    {formatDate(
                      note.createdAt
                    )}

                  </span>

                </div>

              </div>

              {isAuthenticated && (

                <div className="hero-actions">

                  <button
                    className={
                      liked
                        ? 'action-btn liked'
                        : 'action-btn'
                    }
                    onClick={() => {

                      setLiked(!liked)

                      setLikes(
                        (prev) =>

                          liked
                            ? prev - 1
                            : prev + 1
                      )
                    }}
                  >

                    <Heart
                      size={16}
                    />

                    {likes}

                  </button>

                  <button
                    className={
                      bookmarked
                        ? 'action-btn saved'
                        : 'action-btn'
                    }
                    onClick={
                      handleBookmark
                    }
                  >

                    <Bookmark
                      size={16}
                    />

                    {bookmarked
                      ? 'Saved'
                      : 'Save'}

                  </button>

                  <button
                    className={
                      completed
                        ? 'complete-btn done'
                        : 'complete-btn'
                    }
                    disabled={
                      completed ||
                      completing
                    }
                    onClick={
                      handleComplete
                    }
                  >

                    <CheckCircle2
                      size={16}
                    />

                    {completed
                      ? 'Completed'
                      : 'Mark Complete'}

                  </button>

                </div>
              )}

            </div>

          </div>

          {/* CONTENT */}

          <div className="content-shell">

            <div className="markdown-content">

              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                ]}
                components={{
                  code: CodeBlock,
                }}
              >

                {note.content}

              </ReactMarkdown>

            </div>

          </div>

          {/* COMMENTS */}

          <div className="comments-shell">

            <CommentSection
              noteId={note.id}
            />

          </div>

        </div>

      </div>

      <style>{`

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');

*{
  box-sizing:border-box;
}

.note-page{

  min-height:100vh;

  position:relative;

  overflow:hidden;

  padding:24px;

  background:

    radial-gradient(
      circle at top left,
      rgba(0,255,153,0.10),
      transparent 24%
    ),

    radial-gradient(
      circle at bottom right,
      rgba(124,92,255,0.10),
      transparent 24%
    ),

    #05060d;

  font-family:
    'Space Grotesk',
    sans-serif;

  color:white;
}

/* particles */

.particles-layer{
  position:absolute;
  inset:0;
  overflow:hidden;
  pointer-events:none;
}

.particle{

  position:absolute;

  width:3px;
  height:3px;

  border-radius:50%;

  background:
    rgba(255,255,255,0.4);

  left:
    calc(var(--i) * 5%);

  top:110%;

  animation:
    particleFloat
    calc(10s + var(--i) * 1s)
    linear infinite;
}

@keyframes particleFloat{

  from{
    transform:translateY(0);
    opacity:0;
  }

  10%{
    opacity:1;
  }

  to{
    transform:translateY(-120vh);
    opacity:0;
  }
}

.note-shell{

  max-width:1100px;

  margin:auto;

  position:relative;

  z-index:2;
}

/* hero */

.note-hero{

  position:relative;

  overflow:hidden;

  border-radius:36px;

  padding:34px;

  margin-bottom:26px;

  background:

    linear-gradient(
      145deg,
      rgba(12,15,24,0.96),
      rgba(5,7,15,0.92)
    );

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(24px);

  box-shadow:
    0 30px 80px rgba(0,0,0,0.45);
}

.hero-grid{

  position:absolute;
  inset:0;

  background-image:

    linear-gradient(
      rgba(255,255,255,0.025) 1px,
      transparent 1px
    ),

    linear-gradient(
      90deg,
      rgba(255,255,255,0.025) 1px,
      transparent 1px
    );

  background-size:
    38px 38px;

  opacity:0.35;
}

.hero-glow{

  position:absolute;

  border-radius:50%;

  filter:blur(120px);

  opacity:0.4;
}

.hero-glow-1{

  width:420px;
  height:420px;

  background:
    rgba(0,255,153,0.12);

  top:-180px;
  left:-100px;
}

.hero-glow-2{

  width:320px;
  height:320px;

  background:
    rgba(124,92,255,0.14);

  right:-120px;
  bottom:-120px;
}

.hero-top{

  position:relative;

  z-index:2;

  display:flex;

  justify-content:space-between;

  align-items:center;

  flex-wrap:wrap;

  gap:16px;

  margin-bottom:38px;
}

.back-link{

  display:flex;

  align-items:center;

  gap:8px;

  text-decoration:none;

  color:#a7b0d8;

  font-size:0.88rem;

  transition:0.3s;
}

.back-link:hover{
  color:#ffffff;
}

.hero-badges{

  display:flex;

  align-items:center;

  gap:12px;

  flex-wrap:wrap;
}

.difficulty-pill,
.xp-pill{

  height:40px;

  padding:0 16px;

  border-radius:999px;

  display:flex;

  align-items:center;

  gap:8px;

  font-size:0.78rem;

  font-weight:600;

  backdrop-filter:
    blur(10px);
}

.xp-pill{

  background:
    rgba(0,255,153,0.08);

  border:
    1px solid rgba(0,255,153,0.14);

  color:#7dffca;
}

/* title */

.hero-main{

  position:relative;

  z-index:2;

  display:flex;

  justify-content:space-between;

  gap:30px;

  align-items:flex-end;

  flex-wrap:wrap;
}

.hero-left{

  flex:1;

  min-width:0;

  width:100%;
}

.title-line{

  width:80px;
  height:2px;

  margin-bottom:24px;

  background:

    linear-gradient(
      90deg,
      #00ff99,
      transparent
    );
}

.hero-left h1{

font-size:
  clamp(1.8rem,4vw,3.4rem);

  line-height:1.04;

  letter-spacing:-0.07em;

  margin:0 0 24px;

  padding-bottom:8px;

  font-weight:700;

  position:relative;

  display:block;

  overflow:visible;

  word-break:break-word;

  color:transparent;

  background:

    linear-gradient(
      135deg,
      #ffffff 0%,
      #d8ffe9 22%,
      #7dffca 52%,
      #8b7dff 100%
    );

  background-size:
    200% 200%;

  -webkit-background-clip:text;

  background-clip:text;

  -webkit-text-fill-color:transparent;

  animation:
    gradientMove 8s ease infinite;

  text-shadow:
    0 0 28px rgba(0,255,153,0.10);
}

@keyframes gradientMove{

  0%{
    background-position:0% 50%;
  }

  50%{
    background-position:100% 50%;
  }

  100%{
    background-position:0% 50%;
  }
}

.note-meta{

  display:flex;

  align-items:center;

  gap:18px;

  flex-wrap:wrap;
}

.note-meta span{

  display:flex;

  align-items:center;

  gap:8px;

  color:#9ca7d2;

  font-size:0.88rem;
}

/* actions */

.hero-actions{

  display:flex;

  gap:12px;

  flex-wrap:wrap;
}

.action-btn,
.complete-btn{

  height:48px;

  padding:0 18px;

  border-radius:18px;

  border:
    1px solid rgba(255,255,255,0.08);

  background:
    rgba(255,255,255,0.04);

  color:white;

  display:flex;

  align-items:center;

  gap:10px;

  font-size:0.84rem;

  font-weight:600;

  cursor:pointer;

  transition:
    all .35s ease;

  backdrop-filter:
    blur(10px);
}

.action-btn:hover,
.complete-btn:hover{

  transform:
    translateY(-4px);

  border-color:
    rgba(0,255,153,0.25);
}

.action-btn.liked{

  background:
    rgba(255,77,109,0.12);

  border-color:
    rgba(255,77,109,0.25);

  color:#ff6b88;
}

.action-btn.saved{

  background:
    rgba(0,255,153,0.10);

  border-color:
    rgba(0,255,153,0.22);

  color:#7dffca;
}

.complete-btn{

  background:

    linear-gradient(
      135deg,
      #00ff99,
      #00c97b
    );

  color:#04110a;

  border:none;

  box-shadow:
    0 12px 35px rgba(0,255,153,0.25);
}

.complete-btn.done{

  opacity:0.7;
}

/* content */

.content-shell{

  border-radius:34px;

  overflow:hidden;

  background:

    linear-gradient(
      145deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.02)
    );

  border:
    1px solid rgba(255,255,255,0.06);

  backdrop-filter:
    blur(20px);

  padding:40px;

  box-shadow:
    0 20px 60px rgba(0,0,0,0.35);
}

/* markdown */

.markdown-content{

  color:#d9def5;

  line-height:1.9;

  font-size:1.02rem;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3{

  color:white;

  line-height:1.2;

  letter-spacing:-0.04em;

  margin-top:2.4rem;

  margin-bottom:1rem;
}

.markdown-content h1{
  font-size:2.5rem;
}

.markdown-content h2{
  font-size:2rem;
}

.markdown-content h3{
  font-size:1.4rem;
}

.markdown-content p{
  margin-bottom:1.4rem;
}

.markdown-content strong{
  color:white;
}

.markdown-content a{

  color:#7dffca;

  text-decoration:none;
}

.markdown-content ul,
.markdown-content ol{

  padding-left:1.4rem;

  margin-bottom:1.5rem;
}

.markdown-content li{
  margin-bottom:0.5rem;
}

.inline-code{

  padding:3px 8px;

  border-radius:8px;

  background:
    rgba(0,255,153,0.08);

  color:#7dffca;

  font-size:0.9rem;
}

/* code */

.code-block-wrap{

  overflow:hidden;

  border-radius:22px;

  margin:2rem 0;

  background:
    #0d111c;

  border:
    1px solid rgba(255,255,255,0.06);
}

.code-topbar{

  height:52px;

  padding:0 18px;

  display:flex;

  align-items:center;

  justify-content:space-between;

  background:
    rgba(255,255,255,0.03);

  border-bottom:
    1px solid rgba(255,255,255,0.05);
}

.code-lang{

  color:#8b95c5;

  font-size:0.78rem;

  text-transform:uppercase;

  letter-spacing:0.08em;
}

.copy-btn{

  display:flex;

  align-items:center;

  gap:8px;

  background:none;

  border:none;

  color:#9aa6d2;

  cursor:pointer;

  font-size:0.8rem;

  transition:0.3s;
}

.copy-btn:hover{
  color:#7dffca;
}

/* comments */

.comments-shell{
  margin-top:28px;
}

/* mobile */

@media(max-width:768px){

  .hero-left h1{
font-size:
  clamp(1.7rem,8vw,2.7rem);

    line-height:1.06;

    letter-spacing:-0.05em;
  }
}
}

      `}</style>

    </PageWrapper>
  )
}
