# Run Doc — House of Fashion

## How to reproduce uncommitted artifacts
- Dependencies are already installed in `node_modules/` (npm). If missing, run `npm install`.
- No `.env.local` file needed — the project has no environment variables.

## How to run the server
```bash
npm run dev
```
This starts Next.js dev server on port 3000 (default).
The project uses `output: "export"` in `next.config.ts`, but `next dev` works fine for development.

## Preview
- Port: 2136
- URL: http://localhost:2136
- Server PID: 31560 (started by a previous `npm run dev` invocation)
- Detached via PowerShell `Start-Process npm.cmd run dev`
- Note: `next dev` auto-selects a free port when 3000 is in use; check logs for actual port
