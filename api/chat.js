/**
 * /api/chat — CommonJS serverless handler (Vercel)
 * Safe CORS + GET health + simple POST echo
 */
module.exports = async function handler(req, res) {
  try {
    // Preflight CORS
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }

    // CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Health check
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'ready',
        service: 'op01-backend',
        endpoint: '/api/chat',
        ts: new Date().toISOString(),
      });
    }

    // Only POST au-delà d'ici
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Use POST' });
    }

    // Body: string JSON ou objet
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text } = body || {};

    if (!text) {
      return res.status(400).json({ ok: false, error: 'Missing "text" in body' });
    }

    // Réponse simple (echo)
    return res.status(200).json({ ok: true, echo: text });
  } catch (err) {
    console.error('chat.js error:', err);
    return res.status(500).json({ ok: false, error: 'server-error', detail: String(err) });
  }
};