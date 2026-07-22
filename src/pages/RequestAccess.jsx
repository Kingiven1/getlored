import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  inputDisabled: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#9B9590', backgroundColor: '#EDEAE5', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  inputError: { border: '1px solid #C0392B' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '120px', lineHeight: '1.6' },
  button: { width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '8px' },
  buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '16px 0' },
  dividerLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9590', marginBottom: '24px', marginTop: '8px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0' },
  warning: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#8B6914', backgroundColor: '#FEF9E7', padding: '16px', borderRadius: '2px', border: '1px solid #F9E79F', lineHeight: '1.6' },
  info: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#2C6FA0', backgroundColor: '#EAF2FB', padding: '16px', borderRadius: '2px', border: '1px solid #C7DEF2', lineHeight: '1.6', marginBottom: '8px' },
  hint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#9B9590', marginTop: '4px' },
  inlineLink: { color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px', fontWeight: '500' },
  success: { textAlign: 'center', padding: '48px 0' },
  successHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px', lineHeight: '1.3' },
  successSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', lineHeight: '1.7' },
  loginLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', textAlign: 'center', marginTop: '24px' },
  portalChoice: { display: 'flex', gap: '12px' },
  portalCard: { flex: 1, padding: '20px', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', backgroundColor: '#F2EEE9', transition: 'border-color 0.15s' },
  portalCardActive: { border: '1px solid #1A1A1A', backgroundColor: '#FAF8F5' },
  portalCardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  portalCardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '300', color: '#6B6560', lineHeight: '1.5' },
  checkboxRow: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  checkbox: { marginTop: '3px', flexShrink: 0, width: '15px', height: '15px', cursor: 'pointer', accentColor: '#1A1A1A' },
  checkboxLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '300', color: '#6B6560', lineHeight: '1.5', cursor: 'pointer' },
  checkboxLink: { color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px' },
}

