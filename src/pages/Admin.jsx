import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '48px', lineHeight: '1.6' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  signOutButton: { padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  tabRow: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '40px' },
  tabButton: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  tabButtonActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #E8E4DE' },
  td: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1A1A1A', padding: '16px', borderBottom: '1px solid #F2EEE9', verticalAlign: 'top' },
  tdMuted: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', padding: '16px', borderBottom: '1px solid #F2EEE9', verticalAlign: 'top' },
  approveButton: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginRight: '8px' },
  rejectButton: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer' },
  toggleButton: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer', marginRight: '6px', marginBottom: '4px' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '4px', marginBottom: '4px' },
  badgeOn: { backgroundColor: '#EDFAF3', color: '#27AE60' },
  badgeOff: { backgroundColor: '#FEF9E7', color: '#8B6914' },
  badgeEvents: { backgroundColor: '#F0EAFB', color: '#6B3FA0' },
  badgePlaces: { backgroundColor: '#EAF2FB', color: '#2C6FA0' },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '48px 0' },
  deniedWrap: { textAlign: 'center', padding: '120px 32px' },
  deniedHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  deniedSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560' },
  loadingWrap: { textAlign: 'center', padding: '120px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590' },
  whyCell: { maxWidth: '260px', whiteSpace: 'pre-wrap', lineHeight: '1.5' },
  banner: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 16px', borderRadius: '2px', marginBottom: '24px' },
  bannerSuccess: { color: '#27AE60', backgroundColor: '#EDFAF3', border: '1px solid #B7EAD0' },
  bannerError: { color: '#C0392B', backgroundColor: '#FDF0EE', border: '1px solid #F5C6C0' },
}

function formatWhen(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  } catch {
    return ''
  }
}

