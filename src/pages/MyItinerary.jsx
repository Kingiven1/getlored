import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px', lineHeight: '1.6' },
  emailBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginBottom: '48px' },
  emailBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  sectionHeading: { fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '500', color: '#1A1A1A', marginBottom: '24px', marginTop: '8px' },
  citySection: { marginBottom: '48px' },
  cityTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '2px' },
  card: { backgroundColor: '#F2EEE9', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' },
  info: { flex: 1, minWidth: '200px' },
  name: { fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  meta: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  removeBtn: { padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer', flexShrink: 0 },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  gateBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px' },
  banner: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 16px', borderRadius: '2px', marginBottom: '24px' },
  bannerSuccess: { color: '#27AE60', backgroundColor: '#EDFAF3', border: '1px solid #B7EAD0' },
  bannerError: { color: '#C0392B', backgroundColor: '#FDF0EE', border: '1px solid #F5C6C0' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '48px 0' },
}

export default function MyItinerary() {
  const [user, setUser] = useState(undefined)
  const [savedPlaces, setSavedPlaces] = useState([])
  const [savedDjs, setSavedDjs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [banner, setBanner] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchSaved(session.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function fetchSaved(userId) {
    setLoading(true)
    const [placesRes, djsRes] = await Promise.all([
      supabase
        .from('saved_places')
        .select('id, place_id, places (id, name, city, address, category, dining_style, website, google_maps_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('saved_djs')
        .select('id, dj_id, dj_curators (id, name, city, event_name, instagram_handle, genres)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ])
    setSavedPlaces(placesRes.data || [])
    setSavedDjs(djsRes.data || [])
    setLoading(false)
  }

  async function handleRemovePlace(savedId) {
    await supabase.from('saved_places').delete().eq('id', savedId)
    setSavedPlaces(prev => prev.filter(p => p.id !== savedId))
  }

  async function handleRemoveDj(savedId) {
    await supabase.from('saved_djs').delete().eq('id', savedId)
    setSavedDjs(prev => prev.filter(d => d.id !== savedId))
  }

  function showBanner(type, text) {
    setBanner({ type, text })
    setTimeout(() => setBanner(null), 4000)
  }

  async function handleEmailMe() {
    if (!user || (savedPlaces.length === 0 && savedDjs.length === 0)) return
    setSending(true)
    try {
      const places = savedPlaces.map(sp => sp.places).filter(Boolean)
      const djs = savedDjs.map(sd => sd.dj_curators).filter(Boolean)
      const res = await fetch('/api/send-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.name || '',
          places,
          djs,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showBanner('error', data.error || "Couldn't send that email. Try again in a moment.")
      } else {
        showBanner('success', `Sent to ${user.email}.`)
      }
    } catch {
      showBanner('error', "Couldn't send that email. Try again in a moment.")
    }
    setSending(false)
  }

  if (user === undefined) return null

  if (!user) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>Sign in to see your itinerary.</h2>
        <p style={s.gateSub}>Save places and DJs from any city page, then find them all here.</p>
        <Link to="/login" style={s.gateBtn}>Sign in</Link>
      </div>
    )
  }

  const byCity = {}
  savedPlaces.forEach(sp => {
    const place = sp.places
    if (!place) return
    const city = place.city || 'Other'
    if (!byCity[city]) byCity[city] = []
    byCity[city].push({ savedId: sp.id, ...place })
  })

  const hasAnything = savedPlaces.length > 0 || savedDjs.length > 0

  return (
    <main style={s.page}>
      <p style={s.eyebrow}>Your saved places</p>
      <h1 style={s.headline}>Itinerary.</h1>
      <p style={s.sub}>Everything you've saved, in one place. Email it to yourself whenever you're ready.</p>

      {banner && (
        <p style={{ ...s.banner, ...(banner.type === 'success' ? s.bannerSuccess : s.bannerError) }}>
          {banner.text}
        </p>
      )}

      {!loading && hasAnything && (
        <button
          style={sending ? { ...s.emailBtn, ...s.emailBtnDisabled } : s.emailBtn}
          onClick={handleEmailMe}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Email me my itinerary'}
        </button>
      )}

      {loading ? (
        <p style={s.emptyState}>Loading your saved places...</p>
      ) : !hasAnything ? (
        <p style={s.emptyState}>You haven't saved anything yet. Browse a city and tap "Save" on any place or DJ that catches your eye.</p>
      ) : (
        <>
          {savedPlaces.length > 0 && (
            <>
              {Object.entries(byCity).map(([city, places]) => (
                <section key={city} style={s.citySection}>
                  <h2 style={s.cityTitle}>{city}</h2>
                  <div style={s.list}>
                    {places.map(place => (
                      <div key={place.savedId} style={s.card}>
                        <div style={s.info}>
                          <p style={s.meta}>{place.dining_style || place.category}</p>
                          <h3 style={s.name}>{place.name}</h3>
                          <p style={s.meta}>{place.address}</p>
                        </div>
                        <button style={s.removeBtn} onClick={() => handleRemovePlace(place.savedId)}>Remove</button>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}

          {savedDjs.length > 0 && (
            <>
              {savedPlaces.length > 0 && <div style={s.divider} />}
              <h2 style={s.sectionHeading}>DJs to check out</h2>
              <div style={s.list}>
                {savedDjs.map(sd => {
                  const dj = sd.dj_curators
                  if (!dj) return null
                  return (
                    <div key={sd.id} style={s.card}>
                      <div style={s.info}>
                        <p style={s.meta}>{dj.city}{dj.event_name ? ` · ${dj.event_name}` : ''}</p>
                        <h3 style={s.name}>{dj.name}</h3>
                        {Array.isArray(dj.genres) && dj.genres.length > 0 && (
                          <p style={s.meta}>{dj.genres.join(', ')}</p>
                        )}
                      </div>
                      <button style={s.removeBtn} onClick={() => handleRemoveDj(sd.id)}>Remove</button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}