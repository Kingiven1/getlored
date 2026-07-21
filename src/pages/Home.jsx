import { Link } from 'react-router-dom'

const cities = [
  { name: 'Miami', country: 'USA', slug: 'miami', emoji: '🌴' },
  { name: 'London', country: 'UK', slug: 'london', emoji: '🇬🇧' },
  { name: 'Ibiza', country: 'Spain', slug: 'ibiza', emoji: '🌊' },
  { name: 'New York', country: 'USA', slug: 'new-york', emoji: '🗽' },
  { name: 'Paris', country: 'France', slug: 'paris', emoji: '🗼' },
  { name: 'Lagos', country: 'Nigeria', slug: 'lagos', emoji: '🌍' },
  { name: 'Toronto', country: 'Canada', slug: 'toronto', emoji: '🍁' },
  { name: 'Charlotte', country: 'USA', slug: 'charlotte', emoji: '👑' },
]

const styles = {
  hero: {
    padding: '120px 32px 80px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#B07D62',
    marginBottom: '24px',
  },
  headline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(52px, 8vw, 96px)',
    fontWeight: '500',
    lineHeight: '1.0',
    letterSpacing: '-0.02em',
    color: '#1A1A1A',
    marginBottom: '32px',
  },
  headlineItalic: {
    fontStyle: 'italic',
    color: '#B07D62',
  },
  subheadline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    fontWeight: '300',
    lineHeight: '1.7',
    color: '#6B6560',
    maxWidth: '480px',
    marginBottom: '48px',
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#FAF8F5',
    backgroundColor: '#1A1A1A',
    padding: '14px 32px',
    borderRadius: '2px',
    display: 'inline-block',
  },
  ctaSecondary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#6B6560',
    borderBottom: '1px solid #6B6560',
    paddingBottom: '2px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E8E4DE',
    margin: '0 32px',
  },
  citiesSection: {
    padding: '80px 32px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#B07D62',
    marginBottom: '40px',
  },
  citiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '2px',
  },
  cityCard: {
    backgroundColor: '#F2EEE9',
    padding: '32px 28px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'block',
  },
  cityEmoji: {
    fontSize: '28px',
    marginBottom: '16px',
    display: 'block',
  },
  cityName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: '4px',
  },
  cityCountry: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#9B9590',
  },
  bottomSection: {
    padding: '80px 32px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  bottomHeadline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#1A1A1A',
    marginBottom: '16px',
  },
  bottomSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '300',
    color: '#6B6560',
    marginBottom: '32px',
  },
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
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
          <Link to="/cities" style={styles.ctaPrimary}>
            Explore cities
          </Link>
          <Link to="/request-access" style={styles.ctaSecondary}>
            Become a curator
          </Link>
        </div>
      </section>

      <div style={styles.divider} />

      {/* Cities Grid */}
      <section style={styles.citiesSection}>
        <p style={styles.sectionLabel}>Cities on the map</p>
        <div style={styles.citiesGrid}>
          {cities.map((city) => (
            <Link
              key={city.slug}
              to={`/cities/${city.slug}`}
              style={styles.cityCard}
            >
              <span style={styles.cityEmoji}>{city.emoji}</span>
              <div style={styles.cityName}>{city.name}</div>
              <div style={styles.cityCountry}>{city.country}</div>
            </Link>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* Bottom CTA */}
      <section style={styles.bottomSection}>
        <h2 style={styles.bottomHeadline}>Are you in the scene?</h2>
        <p style={styles.bottomSub}>
          Apply to become a curator and share your city with the world.
        </p>
        <Link to="/request-access" style={styles.ctaPrimary}>
          Request access
        </Link>
      </section>
    </main>
  )
}
