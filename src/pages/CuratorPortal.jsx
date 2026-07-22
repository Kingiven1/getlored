import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const SUPPORTED_CITIES = [
  { city: 'Washington DC', country: 'USA' },
  { city: 'Charlotte', country: 'USA' },
  { city: 'Chicago', country: 'USA' },
  { city: 'Atlanta', country: 'USA' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Panama City', country: 'Panama' },
  { city: 'Lisbon', country: 'Portugal' },
  { city: 'Amsterdam', country: 'Netherlands' },
]

const DINING_STYLES = [
  'Fine Dining',
  'Casual Dining',
  'Brunch & Breakfast',
  'Bakery & Café',
  'Steakhouse',
  'Bar & Lounge',
  'Pizzeria',
]

function matchSupportedCity(detected) {
  if (!detected) return null
  const cleaned = detected.trim().toLowerCase()
  return SUPPORTED_CITIES.find(c =>
    c.city.toLowerCase() === cleaned || cleaned.includes(c.city.toLowerCase())
  ) || null
}

const emptyEvent = {
  title: '', venue: '', address: '', city: '', country: '',
  date: '', time: '', genre: '', description: '', ticket_url: '',
}

const emptyPlace = {
  name: '', category: 'restaurant', dining_style: '', address: '', city: '', country: '',
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
  subTabs: { display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' },
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
  inputDisabled: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#9B9590', backgroundColor: '#EDEAE5', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px', lineHeight: '1.6' },
  button: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start' },
  cancelEditBtn: { padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start', marginLeft: '12px' },
  formButtonRow: { display: 'flex', alignItems: 'center' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '24px' },
  error: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '24px' },
  warning: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#8B6914', backgroundColor: '#FEF9E7', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F9E79F', marginBottom: '24px' },
  divider: { height: '1px', backgroundColor: '#E8E4DE', margin: '40px 0' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '32px' },
  gateBtn: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', borderRadius: '2px', marginRight: '16px' },
  gateSecondary: { display: 'inline-block', padding: '14px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer', backgroundColor: 'transparent' },
  filterBar: { display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'flex-end' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' },
  filterLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590' },
  filterSelect: { padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1A1A1A', backgroundColor: '#F2EEE9', border: '1px solid #E8E4DE', borderRadius: '2px', outline: 'none' },
  filterClear: { padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  resultsCount: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590', marginBottom: '16px' },
  myList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  myCard: { backgroundColor: '#F2EEE9', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' },
  myCardPast: { opacity: 0.6 },
  myInfo: { flex: 1, minWidth: '200px' },
  myEyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', color: '#B07D62', marginBottom: '6px', letterSpacing: '0.08em' },
  myTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '500', color: '#1A1A1A', marginBottom: '4px' },
  mySub: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#6B6560' },
  myActions: { display: 'flex', gap: '8px', flexShrink: 0 },
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

function isPastDate(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

function formatCategory(category) {
  if (!category) return ''
  return category.replace(/_/g, ' ')
}

export default function CuratorPortal() {
  const [user, setUser] = useState(null)
  const [curator, setCurator] = useState(undefined)
  const [portalTab, setPortalTab] = useState('events')
  const [eventsSubTab, setEventsSubTab] = useState('add')
  const [placesType, setPlacesType] = useState('place') // 'place' | 'happening'
  const [placesViewMode, setPlacesViewMode] = useState('add') // 'add' | 'mine'

  const [eventForm, setEventForm] = useState(emptyEvent)
  const [placeForm, setPlaceForm] = useState(emptyPlace)
  const [happeningForm, setHappeningForm] = useState(emptyHappening)

  const [myEvents, setMyEvents] = useState([])
  const [myEventsLoading, setMyEventsLoading] = useState(true)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingFlyerUrl, setEditingFlyerUrl] = useState(null)

  const [myPlaces, setMyPlaces] = useState([])
  const [myPlacesLoading, setMyPlacesLoading] = useState(true)
  const [editingPlaceId, setEditingPlaceId] = useState(null)

  const [myHappenings, setMyHappenings] = useState([])
  const [myHappeningsLoading, setMyHappeningsLoading] = useState(true)
  const [editingHappeningId, setEditingHappeningId] = useState(null)

  const [sortOrder, setSortOrder] = useState('upcoming')
  const [filterCity, setFilterCity] = useState('')
  const [filterGenre, setFilterGenre] = useState('')

  const [placeFilterCity, setPlaceFilterCity] = useState('')
  const [placeFilterStyle, setPlaceFilterStyle] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
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

  useEffect(() => {
    if (user && curator?.can_places) {
      fetchMyPlaces()
      fetchMyHappenings()
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

  async function fetchMyPlaces() {
    setMyPlacesLoading(true)
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('curator_id', user.id)
      .order('created_at', { ascending: false })
    setMyPlaces(data || [])
    setMyPlacesLoading(false)
  }

  async function fetchMyHappenings() {
    setMyHappeningsLoading(true)
    const { data } = await supabase
      .from('happenings')
      .select('*')
      .eq('curator_id', user.id)
      .order('date', { ascending: true })
    setMyHappenings(data || [])
    setMyHappeningsLoading(false)
  }

  function handleEventChange(e) { setEventForm({ ...eventForm, [e.target.name]: e.target.value }) }
  function handlePlaceChange(e) { setPlaceForm({ ...placeForm, [e.target.name]: e.target.value }) }
  function handleHappeningChange(e) { setHappeningForm({ ...happeningForm, [e.target.name]: e.target.value }) }

  function handleEventCitySelect(e) {
    const match = SUPPORTED_CITIES.find(c => c.city === e.target.value)
    setEventForm({ ...eventForm, city: match ? match.city : '', country: match ? match.country : '' })
  }

  function handlePlaceCitySelect(e) {
    const match = SUPPORTED_CITIES.find(c => c.city === e.target.value)
    setPlaceForm({ ...placeForm, city: match ? match.city : '', country: match ? match.country : '' })
  }

  function handleHappeningCitySelect(e) {
    const match = SUPPORTED_CITIES.find(c => c.city === e.target.value)
    setHappeningForm({ ...happeningForm, city: match ? match.city : '', country: match ? match.country : '' })
  }

  async function processFlyerFile(file) {
    if (!file) return
    if (file.type && !file.type.startsWith('image/') && !file.type.startsWith('application/octet-stream')) return

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
          const matchedCity = matchSupportedCity(data.city)
          setEventForm(prev => ({
            ...prev,
            title: data.title || prev.title,
            venue: data.venue || prev.venue,
            address: data.address || prev.address,
            city: matchedCity ? matchedCity.city : prev.city,
            country: matchedCity ? matchedCity.country : prev.country,
            date: data.date || prev.date,
            time: data.time || prev.time,
            genre: data.genre || prev.genre,
            description: data.description || prev.description,
            ticket_url: data.ticket_url || prev.ticket_url,
          }))
          if (data.city && !matchedCity) {
            setWarning(`AI detected "${data.city}" but that's not one of our supported cities yet — please select one manually.`)
          } else {
            setWarning('')
          }
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
    if (!flyer) return { url: null, failed: false }
    const fileName = `${Date.now()}-${flyer.name}`
    const { error: uploadError } = await supabase.storage
      .from('flyers')
      .upload(fileName, flyer, { contentType: flyer.type })
    if (uploadError) {
      console.error(uploadError)
      return { url: null, failed: true }
    }
    const { data } = supabase.storage.from('flyers').getPublicUrl(fileName)
    return { url: data.publicUrl, failed: false }
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
    setWarning('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditingEvent() {
    setEditingEventId(null)
    setEditingFlyerUrl(null)
    setEventForm(emptyEvent)
    setFlyer(null)
    setFlyerPreview(null)
    setSuccess('')
    setError('')
    setWarning('')
  }

  function startEditingPlace(place) {
    setPlaceForm({
      name: place.name || '',
      category: place.category || 'restaurant',
      dining_style: place.dining_style || '',
      address: place.address || '',
      city: place.city || '',
      country: place.country || '',
      description: place.description || '',
      google_maps_url: place.google_maps_url || '',
      website: place.website || '',
    })
    setEditingPlaceId(place.id)
    setPlacesType('place')
    setPlacesViewMode('add')
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditingPlace() {
    setEditingPlaceId(null)
    setPlaceForm(emptyPlace)
    setSuccess('')
    setError('')
  }

  function startEditingHappening(happening) {
    setHappeningForm({
      title: happening.title || '',
      description: happening.description || '',
      city: happening.city || '',
      country: happening.country || '',
      date: happening.date || '',
      time: happening.time || '',
      location: happening.location || '',
      link: happening.link || '',
    })
    setEditingHappeningId(happening.id)
    setPlacesType('happening')
    setPlacesViewMode('add')
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditingHappening() {
    setEditingHappeningId(null)
    setHappeningForm(emptyHappening)
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

  async function handleDeletePlace(place) {
    const confirmed = window.confirm(`Delete "${place.name}"? This can't be undone.`)
    if (!confirmed) return
    const { error } = await supabase.from('places').delete().eq('id', place.id)
    if (error) {
      setError('Could not delete that place. Try again.')
      return
    }
    setSuccess(`"${place.name}" deleted.`)
    await fetchMyPlaces()
  }

  async function handleDeleteHappening(happening) {
    const confirmed = window.confirm(`Delete "${happening.title}"? This can't be undone.`)
    if (!confirmed) return
    const { error } = await supabase.from('happenings').delete().eq('id', happening.id)
    if (error) {
      setError('Could not delete that happening. Try again.')
      return
    }
    setSuccess(`"${happening.title}" deleted.`)
    await fetchMyHappenings()
  }

  async function handleEventSubmit(e) {
    e.preventDefault()
    if (!eventForm.city) {
      setError('Please select a city from the list.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    setWarning('')

    let flyerUrl = editingFlyerUrl
    let flyerFailed = false
    if (flyer) {
      const result = await uploadFlyer()
      if (result.url) flyerUrl = result.url
      if (result.failed) flyerFailed = true
    }

    if (editingEventId) {
      const { error } = await supabase
        .from('events')
        .update({ ...eventForm, flyer_url: flyerUrl })
        .eq('id', editingEventId)

      if (error) {
        setError('Something went wrong updating the event. Try again.')
      } else {
        setSuccess(flyerFailed ? 'Event updated, but the new flyer failed to upload — try re-uploading it.' : 'Event updated.')
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
        setSuccess(flyerFailed ? 'Event added, but the flyer failed to upload — edit the event to try again.' : 'Event added to Get Lored.')
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
    if (!placeForm.city) {
      setError('Please select a city from the list.')
      return
    }
    if (!placeForm.dining_style) {
      setError('Please select a dining style.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (editingPlaceId) {
      const { error } = await supabase
        .from('places')
        .update({ ...placeForm })
        .eq('id', editingPlaceId)

      if (error) {
        setError('Something went wrong updating the place. Try again.')
      } else {
        setSuccess('Place updated.')
        setPlaceForm(emptyPlace)
        setEditingPlaceId(null)
        await fetchMyPlaces()
        setPlacesViewMode('mine')
      }
    } else {
      const { error } = await supabase.from('places').insert([{
        ...placeForm, curator_id: user.id,
      }])
      if (error) {
        setError('Something went wrong. Try again.')
      } else {
        setSuccess('Place added to Get Lored.')
        setPlaceForm(emptyPlace)
        await fetchMyPlaces()
      }
    }
    setSubmitting(false)
  }

  async function handleHappeningSubmit(e) {
    e.preventDefault()
    if (!happeningForm.city) {
      setError('Please select a city from the list.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (editingHappeningId) {
      const { error } = await supabase
        .from('happenings')
        .update({ ...happeningForm })
        .eq('id', editingHappeningId)

      if (error) {
        setError('Something went wrong updating the happening. Try again.')
      } else {
        setSuccess('Happening updated.')
        setHappeningForm(emptyHappening)
        setEditingHappeningId(null)
        await fetchMyHappenings()
        setPlacesViewMode('mine')
      }
    } else {
      const { error } = await supabase.from('happenings').insert([{
        ...happeningForm, curator_id: user.id, status: 'published',
      }])
      if (error) {
        setError('Something went wrong. Try again.')
      } else {
        setSuccess('Happening added to Get Lored.')
        setHappeningForm(emptyHappening)
        await fetchMyHappenings()
      }
    }
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

  const myEventCities = [...new Set(myEvents.map(e => e.city).filter(Boolean))]
  const myEventGenres = [...new Set(myEvents.map(e => e.genre).filter(Boolean))]

  let visibleEvents = myEvents.filter(e => {
    if (filterCity && e.city !== filterCity) return false
    if (filterGenre && e.genre !== filterGenre) return false
    return true
  })

  visibleEvents = [...visibleEvents].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    if (sortOrder === 'upcoming') return dateA - dateB
    if (sortOrder === 'newest') return dateB - dateA
    if (sortOrder === 'az') return (a.title || '').localeCompare(b.title || '')
    return 0
  })

  const hasActiveEventFilters = filterCity || filterGenre || sortOrder !== 'upcoming'

  const myPlaceCities = [...new Set(myPlaces.map(p => p.city).filter(Boolean))]
  const myPlaceStyles = [...new Set(myPlaces.map(p => p.dining_style).filter(Boolean))]

  const visiblePlaces = myPlaces.filter(p => {
    if (placeFilterCity && p.city !== placeFilterCity) return false
    if (placeFilterStyle && p.dining_style !== placeFilterStyle) return false
    return true
  })

  const hasActivePlaceFilters = placeFilterCity || placeFilterStyle

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
            onClick={() => { setPortalTab('events'); setSuccess(''); setError(''); setWarning('') }}
          >
            Events
          </button>
          <button
            style={portalTab === 'places' ? { ...s.portalTab, ...s.portalTabActive } : s.portalTab}
            onClick={() => { setPortalTab('places'); setSuccess(''); setError(''); setWarning('') }}
          >
            Places & Happenings
          </button>
        </div>
      )}

      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}
      {warning && <p style={s.warning}>{warning}</p>}

      {portalTab === 'events' && curator.can_events && (
        <>
          <div style={s.subTabs}>
            <button
              style={eventsSubTab === 'add' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setEventsSubTab('add'); setSuccess(''); setError(''); setWarning('') }}
            >
              {editingEventId ? 'Editing event' : 'Add event'}
            </button>
            <button
              style={eventsSubTab === 'mine' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setEventsSubTab('mine'); setSuccess(''); setError(''); setWarning('') }}
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
                    <select style={s.select} value={eventForm.city} onChange={handleEventCitySelect} required>
                      <option value="">Select city</option>
                      {SUPPORTED_CITIES.map(c => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Country</label>
                    <input style={s.inputDisabled} value={eventForm.country} placeholder="Auto-filled" disabled />
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
                    <button type="button" style={s.cancelEditBtn} onClick={cancelEditingEvent}>
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
              <>
                <div style={s.filterBar}>
                  <div style={s.filterGroup}>
                    <label style={s.filterLabel}>Sort by</label>
                    <select style={s.filterSelect} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="upcoming">Upcoming first</option>
                      <option value="newest">Furthest out first</option>
                      <option value="az">A–Z</option>
                    </select>
                  </div>
                  <div style={s.filterGroup}>
                    <label style={s.filterLabel}>City</label>
                    <select style={s.filterSelect} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                      <option value="">All cities</option>
                      {myEventCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={s.filterGroup}>
                    <label style={s.filterLabel}>Genre</label>
                    <select style={s.filterSelect} value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
                      <option value="">All genres</option>
                      {myEventGenres.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  {hasActiveEventFilters && (
                    <button
                      style={s.filterClear}
                      onClick={() => { setFilterCity(''); setFilterGenre(''); setSortOrder('upcoming') }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <p style={s.resultsCount}>{visibleEvents.length} event{visibleEvents.length !== 1 ? 's' : ''}</p>

                {visibleEvents.length === 0 ? (
                  <p style={s.emptyState}>No events match those filters.</p>
                ) : (
                  <div style={s.myList}>
                    {visibleEvents.map(evt => (
                      <div key={evt.id} style={isPastDate(evt.date) ? { ...s.myCard, ...s.myCardPast } : s.myCard}>
                        <div style={s.myInfo}>
                          <p style={s.myEyebrow}>{formatDate(evt.date)}{isPastDate(evt.date) ? ' · Past' : ''}</p>
                          <h3 style={s.myTitle}>{evt.title}</h3>
                          <p style={s.mySub}>{evt.venue}{evt.city ? ` · ${evt.city}` : ''}{evt.genre ? ` · ${evt.genre}` : ''}</p>
                        </div>
                        <div style={s.myActions}>
                          <button style={s.editBtn} onClick={() => startEditingEvent(evt)}>Edit</button>
                          <button style={s.deleteBtn} onClick={() => handleDeleteEvent(evt)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          )}
        </>
      )}

      {portalTab === 'places' && curator.can_places && (
        <>
          <div style={s.subTabs}>
            <button
              style={placesType === 'place' && placesViewMode === 'add' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesType('place'); setPlacesViewMode('add'); setSuccess(''); setError(''); setWarning('') }}
            >
              {editingPlaceId ? 'Editing place' : 'Add a place'}
            </button>
            <button
              style={placesType === 'place' && placesViewMode === 'mine' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesType('place'); setPlacesViewMode('mine'); setSuccess(''); setError(''); setWarning('') }}
            >
              My Places ({myPlaces.length})
            </button>
            <button
              style={placesType === 'happening' && placesViewMode === 'add' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesType('happening'); setPlacesViewMode('add'); setSuccess(''); setError(''); setWarning('') }}
            >
              {editingHappeningId ? 'Editing happening' : 'Add a happening'}
            </button>
            <button
              style={placesType === 'happening' && placesViewMode === 'mine' ? { ...s.subTab, ...s.subTabActive } : s.subTab}
              onClick={() => { setPlacesType('happening'); setPlacesViewMode('mine'); setSuccess(''); setError(''); setWarning('') }}
            >
              My Happenings ({myHappenings.length})
            </button>
          </div>

          {placesType === 'place' && placesViewMode === 'add' && (
            <>
              {editingPlaceId && (
                <p style={s.editingBanner}>Editing "{placeForm.name || 'this place'}". Changes will update the existing listing.</p>
              )}
              <form style={s.form} onSubmit={handlePlaceSubmit}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Name</label>
                  <input style={s.input} name="name" value={placeForm.name} onChange={handlePlaceChange} placeholder="Place name" required />
                </div>
                <div style={s.row}>
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
                    <label style={s.label}>Dining style</label>
                    <select style={s.select} name="dining_style" value={placeForm.dining_style} onChange={handlePlaceChange} required>
                      <option value="">Select style</option>
                      {DINING_STYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Address</label>
                  <input style={s.input} name="address" value={placeForm.address} onChange={handlePlaceChange} placeholder="Full address" />
                </div>
                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>City</label>
                    <select style={s.select} value={placeForm.city} onChange={handlePlaceCitySelect} required>
                      <option value="">Select city</option>
                      {SUPPORTED_CITIES.map(c => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Country</label>
                    <input style={s.inputDisabled} value={placeForm.country} placeholder="Auto-filled" disabled />
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
                <div style={s.formButtonRow}>
                  <button type="submit" style={s.button} disabled={submitting}>
                    {submitting ? 'Saving...' : editingPlaceId ? 'Save changes' : 'Add place'}
                  </button>
                  {editingPlaceId && (
                    <button type="button" style={s.cancelEditBtn} onClick={cancelEditingPlace}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {placesType === 'place' && placesViewMode === 'mine' && (
            myPlacesLoading ? (
              <p style={s.emptyState}>Loading your places...</p>
            ) : myPlaces.length === 0 ? (
              <p style={s.emptyState}>You haven't added any places yet.</p>
            ) : (
              <>
                <div style={s.filterBar}>
                  <div style={s.filterGroup}>
                    <label style={s.filterLabel}>City</label>
                    <select style={s.filterSelect} value={placeFilterCity} onChange={(e) => setPlaceFilterCity(e.target.value)}>
                      <option value="">All cities</option>
                      {myPlaceCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={s.filterGroup}>
                    <label style={s.filterLabel}>Dining style</label>
                    <select style={s.filterSelect} value={placeFilterStyle} onChange={(e) => setPlaceFilterStyle(e.target.value)}>
                      <option value="">All styles</option>
                      {myPlaceStyles.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  {hasActivePlaceFilters && (
                    <button
                      style={s.filterClear}
                      onClick={() => { setPlaceFilterCity(''); setPlaceFilterStyle('') }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <p style={s.resultsCount}>{visiblePlaces.length} place{visiblePlaces.length !== 1 ? 's' : ''}</p>

                {visiblePlaces.length === 0 ? (
                  <p style={s.emptyState}>No places match those filters.</p>
                ) : (
                  <div style={s.myList}>
                    {visiblePlaces.map(place => (
                      <div key={place.id} style={s.myCard}>
                        <div style={s.myInfo}>
                          <p style={s.myEyebrow}>{place.dining_style || formatCategory(place.category)}</p>
                          <h3 style={s.myTitle}>{place.name}</h3>
                          <p style={s.mySub}>{place.city}{place.address ? ` · ${place.address}` : ''}</p>
                        </div>
                        <div style={s.myActions}>
                          <button style={s.editBtn} onClick={() => startEditingPlace(place)}>Edit</button>
                          <button style={s.deleteBtn} onClick={() => handleDeletePlace(place)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          )}

          {placesType === 'happening' && placesViewMode === 'add' && (
            <>
              {editingHappeningId && (
                <p style={s.editingBanner}>Editing "{happeningForm.title || 'this happening'}". Changes will update the existing listing.</p>
              )}
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
                    <select style={s.select} value={happeningForm.city} onChange={handleHappeningCitySelect} required>
                      <option value="">Select city</option>
                      {SUPPORTED_CITIES.map(c => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Country</label>
                    <input style={s.inputDisabled} value={happeningForm.country} placeholder="Auto-filled" disabled />
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
                <div style={s.formButtonRow}>
                  <button type="submit" style={s.button} disabled={submitting}>
                    {submitting ? 'Saving...' : editingHappeningId ? 'Save changes' : 'Add happening'}
                  </button>
                  {editingHappeningId && (
                    <button type="button" style={s.cancelEditBtn} onClick={cancelEditingHappening}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {placesType === 'happening' && placesViewMode === 'mine' && (
            myHappeningsLoading ? (
              <p style={s.emptyState}>Loading your happenings...</p>
            ) : myHappenings.length === 0 ? (
              <p style={s.emptyState}>You haven't added any happenings yet.</p>
            ) : (
              <div style={s.myList}>
                {myHappenings.map(h => (
                  <div key={h.id} style={isPastDate(h.date) ? { ...s.myCard, ...s.myCardPast } : s.myCard}>
                    <div style={s.myInfo}>
                      <p style={s.myEyebrow}>{formatDate(h.date)}{h.time ? ` · ${h.time}` : ''}{isPastDate(h.date) ? ' · Past' : ''}</p>
                      <h3 style={s.myTitle}>{h.title}</h3>
                      <p style={s.mySub}>{h.location}{h.city ? ` · ${h.city}` : ''}</p>
                    </div>
                    <div style={s.myActions}>
                      <button style={s.editBtn} onClick={() => startEditingHappening(h)}>Edit</button>
                      <button style={s.deleteBtn} onClick={() => handleDeleteHappening(h)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </main>
  )
}