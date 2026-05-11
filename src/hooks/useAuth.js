import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((s) => s.auth)
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
  }
}