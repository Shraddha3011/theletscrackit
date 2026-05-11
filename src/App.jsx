import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppRouter from './routes/AppRouter'
import { getMe } from './app/slices/authSlice'

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)

  useEffect(() => {
    if (token) dispatch(getMe())
  }, [dispatch, token])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AppRouter />
    </div>
  )
}