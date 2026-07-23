import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import SignupGate from '../components/SignupGate.jsx'
import DJCard from '../components/DJCard.jsx'

const cityMeta = {
  'washington-dc': { name: 'Washington DC', country: 'USA' },
  'charlotte': { name: 'Charlotte', country: 'USA' },
  'chicago': { name: 'Chicago', country: 'USA' },
  'atlanta': { name: 'Atlanta', country: 'USA' },
  'mexico-city': { name: 'Mexico City', country: 'Mexico' },
  'panama-city': { name: 'Panama City', country: 'Panama' },
  'lisbon': { name: 'Lisbon', country: 'Portugal' },
  'amsterdam': { name: 'Amsterdam', country: 'Netherlands' },
}

const BAR_CATEGORIES = ['bar', 'music_venue']

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block', letterSpacing: '0.08em' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' },
  country: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#B07D62', letterSpacing: '0.1em' },
  tabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '48px', marginTop: '48px', flexWrap: 'wrap' },
  tab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px', letterSpacing: '0.08em' },
  tabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' },
  card: { backgroundColor: '#F2EEE9', padding: '28px 24px' },
  cardDate: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '10px', letterSpacing: '0.1em' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px' },
  cardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', marginBottom: '16px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#9B9590', border: '1px solid #D8D4CE', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.1em' },
  instagramTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#B07D62', border: '1px solid #E8D5C4', backgroundColor: '#FDF8F5', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.1em' },
  styleTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#B07D62', border: '1px solid #E8D5C4', backgroundColor: '#FDF8F5', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.1em' },
  empty: { fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  loading: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  djSection: { marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #E8E4DE' },
  djHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '500', color: '#1A1A1A', marginBottom: '32px' },
}

function formatCategory(category) {
  if (!category) return ''
  return category.replace(/_/g, ' ')
}

function isInstagramUrl(url) {
  if (!url) return false
  return url.toLowerCase().includes('instagram.com')
}

function EventCard({ event, locked, onLockedClick }) {
  const dateLabel = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''

  const inner = (
    <>
      <p style={s.cardDate}>{dateLabel}</p>
      <h2 style={s.cardTitle}>{event.title}</h2>
      <p style={s.cardSub}>{event.venue}</p>
      {event.genre && <span style={s.tag}>{event.genre}</span>}
    </>
  )

  if (locked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        style={{ ...s.card, width: '100%', textAlign: 'left', border: 'none', font: 'inherit', cursor: 'pointer' }}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link to={`/events/${event.id}`} style={{ ...s.card, display: 'block' }}>
      {inner}
    </Link>
  )
}

function PlaceCard({ place, locked, onLockedClick }) {
  const topLabel = place.dining_style || formatCategory(place.category)
  const websiteIsInstagram = isInstagramUrl(place.website)
  const websiteLabel = websiteIsInstagram ? 'Instagram' : 'Website'
  const websiteTagStyle = websiteIsInstagram ? s.instagramTag : s.tag

  return (
    <div style={s.card}>
      <p style={s.cardDate}>{topLabel}</p>
      <h2 style={s.cardTitle}>{place.name}</h2>
      <p style={s.cardSub}>{place.address}</p>
      <div style={s.tagRow}>
        {place.dining_style && <span style={s.styleTag}>{place.dining_style}</span>}
        {place.website && (
          locked ? (
            <button type="button" onClick={onLockedClick} style={{ ...websiteTagStyle, background: websiteIsInstagram ? '#FDF8F5' : 'none', font: 'inherit' }}>
              {websiteLabel}
            </button>
          ) : (
            <a href={place.website} target="_blank" rel="noopener noreferrer" style={websiteTagStyle}>{websiteLabel}</a>
          )
        )}
        {place.google_maps_url && (
          locked ? (
            <button type="button" onClick={onLockedClick} style={{ ...s.tag, background: 'none', font: 'inherit', cursor: 'pointer' }}>
              View on Maps
            </button>
          ) : (
            <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer" style={s.tag}>View on Maps</a>
          )
        )}
      </div>
    </div>
  )
}

