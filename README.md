# Islamic Animation MCP

A Node.js Model Context Protocol server for planning and producing short-form Islamic educational animations with a strict religious-content safety workflow.

## Features
- Islamic animation creative brief and 45-second storyboard generator
- Arabic/English narration and shot-prompt planning
- Religious-content safety review checklist
- Optional Best MCP/Kie media-provider integration through an upstream MCP endpoint
- Optional Metricool publishing integration through an upstream MCP endpoint
- Local stdio MCP transport and Vercel health/API starter

## Safety rules
- Never depict Prophets or other sacred figures.
- Never invent Qur'an, hadith, rulings, or historical claims.
- Do not generate Qur'anic text/calligraphy inside AI images; typeset verified text in post-production.
- Require human review for sensitive religious claims.
- Never publish without explicit approval of the exact final video.

## Quick start
```bash
npm install
npm start
```

Configure the server in your MCP client with command `node` and args `["src/stdio.js"]`.

## Environment
Copy `.env.example` to `.env`. Set provider URLs/tokens only on your server; never commit secrets.

## Vercel
Deploy the repository as a Node.js project. The health endpoint is `/api/health`. The MCP HTTP endpoint scaffold is `/api/mcp`; configure environment variables in Vercel before connecting providers.

## Important
This repository contains workflow/planning tools. Actual image/video generation requires a configured media provider. A successful plan is not a rendered video.
