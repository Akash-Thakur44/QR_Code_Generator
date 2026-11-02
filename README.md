# Real QR Code Generator

An Astro app for creating QR codes, managing dynamic QR codes, and viewing scan analytics.

## Requirements

- Node.js 22.12 or later
- A Supabase project for PostgreSQL (required for accounts, QR codes, sessions, and analytics)

## Local development

1. Install dependencies:

   ```sh
   npm ci
   ```

2. In Supabase, open **SQL Editor**, run [`supabase/migrations/202611020001_initial_schema.sql`](./supabase/migrations/202611020001_initial_schema.sql), then copy a PostgreSQL connection string from **Project Settings → Database**.
3. Copy `.env.example` to `.env` (in PowerShell, run `Copy-Item .env.example .env`) and set `DATABASE_URL` to that connection string. Keep this value private and server-side.
4. Start Astro:

   ```sh
   npm run dev
   ```

   Open the local URL printed by Astro, usually `http://localhost:4321`.

The database migration enables row-level security without adding public access policies. The app connects directly from its server using `DATABASE_URL`; never expose that connection string in browser code.

## Deploy to Vercel

1. Import this repository into Vercel and keep the Astro framework preset and default build settings.
2. Add `DATABASE_URL` in the Vercel project’s environment variables for Preview and Production. For serverless functions, use the Supabase **Transaction pooler** connection string and keep its SSL requirement.
3. Deploy. The Vercel adapter is selected automatically by Vercel.
4. Optionally add `PUBLIC_QR_BASE_URL` if generated QR links should use a specific public domain instead of the incoming request’s origin.

## Deploy to Render

Create a **Web Service** from this repository with:

- Runtime: **Node**
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Environment variable: `DATABASE_URL`

The start script binds to `0.0.0.0` and uses Render's assigned `PORT`. Use the Supabase **Session pooler** connection string for the long-running Node server and retain its SSL requirement. Optionally set `PUBLIC_QR_BASE_URL` to the public site origin. The Node standalone adapter is used by default; set `ASTRO_DEPLOY_TARGET=node` explicitly if desired.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run check` | Check Astro and TypeScript diagnostics |
| `npm run build` | Build the Node standalone deployment |
| `npm run start` | Run the built Node server |
