import { Link } from 'react-router-dom'

const cities = [
  { name: 'Washington DC', country: 'USA', slug: 'washington-dc', region: 'Americas' },
  { name: 'Charlotte', country: 'USA', slug: 'charlotte', region: 'Americas' },
  { name: 'Chicago', country: 'USA', slug: 'chicago', region: 'Americas' },
  { name: 'Atlanta', country: 'USA', slug: 'atlanta', region: 'Americas' },
  { name: 'Mexico City', country: 'Mexico', slug: 'mexico-city', region: 'Americas' },
  { name: 'Panama City', country: 'Panama', slug: 'panama-city', region: 'Americas' },
  { name: 'Lisbon', country: 'Portugal', slug: 'lisbon', region: 'Europe' },
  { name: 'Amsterdam', country: 'Netherlands', slug: 'amsterdam', region: 'Europe' },
]

const regions = ['Americas', 'Europe', 'Africa']

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '64px 32px',
  },
  header: {
    marginBottom: '64px',
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
    fontSize: 'clamp(36px, 5vw, 64px)',
    fontWeight: '500',
    lineHeight: '1.1',
    color: '#1A1A1A',
    marginBottom: '16px',
  },
  sub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '300',
    color: '#6B6560',
    maxWidth: '420px',
    lineHeight: '1.7',
  },
  regionSection: {
    marginBottom: '56px',
  },
  regionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9B9590',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E8E4DE',
  },
  citiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '2px',
  },
  cityCard: {
    backgroundColor: '#F2EEE9',
    padding: '28px 24px',
    display: 'block',
    transition: 'background 0.2s',
  },
  cityName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: '4px',
  },
  cityCountry: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#9B9590',
  },
}

export default function Cities() {
  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>Where the lore lives</p>
        <h1 style={styles.headline}>Cities</h1>
        <p style={styles.sub}>
          Each city has its own scene. Tap in and find out what's happening — 
          from events to restaurants to the spots only locals know.
        </p>
      </div>

      {regions.map((region) => {
        const regionCities = cities.filter((c) => c.region === region)
        if (!regionCities.length) return null
        return (
          <div key={region} style={styles.regionSection}>
            <p style={styles.regionLabel}>{region}</p>
            <div style={styles.citiesGrid}>
              {regionCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/cities/${city.slug}`}
                  style={styles.cityCard}
                >
                  <div style={styles.cityName}>{city.name}</div>
                  <div style={styles.cityCountry}>{city.country}</div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </main>
  )
}