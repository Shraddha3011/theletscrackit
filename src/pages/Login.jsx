import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

import {
  login,
  clearError
} from '../app/slices/authSlice'

import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Login() {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const {
    loading,
    error
  } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] =
    useState(false)

  useEffect(() => {

    return () => {

      dispatch(clearError())
    }

  }, [dispatch])

  const handleChange = (e) => {

    setForm((prev) => ({

      ...prev,

      [e.target.name]:
        e.target.value
    }))
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const result =
        await dispatch(
          login(form)
        )

      console.log(
        'LOGIN RESULT:',
        result
      )

      if (!result.error) {

        navigate(
          result.payload?.role === 'ADMIN'
            ? '/admin'
            : '/dashboard'
        )
      }

    } catch (err) {

      console.error(err)
    }
  }

  return (

    <div className="min-h-screen flex">

      {/* LEFT PANEL */}

      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background:
            'var(--bg-surface)'
        }}
      >

        <div className="absolute inset-0 bg-grid-pattern" />

        <div className="glow-orb w-96 h-96 bg-brand-500/10 -top-10 -left-10" />

        <div className="glow-orb w-64 h-64 bg-purple-500/10 bottom-20 right-10" />

        <Link
          to="/"
          className="relative flex items-center gap-2"
        >

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background:
                'var(--brand)',
              color:
                '#0c0c12'
            }}
          >
            LC
          </div>

          <span className="font-display font-bold text-lg text-primary">
            LetsCrackIT
          </span>

        </Link>

        <div className="relative space-y-6">

          <h2 className="font-display font-bold text-3xl text-primary">

            Continue your
            <br />

            <span className="gradient-text">
              learning journey.
            </span>

          </h2>

          <p className="text-secondary">

            Sign in to track progress,
            earn XP, and access your
            personalized dashboard.

          </p>

          <div className="space-y-3">

            {[
              {
                icon: '⚡',
                text: 'Pick up where you left off'
              },
              {
                icon: '🔥',
                text: 'Keep your streak alive'
              }
            ].map((item) => (

              <div
                key={item.text}
                className="flex items-center gap-3"
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="text-sm text-secondary">
                  {item.text}
                </span>

              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted">
          © 2026 LetsCrackIT.
          All rights reserved.
        </p>
      </div>

      {/* RIGHT PANEL */}

      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{
          background:
            'var(--bg-primary)'
        }}
      >

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}

          <div className="lg:hidden flex items-center gap-2 mb-8">

            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{
                background:
                  'var(--brand)',
                color:
                  '#0c0c12'
              }}
            >
              LC
            </div>

            <span className="font-display font-bold text-base text-primary">
              LetsCrackIT
            </span>

          </div>

          {/* HEADER */}

          <h1 className="font-display font-bold text-2xl text-primary mb-1">
            Welcome back
          </h1>

          <p className="text-secondary text-sm mb-8">
            Sign in to your account
          </p>

          {/* ERROR */}

          {error && (

            <div
              className="px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in"
              style={{
                background:
                  'rgba(239,68,68,0.1)',

                border:
                  '1px solid rgba(239,68,68,0.3)',

                color:
                  '#ef4444'
              }}
            >

              {error}

            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            {/* PASSWORD FIELD */}

            <div className="relative">

              <Input
                label="Password"
                name="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-[38px] text-secondary hover:text-primary transition-colors"
              >

                {showPassword ? (

                  <EyeOff size={18} />

                ) : (

                  <Eye size={18} />

                )}

              </button>

            </div>

            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="text-xs text-brand-400 hover:underline"
              >

                Forgot password?

              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >

              Sign In

            </Button>
          </form>

          <p className="text-center text-sm text-secondary mt-6">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="text-brand-400 font-medium hover:underline"
            >

              Create one free

            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}