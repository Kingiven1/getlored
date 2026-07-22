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
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '16px' },
  pending: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#B07D62', backgroundColor: '#FDF8F5', padding: '12px 16px', borderRadius: '2px', border: '1px solid #E8D5C4', marginBottom: '16px' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '16px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '32px 0' },
  toggle: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', textAlign: 'center', marginTop: '24px' },
  toggleLink: { color: '#1A1A1A', fontWeight: '500', cursor: 'pointer', borderBottom: '1px solid #1A1A1A', paddingBottom: '1px' },
  requestLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', textAlign: 'center', marginTop: '12px' },
  regularLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', textAlign: 'center', marginTop: '12px' },
  hint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', marginTop: '4px' },
}

export default function CuratorLogin() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '', city: '', instagram: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notApproved, setNotApproved] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setNotApproved(false)

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) { setError(error.message); setLoading(false); return }

      const { data: curator } = await supabase
        .from('curators')
        .select('approved')
        .eq('user_id', data.user.id)
        .single()

      if (!curator) {
        setError('No curator account found. Request access first.')
        await supabase.auth.signOut()
      } else if (!curator.approved) {
        setNotApproved(true)
        await supabase.auth.signOut()
      } else {
        navigate('/curator')
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, city: form.city, instagram: form.instagram }
        }
      })
      if (error) { setError(error.message) }
      else {
        setSuccess('Account created. You will be notified once approved.')
        setForm({ email: '', password: '', confirmPassword: '', name: '', city: '', instagram: '' })
      }
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.eyebrow}>Curators only</p>
        <h1 style={s.headline}>{mode === 'login' ? 'Curator sign in.' : 'Create account.'}</h1>
        <p style={s.sub}>
          {mode === 'login'
            ? 'Access your portal to upload events and recommendations.'
            : 'Create your curator account. You will need approval before accessing the portal.'}
        </p>

        {error && <p style={s.error}>{error}</p>}
        {success && <p style={s.success}>{success}</p>}
        {notApproved && <p style={s.pending}>Your account is pending approval. We'll reach out soon.</p>}

        <form style={s.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={s.label}>Full name</label>
                <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="DJ King Iven" required />
              </div>
              <div>
                <label style={s.label}>Your city</label>
                <input style={s.input} name="city" value={form.city} onChange={handleChange} placeholder="Charlotte, Miami, London..." required />
              </div>
              <div>
                <label style={s.label}>Instagram handle</label>
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
            {loading ? 'One moment...' : mode === 'login' ? 'Sign in to portal' : 'Create account'}
          </button>
        </form>

        <div style={s.divider} />

        <p style={s.toggle}>
          {mode === 'login' ? "New curator? " : 'Already have an account? '}
          <span style={s.toggleLink} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </span>
        </p>

        <p style={s.requestLink}>
          Not approved yet?{' '}
          <Link to="/request-access" style={{ color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px' }}>
            Request access →
          </Link>
        </p>

        <p style={s.regularLink}>
          Looking for events?{' '}
          <Link to="/login" style={{ color: '#6B6560', borderBottom: '1px solid #6B6560', paddingBottom: '1px' }}>
            Sign in as a user
          </Link>
        </p>
      </div>
    </div>
  )
}