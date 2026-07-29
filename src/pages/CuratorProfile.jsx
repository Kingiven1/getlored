import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  metaRow: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '48px' },
  metaItem: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  instagramLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', color: '#B07D62', textDecoration: 'none', borderBottom: '1px solid #B07D62', paddingBottom: '1px' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px', marginTop: '0' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '48px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' },
  card: { backgroundColor: '#F2EEE9', padding: '20px 24px' },
  cardEyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '6px', letterSpacing: '0.08em' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  cardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  cardLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#B07D62', textDecoration: 'none', marginTop: '8px', display: 'inline-block' },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontStyle: 'italic', color: '#9B9590', padding: '24px 0' },
  loadingWrap: { textAlign: 'center', padding: '120px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590' },
  notFoundWrap: { textAlign: 'center', padding: '120px 32px' },
  notFoundHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  notFoundSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDateRange(dateStr, endDateStr) {
  if (!dateStr) return ''
  if (!endDateStr || endDateStr === dateStr) return formatDate(dateStr)
  const start = new Date(dateStr)
  const end = new Date(endDateStr)
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}\u2013${end.getDate()}`
  }
  return `${startMonth} ${start.getDate()} \u2013 ${endMonth} ${end.getDate()}`
}

export default function CuratorProfile() {
  const { curatorId } = useParams()
  const [curator, setCurator] = useState(undefined)
  const [events, setEvents] = useState([])
  const [places, setPlaces] = useState([])
  const [happenings, setHappenings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data: curatorRow } = await supabase
        .from('curators')
        .select('id, user_id, name, city, instagram, can_events, can_places')
        .eq('id', curatorId)
        .single()

      if (cancelled) return

      if (!curatorRow) {
        setCurator(null)
        setLoading(false)
        return
      }

      setCurator(curatorRow)

      const [eventsRes, placesRes, happeningsRes] = await Promise.all([
        curatorRow.can_events
          ? supabase
              .from('events')
              .select('*')
              .eq('curator_id', curatorRow.user_id)
              .eq('status', 'published')
              .order('date', { ascending: true })
          : Promise.resolve({ data: [] }),
        curatorRow.can_places
          ? supabase
              .from('places')
              .select('*')
              .eq('curator_id', curatorRow.user_id)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [] }),
        curatorRow.can_places
          ? supabase
              .from('happenings')
              .select('*')
              .eq('curator_id', curatorRow.user_id)
              .eq('status', 'published')
              .order('date', { ascending: true })
          : Promise.resolve({ data: [] }),
      ])

      if (cancelled) return

      setEvents(eventsRes.data || [])
      setPlaces(placesRes.data || [])
      setHappenings(happeningsRes.data || [])
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [curatorId])

  if (loading) {
    return <p style={s.loadingWrap}>Loading...</p>
  }

  if (curator === null) {
    return (
      <div style={s.notFoundWrap}>
        <h2 style={s.notFoundHeadline}>Curator not found.</h2>
        <p style={s.notFoundSub}>This profile doesn't exist or isn't public.</p>
      </div>
    )
  }

  const instagramUrl = curator.instagram
    ? (curator.instagram.startsWith('http')
        ? curator.instagram
        : `https://instagram.com/${curator.instagram.replace('@', '')}`)
    : null

  const hasAnything = events.length > 0 || places.length > 0 || happenings.length > 0

  return (
    <main style={s.page}>
      <p style={s.eyebrow}>Get Lored curator</p>
      <h1 style={s.headline}>{curator.name}</h1>
      <div style={s.metaRow}>
        {curator.city && <span style={s.metaItem}>{curator.city}</span>}
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noreferrer" style={s.instagramLink}>
            {curator.instagram}
          </a>
        )}
      </div>

      {!hasAnything && (
        <p style={s.emptyState}>Nothing posted yet — check back soon.</p>
      )}

      {events.length > 0 && (
        <section>
          <h2 style={s.sectionTitle}>Events</h2>
          <div style={s.list}>
            {events.map(evt => (
              <div key={evt.id} style={s.card}>
                <p style={s.cardEyebrow}>{formatDateRange(evt.date, evt.end_date)}</p>
                <h3 style={s.cardTitle}>{evt.title}</h3>
                <p style={s.cardSub}>{evt.venue}{evt.city ? ` · ${evt.city}` : ''}{evt.genre ? ` · ${evt.genre}` : ''}</p>
                {evt.ticket_url && (
                  <a href={evt.ticket_url} target="_blank" rel="noreferrer" style={s.cardLink}>Tickets →</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {places.length > 0 && (
        <>
          {events.length > 0 && <div style={s.divider} />}
          <section>
            <h2 style={s.sectionTitle}>Places</h2>
            <div style={s.list}>
              {places.map(place => (
                <div key={place.id} style={s.card}>
                  <p style={s.cardEyebrow}>{place.dining_style || place.category}</p>
                  <h3 style={s.cardTitle}>{place.name}</h3>
                  <p style={s.cardSub}>{place.city}{place.address ? ` · ${place.address}` : ''}</p>
                  {place.google_maps_url && (
                    <a href={place.google_maps_url} target="_blank" rel="noreferrer" style={s.cardLink}>View on Maps →</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {happenings.length > 0 && (
        <>
          {(events.length > 0 || places.length > 0) && <div style={s.divider} />}
          <section>
            <h2 style={s.sectionTitle}>Happenings</h2>
            <div style={s.list}>
              {happenings.map(h => (
                <div key={h.id} style={s.card}>
                  <p style={s.cardEyebrow}>{formatDate(h.date)}{h.time ? ` · ${h.time}` : ''}</p>
                  <h3 style={s.cardTitle}>{h.title}</h3>
                  <p style={s.cardSub}>{h.location}{h.city ? ` · ${h.city}` : ''}</p>
                  {h.link && (
                    <a href={h.link} target="_blank" rel="noreferrer" style={s.cardLink}>More info →</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}