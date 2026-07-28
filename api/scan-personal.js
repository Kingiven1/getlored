export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { image, mediaType } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        tools: [
          { type: 'web_search_20250305', name: 'web_search' },
        ],
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `You are reading a photo or screenshot someone saved to their personal trip itinerary. It could be:
- An event flyer (concert, party, festival, etc.)
- A screenshot of a place — a Google Maps listing, restaurant, bar, or venue

First figure out which kind of image this is. Then use web search to confirm and fill in accurate real-world details about the place or event — official Instagram handle, official website, Google Maps link, correct address. Don't guess; search to confirm what you can.

Return ONLY a JSON object as your final message, no other text, no markdown fences, in this exact shape:
{
  "item_type": "event" or "place",
  "title": "event name, or place/business name",
  "venue": "venue name if this is an event, else empty string",
  "address": "full address if known",
  "city": "city",
  "country": "country",
  "date": "YYYY-MM-DD start date, only for events",
  "end_date": "YYYY-MM-DD, only if this is a multi-day event date range",
  "time": "start time - end time, only for events",
  "genre": "music genre or type of event/place",
  "description": "brief 1-2 sentence description",
  "ticket_url": "ticket or RSVP link, only for events",
  "instagram_handle": "official instagram handle if found, formatted as @handle",
  "website": "official website if found",
  "google_maps_url": "google maps link if found"
}
Leave any field as an empty string if not applicable or not found.`,
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    const textBlocks = (data.content || []).filter(b => b.type === 'text').map(b => b.text)
    const text = textBlocks.join('\n')
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')

    try {
      const parsed = JSON.parse(cleaned)
      res.status(200).json(parsed)
    } catch {
      res.status(200).json({ raw: text })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}