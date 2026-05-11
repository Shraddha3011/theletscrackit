import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getProgressApi } from '../api/notesApi'
import { getTopicsApi } from '../api/topicsApi'
import PageWrapper from '../components/layout/PageWrapper'
import Avatar from '../components/common/Avatar'
import ProgressBar from '../components/common/ProgressBar'
import { CardSkeleton } from '../components/common/Skeleton'
import { getLevel, getXpProgress, TOPIC_COLORS } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const StatCard = ({ icon, label, value, sub, color = 'brand' }) => {
  const colors = {
    brand:  { bg: 'var(--brand-dim)',            text: 'var(--brand)',   border: 'var(--brand-border)' },
    orange: { bg: 'rgba(249,115,22,0.1)',        text: '#f97316',        border: 'rgba(249,115,22,0.25)' },
    purple: { bg: 'var(--purple-dim)',           text: 'var(--purple)',  border: 'rgba(139,92,246,0.25)' },
    blue:   { bg: 'rgba(59,130,246,0.1)',        text: '#3b82f6',        border: 'rgba(59,130,246,0.25)' },
  }
  const c = colors[color]
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          {icon}
        </div>
      </div>
      <p className="font-display font-bold text-2xl text-primary">{value}</p>
      <p className="text-sm font-medium text-secondary mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-brand-400">{payload[0].value} XP</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  const level = getLevel(user?.xpPoints || 0)
  const xpPct = getXpProgress(user?.xpPoints || 0)

  useEffect(() => {
    Promise.all([
      getProgressApi().catch(() => null),
      getTopicsApi().catch(() => ({ data: [] })),
    ]).then(([prog, topicsRes]) => {
      setProgress(prog?.data || null)
      setTopics(topicsRes?.data?.slice(0, 6) || [])
    }).finally(() => setLoading(false))
  }, [])

  // XP chart data — ideally from backend; using progress data as proxy
  const chartData = progress?.weeklyXp || []

  const completedNotes  = progress?.completedNotes || 0
  const totalNotes      = progress?.totalNotes || 0
  const completionPct   = totalNotes > 0 ? Math.round((completedNotes / totalNotes) * 100) : 0

  return (
    <PageWrapper>
      <div className="page-container py-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={user?.fullName || user?.username} src={user?.avatarUrl} size="lg" />
            <div>
              <h1 className="font-display font-bold text-2xl text-primary">
                Hey, {user?.fullName?.split(' ')[0] || user?.username}! 👋
              </h1>
              <p className="text-secondary text-sm">
                {user?.streak > 0
                  ? `🔥 ${user.streak}-day streak — keep it going!`
                  : 'Ready to start learning today?'}
              </p>
            </div>
          </div>
          <Link to="/topics" className="btn-primary">Continue Learning →</Link>
        </div>

        {/* XP level bar */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg gradient-text">Level {level.level}</span>
              <span className="badge badge-brand">{level.label}</span>
            </div>
            <span className="text-sm font-semibold text-primary">⚡ {user?.xpPoints || 0} XP</span>
          </div>
          <ProgressBar value={xpPct} max={100} showPercent />
          <p className="text-xs text-muted mt-2">
            {level.max - (user?.xpPoints || 0)} XP to Level {level.level + 1}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon="⚡" label="XP Points" value={user?.xpPoints || 0} color="brand" />
          <StatCard icon="🔥" label="Day Streak" value={user?.streak || 0} sub="days in a row" color="orange" />
          <StatCard icon="📚" label="Notes Read" value={completedNotes} sub={`of ${totalNotes}`} color="purple" />
          <StatCard icon="🎯" label="Completion" value={`${completionPct}%`} sub="overall progress" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Chart */}
            {chartData.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-primary mb-4">XP This Week</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06d96e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06d96e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="xp" stroke="#06d96e" strokeWidth={2} fill="url(#xpGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Topic Progress */}
            <div className="card p-5">
              <h3 className="font-semibold text-primary mb-4">Topic Progress</h3>
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
                </div>
              ) : progress?.topicProgress?.length > 0 ? (
                <div className="space-y-4">
                  {progress.topicProgress.map((tp) => {
                    const tc = TOPIC_COLORS[tp.slug] || { color: '#8888a8' }
                    return (
                      <div key={tp.slug}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{tp.icon || '📘'}</span>
                            <span className="text-sm font-medium text-primary">{tp.title}</span>
                          </div>
                          <span className="text-xs text-muted">{tp.completed}/{tp.total}</span>
                        </div>
                        <ProgressBar
                          value={tp.completed}
                          max={tp.total || 1}
                          color={tp.slug === 'dsa' ? 'purple' : tp.slug === 'react' ? 'blue' : 'brand'}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">🚀</p>
                  <p className="text-secondary text-sm">No progress yet. Start reading notes!</p>
                  <Link to="/topics" className="btn-primary mt-4 text-sm">Browse Topics</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card p-5">
              <h3 className="font-semibold text-primary mb-4">Achievements</h3>
              {progress?.achievements?.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {progress.achievements.map((a) => (
                    <div key={a.id} title={a.title}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl cursor-default"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-xs text-muted text-center leading-tight">{a.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-3xl mb-2">🏆</p>
                  <p className="text-xs text-muted">Complete goals to earn achievements</p>
                </div>
              )}
            </div>

            {/* Quick Access Topics */}
            <div className="card p-5">
              <h3 className="font-semibold text-primary mb-4">Quick Access</h3>
              <div className="space-y-2">
                {loading ? (
                  [1,2,3,4].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)
                ) : topics.map((topic) => {
                  const tc = TOPIC_COLORS[topic.slug] || { color: '#8888a8', bg: 'rgba(136,136,168,0.1)' }
                  return (
                    <Link key={topic.id} to={`/topics/${topic.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5 group">
                      <span className="text-lg">{topic.icon || '📘'}</span>
                      <span className="text-sm text-secondary group-hover:text-primary transition-colors">{topic.title}</span>
                      <svg className="w-3.5 h-3.5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Bookmarks</h3>
                <Link to="/profile" className="text-xs text-brand-400 hover:underline">View all</Link>
              </div>
              {progress?.bookmarks?.length > 0 ? (
                <div className="space-y-2">
                  {progress.bookmarks.slice(0, 4).map((b) => (
                    <Link key={b.id} to={`/notes/${b.slug}`}
                      className="block px-3 py-2.5 rounded-xl text-sm text-secondary hover:text-primary hover:bg-white/5 transition-all truncate">
                      🔖 {b.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted text-center py-4">No bookmarks yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}