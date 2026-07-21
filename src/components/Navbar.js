import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const s = {
    nav: { position: "sticky", top: 0, zIndex: 100, backgroundColor: "#FAF8F5", borderBottom: "1px solid #E8E4DE", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: "600", color: "#1A1A1A" },
    accent: { color: "#B07D62" },
    links: { display: "flex", alignItems: "center", gap: "32px" },
    link: { fontFamily: "DM Sans, sans-serif", fontSize: "13px", textTransform: "uppercase", color: "#6B6560", letterSpacing: "0.06em" },
    active: { color: "#1A1A1A" },
    cta: { fontFamily: "DM Sans, sans-serif", fontSize: "13px", fontWeight: "500", color: "#FAF8F5", backgroundColor: "#1A1A1A", padding: "8px 20px", borderRadius: "2px" },
  }
  return (
    <nav style={s.nav}>
      <Link to="/"><span style={s.logo}>Get <span style={s.accent}>Lored</span></span></Link>
      <div style={s.links}>
        <Link to="/cities" style={isActive("/cities") ? {...s.link, ...s.active} : s.link}>Cities</Link>
        <Link to="/request-access" style={isActive("/request-access") ? {...s.link, ...s.active} : s.link}>Curators</Link>
        <Link to="/login" style={s.cta}>Sign in</Link>
      </div>
    </nav>
  )
}
