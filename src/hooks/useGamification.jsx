import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getLevel, getXpProgress } from '../utils/constants'
import { getProgressApi } from '../api/notesApi'

const GamificationContext = createContext(null)

const STORAGE_KEY = 'gamification_achievements'

function buildAchievements(totalXp, streak, savedAchievements) {
  const earned = new Set(savedAchievements)

  if (totalXp >= 50) earned.add('first_lesson')
  if (streak >= 3) earned.add('streak_3')
  if (streak >= 7) earned.add('streak_7')
  if (totalXp >= 100) earned.add('xp_100')
  if (totalXp >= 500) earned.add('xp_500')
  if (totalXp >= 1000) earned.add('xp_1000')

  return Array.from(earned)
}

export function GamificationProvider({ children }) {
  const user = useSelector((state) => state.auth.user)
  const [xpToday, setXpToday] = useState(0)
  const [xpProfile, setXpProfile] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')

  const totalXp = user?.xpPoints || 0
  const streak = user?.streak || 0
  const fallbackLevelInfo = useMemo(() => getLevel(totalXp), [totalXp])
  const levelInfo = useMemo(() => ({
    level: xpProfile?.level || fallbackLevelInfo.level,
    min: xpProfile?.levelMinXp ?? fallbackLevelInfo.min,
    max: xpProfile?.nextLevelXp ?? fallbackLevelInfo.max,
    label: xpProfile?.levelLabel || fallbackLevelInfo.label,
  }), [fallbackLevelInfo, xpProfile])
  const level = levelInfo.level
  const xpProgress = useMemo(() => {
    const span = levelInfo.max - levelInfo.min
    return span > 0 ? ((totalXp - levelInfo.min) / span) * 100 : getXpProgress(totalXp)
  }, [levelInfo, totalXp])

  useEffect(() => {
    if (!user) {
      setXpToday(0)
      return
    }

    getProgressApi()
      .then(({ data }) => {
        setXpProfile(data?.xp || null)
        setXpToday(data?.xp?.xpToday || data?.weeklyXp?.[0]?.xp || 0)
      })
      .catch(() => setXpToday(0))
  }, [user?.id, totalXp])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      setAchievements(buildAchievements(totalXp, streak, saved))
    } catch {
      setAchievements(buildAchievements(totalXp, streak, []))
    }
  }, [totalXp, streak])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements))
  }, [achievements])

  const triggerCelebration = useCallback((message) => {
    setCelebrationMessage(message)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }, [])

  const syncXp = useCallback((payload = {}) => {
    if (typeof payload.xpToday === 'number') {
      setXpToday(payload.xpToday)
    }

    if (typeof payload.level === 'number') {
      setXpProfile((current) => ({
        ...(current || {}),
        level: payload.level,
        levelLabel: payload.levelLabel,
        levelMinXp: payload.levelMinXp,
        nextLevelXp: payload.nextLevelXp,
      }))
    }

    if ((payload.xpEarned || 0) > 0) {
      triggerCelebration(`+${payload.xpEarned} XP`)
    }
  }, [triggerCelebration])

  const addXp = useCallback((amount) => {
    if (amount > 0) {
      triggerCelebration(`+${amount} XP`)
    }
  }, [triggerCelebration])

  const value = {
    streak,
    xpToday,
    totalXp,
    achievements,
    level,
    levelInfo,
    xpProgress,
    showCelebration,
    celebrationMessage,
    addXp,
    syncXp,
    triggerCelebration,
  }

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider')
  }
  return context
}
