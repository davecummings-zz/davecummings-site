// Requires WEB3FORMS_ACCESS_KEY to be set in Vercel environment variables.

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, website, service, message } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const w3fRes = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            subject: 'New Contact Form Submission - davecummings.co',
            from_name: 'davecummings.co Contact Form',
            name: name || '',
            email,
            website: website || '',
            service: service || '',
            message: message || '',
        }),
    });

    if (!w3fRes.ok) {
        console.error('Web3Forms error:', await w3fRes.text());
        return res.status(500).json({ error: 'Failed to send message. Please try again or email dave@davecummings.co directly.' });
    }

    const data = await w3fRes.json();
    if (!data.success) {
        console.error('Web3Forms rejected:', data);
        return res.status(500).json({ error: 'Failed to send message. Please try again or email dave@davecummings.co directly.' });
    }

    return res.status(200).json({ ok: true });
};
