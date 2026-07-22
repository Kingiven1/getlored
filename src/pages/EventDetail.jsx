import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import SignupGate from '../components/SignupGate.jsx'

const s = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '64px 32px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '48px', display: 'inline-block', letterSpacing: '0.08em' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '500', lineHeight: '1.1', color: '#1A1A1A', marginBottom: '8px' },
  venue: { fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: '300', color: '#6B6560', marginBottom: '40px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '40px 0' },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  metaLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9B9590' },
  metaValue: { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '400', color: '#1A1A1A' },
  description: { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '300', lineHeight: '1.8', color: '#4A4540', marginBottom: '40px' },
  flyerWrap: { width: '100%', maxWidth: '480px', height: '480px', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2EEE9', borderRadius: '4px', overflow: 'hidden' },
  flyer: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' },
  ticketBtn: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', padding: '14px 32px', borderRadius: '2px', marginRight: '16px' },
  mapsBtn: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', borderBottom: '1px solid #6B6560', paddingBottom: '2px' },
  loading: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  notFound: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  blurred: { filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' },
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(undefined)
  const navigate = useNavigate()

  useEffect(() => { fetchEvent() }, [id])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  async function fetchEvent() {
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    setEvent(data)
    setLoading(false)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading || session === undefined) return <p style={s.loading}>Loading the lore...</p>
  if (!event) return <p style={s.notFound}>Event not found.</p>

  const mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(event.address || '')
  const isLoggedIn = !!session

  function handleGateClose() {
    navigate(`/cities/${(event.city || '').toLowerCase().replace(' ', '-')}`)
  }

  return (
    <main style={s.page}>
      {!isLoggedIn && <SignupGate onClose={handleGateClose} />}
      <Link to={'/cities/' + (event.city || '').toLowerCase().replace(' ', '-')} style={s.back}>
        Back to {event.city}
      </Link>
      <div style={!isLoggedIn ? s.blurred : {}}>
        {event.flyer_url && (
          <div style={s.flyerWrap}>
            <img src={event.flyer_url} alt={event.title} style={s.flyer} />
          </div>
        )}
        <p style={s.eyebrow}>{event.genre || 'Event'}</p>
        <h1 style={s.headline}>{event.title}</h1>
        <p style={s.venue}>{event.venue}</p>
        <div style={s.divider} />
        <div style={s.metaGrid}>
          <div style={s.metaItem}>
            <span style={s.metaLabel}>Date</span>
            <span style={s.metaValue}>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Time</span>
              <span style={s.metaValue}>{event.time}</span>
            </div>
          )}
          {event.city && (
            <div style={s.metaItem}>
              <span style={s.metaLabel}>City</span>
              <span style={s.metaValue}>{event.city}, {event.country}</span>
            </div>
          )}
          {event.address && (
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Address</span>
              <span style={s.metaValue}>{event.address}</span>
            </div>
          )}
        </div>
        {event.description && <p style={s.description}>{event.description}</p>}
        <div style={s.divider} />
        <div>
          {event.ticket_url && (
            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" style={s.ticketBtn}>
              Get tickets
            </a>
          )}
          {event.address && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={s.mapsBtn}>
              View on maps
            </a>
          )}
        </div>
      </div>
    </main>
  )
}