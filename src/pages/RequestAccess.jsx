import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '64px 32px',
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
    fontSize: 'clamp(36px, 5vw, 56px)',
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
    marginBottom: '56px',
    lineHeight: '1.6',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E8E4DE',
    margin: '48px 0',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#6B6560',
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
  textarea: {
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
    resize: 'vertical',
    minHeight: '100px',
    lineHeight: '1.6',
  },
  select: {
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
    padding: '14px 32px',
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
    alignSelf: 'flex-start',
  },
  signOutBtn: {
    padding: '8px 20px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#6B6560',
    backgroundColor: 'transparent',
    border: '1px solid #E8E4DE',
    borderRadius: '2px',
    cursor: 'pointer',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
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
  error: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#C0392B',
    backgroundColor: '#FDF0EE',
    padding: '12px 16px',
    borderRadius: '2px',
    border: '1px solid #F5C6C0',
  },
  notAuth: {
    textAlign: 'center',
    padding: '120px 32px',
  },
  notAuthHeadline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '36px',
    fontStyle: 'italic',
    color: '#1A1A1A',
    marginBottom: '16px',
  },
  notAuthSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '300',
    color: '#6B6560',
    marginBottom: '32px',
  },
  notAuthBtn: {
    display: 'inline-block',
    padding: '14px 32px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#FAF8F5',
    backgroundColor: '#1A1A1A',
    borderRadius: '2px',
  },
}

const emptyEvent = {
  title: '',
  venue: '',
  address: '',
  city: '',
  country: '',
  date: '',
  time: '',
  genre: '',
  description: '',
  ticket_url: '',
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

    const { error } = await supabase.from('events').insert([{
      ...form,
      curator_id: user.id,
      status: 'published',
    }])

    if (error) {
      setError('Something went wrong. Try again.')
    } else {
      setSuccess('Event added to Get Lored.')
      setForm(emptyEvent)
    }
    setSubmitting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return null

  if (!user) {
    return (
      <div style={styles.notAuth}>
        <h2 style={styles.notAuthHeadline}>Curators only.</h2>
        <p style={styles.notAuthSub}>Sign in to access your portal.</p>
        <a href="/login" style={styles.notAuthBtn}>Sign in</a>
      </div>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <p style={styles.eyebrow}>Curator portal</p>
          <h1 style={styles.headline}>Add an event.</h1>
          <p style={styles.sub}>
            Fill in the details below to add an event to Get Lored.
          </p>
        </div>
        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Event title</label>
          <input
            style={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event name"
            required
          />
        </div>

        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Venue</label>
            <input
              style={styles.input}
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="Venue name"
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Genre</label>
            <select
              style={styles.select}
              name="genre"
              value={form.genre}
              onChange={handleChange}
            >
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

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Address</label>
          <input
            style={styles.input}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full address"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>City</label>
            <input
              style={styles.input}
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Miami"
              required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Country</label>
            <input
              style={styles.input}
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="USA"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Time</label>
            <input
              style={styles.input}
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="10pm – 3am"
            />
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Ticket link</label>
          <input
            style={styles.input}
            name="ticket_url"
            value={form.ticket_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell people what to expect..."
          />
        </div>

        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting ? 'Adding...' : 'Add event'}
        </button>
      </form>
    </main>
  )
}
