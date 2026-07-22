import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

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

export default function CityPage() {
  const { city } = useParams()
  const meta = cityMeta[city] || { name: city, country: '' }
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [city])

  async function fetchData() {
    setLoading(true)
    const [eventsRes, placesRes] = await Promise.all([
      supabase.from('events').select('*').ilike('city', meta.name).eq('status', 'published').order('date', { ascending: true }),
      supabase.from('places').select('*').ilike('city', meta.name).order('created_at', { ascending: false }),
    ])
    setEvents(eventsRes.data || [])
    setPlaces(placesRes.data || [])
    setLoading(false)
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const filtered = places.filter(p => {
    if (activeTab === 'restaurants') return p.category === 'restaurant'
    if (activeTab === 'bars') return BAR_CATEGORIES.includes(p.category)
    return p.category !== 'restaurant' && !BAR_CATEGORIES.includes(p.category)
  })

  const s = {
    page: { maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' },
    back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block', letterSpacing: '0.08em' },
    headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' },
    country: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#B07D62', letterSpacing: '0.1em' },
    tabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '48px', marginTop: '48px' },
    tab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px', letterSpacing: '0.08em' },
    tabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' },
    card: { backgroundColor: '#F2EEE9', padding: '28px 24px', display: 'block' },
    cardDate: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '10px', letterSpacing: '0.1em' },
    cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px' },
    cardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', marginBottom: '16px' },
    tag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#9B9590', border: '1px solid #D8D4CE', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.1em' },
    empty: { fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
    loading: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  }

  return (
    <main style={s.page}>
      <Link to="/cities" style={s.back}>All cities</Link>
      <h1 style={s.headline}>{meta.name}</h1>
      <p style={s.country}>{meta.country}</p>
      <div style={s.tabs}>
        {['events', 'restaurants', 'bars', 'attractions'].map(tab => (
          <button key={tab} style={activeTab === tab ? { ...s.tab, ...s.tabActive } : s.tab} onClick={() => setActiveTab(tab)}>
            {tab === 'bars' ? 'Bars & Venues' : tab}
          </button>
        ))}
      </div>
      {loading ? <p style={s.loading}>Loading the lore...</p>
        : activeTab === 'events' ? (
          events.length === 0 ? <p style={s.empty}>No events yet.</p> : (
            <div style={s.grid}>
              {events.map(e => (
                <Link key={e.id} to={`/events/${e.id}`} style={s.card}>
                  <p style={s.cardDate}>{formatDate(e.date)}</p>
                  <h2 style={s.cardTitle}>{e.title}</h2>
                  <p style={s.cardSub}>{e.venue}</p>
                  {e.genre && <span style={s.tag}>{e.genre}</span>}
                </Link>
              ))}
            </div>
          )
        ) : filtered.length === 0 ? <p style={s.empty}>Nothing here yet.</p> : (
          <div style={s.grid}>
            {filtered.map(p => (
              <div key={p.id} style={s.card}>
                <p style={s.cardDate}>{p.category}</p>
                <h2 style={s.cardTitle}>{p.name}</h2>
                <p style={s.cardSub}>{p.address}</p>
                {p.google_maps_url && <a href={p.google_maps_url} target="_blank" rel="noopener noreferrer" style={s.tag}>View on Maps</a>}
              </div>
            ))}
          </div>
        )}
    </main>
  )
}