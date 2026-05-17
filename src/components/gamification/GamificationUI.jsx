import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame, Trophy, Star, Award, TrendingUp, Target, CheckCircle2 } from 'lucide-react'
import { useGamification } from '../../hooks/useGamification'

/* ─── Level Badge ─── */
export function LevelBadge({ size = 'md' }) {
  const { level } = useGamification()

  const sizes = {
    sm: { badge: 'w-10 h-10 text-sm', icon: 16 },
    md: { badge: 'w-14 h-14 text-lg', icon: 20 },
    lg: { badge: 'w-20 h-20 text-2xl', icon: 28 },
  }

  const { badge, icon } = sizes[size] || sizes.md

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`${badge} rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30`}
    >
      <span className="font-black text-black">{level}</span>
    </motion.div>
  )
}

/* ─── Streak Counter ─── */
export function StreakCounter({ showIcon = true }) {
  const { streak } = useGamification()

  const getStreakEmoji = () => {
    if (streak >= 30) return '🔥🔥🔥'
    if (streak >= 14) return '🔥🔥'
    if (streak >= 7) return '🔥'
    return ''
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-2"
    >
      {showIcon && <Flame className="h-5 w-5 text-orange-500" />}
      <span className="text-2xl font-black text-orange-400">{streak}</span>
      <span className="text-sm text-slate-400">day streak {getStreakEmoji()}</span>
    </motion.div>
  )
}

/* ─── XP Progress Bar ─── */
export function XpProgressBar({ compact = false }) {
  const { xpToday, totalXp, level, levelInfo } = useGamification()

  const levelMin = levelInfo?.min || 0
  const levelMax = levelInfo?.max || 100
  const xpProgress = totalXp - levelMin
  const xpForNextLevel = levelMax - levelMin
  const progressPercent = xpForNextLevel > 0 ? (xpProgress / xpForNextLevel) * 100 : 100

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-amber-400">{totalXp} XP</span>
        </div>
        <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <LevelBadge size="sm" />
          <div>
            <span className="text-lg font-bold">Level {level}</span>
            <span className="text-sm text-slate-400 ml-2">{xpProgress}/{xpForNextLevel} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <Zap className="h-5 w-5" />
          <span className="font-bold">{xpToday} XP today</span>
        </div>
      </div>

      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>Current Level</span>
        <span>Next Level ({Math.max(0, xpForNextLevel - xpProgress)} XP needed)</span>
      </div>
    </div>
  )
}

/* ─── Achievement Card ─── */
export function AchievementCard({ achievement }) {
  const icons = {
    first_lesson: <Star className="h-6 w-6" />,
    streak_3: <Flame className="h-6 w-6" />,
    streak_7: <Flame className="h-6 w-6" />,
    xp_100: <Zap className="h-6 w-6" />,
    xp_500: <Trophy className="h-6 w-6" />,
    commenter: <Target className="h-6 w-6" />,
    project_builder: <Award className="h-6 w-6" />,
  }

  const names = {
    first_lesson: 'First Steps',
    streak_3: 'On Fire',
    streak_7: 'Week Warrior',
    xp_100: 'XP Hunter',
    xp_500: 'XP Master',
    commenter: 'Community',
    project_builder: 'Builder',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
        {icons[achievement] || <Star className="h-6 w-6" />}
      </div>
      <span className="font-bold text-amber-300">{names[achievement] || achievement}</span>
    </motion.div>
  )
}

/* ─── Achievements List ─── */
export function AchievementsList() {
  const { achievements } = useGamification()

  if (achievements.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>Complete tasks to unlock achievements!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {achievements.map((a) => (
        <AchievementCard key={a} achievement={a} />
      ))}
    </div>
  )
}

/* ─── Celebration Overlay ─── */
export function CelebrationOverlay() {
  const { showCelebration, celebrationMessage, level, totalXp } = useGamification()

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 blur-xl opacity-50" />

            {/* Card */}
            <div className="relative rounded-3xl border border-amber-500/50 bg-gradient-to-br from-gray-900 to-gray-800 p-10 text-center shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="mb-6"
              >
                <Trophy className="h-24 w-24 text-amber-400 mx-auto" />
              </motion.div>

              <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {celebrationMessage || 'Achievement Unlocked!'}
              </h2>

              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400">{level}</p>
                  <p className="text-sm text-slate-400">Level</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-black text-amber-400">{totalXp}</p>
                  <p className="text-sm text-slate-400">Total XP</p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-black shadow-lg"
              >
                Continue Learning
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Mini Stats Bar ─── */
export function MiniStatsBar() {
  const { streak, totalXp, level } = useGamification()

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-bold text-orange-400">{streak}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-bold text-amber-400">{totalXp}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-emerald-400">Lv.{level}</span>
      </div>
    </div>
  )
}
