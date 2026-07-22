import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { maxWidth: '600px', margin: '0 auto', padding: '80px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: '500', lineHeight: '1.1', color: '#1A1A1A', marginBottom: '16px' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '300', lineHeight: '1.7', color: '#6B6560', marginBottom: '56px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' },
  input: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  inputError: { border: '1px solid #C0392B' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '120px', lineHeight: '1.6' },
  button: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '8px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '16px 0' },
  dividerLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9590', marginBottom: '24px', marginTop: '8px' },
  success: { textAlign: 'center', padding: '48px 0' },
  successHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px', lineHeight: '1.3' },
  successSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', lineHeight: '1.7' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0' },
  hint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', marginTop: '4px' },
  loginLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', textAlign: 'center', marginTop: '24px' },
}

export default function RequestAccess() {
  const [form, setForm] = useState({
    name: '', email: '', instagram: '', city: '', why: '',
    password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, city: form.city, instagram: form.instagram }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { error: requestError } = await supabase.from('curator_requests').insert([{
      name: form.name,
      email: form.email,
      instagram: form.instagram,
      city: form.city,
      why: form.why,
      user_id: data.user?.id,
    }])

    if (requestError) {
      setError('Something went wrong saving your request. Try again.')
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <main style={s.page}>
        <div style={s.success}>
          <h2 style={s.successHeadline}>"You're on our radar."</h2>
          <p style={s.successSub}>
            We review every request personally.<br />
            If you're the right fit, you'll hear from us soon.<br /><br />
            Once approved, sign in at the curator portal with your email and password.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <p style={s.eyebrow}>For tastemakers & curators</p>
      <h1 style={s.headline}>Want to share your city?</h1>
      <p style={s.sub}>
        Get Lored is invite-only on the curator side. We handpick DJs, event promoters,
        and cultural insiders who know their cities better than anyone. If that's you — apply below.
      </p>

      {error && <p style={s.error}>{error}</p>}

      <form style={s.form} onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Full name</label>
          <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="DJ King Iven" required />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Email</label>
          <input style={s.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Instagram handle</label>
          <input style={s.input} name="instagram" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Your city</label>
          <input style={s.input} name="city" value={form.city} onChange={handleChange} placeholder="Charlotte, Miami, London..." required />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Why are you the right fit?</label>
          <textarea style={s.textarea} name="why" value={form.why} onChange={handleChange} placeholder="Tell us about your scene, your audience, and what you'd bring to Get Lored..." required />
        </div>

        <div style={s.divider} />
        <p style={s.dividerLabel}>Set up your login</p>

        <div style={s.fieldGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          <p style={s.hint}>Minimum 8 characters</p>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Confirm password</label>
          <input
            style={{ ...s.input, ...(form.confirmPassword && form.password !== form.confirmPassword ? s.inputError : {}) }}
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p style={{ ...s.hint, color: '#C0392B' }}>Passwords do not match</p>
          )}
        </div>

        <button type="submit" style={s.button} disabled={loading}>
          {loading ? 'Submitting...' : 'Request access'}
        </button>
      </form>

      <p style={s.loginLink}>
        Already approved?{' '}
        <Link to="/curator-login" style={{ color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px' }}>
          Sign in to your portal →
        </Link>
      </p>
    </main>
  )
}