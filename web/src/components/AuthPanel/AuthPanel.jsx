import { useState } from 'react'
import styles from './AuthPanel.module.css'
import { api } from '../../services/api'

const tabs = [
  { id: 'login', label: 'Login' },
  { id: 'signup', label: 'Sign Up' },
]

const copy = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Login to your account to continue',
    button: 'Login',
    footerText: "Don’t have an account?",
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
      payload.fullName = formData.get('fullName')
    }

    try {
      if (mode === 'login') {
        await api.login(payload)
      } else {
        await api.register(payload)
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
        onClick={() => setError('Google sign-on is coming soon!')}
      >
        <img src="https://www.figma.com/api/mcp/asset/5b7c29ab-57d3-4741-a357-89b4e8e59a34" alt="" />
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

