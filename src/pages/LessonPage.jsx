import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Heart, Loader2, Trophy, BookOpen,
  CheckCircle2, ArrowRight, Code, Lightbulb,
  RefreshCw, Copy, Check, MessageCircle, Star,
  Target, Zap, Eye, Play, Wrench, Hammer,
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import LessonCommentSection from '../components/community/LessonCommentSection'
import { getLessonApi, likeLessonApi } from '../api/lessonApi'
import { useAuth } from '../hooks/useAuth'

const accent = '#06d96e'

/* ───────────────────────────────────────────────────── */
/*  Parse JSON safely                                     */
/* ───────────────────────────────────────────────────── */
function parseData(str) {
  try { return JSON.parse(str) } catch { return {} }
}

/* ───────────────────────────────────────────────────── */
/*  Phase: LEARN (Theory)                                 */
/* ───────────────────────────────────────────────────── */
function LearnPhase({ data, accent }) {
  const content = parseData(data)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Big Picture Story
      {content.story && (
        <div className="relative p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-3xl">💡</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">The Big Picture</p>
              <p className="text-lg text-slate-200 leading-relaxed">{content.story}</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Main Concept */}
      {content.content && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Let's Understand It
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{content.content}</p>
        </div>
      )}

      {/* Key Points */}
      {content.points?.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-400">📌 Key Points to Remember</p>
          {content.points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-slate-200">{point}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactive Prompt
      {content.interactionPrompt && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-amber-400 mt-1" />
            <div>
              <p className="font-bold text-amber-300 mb-2">🤔 Think About It!</p>
              <p className="text-slate-300">{content.interactionPrompt}</p>
            </div>
          </div>
        </div>
      )} */}
    </motion.div>
  )
}

