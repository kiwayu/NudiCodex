import { useEffect, useState, type FC, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/auth/authService'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

type Mode = 'signin' | 'signup'

export const Auth: FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Already signed in → go to profile.
  useEffect(() => {
    if (user) navigate('/profile', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        await authService.signUp(
          email,
          password,
          displayName.trim() || email.split('@')[0] || 'Diver'
        )
        setNotice('Account created. If email confirmation is on, check your inbox, then sign in.')
        setMode('signin')
      } else {
        await authService.signIn(email, password)
        navigate('/profile', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleMagicLink = async () => {
    setError(null)
    setNotice(null)
    if (!email) {
      setError('Enter your email first.')
      return
    }
    setBusy(true)
    try {
      await authService.signInWithMagicLink(email)
      setNotice('Magic link sent. Check your email to finish signing in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the magic link.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page auth">
      <div className="auth__card">
        <p className="eyebrow">Your codex, saved</p>
        <h1 className="auth__title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth__lede">
          Sign in to save your sightings, favourites and bucket-list to your profile and sync them
          across devices.
        </p>

        {!isSupabaseConfigured && (
          <p className="auth__warn">
            Accounts aren&apos;t configured for this deployment. Your collection is still saved in
            this browser — you can keep using NudiCodex as a guest.
          </p>
        )}

        <div className="auth__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={`auth__tab ${mode === 'signin' ? 'is-active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth__tab ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
        </div>

        <form className="auth__form" onSubmit={(e) => void handleSubmit(e)}>
          {mode === 'signup' && (
            <label className="auth__field">
              <span>Display name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Reef Diver"
                autoComplete="nickname"
              />
            </label>
          )}
          <label className="auth__field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label className="auth__field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <p className="auth__error">{error}</p>}
          {notice && <p className="auth__notice">{notice}</p>}

          <button
            type="submit"
            className="btn auth__submit"
            disabled={busy || !isSupabaseConfigured}
          >
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="auth__magic link"
          onClick={() => void handleMagicLink()}
          disabled={busy || !isSupabaseConfigured}
        >
          Email me a magic link instead
        </button>

        <p className="auth__foot">
          <Link to="/" className="link">
            ← Back to the codex
          </Link>
        </p>
      </div>
    </div>
  )
}
