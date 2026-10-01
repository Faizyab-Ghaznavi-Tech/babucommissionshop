# Babu Commission Shop

## Local development

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project used by the site.
4. Start the development server with `npm run dev`.

The site shows a setup page when the Supabase values are missing. Only the public anon key belongs in these client-side variables; never add a service-role key to a `VITE_*` variable.

## Supabase setup

Apply the SQL files in `supabase/migrations` to the same Supabase project configured in `.env.local`, in timestamp order. In particular, `20261001062000_006_configure_media_bucket.sql` creates or repairs the public `media` bucket and its image limits, and `20261001063000_007_add_enquiry_business_name.sql` adds the wholesale form's optional business field.

Create or invite `admin@babucommissionshop.com` in Supabase Auth before applying `20261001070000_008_restrict_admin_access.sql`. That migration adds the existing account to the private admin allowlist when it runs. If the account is created later, run this in the Supabase SQL Editor after applying the migration:

```sql
INSERT INTO public.site_admins (user_id)
SELECT id
FROM auth.users
WHERE lower(email) = 'admin@babucommissionshop.com'
ON CONFLICT (user_id) DO NOTHING;
```

Disable public user sign-ups in Supabase Auth. The app login accepts sign-in only, and the admin route and database policies restrict dashboard access and writes to the allowlisted account. Public reads of enabled site content and anonymous enquiry submissions remain available.

If an upload reports `Bucket not found`, migration `006` has not been applied to the configured project, or the deployed site points at a different Supabase project. The client anon key cannot create Storage buckets.

## Vercel deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment variables, then redeploy. `vercel.json` rewrites direct React Router paths such as `/admin` to the SPA entry point. Keep the Supabase service-role key out of Vercel's client-exposed `VITE_*` variables.

## Cloudflare Workers deployment

The `wrangler.jsonc` config serves `dist` and falls back to `index.html` for React Router paths. Use `npm run build` and `npx wrangler deploy`; configure the same two public Supabase variables as build variables in the Cloudflare project.
