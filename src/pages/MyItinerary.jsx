import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px', lineHeight: '1.6' },
  actionsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' },
  emailBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer' },
  shareBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1A1A1A', backgroundColor: 'transparent', border: '1px solid #1A1A1A', borderRadius: '2px', cursor: 'pointer' },
  uploadBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#B07D62', backgroundColor: 'transparent', border: '1px solid #B07D62', borderRadius: '2px', cursor: 'pointer' },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  sectionHeading: { fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '500', color: '#1A1A1A', marginBottom: '24px', marginTop: '8px' },
  categoryHeading: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '14px', marginTop: '28px' },
  citySection: { marginBottom: '48px' },
  cityTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '2px' },
  card: { backgroundColor: '#F2EEE9', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' },
  info: { flex: 1, minWidth: '200px' },
  name: { fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  meta: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  linkRow: { display: 'flex', gap: '14px', marginTop: '6px', flexWrap: 'wrap' },
  linkItem: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#B07D62', textDecoration: 'none' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 },
  removeBtn: { padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer', flexShrink: 0 },
  daySelect: { padding: '6px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  timeInput: { padding: '6px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', width: '90px' },
  notesToggle: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#B07D62', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' },
  notesBox: { width: '100%', boxSizing: 'border-box', marginTop: '10px', padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', minHeight: '50px', resize: 'vertical' },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '80px 0' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  gateBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px' },
  banner: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 16px', borderRadius: '2px', marginBottom: '24px' },
  bannerSuccess: { color: '#27AE60', backgroundColor: '#EDFAF3', border: '1px solid #B7EAD0' },
  bannerError: { color: '#C0392B', backgroundColor: '#FDF0EE', border: '1px solid #F5C6C0' },
  bannerInfo: { color: '#B07D62', backgroundColor: '#F7F0EB', border: '1px solid #E8D5C8' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '48px 0' },
  collabNote: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '400', color: '#B07D62', marginBottom: '32px' },
  uploadPanel: { backgroundColor: '#F7F0EB', border: '1px solid #E8D5C8', borderRadius: '2px', padding: '24px', marginBottom: '48px' },
  uploadPanelTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  uploadPanelType: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  field: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#1A1A1A', backgroundColor: '#FAF8F5', border: '1px solid #E8E4DE', borderRadius: '2px', marginBottom: '10px' },
  fieldRow: { display: 'flex', gap: '10px' },
  fieldLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9B9590', margin: '16px 0 6px 0' },
  confirmRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  confirmBtn: { padding: '10px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer' },
  cancelBtn: { padding: '10px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  dayTabs: { display: 'flex', gap: '2px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' },
  dayTab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.04em', color: '#6B6560', backgroundColor: '#F2EEE9', padding: '12px 22px', border: 'none', cursor: 'pointer' },
  dayTabActive: { color: '#FAF8F5', backgroundColor: '#1A1A1A' },
  addDayBtn: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', color: '#B07D62', backgroundColor: 'transparent', border: '1px dashed #D8C4B4', padding: '11px 18px', cursor: 'pointer', marginLeft: '4px' },
}

const EMPTY_FLYER_ITEM = {
  item_type: 'event', title: '', venue: '', address: '', city: '', country: '',
  date: '', end_date: '', time: '', genre: '', description: '', ticket_url: '',
  instagram_handle: '', website: '', google_maps_url: '',
}

const PLACE_CATEGORY_LABELS = [
  { key: 'restaurants', label: 'Restaurants', match: c => c === 'restaurant' || c === 'coffee' },
  { key: 'bars', label: 'Bars & Venues', match: c => c === 'bar' || c === 'music_venue' },
  { key: 'attractions', label: 'Attractions', match: c => !['restaurant', 'coffee', 'bar', 'music_venue'].includes(c) },
]

function categorizePlace(category) {
  const found = PLACE_CATEGORY_LABELS.find(c => c.match(category))
  return found ? found.key : 'attractions'
}

export default function MyItinerary() {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('t')

  const [user, setUser] = useState(undefined)
  const [itineraryId, setItineraryId] = useState(null)
  const [itineraryMeta, setItineraryMeta] = useState(null)
  const [savedPlaces, setSavedPlaces] = useState([])
  const [savedDjs, setSavedDjs] = useState([])
  const [flyerEvents, setFlyerEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [banner, setBanner] = useState(null)
  const [copyLabel, setCopyLabel] = useState('Copy invite link')

  const [previewOnly, setPreviewOnly] = useState(false)

  const [scanning, setScanning] = useState(false)
  const [pendingFlyer, setPendingFlyer] = useState(null)
  const fileInputRef = useRef(null)

  const [activeDay, setActiveDay] = useState('all')
  const [openNotesId, setOpenNotesId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    if (user === undefined) return

    if (!user) {
      if (inviteToken) {
        loadPreview(inviteToken)
      } else {
        setLoading(false)
      }
      return
    }

    resolveItinerary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, inviteToken])

  async function loadPreview(token) {
    setLoading(true)
    setPreviewOnly(true)
    const { data, error } = await supabase.rpc('get_itinerary_items_by_token', { p_token: token })
    if (!error && data) {
      setItineraryMeta({ name: data.name })
      setSavedPlaces((data.places || []).map(p => ({ id: null, places: p })))
      setSavedDjs((data.djs || []).map(d => ({ id: null, dj_curators: d })))
      setFlyerEvents(data.events || [])
    } else {
      showBanner('error', 'That invite link is invalid or has expired.')
    }
    setLoading(false)
  }

  async function resolveItinerary() {
    setLoading(true)
    try {
      let id
      if (inviteToken) {
        const { data, error } = await supabase.rpc('accept_itinerary_invite', { p_token: inviteToken })
        if (error) {
          showBanner('error', "That invite link is invalid or has expired. Showing your own itinerary instead.")
          id = await getOrCreateOwnItinerary()
        } else {
          id = data
          showBanner('success', "You're in — you can now add and remove items on this itinerary.")
        }
      } else {
        id = await getOrCreateOwnItinerary()
      }

      setItineraryId(id)

      const { data: itineraryRow } = await supabase
        .from('itineraries')
        .select('id, name, share_token, owner_id')
        .eq('id', id)
        .single()

      if (itineraryRow) {
        setItineraryMeta({
          name: itineraryRow.name,
          shareToken: itineraryRow.share_token,
          isOwner: itineraryRow.owner_id === user.id,
        })
      }

      await fetchAll(id)
    } catch {
      showBanner('error', 'Something went wrong loading your itinerary.')
      setLoading(false)
    }
  }

  async function getOrCreateOwnItinerary() {
    const { data, error } = await supabase.rpc('get_or_create_default_itinerary', { p_user_id: user.id })
    if (error) throw error
    return data
  }

  async function fetchAll(id) {
    const [placesRes, djsRes, eventsRes] = await Promise.all([
      supabase
        .from('saved_places')
        .select('id, place_id, trip_day, planned_time, notes, places (id, name, city, address, category, dining_style, website, google_maps_url)')
        .eq('itinerary_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('saved_djs')
        .select('id, dj_id, trip_day, planned_time, notes, dj_curators (id, name, city, event_name, instagram_handle, genres)')
        .eq('itinerary_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('itinerary_events')
        .select('*')
        .eq('itinerary_id', id)
        .order('created_at', { ascending: false }),
    ])
    setSavedPlaces(placesRes.data || [])
    setSavedDjs(djsRes.data || [])
    setFlyerEvents(eventsRes.data || [])
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

  async function handleRemoveEvent(eventId) {
    await supabase.from('itinerary_events').delete().eq('id', eventId)
    setFlyerEvents(prev => prev.filter(e => e.id !== eventId))
  }

  function showBanner(type, text) {
    setBanner({ type, text })
    setTimeout(() => setBanner(null), 5000)
  }

  // ---- Day / time / notes updates, per source table ----

  async function updateField(table, id, patch, localSetter) {
    localSetter(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item))
    await supabase.from(table).update(patch).eq('id', id)
  }

  function handleDayChange(source, id, value) {
    const trip_day = value === 'unscheduled' ? null : parseInt(value, 10)
    if (source === 'place') updateField('saved_places', id, { trip_day }, setSavedPlaces)
    if (source === 'dj') updateField('saved_djs', id, { trip_day }, setSavedDjs)
    if (source === 'event') updateField('itinerary_events', id, { trip_day }, setFlyerEvents)
  }

  function handleTimeChange(source, id, value) {
    if (source === 'place') updateField('saved_places', id, { planned_time: value }, setSavedPlaces)
    if (source === 'dj') updateField('saved_djs', id, { planned_time: value }, setSavedDjs)
    if (source === 'event') updateField('itinerary_events', id, { event_time: value }, setFlyerEvents)
  }

  function handleNotesChange(source, id, value) {
    if (source === 'place') setSavedPlaces(prev => prev.map(p => p.id === id ? { ...p, notes: value } : p))
    if (source === 'dj') setSavedDjs(prev => prev.map(d => d.id === id ? { ...d, notes: value } : d))
    if (source === 'event') setFlyerEvents(prev => prev.map(e => e.id === id ? { ...e, notes: value } : e))
  }

  async function handleNotesSave(source, id, value) {
    if (source === 'place') await supabase.from('saved_places').update({ notes: value }).eq('id', id)
    if (source === 'dj') await supabase.from('saved_djs').update({ notes: value }).eq('id', id)
    if (source === 'event') await supabase.from('itinerary_events').update({ notes: value }).eq('id', id)
  }

  function handleAddDay() {
    setActiveDay(prev => {
      const nextMax = maxDayUsed + 1
      return nextMax
    })
  }

  async function handleEmailMe() {
    if (!user || (savedPlaces.length === 0 && savedDjs.length === 0 && flyerEvents.length === 0)) return
    setSending(true)
    try {
      const places = savedPlaces.map(sp => ({ ...sp.places, trip_day: sp.trip_day, planned_time: sp.planned_time, notes: sp.notes })).filter(p => p.id)
      const djs = savedDjs.map(sd => ({ ...sd.dj_curators, trip_day: sd.trip_day, planned_time: sd.planned_time, notes: sd.notes })).filter(d => d.id)
      const events = flyerEvents.map(ev => ({ ...ev }))
      const res = await fetch('/api/send-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.name || '',
          places,
          djs,
          events,
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

  function handleCopyInvite() {
    if (!itineraryMeta?.shareToken) return
    const url = `${window.location.origin}/itinerary?t=${itineraryMeta.shareToken}`
    navigator.clipboard.writeText(url)
    setCopyLabel('Link copied!')
    setTimeout(() => setCopyLabel('Copy invite link'), 2500)
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    scanUpload(file)
    e.target.value = ''
  }

  function scanUpload(file) {
    setScanning(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(',')[1]
        const res = await fetch('/api/scan-personal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mediaType: file.type }),
        })
        const data = await res.json()
        if (data.raw || data.error) {
          showBanner('error', "Couldn't read that clearly. Try a clearer photo.")
        } else {
          setPendingFlyer({ ...EMPTY_FLYER_ITEM, ...data })
        }
      } catch {
        showBanner('error', "Couldn't read that. Try again.")
      }
      setScanning(false)
    }
    reader.readAsDataURL(file)
  }

  function updatePendingField(field, value) {
    setPendingFlyer(prev => ({ ...prev, [field]: value }))
  }

  async function handleConfirmFlyer() {
    if (!pendingFlyer || !itineraryId) return
    const { data, error } = await supabase
      .from('itinerary_events')
      .insert({
        itinerary_id: itineraryId,
        added_by: user.id,
        item_type: pendingFlyer.item_type || 'event',
        title: pendingFlyer.title,
        venue: pendingFlyer.venue,
        address: pendingFlyer.address,
        city: pendingFlyer.city,
        country: pendingFlyer.country,
        event_date: pendingFlyer.date || null,
        end_date: pendingFlyer.end_date || null,
        event_time: pendingFlyer.time,
        genre: pendingFlyer.genre,
        description: pendingFlyer.description,
        ticket_url: pendingFlyer.ticket_url,
        instagram_handle: pendingFlyer.instagram_handle,
        website: pendingFlyer.website,
        google_maps_url: pendingFlyer.google_maps_url,
      })
      .select()
      .single()

    if (error) {
      showBanner('error', "Couldn't add that to your itinerary. Try again.")
    } else {
      setFlyerEvents(prev => [data, ...prev])
      showBanner('success', 'Added to your itinerary.')
    }
    setPendingFlyer(null)
  }

  if (user === undefined) return null

  if (!user && !previewOnly) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>Sign in to see your itinerary.</h2>
        <p style={s.gateSub}>Save places and DJs from any city page, then find them all here.</p>
        <Link to="/login" style={s.gateBtn}>Sign in</Link>
      </div>
    )
  }

  const hasAnything = savedPlaces.length > 0 || savedDjs.length > 0 || flyerEvents.length > 0

  // Figure out which days are in use, so tabs are stable and cover everything
  const allDayValues = [
    ...savedPlaces.map(p => p.trip_day),
    ...savedDjs.map(d => d.trip_day),
    ...flyerEvents.map(e => e.trip_day),
  ].filter(d => d != null)
  const maxDayUsed = allDayValues.length > 0 ? Math.max(...allDayValues) : 0
  const dayCount = Math.max(maxDayUsed, 1)
  const dayNumbers = Array.from({ length: dayCount }, (_, i) => i + 1)

  const matchesActiveDay = (tripDay) => {
    if (activeDay === 'all') return true
    if (activeDay === 'unscheduled') return tripDay == null
    return tripDay === activeDay
  }

  const filteredPlaces = savedPlaces.filter(sp => matchesActiveDay(sp.trip_day))
  const filteredDjs = savedDjs.filter(sd => matchesActiveDay(sd.trip_day))
  const filteredEvents = flyerEvents.filter(ev => matchesActiveDay(ev.trip_day))

  const placesByCategory = { restaurants: [], bars: [], attractions: [] }
  filteredPlaces.forEach(sp => {
    const place = sp.places
    if (!place) return
    const key = categorizePlace(place.category)
    placesByCategory[key].push(sp)
  })

  const eventTypeItems = filteredEvents.filter(ev => ev.item_type !== 'place')
  const placeTypeItems = filteredEvents.filter(ev => ev.item_type === 'place')

  function DayTimeControls({ source, id, tripDay, plannedTime }) {
    if (previewOnly) return null
    return (
      <div style={s.cardRight}>
        <select
          style={s.daySelect}
          value={tripDay == null ? 'unscheduled' : tripDay}
          onChange={e => handleDayChange(source, id, e.target.value)}
        >
          <option value="unscheduled">Unscheduled</option>
          {Array.from({ length: Math.max(dayCount, tripDay || 0) }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>Day {d}</option>
          ))}
          <option value={Math.max(dayCount, tripDay || 0) + 1}>+ New day</option>
        </select>
        <input
          style={s.timeInput}
          type="text"
          placeholder="Time"
          value={plannedTime || ''}
          onChange={e => handleTimeChange(source, id, e.target.value)}
        />
      </div>
    )
  }

  function NotesSection({ source, id, notes }) {
    if (previewOnly) return null
    const isOpen = openNotesId === `${source}-${id}`
    return (
      <div style={{ width: '100%' }}>
        <button style={s.notesToggle} onClick={() => setOpenNotesId(isOpen ? null : `${source}-${id}`)}>
          {isOpen ? 'Hide notes' : notes ? 'Edit notes' : '+ Add notes'}
        </button>
        {isOpen && (
          <textarea
            style={s.notesBox}
            placeholder="Reservation info, who's meeting you, what to order..."
            value={notes || ''}
            onChange={e => handleNotesChange(source, id, e.target.value)}
            onBlur={e => handleNotesSave(source, id, e.target.value)}
          />
        )}
        {!isOpen && notes && <p style={{ ...s.meta, marginTop: '6px', fontStyle: 'italic' }}>{notes}</p>}
      </div>
    )
  }

  return (
    <main style={s.page}>
      <p style={s.eyebrow}>{previewOnly ? "You've been invited" : 'Your saved places'}</p>
      <h1 style={s.headline}>{itineraryMeta?.name || 'Itinerary.'}</h1>
      <p style={s.sub}>
        {previewOnly
          ? "Sign in to add or remove things on this itinerary together."
          : "Everything you've saved, in one place. Assign items to a day, add notes, and email it to yourself when you're ready."}
      </p>

      {previewOnly && (
        <div style={s.actionsRow}>
          <Link to={`/login?redirect=/itinerary?t=${inviteToken}`} style={s.gateBtn}>Sign in to collaborate</Link>
        </div>
      )}

      {banner && (
        <p style={{ ...s.banner, ...(banner.type === 'success' ? s.bannerSuccess : banner.type === 'info' ? s.bannerInfo : s.bannerError) }}>
          {banner.text}
        </p>
      )}

      {!previewOnly && itineraryMeta && !itineraryMeta.isOwner && (
        <p style={s.collabNote}>You're collaborating on this itinerary — changes you make here are visible to everyone on it.</p>
      )}

      {!previewOnly && !loading && (
        <div style={s.actionsRow}>
          {hasAnything && (
            <button
              style={sending ? { ...s.emailBtn, ...s.btnDisabled } : s.emailBtn}
              onClick={handleEmailMe}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Email me my itinerary'}
            </button>
          )}
          {itineraryMeta?.shareToken && (
            <button style={s.shareBtn} onClick={handleCopyInvite}>{copyLabel}</button>
          )}
          <button style={s.uploadBtn} onClick={() => fileInputRef.current?.click()}>
            + Add from a flyer or screenshot
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
      )}

      {scanning && (
        <p style={{ ...s.banner, ...s.bannerInfo }}>Reading and researching that for you...</p>
      )}

      {pendingFlyer && (
        <div style={s.uploadPanel}>
          <h3 style={s.uploadPanelTitle}>Confirm details</h3>
          <p style={s.uploadPanelType}>{pendingFlyer.item_type === 'place' ? 'Place' : 'Event'}</p>

          <input style={s.field} placeholder="Title / name" value={pendingFlyer.title} onChange={e => updatePendingField('title', e.target.value)} />

          <div style={s.fieldRow}>
            {pendingFlyer.item_type !== 'place' && (
              <input style={s.field} placeholder="Venue" value={pendingFlyer.venue} onChange={e => updatePendingField('venue', e.target.value)} />
            )}
            <input style={s.field} placeholder="City" value={pendingFlyer.city} onChange={e => updatePendingField('city', e.target.value)} />
          </div>

          <input style={s.field} placeholder="Address" value={pendingFlyer.address} onChange={e => updatePendingField('address', e.target.value)} />

          {pendingFlyer.item_type !== 'place' && (
            <div style={s.fieldRow}>
              <input style={s.field} placeholder="Date (YYYY-MM-DD)" value={pendingFlyer.date} onChange={e => updatePendingField('date', e.target.value)} />
              <input style={s.field} placeholder="End date (if multi-day)" value={pendingFlyer.end_date} onChange={e => updatePendingField('end_date', e.target.value)} />
              <input style={s.field} placeholder="Time" value={pendingFlyer.time} onChange={e => updatePendingField('time', e.target.value)} />
            </div>
          )}

          <input style={s.field} placeholder="Genre / type" value={pendingFlyer.genre} onChange={e => updatePendingField('genre', e.target.value)} />

          <p style={s.fieldLabel}>Links & socials</p>
          <div style={s.fieldRow}>
            <input style={s.field} placeholder="Instagram (@handle)" value={pendingFlyer.instagram_handle} onChange={e => updatePendingField('instagram_handle', e.target.value)} />
            <input style={s.field} placeholder="Website" value={pendingFlyer.website} onChange={e => updatePendingField('website', e.target.value)} />
          </div>
          <input style={s.field} placeholder="Google Maps link" value={pendingFlyer.google_maps_url} onChange={e => updatePendingField('google_maps_url', e.target.value)} />
          {pendingFlyer.item_type !== 'place' && (
            <input style={s.field} placeholder="Ticket / RSVP link" value={pendingFlyer.ticket_url} onChange={e => updatePendingField('ticket_url', e.target.value)} />
          )}

          <div style={s.confirmRow}>
            <button style={s.confirmBtn} onClick={handleConfirmFlyer}>Add to itinerary</button>
            <button style={s.cancelBtn} onClick={() => setPendingFlyer(null)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={s.emptyState}>Loading...</p>
      ) : !hasAnything ? (
        <p style={s.emptyState}>
          {previewOnly
            ? "Nothing saved on this itinerary yet."
            : 'You haven\'t saved anything yet. Browse a city and tap "Save," or add something straight from a flyer or screenshot.'}
        </p>
      ) : (
        <>
          <div style={s.dayTabs}>
            <button style={activeDay === 'all' ? { ...s.dayTab, ...s.dayTabActive } : s.dayTab} onClick={() => setActiveDay('all')}>All</button>
            {dayNumbers.map(d => (
              <button key={d} style={activeDay === d ? { ...s.dayTab, ...s.dayTabActive } : s.dayTab} onClick={() => setActiveDay(d)}>Day {d}</button>
            ))}
            <button style={activeDay === 'unscheduled' ? { ...s.dayTab, ...s.dayTabActive } : s.dayTab} onClick={() => setActiveDay('unscheduled')}>Unscheduled</button>
            {!previewOnly && (
              <button style={s.addDayBtn} onClick={() => setActiveDay(dayCount + 1)}>+ Add day</button>
            )}
          </div>

          {eventTypeItems.length > 0 && (
            <section style={s.citySection}>
              <h2 style={s.sectionHeading}>Events</h2>
              <div style={s.list}>
                {eventTypeItems.map(ev => (
                  <div key={ev.id} style={s.card}>
                    <div style={s.info}>
                      <p style={s.meta}>
                        {`${ev.venue || ''}${ev.city ? ` · ${ev.city}` : ''}${ev.event_date ? ` · ${ev.event_date}` : ''}`}
                      </p>
                      <h3 style={s.name}>{ev.title}</h3>
                      {ev.event_time && <p style={s.meta}>{ev.event_time}</p>}
                      {(ev.instagram_handle || ev.website || ev.google_maps_url || ev.ticket_url) && (
                        <div style={s.linkRow}>
                          {ev.instagram_handle && (
                            <a style={s.linkItem} href={`https://instagram.com/${ev.instagram_handle.replace('@', '')}`} target="_blank" rel="noreferrer">Instagram →</a>
                          )}
                          {ev.website && <a style={s.linkItem} href={ev.website} target="_blank" rel="noreferrer">Website →</a>}
                          {ev.google_maps_url && <a style={s.linkItem} href={ev.google_maps_url} target="_blank" rel="noreferrer">Maps →</a>}
                          {ev.ticket_url && <a style={s.linkItem} href={ev.ticket_url} target="_blank" rel="noreferrer">Tickets / RSVP →</a>}
                        </div>
                      )}
                      <NotesSection source="event" id={ev.id} notes={ev.notes} />
                    </div>
                    <DayTimeControls source="event" id={ev.id} tripDay={ev.trip_day} plannedTime={ev.event_time} />
                    {!previewOnly && (
                      <button style={s.removeBtn} onClick={() => handleRemoveEvent(ev.id)}>Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {placeTypeItems.length > 0 && (
            <section style={s.citySection}>
              <h2 style={s.categoryHeading}>Places you added</h2>
              <div style={s.list}>
                {placeTypeItems.map(ev => (
                  <div key={ev.id} style={s.card}>
                    <div style={s.info}>
                      <p style={s.meta}>{ev.address || ev.city}</p>
                      <h3 style={s.name}>{ev.title}</h3>
                      {(ev.instagram_handle || ev.website || ev.google_maps_url) && (
                        <div style={s.linkRow}>
                          {ev.instagram_handle && (
                            <a style={s.linkItem} href={`https://instagram.com/${ev.instagram_handle.replace('@', '')}`} target="_blank" rel="noreferrer">Instagram →</a>
                          )}
                          {ev.website && <a style={s.linkItem} href={ev.website} target="_blank" rel="noreferrer">Website →</a>}
                          {ev.google_maps_url && <a style={s.linkItem} href={ev.google_maps_url} target="_blank" rel="noreferrer">Maps →</a>}
                        </div>
                      )}
                      <NotesSection source="event" id={ev.id} notes={ev.notes} />
                    </div>
                    <DayTimeControls source="event" id={ev.id} tripDay={ev.trip_day} plannedTime={ev.event_time} />
                    {!previewOnly && (
                      <button style={s.removeBtn} onClick={() => handleRemoveEvent(ev.id)}>Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredPlaces.length > 0 && (
            <section style={s.citySection}>
              {PLACE_CATEGORY_LABELS.map(({ key, label }) => {
                const items = placesByCategory[key]
                if (!items.length) return null
                return (
                  <div key={key}>
                    <h2 style={s.categoryHeading}>{label}</h2>
                    <div style={s.list}>
                      {items.map(sp => {
                        const place = sp.places
                        if (!place) return null
                        return (
                          <div key={sp.id || place.id} style={s.card}>
                            <div style={s.info}>
                              <p style={s.meta}>{place.dining_style || place.category}{place.city ? ` · ${place.city}` : ''}</p>
                              <h3 style={s.name}>{place.name}</h3>
                              <p style={s.meta}>{place.address}</p>
                              <NotesSection source="place" id={sp.id} notes={sp.notes} />
                            </div>
                            <DayTimeControls source="place" id={sp.id} tripDay={sp.trip_day} plannedTime={sp.planned_time} />
                            {!previewOnly && (
                              <button style={s.removeBtn} onClick={() => handleRemovePlace(sp.id)}>Remove</button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </section>
          )}

          {filteredDjs.length > 0 && (
            <>
              <div style={s.divider} />
              <h2 style={s.sectionHeading}>DJs to check out</h2>
              <div style={s.list}>
                {filteredDjs.map(sd => {
                  const dj = sd.dj_curators
                  if (!dj) return null
                  return (
                    <div key={sd.id || dj.id} style={s.card}>
                      <div style={s.info}>
                        <p style={s.meta}>{dj.city}{dj.event_name ? ` · ${dj.event_name}` : ''}</p>
                        <h3 style={s.name}>{dj.name}</h3>
                        {Array.isArray(dj.genres) && dj.genres.length > 0 && (
                          <p style={s.meta}>{dj.genres.join(', ')}</p>
                        )}
                        <NotesSection source="dj" id={sd.id} notes={sd.notes} />
                      </div>
                      <DayTimeControls source="dj" id={sd.id} tripDay={sd.trip_day} plannedTime={sd.planned_time} />
                      {!previewOnly && (
                        <button style={s.removeBtn} onClick={() => handleRemoveDj(sd.id)}>Remove</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeDay !== 'all' && filteredPlaces.length === 0 && filteredDjs.length === 0 && filteredEvents.length === 0 && (
            <p style={s.emptyState}>Nothing assigned to this day yet.</p>
          )}
        </>
      )}
    </main>
  )
}