export default function RequestAccess() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [existingUser, setExistingUser] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', instagram: '', city: '', why: '',
    password: '', confirmPassword: '',
  })
  const [wantsEvents, setWantsEvents] = useState(false)
  const [wantsPlaces, setWantsPlaces] = useState(false)
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [accountExists, setAccountExists] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setExistingUser(session.user)
        const meta = session.user.user_metadata || {}
        setForm(prev => ({
          ...prev,
          name: meta.name || '',
          city: meta.city || '',
          instagram: meta.instagram || '',
          email: session.user.email || '',
        }))
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (accountExists) setAccountExists(false)
    if (error) setError('')
  }

  async function handlePasswordReset() {
    await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/curator-login`,
    })
    setResetSent(true)
  }

  // Tags this person as a curator and records their curator city in marketing_consent,
  // without disturbing an existing marketing opt-in they may have already given elsewhere.
  // Only touches email_opt_in / opted_in_at if they explicitly checked the box on this form.
  async function saveCuratorConsent(userId) {
    const consentPayload = {
      user_id: userId,
      email: form.email,
      consent_version: 'v1',
      audience_type: 'curator',
      home_city: form.city,
    }
    if (marketingOptIn) {
      consentPayload.email_opt_in = true
      consentPayload.opted_in_at = new Date().toISOString()
    }
    await supabase.from('marketing_consent').upsert([consentPayload], { onConflict: 'user_id' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setAccountExists(false)

    if (!wantsEvents && !wantsPlaces) {
      setError('Select at least one portal to apply for.')
      return
    }
    if (!form.name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!form.city.trim()) {
      setError('Please enter your city.')
      return
    }
    if (!form.why.trim()) {
      setError('Please tell us why you\'re the right fit.')
      return
    }
    if (!agreedToPolicy) {
      setError('Please acknowledge the Privacy Policy to continue.')
      return
    }

    setLoading(true)

    // Already-signed-in member: just attach the request to their existing account.
    if (existingUser) {
      const { error: requestError } = await supabase.from('curator_requests').insert([{
        name: form.name,
        email: form.email,
        instagram: form.instagram,
        city: form.city,
        why: form.why,
        user_id: existingUser.id,
        wants_events: wantsEvents,
        wants_places: wantsPlaces,
      }])

      if (requestError) {
        setError('Something went wrong saving your request. Try again.')
        setLoading(false)
        return
      }

      await saveCuratorConsent(existingUser.id)

      setSubmitted(true)
      setLoading(false)
      return
    }

    // New visitor: create the account first, same as before.
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, city: form.city, instagram: form.instagram }
      }
    })

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already registered') ||
          signUpError.message.toLowerCase().includes('already been registered') ||
          signUpError.message.toLowerCase().includes('user already exists')) {
        setAccountExists(true)
      } else {
        setError(signUpError.message)
      }
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
      wants_events: wantsEvents,
      wants_places: wantsPlaces,
    }])

    if (requestError) {
      setError('Something went wrong saving your request. Try again.')
      setLoading(false)
      return
    }

    if (data.user?.id) {
      await saveCuratorConsent(data.user.id)
    }

    await supabase.auth.signOut()
    setSubmitted(true)
    setLoading(false)
  }

  const canSubmit = wantsEvents || wantsPlaces
  const submitDisabled = loading || !agreedToPolicy || !canSubmit

  if (checkingSession) return null

  if (submitted) {
    return (
      <main style={s.page}>
        <div style={s.success}>
          <h2 style={s.successHeadline}>"You're on our radar."</h2>
          <p style={s.successSub}>
            We review every request personally.<br />
            If you're the right fit, you'll hear from us soon.<br /><br />
            {existingUser
              ? "You'll see your curator portal unlock automatically once approved — no need to sign in again."
              : 'Once approved, sign in at the curator portal with your email and password.'}
          </p>
          <br />
          {!existingUser && <Link to="/curator-login" style={s.inlineLink}>Go to curator sign in →</Link>}
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

      {existingUser && (
        <p style={s.info}>
          You're signed in as {existingUser.email}. We've filled in what we already know —
          just finish the rest below.
        </p>
      )}

      {error && <p style={s.error}>{error}</p>}

      {accountExists && (
        <div style={s.warning}>
          An account with that email already exists.{' '}
          <Link to="/curator-login" style={s.inlineLink}>Sign in to your portal</Link>
          {' '}or{' '}
          {resetSent ? (
            <span style={{ color: '#27AE60', fontWeight: '500' }}>Reset email sent — check your inbox.</span>
          ) : (
            <span
              style={{ ...s.inlineLink, cursor: 'pointer' }}
              onClick={handlePasswordReset}
            >
              reset your password
            </span>
          )}
          .
        </div>
      )}

      <form style={s.form} onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label}>What are you applying for?</label>
          <div style={s.portalChoice}>
            <div
              style={wantsEvents ? { ...s.portalCard, ...s.portalCardActive } : s.portalCard}
              onClick={() => setWantsEvents(!wantsEvents)}
            >
              <p style={s.portalCardTitle}>{wantsEvents ? '✓ ' : ''}Event Curator</p>
              <p style={s.portalCardSub}>Upload parties, shows, and ticketed events.</p>
            </div>
            <div
              style={wantsPlaces ? { ...s.portalCard, ...s.portalCardActive } : s.portalCard}
              onClick={() => setWantsPlaces(!wantsPlaces)}
            >
              <p style={s.portalCardTitle}>{wantsPlaces ? '✓ ' : ''}Cultural Influencer</p>
              <p style={s.portalCardSub}>Recommend restaurants, bars, venues, and happenings.</p>
            </div>
          </div>
          {!canSubmit && <p style={s.hint}>Select at least one to continue.</p>}
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Full name</label>
          <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="DJ King Iven" required />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Email</label>
          {existingUser ? (
            <input style={s.inputDisabled} value={form.email} disabled />
          ) : (
            <input style={s.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          )}
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Instagram handle</label>
          <input style={s.input} name="instagram" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" required />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Your city</label>
          <input style={s.input} name="city" value={form.city} onChange={handleChange} placeholder="Charlotte, Miami, London..." required />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Why are you the right fit?</label>
          <textarea style={s.textarea} name="why" value={form.why} onChange={handleChange} placeholder="Tell us about your scene, your audience, and what you'd bring to Get Lored..." required />
        </div>

        {!existingUser && (
          <>
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
          </>
        )}

        <div style={s.divider} />

        <label style={s.checkboxRow}>
          <input
            type="checkbox"
            style={s.checkbox}
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
            required
          />
          <span style={s.checkboxLabel}>
            I acknowledge Get Lored's{' '}
            <Link to="/privacy" target="_blank" style={s.checkboxLink}>Privacy Policy</Link>{' '}and{' '}
            <Link to="/terms" target="_blank" style={s.checkboxLink}>Terms of Service</Link>.
          </span>
        </label>

        {!existingUser && (
          <label style={s.checkboxRow}>
            <input
              type="checkbox"
              style={s.checkbox}
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />
            <span style={s.checkboxLabel}>
              Send me event drops, city updates, and news from Get Lored. (Optional — unsubscribe anytime.)
            </span>
          </label>
        )}

        {existingUser && (
          <label style={s.checkboxRow}>
            <input
              type="checkbox"
              style={s.checkbox}
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />
            <span style={s.checkboxLabel}>
              Also sign me up for event drops, city updates, and news. (Optional — unsubscribe anytime.)
            </span>
          </label>
        )}

        <button
          type="submit"
          style={submitDisabled ? { ...s.button, ...s.buttonDisabled } : s.button}
          disabled={submitDisabled}
        >
          {loading ? 'Submitting...' : 'Request access'}
        </button>
      </form>

      {!existingUser && (
        <p style={s.loginLink}>
          Already approved?{' '}
          <Link to="/curator-login" style={{ color: '#B07D62', borderBottom: '1px solid #B07D62', paddingBottom: '1px' }}>
            Sign in to your portal →
          </Link>
        </p>
      )}
    </main>
  )
}