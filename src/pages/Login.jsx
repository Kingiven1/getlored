import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', backgroundColor: '#FAF8F5' },
  card: { width: '100%', maxWidth: '420px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '40px', lineHeight: '1.6' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  inputError: { border: '1px solid #C0392B' },
  button: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '8px' },
  divider: { display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#E8E4DE' },
  dividerText: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', letterSpacing: '0.08em', textTransform: 'uppercase' },
  googleBtn: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '16px' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '16px' },
  toggle: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', textAlign: 'center', marginTop: '24px' },
  toggleLink: { color: '#1A1A1A', fontWeight: '500', cursor: 'pointer', borderBottom: '1px solid #1A1A1A', paddingBottom: '1px' },
  curatorLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', textAlign: 'center', marginTop: '12px' },
  hint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', marginTop: '4px' },
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '', city: '', instagram: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) { setError(error.message) }
      else { navigate('/cities') }
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, city: form.city, instagram: form.instagram }
        }
      })
      if (error) { setError(error.message) }
      else {
        setSuccess('Welcome to Get Lored.')
        setTimeout(() => navigate('/cities'), 1500)
      }
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/cities` },
    })
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.eyebrow}>{mode === 'login' ? 'Welcome back' : 'Join Get Lored'}</p>
        <h1 style={s.headline}>{mode === 'login' ? 'Sign in.' : 'Sign up.'}</h1>
        <p style={s.sub}>
          {mode === 'login'
            ? 'Sign in to save events and access exclusive recommendations.'
            : 'Create your account to get tapped in.'}
        </p>

        {error && <p style={s.error}>{error}</p>}
        {success && <p style={s.success}>{success}</p>}

        <form style={s.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={s.label}>Full name</label>
                <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div>
                <label style={s.label}>Your city</label>
                <input style={s.input} name="city" value={form.city} onChange={handleChange} placeholder="Charlotte, Miami, London..." required />
              </div>
              <div>
                <label style={s.label}>Instagram handle (optional)</label>
                <input style={s.input} name="instagram" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" />
              </div>
            </>
          )}
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            {mode === 'signup' && <p style={s.hint}>Minimum 8 characters</p>}
          </div>
          {mode === 'signup' && (
            <div>
              <label style={s.label}>Confirm password</label>
              <input
                style={{ ...s.input, ...(form.confirmPassword && form.password !== form.confirmPassword ? s.inputError : {}) }}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ ...s.hint, color: '#C0392B' }}>Passwords do not match</p>
              )}
            </div>
          )}
          <button type="submit" style={s.button} disabled={loading}>
            {loading ? 'One moment...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or</span>
          <div style={s.dividerLine} />
        </div>

        <button style={s.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        <p style={s.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.toggleLink} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>

        <p style={s.curatorLink}>
          Are you a curator?{' '}
          <Link to="/curator-login" style={{ color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px' }}>
            Curator sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}