export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "op01-backend",
    timestamp: new Date().toISOString()
  });
}
