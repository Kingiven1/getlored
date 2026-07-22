import { useNavigate } from 'react-router-dom'

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block', letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B07D62', marginBottom: '16px' },
  headline: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px', lineHeight: '1.1' },
  updated: { fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#9B9590', marginBottom: '48px' },
  h2: { fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: '500', color: '#1A1A1A', marginTop: '40px', marginBottom: '14px' },
  p: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#4A4642', lineHeight: '1.8', marginBottom: '16px' },
  ul: { fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '300', color: '#4A4642', lineHeight: '1.8', marginBottom: '16px', paddingLeft: '20px' },
  li: { marginBottom: '8px' },
  strong: { fontWeight: '500', color: '#1A1A1A' },
  link: { color: '#B07D62', borderBottom: '1px solid #B07D62' },
}

export default function TermsOfService() {
  const navigate = useNavigate()

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/login')
    }
  }

  return (
    <main style={s.page}>
      <button type="button" style={s.back} onClick={handleBack}>← Back</button>
      <p style={s.eyebrow}>Legal</p>
      <h1 style={s.headline}>Terms of Service.</h1>
      <p style={s.updated}>Last updated: July 2026</p>

      <p style={s.p}>
        These Terms of Service govern your use of getlored.co (the "Site"), operated by Global Lynk.
        By creating an account or using the Site, you agree to these terms.
      </p>

      <h2 style={s.h2}>1. Who can use Get Lored</h2>
      <p style={s.p}>
        You must be at least 13 years old to create an account. By signing up, you confirm the
        information you provide is accurate.
      </p>

      <h2 style={s.h2}>2. Your account</h2>
      <p style={s.p}>
        You're responsible for maintaining the confidentiality of your account credentials and for
        all activity under your account. Notify us immediately if you suspect unauthorized access.
      </p>

      <h2 style={s.h2}>3. Curator-submitted content</h2>
      <p style={s.p}>
        Approved curators may submit events, places, happenings, flyers, and descriptions to the Site.
        By submitting content, you confirm:
      </p>
      <ul style={s.ul}>
        <li style={s.li}>You have the right to share the information and images you upload</li>
        <li style={s.li}>The information is accurate to the best of your knowledge</li>
        <li style={s.li}>You grant Get Lored a license to display, reproduce, and distribute your submitted content on the Site</li>
      </ul>
      <p style={s.p}>
        We reserve the right to edit, decline, or remove any submitted content at our discretion,
        including content that is inaccurate, inappropriate, or violates these terms.
      </p>

      <h2 style={s.h2}>4. Prohibited conduct</h2>
      <p style={s.p}>You agree not to:</p>
      <ul style={s.ul}>
        <li style={s.li}>Submit false, misleading, or fraudulent event or place listings</li>
        <li style={s.li}>Upload content that infringes on others' intellectual property rights</li>
        <li style={s.li}>Attempt to access accounts, data, or areas of the Site you're not authorized to access</li>
        <li style={s.li}>Use the Site to harass, spam, or harm other users</li>
        <li style={s.li}>Interfere with or disrupt the Site's operation</li>
      </ul>

      <h2 style={s.h2}>5. No warranty</h2>
      <p style={s.p}>
        Event details, prices, dates, and place information are submitted by third-party curators.
        Get Lored does not guarantee the accuracy of this information and is not responsible for
        changes, cancellations, or discrepancies. Always confirm details directly with the venue or
        organizer before attending.
      </p>

      <h2 style={s.h2}>6. Limitation of liability</h2>
      <p style={s.p}>
        The Site is provided "as is" without warranties of any kind. To the fullest extent permitted
        by law, Get Lored is not liable for any indirect, incidental, or consequential damages arising
        from your use of the Site.
      </p>

      <h2 style={s.h2}>7. Termination</h2>
      <p style={s.p}>
        We may suspend or terminate your account at our discretion, including for violations of these
        terms. You may stop using the Site and request account deletion at any time.
      </p>

      <h2 style={s.h2}>8. Changes to these terms</h2>
      <p style={s.p}>
        We may update these terms from time to time. Continued use of the Site after changes take
        effect constitutes acceptance of the updated terms.
      </p>

      <h2 style={s.h2}>9. Contact</h2>
      <p style={s.p}>
        Questions about these terms? Reach out at{' '}
        <a href="mailto:djkingiven@gmail.com" style={s.link}>djkingiven@gmail.com</a>, or by mail at
        Global Lynk, 9407 Fernspray Rd, Charlotte, NC 28217.
      </p>
    </main>
  )
}