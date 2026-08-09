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
  'toronto': { name: 'Toronto', country: 'Canada' },
  'mexico-city': { name: 'Mexico City', country: 'Mexico' },
  'panama-city': { name: 'Panama City', country: 'Panama' },
  'lisbon': { name: 'Lisbon', country: 'Portugal' },
  'amsterdam': { name: 'Amsterdam', country: 'Netherlands' },
  'rio-de-janeiro': { name: 'Rio de Janeiro', country: 'Brazil' },
}

const BAR_CATEGORIES = ['bar', 'music_venue']

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block', letterSpacing: '0.08em' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' },
  country: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#B07D62', letterSpacing: '0.1em' },
  howToBar: { display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', backgroundColor: '#F2EEE9', padding: '16px 24px', marginTop: '32px' },
  howToItem: { display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '300', color: '#6B6560' },
  howToNum: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: '#B07D62' },
  howToLink: { color: '#1A1A1A', fontWeight: '500', borderBottom: '1px solid #1A1A1A' },
  tabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '32px', marginTop: '32px', flexWrap: 'wrap' },
  tab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px', letterSpacing: '0.08em' },
  tabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  filterBar: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' },
  filterLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590' },
  filterSelect: { padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none' },
  filterClear: { padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' },
  card: { backgroundColor: '#F2EEE9', padding: '28px 24px' },
  cardDate: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '10px', letterSpacing: '0.1em' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px' },
  cardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', marginBottom: '16px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#9B9590', border: '1px solid #D8D4CE', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3' },
  instagramTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#B07D62', border: '1px solid #E8D5C4', backgroundColor: '#FDF8F5', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3' },
  styleTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#B07D62', border: '1px solid #E8D5C4', backgroundColor: '#FDF8F5', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3' },
  cuisineTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#6B3FA0', border: '1px solid #D9C8F0', backgroundColor: '#F5EFFB', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3' },
  saveTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#1A1A1A', border: '1px solid #1A1A1A', backgroundColor: 'transparent', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3', cursor: 'pointer', font: 'inherit' },
  savedTag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '500', textTransform: 'uppercase', color: '#FAF8F5', border: '1px solid #1A1A1A', backgroundColor: '#1A1A1A', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', lineHeight: '1.3', cursor: 'pointer', font: 'inherit' },
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
  const startDay = start.getDate()
  const endDay = end.getDate()
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}\u2013${endDay}`
  }
  return `${startMonth} ${startDay} \u2013 ${endMonth} ${endDay}`
}

function EventCard({ event, locked, onLockedClick }) {
  const dateLabel = formatDateRange(event.date, event.end_date)

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

function PlaceCard({ place, locked, onLockedClick, saved, onToggleSave }) {
  const topLabel = place.dining_style || formatCategory(place.category)
  const websiteIsInstagram = isInstagramUrl(place.website)
  const websiteLabel = websiteIsInstagram ? 'Instagram' : 'Website'
  const websiteTagStyle = websiteIsInstagram ? s.instagramTag : s.tag

  return (
    <div style={s.card}>
      <p style={s.cardDate}>{topLabel}{place.cuisine ? ` · ${place.cuisine}` : ''}</p>
      <h2 style={s.cardTitle}>{place.name}</h2>
      <p style={s.cardSub}>{place.address}</p>
      <div style={s.tagRow}>
        <button
          type="button"
          onClick={locked ? onLockedClick : () => onToggleSave(place)}
          style={saved ? s.savedTag : s.saveTag}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
        {place.cuisine && <span style={s.cuisineTag}>{place.cuisine}</span>}
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
  const [userId, setUserId] = useState(null)
  const [savedPlaceIds, setSavedPlaceIds] = useState(new Set())
  const [savedDjIds, setSavedDjIds] = useState(new Set())
  const [gateOpen, setGateOpen] = useState(false)
  const [cuisineFilter, setCuisineFilter] = useState('')

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

      const sessionUser = sessionRes.data.session?.user
      setIsLoggedIn(!!sessionUser)
      setUserId(sessionUser?.id || null)

      if (sessionUser) {
        const [savedPlacesRes, savedDjsRes] = await Promise.all([
          supabase.from('saved_places').select('place_id').eq('user_id', sessionUser.id),
          supabase.from('saved_djs').select('dj_id').eq('user_id', sessionUser.id),
        ])
        if (active) {
          setSavedPlaceIds(new Set((savedPlacesRes.data || []).map(r => r.place_id)))
          setSavedDjIds(new Set((savedDjsRes.data || []).map(r => r.dj_id)))
        }
      }

      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      setUserId(session?.user?.id || null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [city, meta.name])

  useEffect(() => {
    setCuisineFilter('')
  }, [activeTab])

  function openGate() {
    setGateOpen(true)
  }

  function closeGate() {
    setGateOpen(false)
  }

  async function handleToggleSave(place) {
    if (!userId) return

    const alreadySaved = savedPlaceIds.has(place.id)

    if (alreadySaved) {
      setSavedPlaceIds(prev => {
        const next = new Set(prev)
        next.delete(place.id)
        return next
      })
      await supabase.from('saved_places').delete().eq('user_id', userId).eq('place_id', place.id)
    } else {
      setSavedPlaceIds(prev => new Set(prev).add(place.id))
      const { error } = await supabase.from('saved_places').insert([{ user_id: userId, place_id: place.id }])
      if (error) {
        setSavedPlaceIds(prev => {
          const next = new Set(prev)
          next.delete(place.id)
          return next
        })
      }
    }
  }

  async function handleToggleSaveDj(dj) {
    if (!userId) return

    const alreadySaved = savedDjIds.has(dj.id)

    if (alreadySaved) {
      setSavedDjIds(prev => {
        const next = new Set(prev)
        next.delete(dj.id)
        return next
      })
      await supabase.from('saved_djs').delete().eq('user_id', userId).eq('dj_id', dj.id)
    } else {
      setSavedDjIds(prev => new Set(prev).add(dj.id))
      const { error } = await supabase.from('saved_djs').insert([{ user_id: userId, dj_id: dj.id }])
      if (error) {
        setSavedDjIds(prev => {
          const next = new Set(prev)
          next.delete(dj.id)
          return next
        })
      }
    }
  }

  const placeFilterByTab = places.filter(p => {
    if (activeTab === 'restaurants') return p.category === 'restaurant' || p.category === 'coffee'
    if (activeTab === 'bars') return BAR_CATEGORIES.includes(p.category)
    return !['restaurant', 'coffee', ...BAR_CATEGORIES].includes(p.category)
  })

  const availableCuisines = [...new Set(placeFilterByTab.map(p => p.cuisine).filter(Boolean))].sort()

  const placeFilter = cuisineFilter
    ? placeFilterByTab.filter(p => p.cuisine === cuisineFilter)
    : placeFilterByTab

  const showCuisineFilter = activeTab === 'restaurants' && availableCuisines.length > 0

  return (
    <main style={s.page}>
      {gateOpen && <SignupGate onClose={closeGate} />}

      <Link to="/cities" style={s.back}>All cities</Link>
      <h1 style={s.headline}>{meta.name}</h1>
      <p style={s.country}>{meta.country}</p>

      <div style={s.howToBar}>
        <span style={s.howToItem}><span style={s.howToNum}>1</span> Browse the recommendations below</span>
        <span style={s.howToItem}><span style={s.howToNum}>2</span> Tap "Save" on anything you like</span>
        <span style={s.howToItem}>
          <span style={s.howToNum}>3</span> View or email it from your{' '}
          <Link to="/itinerary" style={s.howToLink}>Itinerary</Link>
        </span>
      </div>

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

      {showCuisineFilter && (
        <div style={s.filterBar}>
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>Cuisine</label>
            <select style={s.filterSelect} value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
              <option value="">All cuisines</option>
              {availableCuisines.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {cuisineFilter && (
            <button style={s.filterClear} onClick={() => setCuisineFilter('')}>Clear filter</button>
          )}
        </div>
      )}

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
              <PlaceCard
                key={p.id}
                place={p}
                locked={!isLoggedIn}
                onLockedClick={openGate}
                saved={savedPlaceIds.has(p.id)}
                onToggleSave={handleToggleSave}
              />
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
                saved={savedDjIds.has(dj.id)}
                onToggleSave={handleToggleSaveDj}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}