// /api/chat — CommonJS handler (Vercel)
// CORS strict + GET health + POST echo

module.exports = async function handler(req, res) {
  try {
    // --- CORS strict (liste blanche depuis ALLOWED_ORIGINS) ---
    const allowlist = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const origin = req.headers.origin || "";
    const isAllowed = allowlist.includes(origin);

    res.setHeader("Vary", "Origin");
    if (isAllowed) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");

    // Pré-vol
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    // GET: statut service
    if (req.method === "GET") {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        status: "ready",
        service: "op01-backend",
        endpoint: "/api/chat",
        ts: new Date().toISOString(),
      });
    }

    // POST: echo sécurisé
    if (req.method === "POST") {
      if (!isAllowed) {
        return res
          .status(403)
          .json({ ok: false, error: "origin-not-allowed", origin });
      }

      let raw = "";
      for await (const chunk of req) raw += chunk;

      let body = {};
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          return res.status(400).json({ ok: false, error: "invalid-json" });
        }
      }

      const { text } = body || {};
      if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ ok: false, error: "missing-text" });
      }

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ ok: true, echo: text });
    }

    // Méthode non supportée
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  } catch (err) {
    console.error("chat.js error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "server-error", detail: String(err) });
  }
};
