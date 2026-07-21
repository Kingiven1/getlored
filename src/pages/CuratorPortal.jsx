import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const emptyEvent = {
  title: '', venue: '', address: '', city: '', country: '',
  date: '', time: '', genre: '', description: '', ticket_url: '',
}

const s = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '40px', lineHeight: '1.6' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  signOutBtn: { padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' },
  input: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px', lineHeight: '1.6' },
  button: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0' },
  notAuth: { textAlign: 'center', padding: '120px 32px' },
  notAuthHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  notAuthSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  notAuthBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px' },
}

export default function CuratorPortal() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyEvent)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.from('events').insert([{ ...form, curator_id: user.id, status: 'published' }])
    if (error) { setError('Something went wrong. Try again.') }
    else { setSuccess('Event added to Get Lored.'); setForm(emptyEvent) }
    setSubmitting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return null

  if (!user) {
    return (
      <div style={s.notAuth}>
        <h2 style={s.notAuthHeadline}>Curators only.</h2>
        <p style={s.notAuthSub}>Sign in to access your portal.</p>
        <a href="/login" style={s.notAuthBtn}>Sign in</a>
      </div>
    )
  }

  return (
    <main style={s.page}>
      <div style={s.topRow}>
        <div>
          <p style={s.eyebrow}>Curator portal</p>
          <h1 style={s.headline}>Add an event.</h1>
          <p style={s.sub}>Fill in the details to add an event to Get Lored.</p>
        </div>
        <button style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>
      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}
      <form style={s.form} onSubmit={handleSubmit}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Event title</label>
          <input style={s.input} name="title" value={form.title} onChange={handleChange} placeholder="Event name" required />
        </div>
        <div style={s.row}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Venue</label>
            <input style={s.input} name="venue" value={form.venue} onChange={handleChange} placeholder="Venue name" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Genre</label>
            <select style={s.select} name="genre" value={form.genre} onChange={handleChange}>
              <option value="">Select genre</option>
              <option value="Afrobeats">Afrobeats</option>
              <option value="Amapiano">Amapiano</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="House">House</option>
              <option value="R&B">R&B</option>
              <option value="Reggae">Reggae</option>
              <option value="Soca">Soca</option>
              <option value="Tech House">Tech House</option>
              <option value="Mixed">Mixed</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Address</label>
          <input style={s.input} name="address" value={form.address} onChange={handleChange} placeholder="Full address" />
        </div>
        <div style={s.row}>
          <div style={s.fieldGroup}>
            <label style={s.label}>City</label>
            <input style={s.input} name="city" value={form.city} onChange={handleChange} placeholder="Miami" required />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Country</label>
            <input style={s.input} name="country" value={form.country} onChange={handleChange} placeholder="USA" required />
          </div>
        </div>
        <div style={s.row}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Date</label>
            <input style={s.input} name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Time</label>
            <input style={s.input} name="time" value={form.time} onChange={handleChange} placeholder="10pm – 3am" />
          </div>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Ticket link</label>
          <input style={s.input} name="ticket_url" value={form.ticket_url} onChange={handleChange} placeholder="https://..." />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Tell people what to expect..." />
        </div>
        <button type="submit" style={s.button} disabled={submitting}>
          {submitting ? 'Adding...' : 'Add event'}
        </button>
      </form>
    </main>
  )
}