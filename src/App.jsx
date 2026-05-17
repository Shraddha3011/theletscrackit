import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppRouter from './routes/AppRouter'
import { getMe } from './app/slices/authSlice'
import { GamificationProvider } from './hooks/useGamification'
import { CelebrationOverlay } from './components/gamification/GamificationUI'

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [dispatch, token])

  return (
    <GamificationProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <AppRouter />
        <CelebrationOverlay />
      </div>
    </GamificationProvider>
  )
}