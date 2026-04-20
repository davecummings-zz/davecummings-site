const SERVICE_LABELS = {
    'website-audit': 'Website Audit',
    'performance': 'Performance Optimization',
    'seo': 'SEO & Visibility',
    'redesign': 'Website Redesign',
    'other': 'Other / Not Sure Yet',
};

function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, website, service, message } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const html = `
<h2 style="font-family:sans-serif;color:#0F172A;">New contact form submission</h2>
<table style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#475569;border-collapse:collapse;">
  <tr><td style="padding:6px 16px 6px 0;font-weight:600;color:#0F172A;">Name</td><td>${esc(name) || '<em>not provided</em>'}</td></tr>
  <tr><td style="padding:6px 16px 6px 0;font-weight:600;color:#0F172A;">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
  <tr><td style="padding:6px 16px 6px 0;font-weight:600;color:#0F172A;">Website</td><td>${esc(website) || '<em>not provided</em>'}</td></tr>
  <tr><td style="padding:6px 16px 6px 0;font-weight:600;color:#0F172A;">Service</td><td>${esc(SERVICE_LABELS[service] || service) || '<em>not selected</em>'}</td></tr>
</table>
<h3 style="font-family:sans-serif;color:#0F172A;margin-top:24px;">Message</h3>
<p style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#475569;white-space:pre-wrap;">${esc(message) || '<em>none</em>'}</p>
`;

    const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'davecummings.co <contact@davecummings.co>',
            to: 'dave@davecummings.co',
            reply_to: email,
            subject: `New inquiry from ${name || email}`,
            html,
        }),
    });

    if (!resendRes.ok) {
        console.error('Resend error:', await resendRes.text());
        return res.status(500).json({ error: 'Failed to send message. Please try again or email dave@davecummings.co directly.' });
    }

    return res.status(200).json({ ok: true });
};
