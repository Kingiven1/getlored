function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildPlaceRow(p) {
  const links = []
  if (p.website) {
    links.push(`<a href="${escapeHtml(p.website)}" style="color: #B07D62; text-decoration: none; font-size: 12px; margin-right: 16px;">Website →</a>`)
  }
  if (p.google_maps_url) {
    links.push(`<a href="${escapeHtml(p.google_maps_url)}" style="color: #B07D62; text-decoration: none; font-size: 12px;">View on Maps →</a>`)
  }

  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #E8E4DE;">
        <div style="font-family: Georgia, serif; font-size: 18px; color: #1A1A1A; margin-bottom: 4px;">${escapeHtml(p.name)}</div>
        <div style="font-family: Arial, sans-serif; font-size: 13px; color: #6B6560; margin-bottom: 6px;">${escapeHtml(p.dining_style || p.category || '')}${p.address ? ' &middot; ' + escapeHtml(p.address) : ''}</div>
        ${links.length ? `<div>${links.join('')}</div>` : ''}
      </td>
    </tr>
  `
}

function buildDjRow(dj) {
  let instagramLink = ''
  if (dj.instagram_handle) {
    const url = dj.instagram_handle.startsWith('http')
      ? dj.instagram_handle
      : `https://instagram.com/${dj.instagram_handle.replace('@', '')}`
    instagramLink = `<a href="${escapeHtml(url)}" style="color: #B07D62; text-decoration: none; font-size: 12px;">Follow on Instagram →</a>`
  }

  const genres = Array.isArray(dj.genres) && dj.genres.length ? escapeHtml(dj.genres.join(', ')) : ''

  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #E8E4DE;">
        <div style="font-family: Georgia, serif; font-size: 18px; color: #1A1A1A; margin-bottom: 4px;">${escapeHtml(dj.name)}</div>
        <div style="font-family: Arial, sans-serif; font-size: 13px; color: #6B6560; margin-bottom: 6px;">${escapeHtml(dj.event_name || '')}${genres ? ' &middot; ' + genres : ''}</div>
        ${instagramLink ? `<div>${instagramLink}</div>` : ''}
      </td>
    </tr>
  `
}

function buildEventRow(ev) {
  const links = []
  if (ev.instagram_handle) {
    const url = ev.instagram_handle.startsWith('http')
      ? ev.instagram_handle
      : `https://instagram.com/${ev.instagram_handle.replace('@', '')}`
    links.push(`<a href="${escapeHtml(url)}" style="color: #B07D62; text-decoration: none; font-size: 12px; margin-right: 16px;">Instagram →</a>`)
  }
  if (ev.website) {
    links.push(`<a href="${escapeHtml(ev.website)}" style="color: #B07D62; text-decoration: none; font-size: 12px; margin-right: 16px;">Website →</a>`)
  }
  if (ev.google_maps_url) {
    links.push(`<a href="${escapeHtml(ev.google_maps_url)}" style="color: #B07D62; text-decoration: none; font-size: 12px; margin-right: 16px;">Maps →</a>`)
  }
  if (ev.ticket_url) {
    links.push(`<a href="${escapeHtml(ev.ticket_url)}" style="color: #B07D62; text-decoration: none; font-size: 12px;">Tickets / RSVP →</a>`)
  }

  const metaParts = []
  if (ev.item_type === 'place') {
    if (ev.address) metaParts.push(escapeHtml(ev.address))
    else if (ev.city) metaParts.push(escapeHtml(ev.city))
  } else {
    if (ev.venue) metaParts.push(escapeHtml(ev.venue))
    if (ev.city) metaParts.push(escapeHtml(ev.city))
    if (ev.event_date) metaParts.push(escapeHtml(ev.event_date))
  }

  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #E8E4DE;">
        <div style="font-family: Georgia, serif; font-size: 18px; color: #1A1A1A; margin-bottom: 4px;">${escapeHtml(ev.title)}</div>
        <div style="font-family: Arial, sans-serif; font-size: 13px; color: #6B6560; margin-bottom: 6px;">${metaParts.join(' &middot; ')}</div>
        ${links.length ? `<div>${links.join('')}</div>` : ''}
      </td>
    </tr>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, name, places, djs, events } = req.body
    const placeList = Array.isArray(places) ? places : []
    const djList = Array.isArray(djs) ? djs : []
    const eventList = Array.isArray(events) ? events : []

    if (!email || (placeList.length === 0 && djList.length === 0 && eventList.length === 0)) {
      return res.status(400).json({ error: 'Missing email or saved items' })
    }

    const byCity = {}
    for (const p of placeList) {
      const city = p.city || 'Other'
      if (!byCity[city]) byCity[city] = []
      byCity[city].push(p)
    }

    const placeBlocks = Object.entries(byCity).map(([city, items]) => {
      const rows = items.map(buildPlaceRow).join('')
      return `
        <div style="margin-bottom: 32px;">
          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1A1A; border-bottom: 2px solid #1A1A1A; padding-bottom: 8px; margin-bottom: 4px;">${escapeHtml(city)}</h2>
          <table style="width: 100%; border-collapse: collapse;">${rows}</table>
        </div>
      `
    }).join('')

    const eventBlock = eventList.length ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1A1A; border-bottom: 2px solid #1A1A1A; padding-bottom: 8px; margin-bottom: 4px;">Added by you</h2>
        <table style="width: 100%; border-collapse: collapse;">${eventList.map(buildEventRow).join('')}</table>
      </div>
    ` : ''

    const djBlock = djList.length ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1A1A; border-bottom: 2px solid #1A1A1A; padding-bottom: 8px; margin-bottom: 4px;">DJs to check out</h2>
        <table style="width: 100%; border-collapse: collapse;">${djList.map(buildDjRow).join('')}</table>
      </div>
    ` : ''

    const html = `
      <div style="max-width: 560px; margin: 0 auto; font-family: Arial, sans-serif; padding: 32px 24px; background-color: #FAF8F5;">
        <p style="font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #B07D62; margin-bottom: 8px;">Your Itinerary</p>
        <h1 style="font-family: Georgia, serif; font-size: 32px; color: #1A1A1A; margin: 0 0 24px 0;">${name ? `${escapeHtml(name)}'s` : 'Your'} Get Lored picks</h1>
        ${eventBlock}
        ${placeBlocks}
        ${djBlock}
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