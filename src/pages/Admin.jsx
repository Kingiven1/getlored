import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '64px 32px' },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', marginBottom: '48px', lineHeight: '1.6' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  signOutBtn: { padding: '8px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', borderRadius: '2px', cursor: 'pointer' },
  tabs: { display: 'flex', borderBottom: '1px solid #E8E4DE', marginBottom: '40px' },
  tab: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 24px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  tabActive: { color: '#1A1A1A', borderBottom: '2px solid #1A1A1A' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #E8E4DE' },
  td: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#1A1A1A', padding: '16px', borderBottom: '1px solid #F2EEE9', verticalAlign: 'top' },
  tdMuted: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#9B9590', padding: '16px', borderBottom: '1px solid #F2EEE9', verticalAlign: 'top' },
  approveBtn: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginRight: '8px' },
  rejectBtn: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer' },
  revokeBtn: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', borderRadius: '2px', cursor: 'pointer', marginRight: '6px', marginBottom: '4px' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '4px', marginBottom: '4px' },
  badgeApproved: { backgroundColor: '#EDFAF3', color: '#27AE60' },
  badgePending: { backgroundColor: '#FEF9E7', color: '#8B6914' },
  badgeEvents: { backgroundColor: '#F0EAFB', color: '#6B3FA0' },
  badgePlaces: { backgroundColor: '#EAF2FB', color: '#2C6FA0' },
  empty: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '48px 0' },
  gate: { textAlign: 'center', padding: '120px 32px' },
  gateHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  gateSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560' },
  loading: { textAlign: 'center', padding: '120px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590' },
  why: { maxWidth: '260px', whiteSpace: 'pre-wrap', lineHeight: '1.5' },
  success: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#27AE60', backgroundColor: '#EDFAF3', padding: '12px 16px', borderRadius: '2px', border: '1px solid #B7EAD0', marginBottom: '24px' },
  errorMsg: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C0392B', backgroundColor: '#FDF0EE', padding: '12px 16px', borderRadius: '2px', border: '1px solid #F5C6C0', marginBottom: '24px' },
}

function RequestRow({ request, onApprove, onReject }) {
  return (
    <tr>
      <td style={s.td}>{request.name}</td>
      <td style={s.td}>{request.email}</td>
      <td style={s.td}>{request.city}</td>
      <td style={s.tdMuted}>{request.instagram}</td>
      <td style={s.td}>
        {request.wants_events && <span style={{ ...s.badge, ...s.badgeEvents }}>Events</span>}
        {request.wants_places && <span style={{ ...s.badge, ...s.badgePlaces }}>Places</span>}
      </td>
      <td style={s.td}><div style={s.why}>{request.why}</div></td>
      <td style={s.td}>
        <button type="button" style={s.approveBtn} onClick={() => onApprove(request)}>Approve</button>
        <button type="button" style={s.rejectBtn} onClick={() => onReject(request)}>Reject</button>
      </td>
    </tr>
  )
}