function PendingRequestsTable({ rows, busyId, onApprove, onReject }) {
  if (rows.length === 0) {
    return <p style={styles.emptyState}>No pending requests.</p>
  }
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>City</th>
          <th style={styles.th}>Instagram</th>
          <th style={styles.th}>Applying for</th>
          <th style={styles.th}>Why</th>
          <th style={styles.th}>Submitted</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td style={styles.td}>{row.name}</td>
            <td style={styles.td}>{row.email}</td>
            <td style={styles.td}>{row.city}</td>
            <td style={styles.tdMuted}>{row.instagram}</td>
            <td style={styles.td}>
              {row.wants_events ? <span style={{ ...styles.badge, ...styles.badgeEvents }}>Events</span> : null}
              {row.wants_places ? <span style={{ ...styles.badge, ...styles.badgePlaces }}>Places</span> : null}
            </td>
            <td style={styles.td}><div style={styles.whyCell}>{row.why}</div></td>
            <td style={styles.tdMuted}>{formatWhen(row.created_at)}</td>
            <td style={styles.td}>
              <button
                type="button"
                style={styles.approveButton}
                disabled={busyId === row.id}
                onClick={() => onApprove(row)}
              >
                {busyId === row.id ? 'Working...' : 'Approve'}
              </button>
              <button
                type="button"
                style={styles.rejectButton}
                disabled={busyId === row.id}
                onClick={() => onReject(row)}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CuratorsTable({ rows, busyId, onTogglePortal }) {
  if (rows.length === 0) {
    return <p style={styles.emptyState}>No curators yet.</p>
  }
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={styles.th}>City</th>
          <th style={styles.th}>Instagram</th>
          <th style={styles.th}>Role</th>
          <th style={styles.th}>Portal access</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const isAdminRow = row.role === 'admin'
          return (
            <tr key={row.id}>
              <td style={styles.td}>{row.name}</td>
              <td style={styles.td}>{row.city}</td>
              <td style={styles.tdMuted}>{row.instagram}</td>
              <td style={styles.td}>{row.role}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(row.can_events ? styles.badgeOn : styles.badgeOff) }}>
                  Events: {row.can_events ? 'On' : 'Off'}
                </span>
                <span style={{ ...styles.badge, ...(row.can_places ? styles.badgeOn : styles.badgeOff) }}>
                  Places: {row.can_places ? 'On' : 'Off'}
                </span>
              </td>
              <td style={styles.td}>
                {isAdminRow ? (
                  <span style={styles.tdMuted}>Admin</span>
                ) : (
                  <>
                    <button
                      type="button"
                      style={styles.toggleButton}
                      disabled={busyId === row.id}
                      onClick={() => onTogglePortal(row, 'can_events')}
                    >
                      {row.can_events ? 'Revoke Events' : 'Grant Events'}
                    </button>
                    <button
                      type="button"
                      style={styles.toggleButton}
                      disabled={busyId === row.id}
                      onClick={() => onTogglePortal(row, 'can_places')}
                    >
                      {row.can_places ? 'Revoke Places' : 'Grant Places'}
                    </button>
                  </>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function Admin() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState('checking')
  const [activeTab, setActiveTab] = useState('requests')
  const [pendingRequests, setPendingRequests] = useState([])
  const [curators, setCurators] = useState([])
  const [banner, setBanner] = useState(null)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const sessionResult = await supabase.auth.getSession()
      const sessionUser = sessionResult.data.session?.user

      if (!sessionUser) {
        if (!cancelled) setPhase('denied')
        return
      }

      const curatorResult = await supabase
        .from('curators')
        .select('role, approved')
        .eq('user_id', sessionUser.id)
        .maybeSingle()

      const isAdminUser = curatorResult.data?.role === 'admin' && curatorResult.data?.approved === true

      if (!isAdminUser) {
        if (!cancelled) setPhase('denied')
        return
      }

      const [requestsResult, curatorsResult] = await Promise.all([
        supabase.from('curator_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('curators').select('*').order('created_at', { ascending: false }),
      ])

      if (cancelled) return

      setPendingRequests(requestsResult.data || [])
      setCurators(curatorsResult.data || [])
      setPhase('ready')
    }

    bootstrap()
    return () => { cancelled = true }
  }, [])

  function showBanner(type, text) {
    setBanner({ type, text })
    setTimeout(() => setBanner(null), 3500)
  }

  async function refreshRequests() {
    const result = await supabase
      .from('curator_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setPendingRequests(result.data || [])
  }

  async function refreshCurators() {
    const result = await supabase
      .from('curators')
      .select('*')
      .order('created_at', { ascending: false })
    setCurators(result.data || [])
  }

  async function handleApprove(request) {
    setBusyId(request.id)
    const insertResult = await supabase.from('curators').insert([{
      user_id: request.user_id,
      name: request.name,
      city: request.city,
      instagram: request.instagram,
      approved: true,
      role: 'curator',
      can_events: Boolean(request.wants_events),
      can_places: Boolean(request.wants_places),
    }])

    if (insertResult.error) {
      showBanner('error', `Could not approve ${request.name}: ${insertResult.error.message}`)
      setBusyId(null)
      return
    }

    const updateResult = await supabase
      .from('curator_requests')
      .update({ status: 'approved' })
      .eq('id', request.id)

    if (updateResult.error) {
      showBanner('error', `${request.name} was added as a curator, but the request status failed to update.`)
      setBusyId(null)
      return
    }

    showBanner('success', `${request.name} approved.`)
    await Promise.all([refreshRequests(), refreshCurators()])
    setBusyId(null)
  }

  async function handleReject(request) {
    setBusyId(request.id)
    const result = await supabase
      .from('curator_requests')
      .update({ status: 'rejected' })
      .eq('id', request.id)

    if (result.error) {
      showBanner('error', `Could not reject ${request.name}: ${result.error.message}`)
      setBusyId(null)
      return
    }

    showBanner('success', `${request.name}'s request rejected.`)
    await refreshRequests()
    setBusyId(null)
  }

  async function handleTogglePortal(curator, field) {
    setBusyId(curator.id)
    const result = await supabase
      .from('curators')
      .update({ [field]: !curator[field] })
      .eq('id', curator.id)

    if (result.error) {
      showBanner('error', `Could not update ${curator.name}'s access.`)
      setBusyId(null)
      return
    }

    showBanner('success', `${curator.name}'s access updated.`)
    await refreshCurators()
    setBusyId(null)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (phase === 'checking') {
    return <p style={styles.loadingWrap}>Loading dashboard...</p>
  }

  if (phase === 'denied') {
    return (
      <div style={styles.deniedWrap}>
        <h2 style={styles.deniedHeadline}>Access denied.</h2>
        <p style={styles.deniedSub}>This page is for admins only.</p>
      </div>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <p style={styles.eyebrow}>Admin</p>
          <h1 style={styles.headline}>Dashboard.</h1>
          <p style={styles.sub}>Manage curator requests and approved curators.</p>
        </div>
        <button type="button" style={styles.signOutButton} onClick={handleSignOut}>Sign out</button>
      </div>

      {banner && (
        <p style={{ ...styles.banner, ...(banner.type === 'success' ? styles.bannerSuccess : styles.bannerError) }}>
          {banner.text}
        </p>
      )}

      <div style={styles.tabRow}>
        <button
          type="button"
          style={activeTab === 'requests' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onClick={() => setActiveTab('requests')}
        >
          Pending requests ({pendingRequests.length})
        </button>
        <button
          type="button"
          style={activeTab === 'curators' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onClick={() => setActiveTab('curators')}
        >
          Curators ({curators.length})
        </button>
      </div>

      {activeTab === 'requests' && (
        <PendingRequestsTable
          rows={pendingRequests}
          busyId={busyId}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {activeTab === 'curators' && (
        <CuratorsTable
          rows={curators}
          busyId={busyId}
          onTogglePortal={handleTogglePortal}
        />
      )}
    </main>
  )
}