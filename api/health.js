export default function handler(_req, res) {
  res.status(200).json({ ok: true, service: "islamic-animation-mcp", version: "1.3.0" });
}
