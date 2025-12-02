import { useState } from 'react'
import styles from './AuthPanel.module.css'
import { authAPI } from '../../api/axios'

const tabs = [
  { id: 'login', label: 'Login' },
  { id: 'signup', label: 'Sign Up' },
]

const copy = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Login to your account to continue',
    button: 'Login',
    footerText: "Don't have an account?",
    footerLink: 'Sign up here',
  },
  signup: {
    title: 'Create Account',
    subtitle: 'Join BusMate to start booking tickets',
    button: 'Create Account',
    footerText: 'Already have an account?',
    footerLink: 'Login',
  },
}

function AuthPanel({ onAuthenticated }) {
  const [status, setStatus] = useState('idle')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('submitting')

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    if (mode === 'signup') {
      const confirmPassword = formData.get('confirmPassword')
      if (payload.password !== confirmPassword) {
        setError('Passwords must match.')
        setStatus('idle')
        return
      }
      payload.name = formData.get('fullName')
    }

    try {
      let response
      if (mode === 'login') {
        response = await authAPI.login(payload)
      } else {
        response = await authAPI.signup(payload)
      }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      if (typeof onAuthenticated === 'function') {
        onAuthenticated()
      }
    } catch (err) {
      setError(err.message || 'Unable to reach BusMate servers.')
    } finally {
      setStatus('idle')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  const content = copy[mode]

  return (
    <div className={styles.card}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${mode === tab.id ? styles.active : ''}`}
            onClick={() => setMode(tab.id)}
            disabled={mode === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.header}>
        <h2>{content.title}</h2>
        <p>{content.subtitle}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <label className={styles.label}>
            Full Name
            <div className={styles.inputWrapper}>
              <span>👤</span>
              <input type="text" name="fullName" placeholder="Juan Dela Cruz" required />
            </div>
          </label>
        )}

        <label className={styles.label}>
          Email Address
          <div className={styles.inputWrapper}>
            <span>✉️</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </div>
        </label>

        <label className={styles.label}>
          Password
          <div className={styles.inputWrapper}>
            <span>🔒</span>
            <input type="password" name="password" placeholder="••••••••" required />
          </div>
          {mode === 'signup' && <small>Must be at least 6 characters</small>}
        </label>

        {mode === 'signup' && (
          <label className={styles.label}>
            Confirm Password
            <div className={styles.inputWrapper}>
              <span>🔒</span>
              <input type="password" name="confirmPassword" placeholder="••••••••" required />
            </div>
          </label>
        )}

        <button className={styles.primary} type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Please wait…' : content.button}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.divider}><span />OR<span /></div>

      <button
        type="button"
        className={styles.googleButton}
        onClick={handleGoogleLogin}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
      </button>

      <div className={styles.footer}>
        <p>{content.footerText}</p>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {content.footerLink}
        </button>
      </div>

      {mode === 'signup' && <p className={styles.legal}>By signing up, you agree to our Terms of Service and Privacy Policy.</p>}
    </div>
  )
}

export default AuthPanel