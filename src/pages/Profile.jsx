import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1>Profile</h1>

      <div style={{ marginTop: 24 }}>
        <p><strong>Name:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>XP:</strong> {user?.xpPoints}</p>
        <p><strong>Streak:</strong> {user?.streak}</p>
      </div>
    </div>
  )
}