export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    service: "islamic-animation-mcp",
    status: "deployed",
    endpoints: { health: "/api/health", mcp: "/mcp" },
    note: "The root route is a status response; MCP transport is being enabled separately."
  });
}
