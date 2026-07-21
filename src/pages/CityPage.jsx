import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const cityMeta = {
  'miami': { name: 'Miami', country: 'USA', emoji: '🌴' },
  'new-york': { name: 'New York', country: 'USA', emoji: '🗽' },
  'charlotte': { name: 'Charlotte', country: 'USA', emoji: '👑' },
  'toronto': { name: 'Toronto', country: 'Canada', emoji: '🍁' },
  'london': { name: 'London', country: 'UK', emoji: '🇬🇧' },
  'paris': { name: 'Paris', country: 'France', emoji: '🗼' },
  'ibiza': { name: 'Ibiza', country: 'Spain', emoji: '🌊' },
  'lagos': { name: 'Lagos', country: 'Nigeria', emoji: '🌍' },
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '400', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block' },
  header: { marginBottom: '64px' },
  emoji: { fontSize: '48px', marginBottom: '16px', display: 'block' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: '500', lineHeight: '1.0', color: '#1A1A1A', marginBottom: '8px' },
  country: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '400', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B07D62' },
  tabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '48px' },
  tab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  tabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' },
  card: { backgroundColor: '#F2EEE9', padding: '28px 24px', display: 'block', transition: 'background 0.2s' },
  cardDate: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '10px' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px', lineHeight: '1.2' },
  cardSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560', marginBottom: '16px' },
  tag: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9590', border: '1px solid #D8D4CE', padding: '4px 10px', borderRadius: '2px' },
  empty: { fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  loading: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
}

export default function CityPage() {
  const { city } = useParams()
  const meta = cityMeta[city] || { name: city, country: '', emoji: '📍' }
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

  const filteredPlaces = places.filter(p =>
    activeTab === 'restaurants' ? p.category === 'restaurant' : p.category !== 'restaurant'
  )

  return (
    <main style={styles.page}>
      <Link to="/cities" style={styles.back}>← All cities</Link>
      <div style={styles.header}>
        <span style={styles.emoji}>{meta.emoji}</span>
        <h1 style={styles.headline}>{meta.name}</h1>
        <p style={styles.country}>{meta.country}</p>
      </div>

      <div style={styles.tabs}>
        {['events', 'restaurants', 'attractions'].map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Loading the lore...</p>
      ) : activeTab === 'events' ? (
        events.length === 0 ? (
          <p style={styles.empty}>No events yet. Check back soon.</p>
        ) : (
          <div style={styles.grid}>
            {events.map(event => (
              <Link key={event.id} to={`/events/${event.id}`} style={styles.card}>
                <p style={styles.cardDate}>{formatDate(event.date)}</p>
                <h2 style={styles.cardTitle}>{event.title}</h2>
                <p style={styles.cardSub}>{event.venue}</p>
                {event.genre && <span style={styles.tag}>{event.genre}</span>}
              </Link>
            ))}
          </div>
        )
      ) : filteredPlaces.length === 0 ? (
        <p style={styles.empty}>Nothing here yet. Come back soon.</p>
      ) : (
        <div style={styles.grid}>
          {filteredPlaces.map(place => (
            <div key={place.id} style={styles.card}>
              <p style={styles.cardDate}>{place.category}</p>
              <h2 style={styles.cardTitle}>{place.name}</h2>
              <p style={styles.cardSub}>{place.address}</p>
              {place.google_maps_url && (
                
                  href={place.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.tag}
                >
                  View on Maps
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
