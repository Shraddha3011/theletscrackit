import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Heart, Send, Sparkles, Loader2, User } from 'lucide-react'
import { getLessonCommentsApi, postLessonCommentApi, likeCommentApi } from '../../api/lessonApi'
import { useAuth } from '../../hooks/useAuth'

export default function LessonCommentSection({ lessonId }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await getLessonCommentsApi(lessonId)
      setComments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    if (!lessonId) return
    fetchComments()
  }, [lessonId, fetchComments])

  const handleComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return

    setPosting(true)
    try {
      await postLessonCommentApi(lessonId, commentText)
      setCommentText('')
      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (commentId) => {
    if (!isAuthenticated) return
    try {
      await likeCommentApi(commentId)
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/20">
          <MessageCircle className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white">Discussion</h3>
          <p className="text-sm text-slate-400">Share your thoughts with other learners</p>
        </div>
        <div className="ml-auto rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-400">
          {comments.length} comments
        </div>
      </div>

      {/* Add Comment */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-6">
        {isAuthenticated ? (
          <>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts, ask a question, or help a fellow learner..."
              className="w-full min-h-[100px] rounded-xl border border-white/10 bg-white/[0.03] p-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-400/10"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleComment}
                disabled={posting || !commentText.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-400 mb-4">Sign in to join the discussion</p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-6 py-3 font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all"
            >
              Sign In to Comment
            </a>
          </div>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/[0.05] p-4">
              <Sparkles className="h-8 w-8 text-slate-500" />
            </div>
          </div>
          <p className="text-lg font-semibold text-slate-300">No comments yet</p>
          <p className="text-sm text-slate-500 mt-2">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10">
                    <User className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-bold text-white">{comment.username || 'Learner'}</span>
                      <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{comment.body}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        disabled={!isAuthenticated}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-400 transition-all hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-400 disabled:cursor-not-allowed"
                      >
                        <Heart className={`h-4 w-4 ${comment.likes > 0 ? 'fill-pink-400 text-pink-400' : ''}`} />
                        {comment.likes || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}