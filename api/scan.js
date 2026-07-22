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
        max_tokens: 1024,
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
                text: `You are reading an event flyer. Extract the following information and return it as a JSON object only, no other text:
{
  "title": "event name",
  "venue": "venue name",
  "address": "full address if visible",
  "city": "city",
  "country": "country",
  "date": "YYYY-MM-DD format",
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

    const data = await response.json()
    const text = data.content[0].text

    // Strip markdown code fences if Claude wraps the JSON in them
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