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
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [curators, setCurators] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        checkAdmin(session.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function checkAdmin(userId) {
    try {
      const { data } = await supabase
        .from('curators')
        .select('role, approved')
        .eq('user_id', userId)
        .single()
      const admin = data?.role === 'admin' && data?.approved === true
      setIsAdmin(admin)
      if (admin) {
        await fetchRequests()
        await fetchCurators()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchRequests() {
    const { data } = await supabase
      .from('curator_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setRequests(data || [])
  }

  async function fetchCurators() {
    const { data } = await supabase
      .from('curators')
      .select('*')
      .order('created_at', { ascending: false })
    setCurators(data || [])
  }

  async function handleApprove(request) {
    const { error } = await supabase.from('curators').insert([{
      user_id: request.user_id,
      name: request.name,
      city: request.city,
      instagram: request.instagram,
      approved: true,
      role: 'curator',
      can_events: !!request.wants_events,
      can_places: !!request.wants_places,
    }])
    if (!error) {
      await supabase.from('curator_requests').update({ status: 'approved' }).eq('id', request.id)
      setSuccessMsg(`${request.name} approved.`)
      fetchRequests()
      fetchCurators()
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  async function handleReject(request) {
    await supabase.from('curator_requests').update({ status: 'rejected' }).eq('id', request.id)
    setSuccessMsg(`${request.name}'s request rejected.`)
    fetchRequests()
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  async function handleTogglePortal(curator, field) {
    const { error } = await supabase
      .from('curators')
      .update({ [field]: !curator[field] })
      .eq('id', curator.id)
    if (!error) {
      setSuccessMsg(`${curator.name}'s access updated.`)
      fetchCurators()
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <p style={s.loading}>Loading dashboard...</p>

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
        <button style={s.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>

      {successMsg && <p style={s.success}>{successMsg}</p>}

      <div style={s.tabs}>
        {['requests', 'curators'].map(tab => (
          <button
            key={tab}
            style={activeTab === tab ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'requests' ? `Pending requests (${requests.length})` : `Curators (${curators.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'requests' ? (
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
                <tr key={r.id}>
                  <td style={s.td}>{r.name}</td>
                  <td style={s.td}>{r.email}</td>
                  <td style={s.td}>{r.city}</td>
                  <td style={s.tdMuted}>{r.instagram}</td>
                  <td style={s.td}>
                    {r.wants_events && <span style={{ ...s.badge, ...s.badgeEvents }}>Events</span>}
                    {r.wants_places && <span style={{ ...s.badge, ...s.badgePlaces }}>Places</span>}
                  </td>
                  <td style={s.td}><div style={s.why}>{r.why}</div></td>
                  <td style={s.td}>
                    <button style={s.approveBtn} onClick={() => handleApprove(r)}>Approve</button>
                    <button style={s.rejectBtn} onClick={() => handleReject(r)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
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
                <tr key={c.id}>
                  <td style={s.td}>{c.name}</td>
                  <td style={s.td}>{c.city}</td>
                  <td style={s.tdMuted}>{c.instagram}</td>
                  <td style={s.td}>{c.role}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(c.can_events ? s.badgeApproved : s.badgePending) }}>
                      Events: {c.can_events ? 'On' : 'Off'}
                    </span>
                    <span style={{ ...s.badge, ...(c.can_places ? s.badgeApproved : s.badgePending) }}>
                      Places: {c.can_places ? 'On' : 'Off'}
                    </span>
                  </td>
                  <td style={s.td}>
                    {c.role !== 'admin' && (
                      <>
                        <button style={s.revokeBtn} onClick={() => handleTogglePortal(c, 'can_events')}>
                          {c.can_events ? 'Revoke Events' : 'Grant Events'}
                        </button>
                        <button style={s.revokeBtn} onClick={() => handleTogglePortal(c, 'can_places')}>
                          {c.can_places ? 'Revoke Places' : 'Grant Places'}
                        </button>
                      </>
                    )}
                    {c.role === 'admin' && <span style={s.tdMuted}>Admin</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </main>
  )
}