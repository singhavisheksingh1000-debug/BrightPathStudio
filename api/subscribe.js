export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, source = 'website' } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_SEGMENT_ID) {
      return res.status(503).json({ error: 'Email service is not configured yet.' });
    }

    const response = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: [{ id: process.env.RESEND_SEGMENT_ID }],
        properties: { signup_source: String(source).slice(0, 120), campaign: 'halloween-2026' }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // A duplicate contact is still a successful lead-capture outcome.
      if (response.status === 409 || /already exists|duplicate/i.test(JSON.stringify(data))) {
        return res.status(200).json({ ok: true, message: 'Already subscribed.' });
      }
      return res.status(response.status).json({ error: data?.message || 'Could not subscribe right now.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Subscription failed.' });
  }
}
