# Babu Commission Shop

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-kbjpl7cy)

## Run locally

1. Install the project dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` using the values from your Supabase project's **Project Settings → API** page.
4. Start the development server with `npm run dev`.

The app displays a setup message if the Supabase values are missing.

For admin image uploads, apply `supabase/migrations/20261001062000_006_configure_media_bucket.sql` in the SQL Editor of the same Supabase project configured by `VITE_SUPABASE_URL`. This creates or repairs the public `media` bucket, its 5 MB image limits, and its storage policies. If the admin shows “Bucket not found”, this migration has not been applied to that project, or the deployed site points to a different Supabase project. The website's anon key cannot create storage buckets.

## Deploy to Cloudflare Workers

Use `npm run build` as the build command and `npx wrangler deploy` as the deploy command. The root `wrangler.jsonc` serves the `dist` directory and falls back to `index.html` for React Router paths.

In the Cloudflare Worker dashboard, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings → Build → Build variables and secrets** so they are available during the Vite build. Vite embeds `VITE_*` values in the browser bundle; use only the public anon key here, never the Supabase service-role key.