function CuratorRow({ curator, onTogglePortal }) {
  const isAdmin = curator.role === 'admin'
  return (
    <tr>
      <td style={s.td}>{curator.name}</td>
      <td style={s.td}>{curator.city}</td>
      <td style={s.tdMuted}>{curator.instagram}</td>
      <td style={s.td}>{curator.role}</td>
      <td style={s.td}>
        <span style={{ ...s.badge, ...(curator.can_events ? s.badgeApproved : s.badgePending) }}>
          Events: {curator.can_events ? 'On' : 'Off'}
        </span>
        <span style={{ ...s.badge, ...(curator.can_places ? s.badgeApproved : s.badgePending) }}>
          Places: {curator.can_places ? 'On' : 'Off'}
        </span>
      </td>
      <td style={s.td}>
        {isAdmin ? (
          <span style={s.tdMuted}>Admin</span>
        ) : (
          <>
            <button type="button" style={s.revokeBtn} onClick={() => onTogglePortal(curator, 'can_events')}>
              {curator.can_events ? 'Revoke Events' : 'Grant Events'}
            </button>
            <button type="button" style={s.revokeBtn} onClick={() => onTogglePortal(curator, 'can_places')}>
              {curator.can_places ? 'Revoke Places' : 'Grant Places'}
            </button>
          </>
        )}
      </td>
    </tr>
  )
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [curators, setCurators] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!active) return

      if (!session?.user) {
        setLoading(false)
        return
      }

      setUser(session.user)

      const { data: curatorRow } = await supabase
        .from('curators')
        .select('role, approved')
        .eq('user_id', session.user.id)
        .single()

      if (!active) return

      const admin = curatorRow?.role === 'admin' && curatorRow?.approved === true
      setIsAdmin(admin)

      if (admin) {
        await Promise.all([fetchRequests(), fetchCurators()])
      }

      setLoading(false)
    }

    init()
    return () => { active = false }
  }, [])

  async function fetchRequests() {
    const { data, error } = await supabase
      .from('curator_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return }
    setRequests(data || [])
  }

  async function fetchCurators() {
    const { data, error } = await supabase
      .from('curators')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return }
    setCurators(data || [])
  }

  function flashSuccess(msg) {
    setSuccessMsg(msg)
    setErrorMsg('')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function flashError(msg) {
    setErrorMsg(msg)
    setSuccessMsg('')
    setTimeout(() => setErrorMsg(''), 4000)
  }

  async function handleApprove(request) {
    const { error: insertError } = await supabase.from('curators').insert([{
      user_id: request.user_id,
      name: request.name,
      city: request.city,
      instagram: request.instagram,
      approved: true,
      role: 'curator',
      can_events: !!request.wants_events,
      can_places: !!request.wants_places,
    }])

    if (insertError) {
      flashError(`Could not approve ${request.name}: ${insertError.message}`)
      return
    }

    const { error: updateError } = await supabase
      .from('curator_requests')
      .update({ status: 'approved' })
      .eq('id', request.id)

    if (updateError) {
      flashError(`Approved curator but failed to update request status.`)
      return
    }

    flashSuccess(`${request.name} approved.`)
    await Promise.all([fetchRequests(), fetchCurators()])
  }

  async function handleReject(request) {
    const { error } = await supabase
      .from('curator_requests')
      .update({ status: 'rejected' })
      .eq('id', request.id)

    if (error) {
      flashError(`Could not reject ${request.name}: ${error.message}`)
      return
    }

    flashSuccess(`${request.name}'s request rejected.`)
    await fetchRequests()
  }

  async function handleTogglePortal(curator, field) {
    const { error } = await supabase
      .from('curators')
      .update({ [field]: !curator[field] })
      .eq('id', curator.id)

    if (error) {
      flashError(`Could not update ${curator.name}'s access.`)
      return
    }

    flashSuccess(`${curator.name}'s access updated.`)
    await fetchCurators()
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return <p style={s.loading}>Loading dashboard...</p>
  }

  if (!user || !isAdmin) {
    return (
      <div style={s.gate}>
        <h2 style={s.gateHeadline}>Access denied.</h2>
        <p style={s.gateSub}>This page is for admins only.</p>
      </div>
    )
  }

  return (
    <main style={s.page}>
      <div style={s.topRow}>
        <div>
          <p style={s.eyebrow}>Admin</p>
          <h1 style={s.headline}>Dashboard.</h1>
          <p style={s.sub}>Manage curator requests and approved curators.</p>
        </div>
        <button type="button" style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>

      {successMsg && <p style={s.success}>{successMsg}</p>}
      {errorMsg && <p style={s.errorMsg}>{errorMsg}</p>}

      <div style={s.tabs}>
        <button
          type="button"
          style={activeTab === 'requests' ? { ...s.tab, ...s.tabActive } : s.tab}
          onClick={() => setActiveTab('requests')}
        >
          Pending requests ({requests.length})
        </button>
        <button
          type="button"
          style={activeTab === 'curators' ? { ...s.tab, ...s.tabActive } : s.tab}
          onClick={() => setActiveTab('curators')}
        >
          Curators ({curators.length})
        </button>
      </div>

      {activeTab === 'requests' && (
        requests.length === 0 ? (
          <p style={s.empty}>No pending requests.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>City</th>
                <th style={s.th}>Instagram</th>
                <th style={s.th}>Applying for</th>
                <th style={s.th}>Why</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <RequestRow key={r.id} request={r} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </tbody>
          </table>
        )
      )}

      {activeTab === 'curators' && (
        curators.length === 0 ? (
          <p style={s.empty}>No curators yet.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>City</th>
                <th style={s.th}>Instagram</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Portal access</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {curators.map(c => (
                <CuratorRow key={c.id} curator={c} onTogglePortal={handleTogglePortal} />
              ))}
            </tbody>
          </table>
        )
      )}
    </main>
  )
}