function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, name, places } = req.body

    if (!email || !Array.isArray(places) || places.length === 0) {
      return res.status(400).json({ error: 'Missing email or places' })
    }

    const byCity = {}
    for (const p of places) {
      const city = p.city || 'Other'
      if (!byCity[city]) byCity[city] = []
      byCity[city].push(p)
    }

    const cityBlocks = Object.entries(byCity).map(([city, items]) => {
      const rows = items.map(p => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #E8E4DE;">
            <div style="font-family: Georgia, serif; font-size: 18px; color: #1A1A1A; margin-bottom: 4px;">${escapeHtml(p.name)}</div>
            <div style="font-family: Arial, sans-serif; font-size: 13px; color: #6B6560;">${escapeHtml(p.dining_style || p.category || '')}${p.address ? ' &middot; ' + escapeHtml(p.address) : ''}</div>
          </td>
        </tr>
      `).join('')

      return `
        <div style="margin-bottom: 32px;">
          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1A1A; border-bottom: 2px solid #1A1A1A; padding-bottom: 8px; margin-bottom: 4px;">${escapeHtml(city)}</h2>
          <table style="width: 100%; border-collapse: collapse;">${rows}</table>
        </div>
      `
    }).join('')

    const html = `
      <div style="max-width: 560px; margin: 0 auto; font-family: Arial, sans-serif; padding: 32px 24px; background-color: #FAF8F5;">
        <p style="font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #B07D62; margin-bottom: 8px;">Your Itinerary</p>
        <h1 style="font-family: Georgia, serif; font-size: 32px; color: #1A1A1A; margin: 0 0 24px 0;">${name ? `${escapeHtml(name)}'s` : 'Your'} Get Lored picks</h1>
        ${cityBlocks}
        <p style="font-family: Arial, sans-serif; font-size: 12px; color: #9B9590; margin-top: 32px;">Sent from Get Lored. Manage your saved places anytime at getlored.co/itinerary</p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Get Lored <hello@getlored.co>',
        to: [email],
        subject: 'Your Get Lored Itinerary',
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Failed to send email' })
    }

    res.status(200).json({ success: true, id: data.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}