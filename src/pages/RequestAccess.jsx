import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const styles = {
  page: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '80px 32px',
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
    fontSize: 'clamp(36px, 6vw, 56px)',
    fontWeight: '500',
    lineHeight: '1.1',
    color: '#1A1A1A',
    marginBottom: '16px',
  },
  sub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '300',
    lineHeight: '1.7',
    color: '#6B6560',
    marginBottom: '56px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
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
    minHeight: '120px',
    lineHeight: '1.6',
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
  success: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '28px',
    fontStyle: 'italic',
    color: '#1A1A1A',
    textAlign: 'center',
    padding: '48px 0',
    lineHeight: '1.4',
  },
  successSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '300',
    color: '#6B6560',
    textAlign: 'center',
    marginTop: '12px',
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
}

export default function RequestAccess() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    instagram: '',
    city: '',
    why: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('curator_requests')
      .insert([form])

    if (error) {
      setError('Something went wrong. Try again.')
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <main style={styles.page}>
        <p style={styles.success}>
          "You're on our radar."
        </p>
        <p style={styles.successSub}>
          We review every request personally. If you're the right fit,
          you'll hear from us soon.
        </p>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <p style={styles.eyebrow}>For tastemakers & curators</p>
      <h1 style={styles.headline}>
        Want to share<br />
        your city?
      </h1>
      <p style={styles.sub}>
        Get Lored is invite-only on the curator side. We handpick DJs,
        event promoters, and cultural insiders who know their cities better
        than anyone. If that's you — apply below.
      </p>

      {error && <p style={styles.error}>{error}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="DJ King Iven"
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Instagram
