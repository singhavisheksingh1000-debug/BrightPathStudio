export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, source = 'website' } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'BrightPathStudio <onboarding@resend.dev>';

    if (!apiKey || !segmentId) {
      return res.status(503).json({ error: 'Email service is not configured yet.' });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // 1) Add/update the subscriber in the Resend segment.
    const contactResponse = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: [{ id: segmentId }],
        properties: {
          signup_source: String(source).slice(0, 120),
          campaign: 'halloween-2026',
          freebie: 'couples-halloween-costume-planner-2026-sample'
        }
      })
    });

    const contactData = await contactResponse.json().catch(() => ({}));

    // A duplicate contact is still a successful lead-capture outcome.
    if (!contactResponse.ok &&
        contactResponse.status !== 409 &&
        !/already exists|duplicate/i.test(JSON.stringify(contactData))) {
      return res.status(contactResponse.status).json({
        error: contactData?.message || 'Could not subscribe right now.'
      });
    }

    // 2) Deliver the promised free sample immediately.
    const sampleUrl = 'https://brightpathstudio.shop/couples-halloween-costume-planner-2026-sample.html';
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: '🎃 Your Free Halloween Planner Sample is Ready',
        html: `
          <div style="margin:0;background:#f7f1e8;padding:32px 16px;font-family:Arial,sans-serif;color:#252126">
            <div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e6ddd1">
              <div style="padding:34px 32px;text-align:center;background:#351d38;color:#fff">
                <div style="font-size:12px;letter-spacing:2px;color:#f5c66b;font-weight:700">BRIGHTPATHSTUDIO</div>
                <h1 style="font-family:Georgia,serif;font-weight:500;font-size:34px;line-height:1.15;margin:14px 0 8px">Your Free Printable Is Ready</h1>
                <p style="margin:0;color:#eadfe9;line-height:1.6">Your Couples Halloween Costume Planner 2026 sample is waiting for you.</p>
              </div>
              <div style="padding:34px 32px">
                <p style="font-size:16px;line-height:1.7;margin-top:0">Thanks for joining BrightPathStudio. Start with the free sample to explore costume ideas, DIY planning, budgeting, party prep and couple photo planning.</p>
                <div style="text-align:center;margin:28px 0">
                  <a href="${sampleUrl}" style="display:inline-block;background:#351d38;color:#fff;text-decoration:none;padding:15px 24px;font-weight:700;font-size:13px;letter-spacing:.5px">OPEN YOUR FREE SAMPLE →</a>
                </div>
                <div style="padding:18px;background:#f7f1e8;border-left:3px solid #f5c66b">
                  <strong>Want the complete planner?</strong>
                  <p style="margin:7px 0 0;line-height:1.6">The full Couples Halloween Costume Planner 2026 is available for $11.99 on the website.</p>
                </div>
                <p style="font-size:12px;color:#777;line-height:1.6;margin-bottom:0">You subscribed to receive BrightPathStudio freebies, new product releases and occasional offers. You can unsubscribe from future marketing emails at any time.</p>
              </div>
            </div>
          </div>
        `
      })
    });

    const emailData = await emailResponse.json().catch(() => ({}));
    if (!emailResponse.ok) {
      console.error('Freebie email failed:', emailData);
      return res.status(502).json({ error: 'Your email was saved, but we could not send the free printable yet. Please try again.' });
    }

    return res.status(200).json({ ok: true, message: 'Subscribed and free sample sent.', emailId: emailData?.id || null });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
}
