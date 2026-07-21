import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    backgroundColor: '#FAF8F5',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#B07D62',
    marginBottom: '16px',
  },
  headline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '48px',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: '8px',
    lineHeight: '1.1',
  },
  sub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '300',
    color: '#6B6560',
    marginBottom: '48px',
    lineHeight: '1.6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#6B6560',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '300',
    color: '#1A1A1A',
    backgroundColor: '#F2EEE9',
    border: '1px solid #E8E4DE',
    borderRadius: '2px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#FAF8F5',
    backgroundColor: '#1A1A1A',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E8E4DE',
  },
  dividerText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    color: '#9B9590',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  googleBtn: {
    width: '100%',
    padding: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.04em',
    color: '#1A1A1A',
    backgroundColor: '#FAF8F5',
    border: '1px solid #E8E4DE',
    borderRadius: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  error: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#C0392B',
    backgroundColor: '#FDF0EE',
    padding: '12px 16px',
    borderRadius: '2px',
    border: '1px solid #F5C6C0',
  },
  success: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#27AE60',
    backgroundColor: '#EDFAF3',
    padding: '12px 16px',
    borderRadius: '2px',
    border: '1px solid #B7EAD0',
  },
  toggle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '300',
    color: '#6B6560',
    textAlign: 'center',
    marginTop: '24px',
  },
  toggleLink: {
    color: '#1A1A1A',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '1px solid #1A1A1A',
    paddingBottom: '1px',
  },
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/curator')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Check your email to confirm.')
      }
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/curator` },
    })
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Welcome back</p>
        <h1 style={styles.headline}>
          {mode === 'login' ? 'Sign in.' : 'Join.'}
        </h1>
        <p style={styles.sub}>
          {mode === 'login'
            ? 'Sign in to access your curator portal.'
            : 'Create an account to get started.'}
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'One moment...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or
