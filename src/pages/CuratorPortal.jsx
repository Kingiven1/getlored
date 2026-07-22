import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const emptyEvent = {
  title: '', venue: '', address: '', city: '', country: '',
  date: '', time: '', genre: '', description: '', ticket_url: '',
}

const emptyPlace = {
  name: '', category: 'restaurant', address: '', city: '', country: '',
  description: '', google_maps_url: '', website: '',
}

const emptyHappening = {
  title: '', description: '', city: '', country: '',
  date: '', time: '', location: '', link: '',
}

const s = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '40px', lineHeight: '1.6' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  signOutBtn: { padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  portalTabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '40px' },
  portalTab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  portalTabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  subTabs: { display: 'flex', gap: '8px', marginBottom: '32px' },
  subTab: { padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  subTabActive: { color: '#FAF8F5', backgroundColor: '#1A1A1A', border: '1px solid #1A1A1A' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '500', color: '#1A1A1A', marginBottom: '24px', marginTop: '0', lineHeight: '1.4', display: 'block', position: 'relative' },
  spacer: { height: '4px', width: '100%' },
  flyerBox: { display: 'block', boxSizing: 'border-box', width: '100%', border: '2px dashed #E8E4DE', borderRadius: '4px', padding: '40px', textAlign: 'center', marginTop: '0', marginBottom: '32px', cursor: 'pointer', backgroundColor: '#F9F7F4', position: 'relative' },
  flyerBoxActive: { border: '2px dashed #B07D62', backgroundColor: '#FDF8F5' },
  flyerLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', marginBottom: '8px' },
  flyerHint: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#B8B4AF', letterSpacing: '0.06em', textTransform: 'uppercase' },
  flyerPreview: { width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '2px', marginBottom: '16px' },
  scanBtn: { width: '100%', padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#B07D62', border: 'none', borderRadius: '2px', cursor: 'pointer', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' },
  input: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px', lineHeight: '1.6' },
  button: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start' },
  cancelEditBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start', marginLeft: '12px' },
  formButtonRow: { display: 'flex', alignItems: 'center' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '24px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '24px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '40px 0' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  gateBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px', marginRight: '16px' },
  gateSecondary: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', backgroundColor: 'transparent' },
  myEventsList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  myEventCard: { backgroundColor: '#F2EEE9', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' },
  myEventInfo: { flex: 1, minWidth: '200px' },
  myEventDate: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '6px', letterSpacing: '0.08em' },
  myEventTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  myEventVenue: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  myEventActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  editBtn: { padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1A1A1A', backgroundColor: 'transparent', border: '1px solid #1A1A1A', borderRadius: '2px', cursor: 'pointer' },
  deleteBtn: { padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer' },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '60px 0' },
  editingBanner: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#B07D62', backgroundColor: '#FDF8F5', padding: '12px 16px', borderRadius: '2px', border: '1px solid #E8D5C4', marginBottom: '24px' },
}

function resizeImage(file, maxWidth = 1000) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = (e) => { img.src = e.target.result }
    reader.onerror = reject
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Could not process image'))
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.82)
    }
    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function CuratorPortal() {
  const [user, setUser] = useState(null)
  const [curator, setCurator] = useState(undefined)
  const [portalTab, setPortalTab] = useState('events')
  const [eventsSubTab, setEventsSubTab] = useState('add')
  const [placesSubTab, setPlacesSubTab] = useState('place')

  const [eventForm, setEventForm] = useState(emptyEvent)
  const [placeForm, setPlaceForm] = useState(emptyPlace)
  const [happeningForm, setHappeningForm] = useState(emptyHappening)

  const [myEvents, setMyEvents] = useState([])
  const [myEventsLoading, setMyEventsLoading] = useState(true)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingFlyerUrl, setEditingFlyerUrl] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [flyer, setFlyer] = useState(null)
  const [flyerPreview, setFlyerPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        checkCurator(session.user.id)
      } else {
        setUser(null)
        setCurator(null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user)
        checkCurator(session.user.id)
      } else {
        setUser(null)
        setCurator(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user && curator?.can_events) {
      fetchMyEvents()
    }
  }, [user, curator])

  async function checkCurator(userId) {
    const { data } = await supabase
      .from('curators')
      .select('*')
      .eq('user_id', userId)
      .single()
    setCurator(data || null)
    if (data) {
      if (!data.can_events && data.can_places) {
        setPortalTab('places')
      } else {
        setPortalTab('events')
      }
    }
  }

  async function fetchMyEvents() {
    setMyEventsLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('curator_id', user.id)
      .order('date', { ascending: true })
    setMyEvents(data || [])
    setMyEventsLoading(false)
  }

  function handleEventChange(e) { setEventForm({ ...eventForm, [e.target.name]: e.target.value }) }
  function handlePlaceChange(e) { setPlaceForm({ ...placeForm, [e.target.name]: e.target.value }) }
  function handleHappeningChange(e) { setHappeningForm({ ...happeningForm, [e.target.name]: e.target.value }) }

  async function processFlyerFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    try {
      const resized = await resizeImage(file)
      setFlyer(resized)
      setFlyerPreview(URL.createObjectURL(resized))
    } catch {
      setFlyer(file)
      setFlyerPreview(URL.createObjectURL(file))
    }
  }

  function handleFlyerChange(e) {
    const file = e.target.files[0]
    processFlyerFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    processFlyerFile(file)
  }

  async function handleScan() {
    if (!flyer) return
    setScanning(true)
    setError('')
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mediaType: flyer.type }),
        })
        const data = await res.json()
        if (data.title) {
          setEventForm(prev => ({
            ...prev,
            title: data.title || prev.title,
            venue: data.venue || prev.venue,
            address: data.address || prev.address,
            city: data.city || prev.city,
            country: data.country || prev.country,
            date: data.date || prev.date,
            time: data.time || prev.time,
            genre: data.genre || prev.genre,
            description: data.description || prev.description,
            ticket_url: data.ticket_url || prev.ticket_url,
          }))
        }
        setScanning(false)
      }
      reader.readAsDataURL(flyer)
    } catch {
      setError('Scan failed. Fill in manually.')
      setScanning(false)
    }
  }

  async function uploadFlyer() {
    if (!flyer) return null
    const fileName = `${Date.now()}-${flyer.name}`
    const { error: uploadError } = await supabase.storage
      .from('flyers')
      .upload(fileName, flyer, { contentType: flyer.type })
    if (uploadError) {
      console.error(uploadError)
      return null
    }
    const { data } = supabase.storage.from('flyers').getPublicUrl(fileName)
    return data.publicUrl
  }

  function startEditingEvent(evt) {
    setEventForm({
      title: evt.title || '',
      venue: evt.venue || '',
      address: evt.address || '',
      city: evt.city || '',
      country: evt.country || '',
      date: evt.date || '',
      time: evt.time || '',
      genre: evt.genre || '',
      description: evt.description || '',
      ticket_url: evt.ticket_url || '',
    })
    setEditingEventId(evt.id)
    setEditingFlyerUrl(evt.flyer_url || null)
    setFlyer(null)
    setFlyerPreview(evt.flyer_url || null)
    setEventsSubTab('add')
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditing() {
    setEditingEventId(null)
    setEditingFlyerUrl(null)
    setEventForm(emptyEvent)
    setFlyer(null)
    setFlyerPreview(null)
    setSuccess('')
    setError('')
  }

  async function handleDeleteEvent(evt) {
    const confirmed = window.confirm(`Delete "${evt.title}"? This can't be undone.`)
    if (!confirmed) return
    const { error } = await supabase.from('events').delete().eq('id', evt.id)
    if (error) {
      setError('Could not delete that event. Try again.')
      return
    }
    setSuccess(`"${evt.title}" deleted.`)
    await fetchMyEvents()
  }

  async function handleEventSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    let flyerUrl = editingFlyerUrl
    if (flyer) {
      const uploaded = await uploadFlyer()
      if (uploaded) flyerUrl = uploaded
    }

    if (editingEventId) {
      const { error } = await supabase
        .from('events')
        .update({ ...eventForm, flyer_url: flyerUrl })
        .eq('id', editingEventId)

      if (error) {
        setError('Something went wrong updating the event. Try again.')
      } else {
        setSuccess('Event updated.')
        setEventForm(emptyEvent)
        setFlyer(null)
        setFlyerPreview(null)
        setEditingEventId(null)
        setEditingFlyerUrl(null)
        await fetchMyEvents()
        setEventsSubTab('mine')
      }
    } else {
      const { error } = await supabase.from('events').insert([{
        ...eventForm, curator_id: user.id, status: 'published',
        flyer_url: flyerUrl,
      }])
      if (error) {
        setError('Something went wrong. Try again.')
      } else {
        setSuccess('Event added to Get Lored.')
        setEventForm(emptyEvent)
        setFlyer(null)
        setFlyerPreview(null)
        await fetchMyEvents()
      }
    }
    setSubmitting(false)
  }

  async function handlePlaceSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.from('places').insert([{
      ...placeForm, curator_id: user.id,
    }])
    if (error) { setError('Something went wrong. Try again.') }
    else { setSuccess('Place added to Get Lored.'); setPlaceForm(emptyPlace) }
    setSubmitting(false)
  }

  async function handleHappeningSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.from('happenings').insert([{
      ...happeningForm, curator_id: user.id, status: 'published',
    }])
    if (error) { setError('Something went wrong. Try again.') }
    else { setSuccess('Happening added to Get Lored.'); setHappeningForm(emptyHappening) }
    setSubmitting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (curator === undefined) return null

  if (!user) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>Curators only.</h2>
        <p style={s.gateSub}>Sign in to access your portal.</p>
        <a href="/curator-login" style={s.gateBtn}>Sign in</a>
      </div>
    )
  }

  if (!curator) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>You're not a curator yet.</h2>
        <p style={s.gateSub}>Request access to start uploading events and recommendations.</p>
        <a href="/request-access" style={s.gateBtn}>Request access</a>
        <br /><br />
        <button style={s.gateSecondary} onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }

  if (!curator.can_events && !curator.can_places) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>You're on our radar.</h2>
        <p style={s.gateSub}>Your application is pending. We'll reach out when you're approved.</p>
        <button style={s.gateSecondary} onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }

  const hasBoth = curator.can_events && curator.can_places

  return (
    <main style={s.page}>
      <div style={s.topRow}>
        <div>
          <p style={s.eyebrow}>Curator portal</p>
          <h1 style={s.headline}>
            {portalTab === 'events' ? 'Add an event.' : 'Add to the city.'}
          </h1>
          <p style={s.sub}>
            {portalTab === 'events'
              ? 'Upload a flyer and let AI fill in the details, or enter manually.'
              : 'Recommend a place or add a happening.'}
          </p>
        </div>
        <button style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>

      {hasBoth && (
        <div style={s.portalTabs}>
          <button
            style={portalTab === 'events' ? { ...s.portalTab, ...s.portalTabActive } : s.portalTab}
            onClick={() => { setPortalTab('events'); setSuccess(''); setError('') }}
          >
            Events
          </button>
          <button
            style={portalTab === 'places' ? { ...s.portalTab, ...s.portalTabActive } : s.portalTab}
            onClick={() => { setPortalTab('places'); setSuccess(''); setError('') }}
          >
            Places & Happenings
          </button>
        </div>
      )}

      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}

      {portalTab === 'events' && curator.can_events && (
        <>
          <div style={s.subTabs}>
            <button
              style={eventsSubTab === 'add' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setEventsSubTab('add'); setSuccess(''); setError('') }}
            >
              {editingEventId ? 'Editing event' : 'Add event'}
            </button>
            <button
              style={eventsSubTab === 'mine' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setEventsSubTab('mine'); setSuccess(''); setError('') }}
            >
              My Events ({myEvents.length})
            </button>
          </div>

          {eventsSubTab === 'add' && (
            <>
              {editingEventId && (
                <p style={s.editingBanner}>Editing "{eventForm.title || 'this event'}". Changes will update the existing listing.</p>
              )}

              <h2 style={s.sectionTitle}>Upload flyer</h2>
              <div style={s.spacer} />
              <label
                style={dragActive ? { ...s.flyerBox, ...s.flyerBoxActive } : s.flyerBox}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {flyerPreview ? (
                  <img src={flyerPreview} alt="Flyer preview" style={s.flyerPreview} />
                ) : (
                  <>
                    <p style={s.flyerLabel}>Drag & drop your flyer here, or click to upload</p>
                    <p style={s.flyerHint}>JPG or PNG</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFlyerChange} style={{ display: 'none' }} />
              </label>

              {flyer && (
                <button style={s.scanBtn} onClick={handleScan} disabled={scanning}>
                  {scanning ? 'Reading flyer...' : 'Scan flyer with AI'}
                </button>
              )}

              <div style={s.divider} />
              <h2 style={s.sectionTitle}>Event details</h2>

              <form style={s.form} onSubmit={handleEventSubmit}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Event title</label>
                  <input style={s.input} name="title" value={eventForm.title} onChange={handleEventChange} placeholder="Event name" required />
                </div>
                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Venue</label>
                    <input style={s.input} name="venue" value={eventForm.venue} onChange={handleEventChange} placeholder="Venue name" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Genre</label>
                    <select style={s.select} name="genre" value={eventForm.genre} onChange={handleEventChange}>
                      <option value="">Select genre</option>
                      <option value="Afrobeats">Afrobeats</option>
                      <option value="Amapiano">Amapiano</option>
                      <option value="Hip-Hop">Hip-Hop</option>
                      <option value="House">House</option>
                      <option value="R&B">R&B</option>
                      <option value="Reggae">Reggae</option>
                      <option value="Soca">Soca</option>
                      <option value="Tech House">Tech House</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Address</label>
                  <input style={s.input} name="address" value={eventForm.address} onChange={handleEventChange} placeholder="Full address" />
                </div>
                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>City</label>
                    <input style={s.input} name="city" value={eventForm.city} onChange={handleEventChange} placeholder="Miami" required />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Country</label>
                    <input style={s.input} name="country" value={eventForm.country} onChange={handleEventChange} placeholder="USA" required />
                  </div>
                </div>
                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Date</label>
                    <input style={s.input} name="date" type="date" value={eventForm.date} onChange={handleEventChange} required />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Time</label>
                    <input style={s.input} name="time" value={eventForm.time} onChange={handleEventChange} placeholder="10pm – 3am" />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Ticket link</label>
                  <input style={s.input} name="ticket_url" value={eventForm.ticket_url} onChange={handleEventChange} placeholder="https://..." />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Description</label>
                  <textarea style={s.textarea} name="description" value={eventForm.description} onChange={handleEventChange} placeholder="Tell people what to expect..." />
                </div>
                <div style={s.formButtonRow}>
                  <button type="submit" style={s.button} disabled={submitting}>
                    {submitting ? 'Saving...' : editingEventId ? 'Save changes' : 'Add event'}
                  </button>
                  {editingEventId && (
                    <button type="button" style={s.cancelEditBtn} onClick={cancelEditing}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {eventsSubTab === 'mine' && (
            myEventsLoading ? (
              <p style={s.emptyState}>Loading your events...</p>
            ) : myEvents.length === 0 ? (
              <p style={s.emptyState}>You haven't added any events yet.</p>
            ) : (
              <div style={s.myEventsList}>
                {myEvents.map(evt => (
                  <div key={evt.id} style={s.myEventCard}>
                    <div style={s.myEventInfo}>
                      <p style={s.myEventDate}>{formatDate(evt.date)}</p>
                      <h3 style={s.myEventTitle}>{evt.title}</h3>
                      <p style={s.myEventVenue}>{evt.venue}{evt.city ? ` · ${evt.city}` : ''}</p>
                    </div>
                    <div style={s.myEventActions}>
                      <button style={s.editBtn} onClick={() => startEditingEvent(evt)}>Edit</button>
                      <button style={s.deleteBtn} onClick={() => handleDeleteEvent(evt)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {portalTab === 'places' && curator.can_places && (
        <>
          <div style={s.subTabs}>
            <button
              style={placesSubTab === 'place' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesSubTab('place'); setSuccess(''); setError('') }}
            >
              Add a place
            </button>
            <button
              style={placesSubTab === 'happening' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesSubTab('happening'); setSuccess(''); setError('') }}
            >
              Add a happening
            </button>
          </div>

          {placesSubTab === 'place' && (
            <form style={s.form} onSubmit={handlePlaceSubmit}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Name</label>
                <input style={s.input} name="name" value={placeForm.name} onChange={handlePlaceChange} placeholder="Place name" required />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Category</label>
                <select style={s.select} name="category" value={placeForm.category} onChange={handlePlaceChange}>
                  <option value="restaurant">Restaurant</option>
                  <option value="coffee">Coffee shop</option>
                  <option value="bar">Bar</option>
                  <option value="music_venue">Music venue</option>
                  <option value="attraction">Attraction</option>
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Address</label>
                <input style={s.input} name="address" value={placeForm.address} onChange={handlePlaceChange} placeholder="Full address" />
              </div>
              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>City</label>
                  <input style={s.input} name="city" value={placeForm.city} onChange={handlePlaceChange} placeholder="Charlotte" required />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Country</label>
                  <input style={s.input} name="country" value={placeForm.country} onChange={handlePlaceChange} placeholder="USA" required />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Google Maps link</label>
                <input style={s.input} name="google_maps_url" value={placeForm.google_maps_url} onChange={handlePlaceChange} placeholder="https://maps.app.goo.gl/..." />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Website</label>
                <input style={s.input} name="website" value={placeForm.website} onChange={handlePlaceChange} placeholder="https://..." />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Description</label>
                <textarea style={s.textarea} name="description" value={placeForm.description} onChange={handlePlaceChange} placeholder="What makes this spot worth knowing about..." />
              </div>
              <button type="submit" style={s.button} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add place'}
              </button>
            </form>
          )}

          {placesSubTab === 'happening' && (
            <form style={s.form} onSubmit={handleHappeningSubmit}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Title</label>
                <input style={s.input} name="title" value={happeningForm.title} onChange={handleHappeningChange} placeholder="Pop-up, festival, market..." required />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Location</label>
                <input style={s.input} name="location" value={happeningForm.location} onChange={handleHappeningChange} placeholder="Where's it happening" />
              </div>
              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>City</label>
                  <input style={s.input} name="city" value={happeningForm.city} onChange={handleHappeningChange} placeholder="Charlotte" required />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Country</label>
                  <input style={s.input} name="country" value={happeningForm.country} onChange={handleHappeningChange} placeholder="USA" required />
                </div>
              </div>
              <div style={s.row}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Date</label>
                  <input style={s.input} name="date" type="date" value={happeningForm.date} onChange={handleHappeningChange} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Time</label>
                  <input style={s.input} name="time" value={happeningForm.time} onChange={handleHappeningChange} placeholder="12pm – 6pm" />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Link</label>
                <input style={s.input} name="link" value={happeningForm.link} onChange={handleHappeningChange} placeholder="https://..." />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Description</label>
                <textarea style={s.textarea} name="description" value={happeningForm.description} onChange={handleHappeningChange} placeholder="Tell people what to expect..." />
              </div>
              <button type="submit" style={s.button} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add happening'}
              </button>
            </form>
          )}
        </>
      )}
    </main>
  )
}