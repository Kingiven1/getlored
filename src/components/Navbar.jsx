import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isCurator, setIsCurator] = useState(false)
  const isActive = (p) => location.pathname === p

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkCurator(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkCurator(session.user.id)
      else setIsCurator(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function checkCurator(userId) {
    const { data } = await supabase.from('curators').select('approved').eq('user_id', userId).single()
    setIsCurator(data?.approved === true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setIsCurator(false)
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
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account'

  return (
    <nav style={s.nav}>
      <Link to="/"><span style={s.logo}>Get <span style={s.accent}>Lored</span></span></Link>
      <div style={s.links}>
        <Link to="/cities" style={isActive('/cities') ? {...s.link, ...s.active} : s.link}>Cities</Link>
        {user ? (
          <>
            {isCurator && (
              <Link to="/curator" style={isActive('/curator') ? {...s.link, ...s.active} : s.link}>Portal</Link>
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
    </nav>
  )
}