// /api/chat.js
export default async function handler(req, res) {
  // CORS (ouvert pour les tests; on resserrera à ovniperdu.com ensuite)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Petit GET de test rapide dans le navigateur: /api/chat?text=bonjour
  if (req.method === 'GET') {
    const text = (req.query && req.query.text) || 'ping';
    return res.status(200).json({
      ok: true,
      service: 'op01-backend',
      reply: `Reçu: ${text}`,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Récupération sûre du body JSON (selon l’environnement Vercel)
  const body = typeof req.body === 'string'
    ? (req.body ? JSON.parse(req.body) : {})
    : (req.body || {});

  // On supporte plusieurs formats: {text}, {message}, {messages:[{content}]}
  const userText =
    body.text ||
    body.message ||
    (Array.isArray(body.messages) && body.messages.length
      ? body.messages[body.messages.length - 1].content
      : '');

  const reply = userText
    ? `Signal reçu: ${userText}`
    : 'Bonjour — opérateur OVNIPERDU en ligne.';

  return res.status(200).json({
    ok: true,
    service: 'op01-backend',
    reply,
    echo: userText