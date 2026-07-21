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
  flyerBox: { border: '2px dashed #E8E4DE', borderRadius: '4px', padding: '40px', textAlign: 'center', marginBottom: '32px', cursor: 'pointer', backgroundColor: '#F9F7F4' },
  flyerLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', marginBottom: '8px' },
  flyerHint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#B8B4AF', letterSpacing: '0.06em', textTransform: 'uppercase' },
  flyerPreview: { width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '2px', marginBottom: '16px' },
  scanBtn: { width: '100%', padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#B07D62', border: 'none', borderRadius: '2px', cursor: 'pointer', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' },
  input: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px', lineHeight: '1.6' },
  button: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '24px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '24px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '40px 0' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '24px' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  gateBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px', marginRight: '16px' },
  gateSecondary: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', backgroundColor: 'transparent' },
}

export default function CuratorPortal() {
  const [user, setUser] = useState(null)
  const [curator, setCurator] = useState(undefined)
  const [form, setForm] = useState(emptyEvent)
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [flyer, setFlyer] = useState(null)
  const [flyerPreview, setFlyerPreview] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        checkCurator(session.user.id)
      } else {
        setUser(null)
        setCurator(null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user)
        checkCurator(session.user.id)
      } else {
        setUser(null)
        setCurator(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function checkCurator(userId) {
    const { data } = await supabase
      .from('curators')
      .select('*')
      .eq('user_id', userId)
      .single()
    setCurator(data || null)
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  function handleFlyerChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setFlyer(file)
    setFlyerPreview(URL.createObjectURL(file))
  }

  async function handleScan() {
    if (!flyer) return
    setScanning(true)
    setError('')
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mediaType: flyer.type }),
        })
        const data = await res.json()
        if (data.title) {
          setForm(prev => ({
            ...prev,
            title: data.title || prev.title,
            venue: data.venue || prev.venue,
            address: data.address || prev.address,
            city: data.city || prev.city,
            country: data.country || prev.country,
            date: data.date || prev.date,
            time: data.time || prev.time,
            genre: data.genre || prev.genre,
            description: data.description || prev.description,
            ticket_url: data.ticket_url || prev.ticket_url,
          }))
        }
        setScanning(false)
      }
      reader.readAsDataURL(flyer)
    } catch {
      setError('Scan failed. Fill in manually.')
      setScanning(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.from('events').insert([{
      ...form, curator_id: user.id, status: 'published',
    }])
    if (error) { setError('Something went wrong. Try again.') }
    else { setSuccess('Event added to Get Lored.'); setForm(emptyEvent); setFlyer(null); setFlyerPreview(null) }
    setSubmitting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  // Still loading
  if (curator === undefined) return null

  // Not logged in
  if (!user) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>Curators only.</h2>
        <p style={s.gateSub}>Sign in to access your portal.</p>
        <a href="/curator-login" style={s.gateBtn}>Sign in</a>
      </div>
    )
  }

  // Logged in but not a curator
  if (!curator) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>You're not a curator yet.</h2>
        <p style={s.gateSub}>Request access to start uploading events and recommendations.</p>
        <a href="/request-access" style={s.gateBtn}>Request access</a>
        <br /><br />
        <button style={s.gateSecondary} onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }

  // Curator exists but not approved
  if (!curator.approved) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>You're on our radar.</h2>
        <p style={s.gateSub}>Your application is pending. We'll reach out when you're approved.</p>
        <button style={s.gateSecondary} onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }

  // Approved curator — show portal
  return (
    <main style={s.page}>
      <div style={s.topRow}>
        <div>
          <p style={s.eyebrow}>Curator portal</p>
          <h1 style={s.headline}>Add an event.</h1>
          <p style={s.sub}>Upload a flyer and let AI fill in the details, or enter manually.</p>
        </div>
        <button style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>

      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}

      <h2 style={s.sectionTitle}>Upload flyer</h2>
      <label style={s.flyerBox}>
        {flyerPreview ? (
          <img src={flyerPreview} alt="Flyer preview" style={s.flyerPreview} />
        ) : (
          <>
            <p style={s.flyerLabel}>Drop your flyer here or click to upload</p>
            <p style={s.flyerHint}>JPG or PNG</p>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFlyerChange} style={{ display: 'none' }} />
      </label>

      {flyer && (
        <button style={s.scanBtn} onClick={handleScan} disabled={scanning}>
          {scanning ? 'Reading flyer...' : 'Scan flyer with AI'}
        </button>
      )}

      <div style={s.divider} />
      <h2 style={s.sectionTitle}>Event details</h2>

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