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
  adminButton: { padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B3FA0', backgroundColor: 'transparent', border: '1px solid #6B3FA0', borderRadius: '2px', cursor: 'pointer', marginRight: '6px', marginBottom: '4px' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '4px', marginBottom: '4px' },
  badgeOn: { backgroundColor: '#EDFAF3', color: '#27AE60' },
  badgeOff: { backgroundColor: '#FEF9E7', color: '#8B6914' },
  badgeAdmin: { backgroundColor: '#F0EAFB', color: '#6B3FA0' },
  emptyState: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', color: '#9B9590', textAlign: 'center', padding: '48px 0' },
  deniedWrap: { textAlign: 'center', padding: '120px 32px' },
  deniedHeadline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontStyle: 'italic', color: '#1A1A1A', marginBottom: '16px' },
  deniedSub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560' },
  loadingWrap: { textAlign: 'center', padding: '120px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590' },
  whyCell: { maxWidth: '260px', whiteSpace: 'pre-wrap', lineHeight: '1.5' },
  banner: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '12px 16px', borderRadius: '2px', marginBottom: '24px' },
  bannerSuccess: { color: '#27AE60', backgroundColor: '#EDFAF3', border: '1px solid #B7EAD0' },
  bannerError: { color: '#C0392B', backgroundColor: '#FDF0EE', border: '1px solid #F5C6C0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2px', marginBottom: '48px' },
  statCard: { backgroundColor: '#F2EEE9', padding: '24px' },
  statNumber: { fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: '500', color: '#1A1A1A', lineHeight: '1' },
  statLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9590', marginTop: '8px' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px', marginTop: '0' },
  sectionSubhead: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '300', color: '#9B9590', marginBottom: '20px', marginTop: '-16px' },
  vercelLink: { display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9B9590', border: '1px solid #E8E4DE', backgroundColor: 'transparent', padding: '8px 16px', borderRadius: '2px', marginBottom: '48px' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  activityRow: { backgroundColor: '#F2EEE9', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  activityLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  activityType: { display: 'inline-block', padding: '3px 10px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: '#FDF8F5', color: '#B07D62', border: '1px solid #E8D5C4' },
  activityTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#1A1A1A' },
  activityWhen: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590' },
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
              {row.wants_events ? <span style={{ ...styles.badge, ...styles.badgeOn }}>Events</span> : null}
              {row.wants_places ? <span style={{ ...styles.badge, ...styles.badgeOn }}>Places</span> : null}
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

function CuratorsTable({ rows, busyId, onTogglePortal, onToggleAdmin, currentUserId }) {
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
          const isSelf = row.user_id === currentUserId
          return (
            <tr key={row.id}>
              <td style={styles.td}>{row.name}</td>
              <td style={styles.td}>{row.city}</td>
              <td style={styles.tdMuted}>{row.instagram}</td>
              <td style={styles.td}>
                {isAdminRow ? <span style={{ ...styles.badge, ...styles.badgeAdmin }}>Admin</span> : 'Curator'}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(row.can_events ? styles.badgeOn : styles.badgeOff) }}>
                  Events: {row.can_events ? 'On' : 'Off'}
                </span>
                <span style={{ ...styles.badge, ...(row.can_places ? styles.badgeOn : styles.badgeOff) }}>
                  Places: {row.can_places ? 'On' : 'Off'}
                </span>
              </td>
              <td style={styles.td}>
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
                {isSelf ? (
                  <span style={styles.tdMuted}>Can't change own admin status</span>
                ) : (
                  <button
                    type="button"
                    style={styles.adminButton}
                    disabled={busyId === row.id}
                    onClick={() => onToggleAdmin(row)}
                  >
                    {isAdminRow ? 'Remove Admin' : 'Make Admin'}
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function StatsPanel({ stats, statsLoading, approvedCuratorCount }) {
  if (statsLoading) {
    return <p style={styles.emptyState}>Loading stats...</p>
  }
  if (!stats) {
    return <p style={styles.emptyState}>Could not load stats.</p>
  }

  const trafficCards = [
    { label: 'Total Page Views (all-time)', value: stats.totalPageViews },
    { label: 'Unique Visitors (7 days)', value: stats.uniqueVisitorsWeek },
    { label: 'Unique Visitors (30 days)', value: stats.uniqueVisitorsMonth },
    { label: 'Unique Visitors (90 days)', value: stats.uniqueVisitors90d },
  ]

  const contentCards = [
    { label: 'Events', value: stats.eventsTotal },
    { label: 'Places', value: stats.placesTotal },
    { label: 'Happenings', value: stats.happeningsTotal },
    { label: 'DJ Curators', value: stats.djsTotal },
    { label: 'Approved Curators', value: approvedCuratorCount },
    { label: 'Newsletter Signups', value: stats.signupsTotal },
    { label: 'Signups (7 days)', value: stats.signupsWeek },
    { label: 'Signups (30 days)', value: stats.signupsMonth },
  ]

  return (
    <>
      <h2 style={styles.sectionTitle}>Site traffic</h2>
      <p style={styles.sectionSubhead}>Tracked directly from your site — updates in real time as people visit.</p>
      <div style={styles.statsGrid}>
        {trafficCards.map(c => (
          <div key={c.label} style={styles.statCard}>
            <div style={styles.statNumber}>{c.value}</div>
            <div style={styles.statLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <a
        href="https://vercel.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.vercelLink}
      >
        Also view in Vercel Analytics →
      </a>

      <h2 style={styles.sectionTitle}>Platform stats</h2>
      <div style={styles.statsGrid}>
        {contentCards.map(c => (
          <div key={c.label} style={styles.statCard}>
            <div style={styles.statNumber}>{c.value}</div>
            <div style={styles.statLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Signups by city</h2>
      <p style={styles.sectionSubhead}>Where your users say they're based — useful for spotting where to activate or pitch local partnerships.</p>
      <table style={{ ...styles.table, marginBottom: '48px' }}>
        <thead>
          <tr>
            <th style={styles.th}>City</th>
            <th style={styles.th}>Signups</th>
          </tr>
        </thead>
        <tbody>
          {stats.signupsByCity.length === 0 ? (
            <tr><td style={styles.tdMuted} colSpan={2}>No data yet.</td></tr>
          ) : (
            stats.signupsByCity.map(row => (
              <tr key={row.city}>
                <td style={styles.td}>{row.city}</td>
                <td style={styles.td}>{row.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={styles.sectionTitle}>By city (content)</h2>
      <table style={{ ...styles.table, marginBottom: '48px' }}>
        <thead>
          <tr>
            <th style={styles.th}>City</th>
            <th style={styles.th}>Events</th>
            <th style={styles.th}>Places</th>
            <th style={styles.th}>Happenings</th>
          </tr>
        </thead>
        <tbody>
          {stats.byCity.length === 0 ? (
            <tr><td style={styles.tdMuted} colSpan={4}>No data yet.</td></tr>
          ) : (
            stats.byCity.map(row => (
              <tr key={row.city}>
                <td style={styles.td}>{row.city}</td>
                <td style={styles.td}>{row.events}</td>
                <td style={styles.td}>{row.places}</td>
                <td style={styles.td}>{row.happenings}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={styles.sectionTitle}>Top pages (90 days)</h2>
      <table style={{ ...styles.table, marginBottom: '48px' }}>
        <thead>
          <tr>
            <th style={styles.th}>Page</th>
            <th style={styles.th}>Views</th>
          </tr>
        </thead>
        <tbody>
          {stats.topPages.length === 0 ? (
            <tr><td style={styles.tdMuted} colSpan={2}>No data yet.</td></tr>
          ) : (
            stats.topPages.map(row => (
              <tr key={row.path}>
                <td style={styles.td}>{row.path}</td>
                <td style={styles.td}>{row.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={styles.sectionTitle}>Recent activity</h2>
      {stats.recentActivity.length === 0 ? (
        <p style={styles.emptyState}>Nothing yet.</p>
      ) : (
        <div style={styles.activityList}>
          {stats.recentActivity.map((item, i) => (
            <div key={i} style={styles.activityRow}>
              <div style={styles.activityLeft}>
                <span style={styles.activityType}>{item.type}</span>
                <span style={styles.activityTitle}>{item.label}</span>
              </div>
              <span style={styles.activityWhen}>{formatWhen(item.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </>
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
  const [currentUserId, setCurrentUserId] = useState(null)

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsLoaded, setStatsLoaded] = useState(false)

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

      setCurrentUserId(sessionUser.id)
      setPendingRequests(requestsResult.data || [])
      setCurators(curatorsResult.data || [])
      setPhase('ready')
    }

    bootstrap()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (activeTab === 'stats' && !statsLoaded && phase === 'ready') {
      fetchStats()
    }
  }, [activeTab, statsLoaded, phase])

  async function fetchStats() {
    setStatsLoading(true)
    try {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

      const [
        eventsRes,
        placesRes,
        happeningsRes,
        djsRes,
        consentRes,
        pageViewsCountRes,
        recentViewsRes,
      ] = await Promise.all([
        supabase.from('events').select('id, title, city, created_at'),
        supabase.from('places').select('id, name, city, created_at'),
        supabase.from('happenings').select('id, title, city, created_at'),
        supabase.from('dj_curators').select('id, city'),
        supabase.from('marketing_consent').select('id, email, created_at, home_city'),
        supabase.from('page_views').select('id', { count: 'exact', head: true }),
        supabase.from('page_views').select('visitor_id, path, created_at').gte('created_at', ninetyDaysAgo.toISOString()),
      ])

      const events = eventsRes.data || []
      const places = placesRes.data || []
      const happenings = happeningsRes.data || []
      const djs = djsRes.data || []
      const consent = consentRes.data || []
      const totalPageViews = pageViewsCountRes.count || 0
      const recentViews = recentViewsRes.data || []

      const signupsWeek = consent.filter(c => c.created_at && new Date(c.created_at) >= sevenDaysAgo).length
      const signupsMonth = consent.filter(c => c.created_at && new Date(c.created_at) >= thirtyDaysAgo).length

      const uniqueVisitors90d = new Set(recentViews.map(v => v.visitor_id)).size
      const uniqueVisitorsWeek = new Set(
        recentViews.filter(v => v.created_at && new Date(v.created_at) >= sevenDaysAgo).map(v => v.visitor_id)
      ).size
      const uniqueVisitorsMonth = new Set(
        recentViews.filter(v => v.created_at && new Date(v.created_at) >= thirtyDaysAgo).map(v => v.visitor_id)
      ).size

      const pageCountMap = {}
      recentViews.forEach(v => {
        const key = v.path || '/'
        pageCountMap[key] = (pageCountMap[key] || 0) + 1
      })
      const topPages = Object.entries(pageCountMap)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const cityMap = {}
      function bump(city, field) {
        const key = city || 'Unspecified'
        if (!cityMap[key]) cityMap[key] = { city: key, events: 0, places: 0, happenings: 0 }
        cityMap[key][field] += 1
      }
      events.forEach(e => bump(e.city, 'events'))
      places.forEach(p => bump(p.city, 'places'))
      happenings.forEach(h => bump(h.city, 'happenings'))
      const byCity = Object.values(cityMap).sort((a, b) =>
        (b.events + b.places + b.happenings) - (a.events + a.places + a.happenings)
      )

      const signupCityMap = {}
      consent.forEach(c => {
        const key = (c.home_city && c.home_city.trim()) || 'Unspecified'
        signupCityMap[key] = (signupCityMap[key] || 0) + 1
      })
      const signupsByCity = Object.entries(signupCityMap)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)

      const activity = [
        ...events.map(e => ({ type: 'Event', label: e.title, created_at: e.created_at })),
        ...places.map(p => ({ type: 'Place', label: p.name, created_at: p.created_at })),
        ...happenings.map(h => ({ type: 'Happening', label: h.title, created_at: h.created_at })),
        ...consent.map(c => ({ type: 'Signup', label: c.email, created_at: c.created_at })),
      ]
        .filter(item => item.created_at)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 15)

      setStats({
        eventsTotal: events.length,
        placesTotal: places.length,
        happeningsTotal: happenings.length,
        djsTotal: djs.length,
        signupsTotal: consent.length,
        signupsWeek,
        signupsMonth,
        byCity,
        signupsByCity,
        recentActivity: activity,
        totalPageViews,
        uniqueVisitors90d,
        uniqueVisitorsWeek,
        uniqueVisitorsMonth,
        topPages,
      })
      setStatsLoaded(true)
    } catch (err) {
      console.error(err)
    } finally {
      setStatsLoading(false)
    }
  }

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

  async function handleToggleAdmin(curator) {
    const makingAdmin = curator.role !== 'admin'
    setBusyId(curator.id)
    const result = await supabase
      .from('curators')
      .update({ role: makingAdmin ? 'admin' : 'curator' })
      .eq('id', curator.id)

    if (result.error) {
      showBanner('error', `Could not update ${curator.name}'s role.`)
      setBusyId(null)
      return
    }

    showBanner('success', makingAdmin ? `${curator.name} is now an admin.` : `${curator.name} is no longer an admin.`)
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

  const approvedCuratorCount = curators.filter(c => c.approved).length

  return (
    <main style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <p style={styles.eyebrow}>Admin</p>
          <h1 style={styles.headline}>Dashboard.</h1>
          <p style={styles.sub}>Manage curator requests, approved curators, and platform stats.</p>
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
        <button
          type="button"
          style={activeTab === 'stats' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onClick={() => setActiveTab('stats')}
        >
          Stats
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
          onToggleAdmin={handleToggleAdmin}
          currentUserId={currentUserId}
        />
      )}

      {activeTab === 'stats' && (
        <StatsPanel stats={stats} statsLoading={statsLoading} approvedCuratorCount={approvedCuratorCount} />
      )}
    </main>
  )
}