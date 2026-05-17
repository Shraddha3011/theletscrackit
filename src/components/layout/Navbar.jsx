import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { logout } from '../../app/slices/authSlice'
import Avatar from '../common/Avatar'

const brandLogo = '/logo.png'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const MenuIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
      : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
    }
  </svg>
)

export default function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { to: '/topics', label: 'Topics' },
    { to: '/projects', label: 'Projects' },
    { to: '/quiz', label: 'Quiz' },
        { to: '/cs-path', label: 'Explore' },
    // { to: '/search', label: 'Search' },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(12,12,18,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={brandLogo}
              alt="The LetsCrackIT"
              className="h-10 w-10 rounded-xl object-cover shadow-[0_0_24px_rgba(166,210,92,0.28)]"
            />
            <span className="font-display font-bold text-lg hidden sm:block" style={{ color: 'var(--text-primary)' }}>
              The Lets Crack<span style={{ color: 'var(--brand)' }}>IT</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith(l.to)
                    ? 'text-brand-400'
                    : 'text-secondary hover:text-primary hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon />
              </span>
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search topics, notes…"
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* User menu */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 p-1 rounded-xl transition-all hover:bg-white/5"
                  >
                    <Avatar name={user?.fullName || user?.username} src={user?.avatarUrl} size="sm" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden animate-slide-up"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-sm font-semibold text-primary">{user?.fullName || user?.username}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-white/5 transition-all">
                          👤 Profile
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-white/5 transition-all">
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm hidden sm:flex">Sign in</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen((p) => !p)} className="md:hidden btn-ghost p-2">
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t animate-slide-up"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
        >
          <div className="page-container py-4 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-white/5 transition-all">
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-white/5 transition-all">
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-white/5 transition-all">
                    Admin
                  </Link>
                )}
              </>
            )}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
                <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search…" className="input-field pl-9 py-2.5 text-sm w-full" />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
