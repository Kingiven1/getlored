import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [curatorData, setCuratorData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (p) => location.pathname === p

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkCurator(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkCurator(session.user.id)
      else setCuratorData(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  async function checkCurator(userId) {
    const { data } = await supabase.from('curators').select('approved, role').eq('user_id', userId).single()
    setCuratorData(data || null)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setCuratorData(null)
    navigate('/')
  }

  const s = {
    nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FAF8F5', borderBottom: '1px solid #E8E4DE', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '600', color: '#1A1A1A' },
    accent: { color: '#B07D62' },
    links: { display: 'flex', alignItems: 'center', gap: '32px' },
    link: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', textTransform: 'uppercase', color: '#6B6560', letterSpacing: '0.06em' },
    active: { color: '#1A1A1A' },
    cta: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', color: '#FAF8F5', backgroundColor: '#1A1A1A', padding: '8px 20px', borderRadius: '2px' },
    userBtn: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '400', color: '#6B6560', backgroundColor: 'transparent', border: '1px solid #E8E4DE', padding: '8px 20px', borderRadius: '2px', cursor: 'pointer' },
    userName: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#1A1A1A', fontWeight: '500' },
    hamburger: { display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' },
    hamburgerBar: { width: '22px', height: '2px', backgroundColor: '#1A1A1A' },
    mobileMenu: { position: 'fixed', top: '64px', left: 0, right: 0, backgroundColor: '#FAF8F5', borderBottom: '1px solid #E8E4DE', display: 'flex', flexDirection: 'column', padding: '16px 32px 24px', gap: '20px', zIndex: 99 },
    mobileLink: { fontFamily: "'DM Sans', sans-serif", fontSize: '15px', textTransform: 'uppercase', color: '#6B6560', letterSpacing: '0.06em' },
    mobileActive: { color: '#1A1A1A', fontWeight: '500' },
    mobileDivider: { height: '1px', backgroundColor: '#E8E4DE', margin: '4px 0' },
  }

  const navStyles = `
    @media (max-width: 767px) {
      .navbar-desktop-links { display: none !important; }
      .navbar-hamburger { display: flex !important; }
    }
    @media (min-width: 768px) {
      .navbar-mobile-menu { display: none !important; }
    }
  `

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account'
  const isApprovedCurator = curatorData?.approved === true
  const isAdmin = curatorData?.role === 'admin'

  return (
    <>
      <style>{navStyles}</style>
      <nav style={s.nav}>
        <Link to="/"><span style={s.logo}>Get <span style={s.accent}>Lored</span></span></Link>

        <div className="navbar-desktop-links" style={s.links}>
          <Link to="/cities" style={isActive('/cities') ? {...s.link, ...s.active} : s.link}>Cities</Link>
          {user ? (
            <>
              {isApprovedCurator && (
                <Link to="/curator" style={isActive('/curator') ? {...s.link, ...s.active} : s.link}>Portal</Link>
              )}
              {isAdmin && (
                <Link to="/control-panel" style={isActive('/control-panel') ? {...s.link, ...s.active} : s.link}>Admin</Link>
              )}
              <span style={s.userName}>{userName}</span>
              <button style={s.userBtn} onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/request-access" style={isActive('/request-access') ? {...s.link, ...s.active} : s.link}>Curators</Link>
              <Link to="/curator-login" style={isActive('/curator-login') ? {...s.link, ...s.active} : s.link}>Portal</Link>
              <Link to="/login" style={s.cta}>Sign in</Link>
            </>
          )}
        </div>

        <button
          className="navbar-hamburger"
          style={s.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={s.hamburgerBar} />
          <span style={s.hamburgerBar} />
          <span style={s.hamburgerBar} />
        </button>
      </nav>

      {menuOpen && (
        <div className="navbar-mobile-menu" style={s.mobileMenu}>
          <Link to="/cities" style={isActive('/cities') ? {...s.mobileLink, ...s.mobileActive} : s.mobileLink}>Cities</Link>
          {user ? (
            <>
              {isApprovedCurator && (
                <Link to="/curator" style={isActive('/curator') ? {...s.mobileLink, ...s.mobileActive} : s.mobileLink}>Portal</Link>
              )}
              {isAdmin && (
                <Link to="/control-panel" style={isActive('/control-panel') ? {...s.mobileLink, ...s.mobileActive} : s.mobileLink}>Admin</Link>
              )}
              <div style={s.mobileDivider} />
              <span style={s.userName}>{userName}</span>
              <button style={s.userBtn} onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/request-access" style={isActive('/request-access') ? {...s.mobileLink, ...s.mobileActive} : s.mobileLink}>Curators</Link>
              <Link to="/curator-login" style={isActive('/curator-login') ? {...s.mobileLink, ...s.mobileActive} : s.mobileLink}>Portal</Link>
              <Link to="/login" style={s.cta}>Sign in</Link>
            </>
          )}
        </div>
      )}
    </>
  )
}