/* ───────────────────────────────────────────────────── */
/*  Phase: SEE IT (Code Example)                          */
/* ───────────────────────────────────────────────────── */
function SeeItPhase({ data, accent }) {
  const content = parseData(data)
  const code = content.code || content.example || ''
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
          <Code className="h-4 w-4" /> Real Code Example
        </p>
        <p className="text-slate-400">This is exactly how professionals write it. Read carefully!</p>
      </div>

      {/* Code Block */}
      <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: '#0d1117' }}>
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-slate-500 font-mono">Main.java</span>
          </div>
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex overflow-x-auto">
          <div className="py-4 pr-4 pl-5 text-right font-mono text-xs text-slate-600 border-r border-white/5 min-w-[40px]">
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <pre className="py-4 px-5 font-mono text-sm text-emerald-300 overflow-x-auto whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      </div>

      {/* Explanation */}
      {content.explanation && (
        <div className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-cyan-400 mt-1" />
            <div>
              <p className="font-bold text-cyan-300 mb-2">💡 What's happening here?</p>
              <p className="text-slate-300 whitespace-pre-wrap">{content.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ───────────────────────────────────────────────────── */
/*  Phase: PRACTICE (Try It)                              */
/* ───────────────────────────────────────────────────── */
function PracticePhase({ data, accent }) {
  const content = parseData(data)
  const options = content.options || []
  const correct = content.correctAnswer ?? 0

  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const isCorrect = selected === correct

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Quiz Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-amber-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">🎯 Quick Check</p>
        </div>
        <p className="text-xl font-bold text-white mb-4">{content.question || 'What did you learn?'}</p>

        {/* Hint button */}
        {content.explanation && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3" />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        )}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 rounded-lg bg-amber-500/10 text-sm text-slate-300"
          >
            💡 {content.explanation}
          </motion.div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selected === i
          const showCorrect = revealed && i === correct
          const showWrong = revealed && isSelected && !isCorrect

          return (
            <button
              key={i}
              onClick={() => { if (!revealed) { setSelected(i); setRevealed(true) } }}
              disabled={revealed}
              className={`
                w-full text-left p-4 rounded-xl border font-medium transition-all flex items-center gap-3
                ${showCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' :
                  showWrong ? 'bg-red-500/20 border-red-500 text-red-300' :
                  isSelected ? 'bg-white/10 border-white/20' :
                  'bg-white/[0.02] border-white/5 hover:border-white/10'
                }
              `}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                ${showCorrect ? 'bg-emerald-500 text-black' : showWrong ? 'bg-red-500 text-white' : 'bg-white/10'}`}>
                {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Result */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <span className="text-3xl">🎉</span>
                <p className="font-bold text-emerald-300">Correct! You got it!</p>
              </>
            ) : (
              <>
                <span className="text-3xl">💪</span>
                <div>
                  <p className="font-bold text-amber-300">Not quite!</p>
                  <p className="text-sm text-slate-400">The correct answer is highlighted above.</p>
                </div>
              </>
            )}
          </div>
          {content.explanation && (
            <p className="text-slate-300 text-sm mt-2">{content.explanation}</p>
          )}
        </motion.div>
      )}

      {/* Retry */}
      {revealed && !isCorrect && (
        <button
          onClick={() => { setSelected(null); setRevealed(false) }}
          className="w-full py-3 rounded-xl border border-white/10 text-slate-400 font-semibold flex items-center justify-center gap-2 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      )}
    </motion.div>
  )
}

/* ───────────────────────────────────────────────────── */
/*  Phase: DO IT (Practical Challenge)                  */
/* ───────────────────────────────────────────────────── */
function DoItPhase({
  data,
  accent,
  onComplete,
  isAuthenticated,
  onAuthRequired,
}) {

  const content = parseData(data)

  const [code, setCode] = useState(
    content.starterCode || ''
  )

  const [completed, setCompleted] =
    useState(false)

  const [showSolution, setShowSolution] =
    useState(false)

  const [taskStep, setTaskStep] =
    useState(0)

  const steps = content.steps || [
    'Read the task carefully',
    'Write your code in the editor',
    'Test your solution',
    'Submit when done',
  ]

  const handleReset = () => {
    setCode(content.starterCode || '')
  }

  const handleComplete = () => {

    if (!isAuthenticated) {

      if (onAuthRequired) {
        onAuthRequired()
      }

      return
    }

    setCompleted(true)

    if (onComplete) {
      onComplete()
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-6"
    >

      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">

        <div className="flex items-center gap-3 mb-4">

          <span className="text-4xl">
            🎯
          </span>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Your Challenge
            </p>

            <h3 className="text-2xl font-black text-white">
              {content.title || 'Build Something!'}
            </h3>

          </div>

        </div>

        <p className="text-slate-300 text-lg leading-relaxed">
          {content.brief || content.description}
        </p>

      </div>


      <div>

        <div className="flex items-center justify-between mb-3">

          <div className="flex items-center gap-2">

            <Wrench className="h-4 w-4 text-slate-400" />

            <p className="text-sm font-bold text-slate-300">
              Your Code
            </p>

          </div>

          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
          >

            <RefreshCw className="h-3 w-3" />

            Reset

          </button>

        </div>

        <div
          className="rounded-xl overflow-hidden border border-white/10"
          style={{
            background: '#0d1117',
          }}
        >

          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/10">

            <div className="flex gap-2">

              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />

              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />

              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />

            </div>

            <span className="text-xs text-slate-500 ml-2 font-mono">
              Solution.java
            </span>

          </div>

          <textarea
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            className="w-full p-4 bg-transparent font-mono text-sm text-emerald-300 outline-none resize-none whitespace-pre"
            style={{
              minHeight: 200,
            }}
            spellCheck={false}
          />

        </div>

      </div>

      {!completed && (

        <div className="text-center">

          <button
            onClick={() =>
              setShowSolution(!showSolution)
            }
            className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2 mx-auto"
          >

            <Eye className="h-4 w-4" />

            {
              showSolution
                ? 'Hide solution'
                : 'Need help? Show solution hint'
            }

          </button>

          <AnimatePresence>

            {showSolution && (

              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="mt-4 overflow-hidden"
              >

                <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">

                  <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
                    💡 Solution Hint
                  </p>

                  <div className="font-mono text-sm text-yellow-200 whitespace-pre-wrap">
                    {
                      content.starterCode
                      || '// Start here...'
                    }
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      )}

      {!completed ? (

        <motion.button
          onClick={handleComplete}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center gap-2 shadow-lg"
        >

          <Trophy className="h-5 w-5" />

          Mark as Complete ✓

        </motion.button>

      ) : (

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center"
        >

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h3 className="text-2xl font-black text-emerald-300 mb-2">
            Amazing Work!
          </h3>

          <p className="text-slate-400">
            You've completed the challenge. Keep going!
          </p>

        </motion.div>
      )}

    </motion.div>
  )
}

/* ───────────────────────────────────────────────────── */
/*  Main Lesson Page                                      */
/* ───────────────────────────────────────────────────── */
export default function LessonPage() {
  const { slug } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState(0)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  const { isAuthenticated } = useAuth()
  const [showAuthPopup, setShowAuthPopup] = useState(false)

  useEffect(() => {
    getLessonApi(slug)
      .then((res) => setLesson(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true)
      return
    }
    if (liking || !lesson?.id) return
    setLiking(true)
    try {
      const { data } = await likeLessonApi(lesson.id, liked)
      setLiked(data.liked)
      setLesson((p) => ({ ...p, likes: data.likes }))
    } catch {} finally { setLiking(false) }
  }

  const advancePhase = () => {
    if (phase < 3) setPhase(phase + 1)
  }

  const goBackPhase = () => {
    if (phase > 0) setPhase(phase - 1)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#050816] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        </div>
      </PageWrapper>
    )
  }

  if (!lesson) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#050816] flex items-center justify-center flex-col gap-6">
          <h1 className="text-4xl font-black">Lesson not found</h1>
          <Link to="/topics" className="px-6 py-3 rounded-xl bg-emerald-500 font-bold text-black">
            Back to Topics
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const blocks = lesson.blocks || []
  const phases = [
    { name: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'See It', icon: <Code className="h-4 w-4" /> },
    { name: 'Practice', icon: <Star className="h-4 w-4" /> },
    { name: 'Do It', icon: <Hammer className="h-4 w-4" /> },
  ]

  const currentBlock = blocks[phase] || blocks[0]

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#050816] text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link to={lesson?.topicSlug ? `/lessons/${lesson.topicSlug}` : '/topics'} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4">
              <ChevronLeft className="h-4 w-4" /> Back to Lessons
            </Link>
            <h1 className="text-3xl font-black mb-2">{lesson.title}</h1>
            <p className="text-slate-400 mb-4">{lesson.description}</p>
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400">
                <Heart className={`h-4 w-4 ${liked ? 'fill-pink-400 text-pink-400' : ''}`} />
                {lesson.likes || 0}
              </button>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-400">{blocks.length} parts</span>
            </div>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="border-b border-white/10 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-1 py-4 overflow-x-auto">
              {phases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPhase(i)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
                    ${i === phase
                      ? 'bg-emerald-500 text-black'
                      : i < phase
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/[0.03] text-slate-400 border border-white/5'
                    }
                  `}
                >
                  {p.icon}
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-10">
          <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {phase === 0 && <LearnPhase data={currentBlock?.data} accent={accent} />}
            {phase === 1 && <SeeItPhase data={currentBlock?.data} accent={accent} />}
            {phase === 2 && <PracticePhase data={currentBlock?.data} accent={accent} />}
            {(phase === 3 || !currentBlock?.type) && (
              <DoItPhase
                data={currentBlock?.data || '{}'}
                accent={accent}
                onComplete={advancePhase}
                isAuthenticated={isAuthenticated}
                onAuthRequired={() => setShowAuthPopup(true)}
              />
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
            <button
              onClick={goBackPhase}
              disabled={phase === 0}
              className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 font-semibold disabled:opacity-30 hover:text-white hover:border-white/20"
            >
              ← Previous
            </button>
            {phase < 3 ? (
              <button
                onClick={advancePhase}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-black flex items-center gap-2"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to={lesson?.topicSlug ? `/lessons/${lesson.topicSlug}` : '/topics'}
                className="px-8 py-3 rounded-xl bg-emerald-500 font-bold text-black flex items-center gap-2"
              >
                Continue Learning <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Comments */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              Discussion
            </h3>
            <LessonCommentSection lessonId={lesson.id} />
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setShowAuthPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: 'rgba(6,217,110,0.1)' }}>
                ❤️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Like this Lesson?</h3>
              <p className="text-slate-400 mb-6">Sign in to like and save your favorite lessons!</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setShowAuthPopup(false)}
                  className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-black"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowAuthPopup(false)}
                  className="w-full py-3 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}