import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside style={{
      width: 240,
      padding: 24,
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/topics">Topics</Link>
        <Link to="/revision">Revision</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
    </aside>
  )
}