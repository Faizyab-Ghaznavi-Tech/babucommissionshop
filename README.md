# Babu Commission Shop

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-kbjpl7cy)

## Run locally

1. Install the project dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` using the values from your Supabase project's **Project Settings → API** page.
4. Start the development server with `npm run dev`.

The app displays a setup message if the Supabase values are missing.

For admin image uploads, apply `supabase/migrations/20261001060000_005_create_media_bucket.sql` in the Supabase SQL Editor. The anon key used by the website cannot create storage buckets.

## Deploy to Cloudflare Workers

Use `npm run build` as the build command and `npx wrangler deploy` as the deploy command. The root `wrangler.jsonc` serves the `dist` directory and falls back to `index.html` for React Router paths.

In the Cloudflare Worker dashboard, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings → Build → Build variables and secrets** so they are available during the Vite build. Vite embeds `VITE_*` values in the browser bundle; use only the public anon key here, never the Supabase service-role key.
