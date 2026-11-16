// HTTP transport placeholder: use the stdio transport for local MCP clients.
// Configure a Streamable HTTP adapter before exposing this endpoint publicly.
export default function handler(_req, res) {
  res.status(501).json({
    error: "HTTP MCP transport is not enabled in this starter build.",
    hint: "Run the stdio server locally with: npm start"
  });
}
