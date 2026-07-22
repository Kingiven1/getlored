import { Link } from 'react-router-dom'

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(26,26,26,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' },
  modal: { backgroundColor: '#FAF8F5', borderRadius: '4px', maxWidth: '440px', width: '100%', padding: '48px 40px', position: 'relative', textAlign: 'center' },
  closeBtn: { position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '18px', color: '#9B9590', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '500', color: '#1A1A1A', marginBottom: '16px', lineHeight: '1.2' },
  sub: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#6B6560', lineHeight: '1.7', marginBottom: '32px' },
  perks: { textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' },
  perk: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '300', color: '#4A4540', display: 'flex', gap: '10px', alignItems: 'flex-start' },
  perkDot: { color: '#B07D62', fontWeight: '600' },
  signupBtn: { display: 'block', width: '100%', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FAF8F5', backgroundColor: '#1A1A1A', border: 'none', borderRadius: '2px', cursor: 'pointer', marginBottom: '12px', textDecoration: 'none', boxSizing: 'border-box' },
  dismiss: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9B9590', cursor: 'pointer', background: 'none', border: 'none' },
}

export default function SignupGate({ onClose }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" style={s.closeBtn} onClick={onClose}>✕</button>
        <p style={s.eyebrow}>Members only</p>
        <h2 style={s.headline}>Get lored to unlock this.</h2>
        <p style={s.sub}>
          Get Lored is curated by DJs, promoters, and cultural insiders who actually know their cities.
          Create a free account to see full event details, restaurant links, and everything our curators recommend.
        </p>
        <div style={s.perks}>
          <div style={s.perk}><span style={s.perkDot}>—</span> Full event details, times, and tickets</div>
          <div style={s.perk}><span style={s.perkDot}>—</span> Direct links to curated restaurants & bars</div>
          <div style={s.perk}><span style={s.perkDot}>—</span> The scene, before everyone else finds out</div>
        </div>
        <Link to="/login" style={s.signupBtn}>Create free account</Link>
        <button type="button" style={s.dismiss} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  )
}