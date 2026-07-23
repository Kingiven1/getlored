import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import DJCard from '../components/DJCard.jsx'
import SignupGate from '../components/SignupGate.jsx'

const cities = [
  { name: 'Washington DC', country: 'USA', slug: 'washington-dc' },
  { name: 'Charlotte', country: 'USA', slug: 'charlotte' },
  { name: 'Chicago', country: 'USA', slug: 'chicago' },
  { name: 'Atlanta', country: 'USA', slug: 'atlanta' },
  { name: 'Mexico City', country: 'Mexico', slug: 'mexico-city' },
  { name: 'Panama City', country: 'Panama', slug: 'panama-city' },
  { name: 'Lisbon', country: 'Portugal', slug: 'lisbon' },
  { name: 'Amsterdam', country: 'Netherlands', slug: 'amsterdam' },
]

function slugForCity(cityName) {
  const match = cities.find(c => c.name.toLowerCase() === (cityName || '').toLowerCase())
  return match ? match.slug : (cityName || '').toLowerCase().replace(/\s+/g, '-')
}

const styles = {
  hero: { padding: '120px 32px 80px', maxWidth: '800px', margin: '0 auto' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '24px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: '500', lineHeight: '1.0', letterSpacing: '-0.02em', color: '#1A1A1A', marginBottom: '32px' },
  headlineItalic: { fontStyle: 'italic', color: '#B07D62' },
  subheadline: { fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: '300', lineHeight: '1.7', color: '#6B6560', maxWidth: '480px', marginBottom: '48px' },
  ctaRow: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
  ctaPrimary: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', padding: '14px 32px', borderRadius: '2px', display: 'inline-block' },
  ctaSecondary: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', borderBottom: '1px solid #6B6560', paddingBottom: '2px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '0 32px' },
  citiesSection: { padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' },
  sectionLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '40px' },
  citiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2px' },
  cityCard: { backgroundColor: '#F2EEE9', padding: '32px 28px', cursor: 'pointer', transition: 'background 0.2s', display: 'block' },
  cityName: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  cityCountry: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '400', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590' },
  djsSection: { padding: '80px 32px', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#F8F6F3' },
  djsLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '40px', textAlign: 'center' },
  djsHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: '500', color: '#1A1A1A', marginBottom: '16px', textAlign: 'center' },
  djsDesc: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#666', marginBottom: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' },
  djsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  djCard: { display: 'flex', flexDirection: 'column' },
  djCity: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#9B9590', letterSpacing: '0.08em', marginBottom: '2px' },
  viewMoreLink: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#B07D62',
    borderTop: '1px solid #E8D5C4',
    marginTop: '-1px',
    padding: '10px 16px',
    backgroundColor: '#F8F6F3',
    textAlign: 'center',
    display: 'block',
  },
  bottomSection: { padding: '80px 32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  bottomHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '500', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  bottomSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [featuredDJs, setFeaturedDJs] = useState([])
  const [loadingDJs, setLoadingDJs] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchDJs = async () => {
      setLoadingDJs(true)
      const { data, error } = await supabase
        .from('dj_curators')
        .select('*')
        .eq('is_featured', true)
        .order('city', { ascending: true })

      if (!error) {
        setFeaturedDJs(data || [])
      }
      setLoadingDJs(false)
    }

    fetchDJs()
  }, [])

  return (
    <main>
      {gateOpen && <SignupGate onClose={() => setGateOpen(false)} />}

      <section style={styles.hero}>
        <p style={styles.eyebrow}>Curated by people in the scene</p>
        <h1 style={styles.headline}>
          Know the<br />
          <span style={styles.headlineItalic}>lore.</span>
        </h1>
        <p style={styles.subheadline}>
          Events, restaurants, and experiences around the world —
          curated by DJs, tastemakers, and cultural insiders.
          Not an algorithm. Real people. Real scenes.
        </p>
        <div style={styles.ctaRow}>
          <Link to="/cities" style={styles.ctaPrimary}>Explore cities</Link>
          <Link to="/request-access" style={styles.ctaSecondary}>Become a curator</Link>
        </div>
      </section>

      <div style={styles.divider} />

      <section style={styles.citiesSection}>
        <p style={styles.sectionLabel}>Cities on the map</p>
        <div style={styles.citiesGrid}>
          {cities.map((city) => (
            <Link key={city.slug} to={`/cities/${city.slug}`} style={styles.cityCard}>
              <div style={styles.cityName}>{city.name}</div>
              <div style={styles.cityCountry}>{city.country}</div>
            </Link>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {!loadingDJs && featuredDJs.length > 0 && (
        <section style={styles.djsSection}>
          <p style={styles.djsLabel}>🎧 Meet the curators</p>
          <h2 style={styles.djsHeadline}>A preview, one per city</h2>
          <p style={styles.djsDesc}>
            Every city has more curators shaping its scene — this is just a taste
          </p>
          <div style={styles.djsGrid}>
            {featuredDJs.map(dj => (
              <div key={dj.id} style={styles.djCard}>
                <p style={styles.djCity}>{dj.city}</p>
                <DJCard
                  dj={dj}
                  locked={!isLoggedIn}
                  onLockedClick={() => setGateOpen(true)}
                  showGenres={false}
                />
                <Link to={`/cities/${slugForCity(dj.city)}`} style={styles.viewMoreLink}>
                  View more in {dj.city} →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={styles.divider} />

      <section style={styles.bottomSection}>
        <h2 style={styles.bottomHeadline}>Are you in the scene?</h2>
        <p style={styles.bottomSub}>
          Apply to become a curator and share your city with the world.
        </p>
        <Link to="/request-access" style={styles.ctaPrimary}>Request access</Link>
      </section>
    </main>
  )
}
