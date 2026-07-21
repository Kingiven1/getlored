import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const styles = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '64px 32px',
  },
  back: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#9B9590',
    marginBottom: '48px',
    display: 'inline-block',
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
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: '500',
    lineHeight: '1.1',
    color: '#1A1A1A',
    marginBottom: '8px',
  },
  venue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    fontWeight: '300',
    color: '#6B6560',
    marginBottom: '40px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E8E4DE',
    margin: '40px 0',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginBottom: '40px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  metaLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '10px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9B9590',
  },
  metaValue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '400',
    color: '#1A1A1A',
  },
  description: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '300',
    lineHeight: '1.8',
    color: '#4A4540',
    marginBottom: '40px',
  },
  flyer: {
    width: '100%',
    borderRadius: '2px',
    marginBottom: '40px',
    display: 'block',
  },
  ticketBtn: {
    display: 'inline-block',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#FAF8F5',
    backgroundColor: '#1A1A1A',
    padding: '14px 32px',
    borderRadius: '2px',
    marginRight: '16px',
  },
  mapsBtn: {
    display: 'inline-block',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#6B6560',
    borderBottom: '1px solid #6B6560',
    paddingBottom: '2px',
  },
  loading: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#9B9590',
    textAlign: 'center',
    padding: '80px 0',
  },
  notFound: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '28px',
    fontStyle: 'italic',
    color: '#9B9590',
    textAlign: 'center',
    padding: '80px 0',
  },
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [id])

  async function fetchEvent() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    setEvent(data)
    setLoading(false)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) return <p style={styles.loading}>Loading the lore...</p>
  if (!event) return <p style={styles.notFound}>Event not found.</p>

  return (
    <main style={styles.page}>
      <Link to={`/cities/${event.city?.toLowerCase().replace(' ', '-')}`} style={styles.back}>
        ← Back to {event.city}
      </Link>

      {event.flyer_url && (
        <img src={event.flyer_url} alt={event.title} style={styles.flyer} />
      )}

      <p style={styles.eyebrow}>{event.genre || 'Event'}</p>
      <h1 style={styles.headline}>{event.title}</h1>
      <p style={styles.venue}>{event.venue}</p>

      <div style={styles.divider} />

      <div style={styles.metaGrid}>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>Date</span>
          <span style={styles.metaValue}>{formatDate(event.date)}</span>
        </div>
        {event.time && (
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Time</span>
            <span style={styles.metaValue}>{event.time}</span>
          </div>
        )}
        {event.city && (
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>City</span>
            <span style={styles.metaValue}>{event.city}, {event.country}</span>
          </div>
        )}
        {event.address && (
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Address</span>
            <span style={styles.metaValue}>{event.address}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p style={styles.description}>{event.description}</p>
      )}

      <div style={styles.divider} />

      <div>
        {event.ticket_url && (
          
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ticketBtn}
          >
            Get tickets
          </a>
        )}
        {event.address && (
          
            href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapsBtn}
          >
            View on maps
          </a>
        )}
      </div>
    </main>
  )
}
