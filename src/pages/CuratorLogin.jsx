import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  button: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '8px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '16px' },
  pending: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#B07D62', backgroundColor: '#FDF8F5', padding: '12px 16px', borderRadius: '2px', border: '1px solid #E8D5C4', marginBottom: '16px' },
  resetSuccess: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '16px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '32px 0' },
  bottomLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', textAlign: 'center', marginTop: '16px' },
  regularLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', textAlign: 'center', marginTop: '12px' },
  forgotLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590', textAlign: 'right', cursor: 'pointer', marginTop: '4px', display: 'block' },
}

export default function CuratorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notApproved, setNotApproved] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNotApproved(false)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }

    const { data: curator } = await supabase
      .from('curators')
      .select('can_events, can_places')
      .eq('user_id', data.user.id)
      .single()

    if (!curator) {
      setError('No curator account found. Request access first.')
      await supabase.auth.signOut()
    } else if (!curator.can_events && !curator.can_places) {
      setNotApproved(true)
      await supabase.auth.signOut()
    } else {
      navigate('/curator')
    }
    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!email) { setError('Enter your email above first.'); return }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/curator-login`,
    })
    setResetSent(true)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.eyebrow}>Curators only</p>
        <h1 style={s.headline}>Curator sign in.</h1>
        <p style={s.sub}>Access your portal to upload events and recommendations.</p>

        {error && <p style={s.error}>{error}</p>}
        {notApproved && <p style={s.pending}>Your account is pending approval. We'll reach out soon.</p>}
        {resetSent && <p style={s.resetSuccess}>Reset email sent — check your inbox.</p>}

        <form style={s.form} onSubmit={handleSubmit}>
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            <span style={s.forgotLink} onClick={handleForgotPassword}>Forgot password?</span>
          </div>
          <button type="submit" style={s.button} disabled={loading}>
            {loading ? 'Checking access...' : 'Sign in to portal'}
          </button>
        </form>

        <div style={s.divider} />

        <p style={s.bottomLink}>
          Not a curator yet?{' '}
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