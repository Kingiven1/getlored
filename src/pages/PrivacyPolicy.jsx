import { Link } from 'react-router-dom'

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' },
  back: { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textTransform: 'uppercase', color: '#9B9590', marginBottom: '40px', display: 'inline-block', letterSpacing: '0.08em' },
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

export default function PrivacyPolicy() {
  return (
    <main style={s.page}>
      <Link to="/" style={s.back}>Back to Get Lored</Link>
      <p style={s.eyebrow}>Legal</p>
      <h1 style={s.headline}>Privacy Policy.</h1>
      <p style={s.updated}>Last updated: July 2026</p>

      <p style={s.p}>
        This Privacy Policy explains how Get Lored, operated by Global Lynk ("we," "us," "our"),
        collects, uses, and protects information when you use getlored.co (the "Site"). By creating
        an account or using the Site, you acknowledge this policy.
      </p>
      <p style={s.p}>
        <span style={s.strong}>Global Lynk</span><br />
        9407 Fernspray Rd<br />
        Charlotte, NC 28217
      </p>

      <h2 style={s.h2}>1. Information we collect</h2>
      <p style={s.p}>When you create an account, we collect:</p>
      <ul style={s.ul}>
        <li style={s.li}><span style={s.strong}>Account information</span> — name, email address, password (encrypted), city, and optional Instagram handle.</li>
        <li style={s.li}><span style={s.strong}>Curator information</span> — if you apply as a curator, we additionally collect the details submitted in your application.</li>
        <li style={s.li}><span style={s.strong}>Content you submit</span> — events, places, happenings, flyers, and descriptions uploaded through the curator portal.</li>
        <li style={s.li}><span style={s.strong}>Usage data</span> — pages visited and general interactions with the Site, collected automatically.</li>
      </ul>
      <p style={s.p}>
        We do not currently collect or store phone numbers, and we do not send SMS/text messages.
        If that changes in the future, we will request separate, explicit consent before doing so.
      </p>

      <h2 style={s.h2}>2. How we use your information</h2>
      <ul style={s.ul}>
        <li style={s.li}>To create and manage your account</li>
        <li style={s.li}>To display curator-submitted content (events, places, happenings) on the Site</li>
        <li style={s.li}>To process and review curator applications</li>
        <li style={s.li}>To send you email updates, event drops, and news — <span style={s.strong}>only if you've opted in</span> to marketing emails at signup or afterward</li>
        <li style={s.li}>To maintain the security and integrity of the Site</li>
      </ul>

      <h2 style={s.h2}>3. Email marketing and opt-in</h2>
      <p style={s.p}>
        If you check the "send me updates" box during signup, we'll add you to our marketing email
        list and log the date and time you opted in. You can unsubscribe at any time using the link
        included in every marketing email we send, or by emailing us directly. Opting out of marketing
        emails does not affect your ability to use your account or receive essential account-related
        emails (like password resets).
      </p>

      <h2 style={s.h2}>4. Third-party services</h2>
      <p style={s.p}>We use the following third-party services to operate the Site, each with their own privacy practices:</p>
      <ul style={s.ul}>
        <li style={s.li}><span style={s.strong}>Supabase</span> — database, authentication, and file storage</li>
        <li style={s.li}><span style={s.strong}>Vercel</span> — website hosting</li>
        <li style={s.li}><span style={s.strong}>Google</span> — optional sign-in via Google OAuth</li>
        <li style={s.li}><span style={s.strong}>Anthropic (Claude)</span> — used to read and extract details from event flyers uploaded by curators</li>
      </ul>
      <p style={s.p}>
        These providers process data on our behalf and are contractually or technically restricted
        from using your information for their own purposes.
      </p>

      <h2 style={s.h2}>5. Data retention</h2>
      <p style={s.p}>
        We retain your account information for as long as your account is active. If you'd like your
        account and associated data deleted, contact us at the email below and we'll process the
        request within a reasonable timeframe, subject to any legal obligations to retain certain records.
      </p>

      <h2 style={s.h2}>6. Your rights</h2>
      <p style={s.p}>
        Depending on where you live, you may have rights to access, correct, delete, or export your
        personal data, and to opt out of marketing communications at any time. To exercise any of these
        rights, contact us using the information below.
      </p>

      <h2 style={s.h2}>7. Cookies</h2>
      <p style={s.p}>
        We use essential cookies required for authentication and basic site functionality. We do not
        currently use third-party advertising or tracking cookies.
      </p>

      <h2 style={s.h2}>8. Children's privacy</h2>
      <p style={s.p}>
        Get Lored is not directed at children under 13, and we do not knowingly collect information
        from anyone under 13.
      </p>

      <h2 style={s.h2}>9. Changes to this policy</h2>
      <p style={s.p}>
        We may update this Privacy Policy from time to time. Material changes will be reflected by
        updating the "Last updated" date above.
      </p>

      <h2 style={s.h2}>10. Contact</h2>
      <p style={s.p}>
        Questions about this policy or your data? Reach out at{' '}
        <a href="mailto:djkingiven@gmail.com" style={s.link}>djkingiven@gmail.com</a>, or by mail at
        Global Lynk, 9407 Fernspray Rd, Charlotte, NC 28217.
      </p>
    </main>
  )
}