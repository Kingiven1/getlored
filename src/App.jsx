import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Cities from './pages/Cities.jsx'
import CityPage from './pages/CityPage.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Login from './pages/Login.jsx'
import CuratorLogin from './pages/CuratorLogin.jsx'
import RequestAccess from './pages/RequestAccess.jsx'
import CuratorPortal from './pages/CuratorPortal.jsx'
import Admin from './pages/Admin.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'

const globalCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #FAF8F5; }
  a { text-decoration: none; color: inherit; }
  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
`

function getVisitorId() {
  try {
    let id = localStorage.getItem('gl_visitor_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('gl_visitor_id', id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

function PageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    const visitorId = getVisitorId()
    supabase
      .from('page_views')
      .insert([{ visitor_id: visitorId, path: location.pathname }])
      .then(() => {})
      .catch(() => {})
  }, [location.pathname])

  return null
}

export default function App() {
return (
<BrowserRouter>
<style>{globalCSS}</style>
<PageViewTracker />
<div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FAF8F5', minHeight: '100vh', color: '#1A1A1A' }}>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/cities" element={<Cities />} />
<Route path="/cities/:city" element={<CityPage />} />
<Route path="/events/:id" element={<EventDetail />} />
<Route path="/login" element={<Login />} />
<Route path="/curator-login" element={<CuratorLogin />} />
<Route path="/request-access" element={<RequestAccess />} />
<Route path="/curator" element={<CuratorPortal />} />
<Route path="/control-panel" element={<Admin />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
</Routes>
</div>
</BrowserRouter>
  )
}