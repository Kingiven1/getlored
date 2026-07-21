import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0' },
  notApproved: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#B07D62', backgroundColor: '#FDF8F5', padding: '12px 16px', borderRadius: '2px', border: '1px solid #E8D5C4' },
  divider: { display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#E8E4DE' },
  dividerText: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', letterSpacing: '0.08em', textTransform: 'uppercase' },
  googleBtn: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  requestLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', textAlign: 'center', marginTop: '24px' },
  link: { color: '#1A1A1A', fontWeight: '500', borderBottom: '1px solid #1A1A1A', paddingBottom: '1px' },
}

export default function CuratorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notApproved, setNotApproved] = useState(false)
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
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/curator` },
    })
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.eyebrow}>Curators only</p>
        <h1 style={s.headline}>Curator sign in.</h1>
        <p style={s.sub}>Access your portal to upload events and recommendations.</p>

        {error && <p style={s.error}>{error}</p>}
        {notApproved && <p style={s.notApproved}>Your account is pending approval. We'll reach out soon.</p>}

        <form style={s.form} onSubmit={handleSubmit}>
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" style={s.button} disabled={loading}>
            {loading ? 'Checking access...' : 'Sign in to portal'}
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

        <p style={s.requestLink}>
          Not a curator yet?{' '}
          <a href="/request-access" style={s.link}>Request access</a>
        </p>
      </div>
    </div>
  )
}