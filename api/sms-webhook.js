function twiml(message) {
  const escaped = String(message)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`
}

function parseFormBody(raw) {
  const params = new URLSearchParams(raw)
  const obj = {}
  for (const [key, value] of params.entries()) {
    obj[key] = value
  }
  return obj
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed')
    return
  }

  res.setHeader('Content-Type', 'text/xml')

  try {
    const raw = await readRawBody(req)
    const params = parseFormBody(raw)

    const from = params.From
    const numMedia = parseInt(params.NumMedia || '0', 10)

    if (!from) {
      res.status(400).send(twiml("Something went wrong reading your message. Try again."))
      return
    }

    // 1. Check if this phone number belongs to an approved curator with events access
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: curator, error: curatorError } = await supabase
      .from('curators')
      .select('id, user_id, name, can_events, phone_number')
      .eq('phone_number', from)
      .single()

    if (curatorError || !curator) {
      res.status(200).send(twiml(
        "This number isn't registered as a Get Lored curator. Reach out at djkingiven@gmail.com to get approved."
      ))
      return
    }

    if (!curator.can_events) {
      res.status(200).send(twiml(
        "Your curator account doesn't have event submission access yet. Reach out at djkingiven@gmail.com."
      ))
      return
    }

    // 2. No image attached
    if (numMedia === 0) {
      res.status(200).send(twiml(
        "Got your text! To submit an event, text a photo of the flyer to this number."
      ))
      return
    }

    // 3. Download the flyer image from Twilio (requires Basic Auth)
    const mediaUrl = params.MediaUrl0
    const mediaContentType = params.MediaContentType0 || 'image/jpeg'

    const authHeader = 'Basic ' + Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString('base64')

    const mediaResponse = await fetch(mediaUrl, {
      headers: { Authorization: authHeader },
    })

    if (!mediaResponse.ok) {
      res.status(200).send(twiml(
        "We couldn't download that image. Please try texting it again."
      ))
      return
    }

    const arrayBuffer = await mediaResponse.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')

    // 4. Scan the flyer with Claude — same extraction shape as api/scan.js,
    // used by the curator portal's Add Event form.
    const scanResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaContentType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `You are reading an event flyer. Extract the following information and return it as a JSON object only, no other text:
{
  "title": "event name",
  "venue": "venue name",
  "address": "full address if visible",
  "city": "city",
  "country": "country",
  "date": "YYYY-MM-DD format - the start date, or the only date if this is a single-day event",
  "end_date": "YYYY-MM-DD format - ONLY fill this in if the flyer shows a date RANGE. Leave as empty string if it's a single-day event.",
  "time": "start time – end time",
  "genre": "music genre or type of event",
  "description": "brief description of the event",
  "ticket_url": "ticket link if visible or empty string"
}
If any field is not visible on the flyer, return an empty string for that field.`,
              },
            ],
          },
        ],
      }),
    })

    const scanData = await scanResponse.json()
    const text = scanData.content?.[0]?.text || ''
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      res.status(200).send(twiml(
        "We couldn't read that flyer clearly. Try a clearer photo, or submit it directly at getlored.co/curator."
      ))
      return
    }

    if (!parsed.date) {
      res.status(200).send(twiml(
        "We read your flyer but couldn't find a clear date. Please submit it at getlored.co/curator so you can fill that in."
      ))
      return
    }

    // 5. Insert directly into events — same table and shape the curator
    // portal's Add Event form writes to. curator_id here is the AUTH user id
    // (curator.user_id), matching how the portal inserts events, not the
    // curators table's own row id.
    const { error: insertError } = await supabase
      .from('events')
      .insert({
        title: parsed.title || '',
        venue: parsed.venue || '',
        address: parsed.address || '',
        city: parsed.city || '',
        country: parsed.country || '',
        date: parsed.date,
        end_date: parsed.end_date || null,
        time: parsed.time || '',
        genre: parsed.genre || '',
        description: parsed.description || '',
        ticket_url: parsed.ticket_url || '',
        flyer_url: mediaUrl,
        curator_id: curator.user_id,
        status: 'published',
      })

    if (insertError) {
      res.status(200).send(twiml(
        "We read your flyer but couldn't save it. Please try again or submit it at getlored.co/curator."
      ))
      return
    }

    const eventName = parsed.title || 'your event'
    res.status(200).send(twiml(
      `Got it — "${eventName}" is live on Get Lored. Check getlored.co/curator to review or edit the details.`
    ))
  } catch (error) {
    res.status(200).send(twiml(
      "Something went wrong on our end. Please try again in a moment."
    ))
  }
}