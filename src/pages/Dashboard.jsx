import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { getTopicsApi } from '../api/topicsApi'
import PageWrapper from '../components/layout/PageWrapper'
import Avatar from '../components/common/Avatar'
import { Target, BookOpen, Trophy, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopicsApi()
      .then((res) => setTopics((res.data || []).filter(t => t.slug !== 'dsa').slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <div className="page-container py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10 flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <Avatar name={user?.fullName || user?.username} src={user?.avatarUrl} size="lg" />
            <div>
              <h1 className="font-display font-bold text-2xl text-primary">
                Hey, {user?.fullName?.split(' ')[0] || user?.username}! 👋
              </h1>
              <p className="text-secondary text-sm">
                Ready to learn something new today?
              </p>
            </div>
          </div>
          <Link to="/topics" className="btn-primary">Continue Learning →</Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon="📚" label="Topics" value={topics.length} color="#06d96e" delay={0.1} />
          <StatCard icon="🎯" label="Subtopics" value={topics.reduce((acc, t) => acc + (t.subtopicCount || 0), 0)} color="#06b6d4" delay={0.2} />
          <StatCard icon="🧩" label="Modules" value={topics.reduce((acc, t) => acc + (t.moduleCount || 0), 0)} color="#8b5cf6" delay={0.3} />
          <StatCard icon="💬" label="Community" value="Active" color="#f59e0b" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Your Topics
                </h3>
                <Link to="/topics" className="text-sm text-emerald-400 hover:underline">
                  View all →
                </Link>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {topics.map((topic, i) => (
                    <Link
                      key={topic.id}
                      to={`/topics/${topic.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `${topic.color || '#06d96e'}20` }}
                      >
                        {topic.icon || '📘'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{topic.title}</h4>
                        <p className="text-xs text-slate-400">
                          {topic.subtopicCount || 0} subtopics • {topic.moduleCount || 0} modules
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                Quick Links
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Link to="/topics" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">📚</span>
                  <span className="text-sm text-slate-300">Topics</span>
                </Link>
                <Link to="/projects" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">🧪</span>
                  <span className="text-sm text-slate-300">Projects</span>
                </Link>
                <Link to="/quiz" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">⚡</span>
                  <span className="text-sm text-slate-300">Quiz</span>
                </Link>
                <Link to="/interview-questions" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">💼</span>
                  <span className="text-sm text-slate-300">Interview</span>
                </Link>
                <Link to="/profile" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">👤</span>
                  <span className="text-sm text-slate-300">Profile</span>
                </Link>
                <Link to="/community" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-center transition-all">
                  <span className="text-2xl block mb-2">💬</span>
                  <span className="text-sm text-slate-300">Community</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Topic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Featured
              </h3>
              {topics[0] && (
                <Link
                  to={`/topics/${topics[0].slug}`}
                  className="block p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
                >
                  <div className="text-3xl mb-3">{topics[0].icon || '📘'}</div>
                  <h4 className="font-bold text-white mb-2">{topics[0].title}</h4>
                  <p className="text-xs text-slate-400 mb-3">{topics[0].description}</p>
                  <span className="text-sm text-amber-400 font-semibold">Start Learning →</span>
                </Link>
              )}
            </motion.div>

            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <h3 className="font-semibold text-primary mb-4">Continue Learning</h3>
              <div className="space-y-3">
                {topics.slice(0, 4).map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  >
                    <span className="text-xl">{topic.icon || '📘'}</span>
                    <span className="text-sm text-slate-300 flex-1">{topic.title}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function StatCard({ icon, label, value, color = '#06d96e', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center"
    >
      <span className="text-3xl mb-2 block">{icon}</span>
      <p className="font-display font-bold text-2xl" style={{ color }}>{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </motion.div>
  )
}