function HappeningCard({ happening, locked, onLockedClick }) {
  const dateLabel = happening.date
    ? new Date(happening.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''

  return (
    <div style={s.card}>
      <p style={s.cardDate}>{dateLabel}{happening.time ? ` · ${happening.time}` : ''}</p>
      <h2 style={s.cardTitle}>{happening.title}</h2>
      <p style={s.cardSub}>{happening.location}</p>
      {happening.link && (
        locked ? (
          <button type="button" onClick={onLockedClick} style={{ ...s.tag, border: '1px solid #D8D4CE', background: 'none', font: 'inherit' }}>
            More info
          </button>
        ) : (
          <a href={happening.link} target="_blank" rel="noopener noreferrer" style={s.tag}>More info</a>
        )
      )}
    </div>
  )
}

export default function CityPage() {
  const { city } = useParams()
  const meta = cityMeta[city] || { name: city, country: '' }

  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [places, setPlaces] = useState([])
  const [happenings, setHappenings] = useState([])
  const [djs, setDJs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)

      const [eventsRes, placesRes, happeningsRes, djsRes, sessionRes] = await Promise.all([
        supabase.from('events').select('*').ilike('city', meta.name).eq('status', 'published').order('date', { ascending: true }),
        supabase.from('places').select('*').ilike('city', meta.name).order('created_at', { ascending: false }),
        supabase.from('happenings').select('*').ilike('city', meta.name).eq('status', 'published').order('date', { ascending: true }),
        supabase.from('dj_curators').select('*').ilike('city', meta.name),
        supabase.auth.getSession(),
      ])

      if (!active) return

      setEvents(eventsRes.data || [])
      setPlaces(placesRes.data || [])
      setHappenings(happeningsRes.data || [])
      setDJs(djsRes.data || [])
      setIsLoggedIn(!!sessionRes.data.session)
      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [city, meta.name])

  function openGate() {
    setGateOpen(true)
  }

  function closeGate() {
    setGateOpen(false)
  }

  const placeFilter = places.filter(p => {
    if (activeTab === 'restaurants') return p.category === 'restaurant' || p.category === 'coffee'
    if (activeTab === 'bars') return BAR_CATEGORIES.includes(p.category)
    return !['restaurant', 'coffee', ...BAR_CATEGORIES].includes(p.category)
  })

  return (
    <main style={s.page}>
      {gateOpen && <SignupGate onClose={closeGate} />}

      <Link to="/cities" style={s.back}>All cities</Link>
      <h1 style={s.headline}>{meta.name}</h1>
      <p style={s.country}>{meta.country}</p>

      <div style={s.tabs}>
        {['events', 'happenings', 'restaurants', 'bars', 'attractions'].map(tab => (
          <button
            key={tab}
            type="button"
            style={activeTab === tab ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'bars' ? 'Bars & Venues' : tab}
          </button>
        ))}
      </div>

      {loading && <p style={s.loading}>Loading the lore...</p>}

      {!loading && activeTab === 'events' && (
        events.length === 0 ? (
          <p style={s.empty}>No events yet.</p>
        ) : (
          <div style={s.grid}>
            {events.map(e => (
              <EventCard key={e.id} event={e} locked={!isLoggedIn} onLockedClick={openGate} />
            ))}
          </div>
        )
      )}

      {!loading && activeTab === 'happenings' && (
        happenings.length === 0 ? (
          <p style={s.empty}>Nothing happening yet.</p>
        ) : (
          <div style={s.grid}>
            {happenings.map(h => (
              <HappeningCard key={h.id} happening={h} locked={!isLoggedIn} onLockedClick={openGate} />
            ))}
          </div>
        )
      )}

      {!loading && (activeTab === 'restaurants' || activeTab === 'bars' || activeTab === 'attractions') && (
        placeFilter.length === 0 ? (
          <p style={s.empty}>Nothing here yet.</p>
        ) : (
          <div style={s.grid}>
            {placeFilter.map(p => (
              <PlaceCard key={p.id} place={p} locked={!isLoggedIn} onLockedClick={openGate} />
            ))}
          </div>
        )
      )}

      {!loading && djs.length > 0 && (
        <section style={s.djSection}>
          <h2 style={s.djHeadline}>🎧 Curators</h2>
          <div style={s.grid}>
            {djs.map(dj => (
              <DJCard
                key={dj.id}
                dj={dj}
                locked={!isLoggedIn}
                onLockedClick={openGate}
                showGenres={true}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
