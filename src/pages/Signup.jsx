import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { signup, clearError } from '../app/slices/authSlice'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import PageWrapper from '../components/layout/PageWrapper'
import { Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAuth()

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => () => dispatch(clearError()), [dispatch])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

const handleSubmit = async (e) => {

  e.preventDefault()

  setValidationError('')

  // FRONTEND VALIDATION

  if (form.fullName.trim().length < 2) {

    setValidationError(
      'Full name must be at least 2 characters'
    )

    return
  }

  if (form.username.trim().length < 3) {

    setValidationError(
      'Username must be at least 3 characters'
    )

    return
  }

  const usernameRegex =
    /^[a-zA-Z0-9_]+$/

  if (!usernameRegex.test(form.username)) {

    setValidationError(
      'Username can only contain letters, numbers and underscores'
    )

    return
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(form.email)) {

    setValidationError(
      'Please enter a valid email'
    )

    return
  }

  if (form.password.length < 6) {

    setValidationError(
      'Password must be at least 6 characters'
    )

    return
  }

  try {

    const result =
      await dispatch(
        signup(form)
      )

    // BACKEND VALIDATION ERROR

    if (result?.error) {

      const payload =
        result.payload

      if (
        payload &&
        typeof payload === 'object'
      ) {

        const firstError =
          Object.values(payload)[0]

        setValidationError(
          firstError
        )

      } else {

        setValidationError(
          'Signup failed'
        )
      }

      return
    }

    // SUCCESS

    setSuccess(true)

    setTimeout(() => {

      navigate('/login')

    }, 2000)

  } catch (err) {

    const data =
      err?.response?.data

    if (
      data &&
      typeof data === 'object'
    ) {

      const firstError =
        Object.values(data)[0]

      setValidationError(
        firstError
      )

    } else {

      setValidationError(
        'Something went wrong'
      )
    }
  }
}

  if (success) {
    return (
      <PageWrapper>
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center space-y-4 animate-slide-up">
          <div className="text-5xl">🎉</div>
          <h2 className="font-display font-bold text-2xl text-primary">Account created!</h2>
          <p className="text-secondary">Redirecting you to sign in…</p>
        </div>
      </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'var(--bg-surface)' }}>
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="glow-orb w-96 h-96 bg-brand-500/10 top-20 right-10" />

        <Link to="/" className="relative flex items-center gap-2">
          <img src="/logo.png" alt="The LetsCrackIT" className="h-10 w-10 rounded-xl object-cover" />
          <span className="font-display font-bold text-lg text-primary">The Lets CrackIT</span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-primary mb-3">
              Start your journey to<br />
              <span className="gradient-text">cracking interviews.</span>
            </h2>
            <p className="text-secondary">Join the community of learners mastering CS, one concept at a time.</p>
          </div>

          <div className="space-y-4">
            {[
              { emoji: '📚', title: 'Access all topics free', sub: 'DSA, React, JS, Java, Python and more' },
              { emoji: '⚡', title: 'Earn XP as you learn', sub: 'Complete notes and quizzes to level up' },
              { emoji: '🏆', title: 'Track your progress', sub: 'Visual dashboard of everything you\'ve learned' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted">Free forever, no credit card required.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="The LetsCrackIT" className="h-9 w-9 rounded-xl object-cover" />
            <span className="font-display font-bold text-base text-primary">The Lets CrackIT</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-primary mb-1">Create your account</h1>
          <p className="text-secondary text-sm mb-8">Free forever, no credit card required</p>

          {(error || validationError) && (
            <div className="px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Rahul Sharma" required />
            <Input label="Username" name="username" value={form.username} onChange={handleChange} placeholder="rahul_dev" required />
            <Input label="Email address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}
