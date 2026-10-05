-- Reassert the Media Library background columns in case migration 012 was
-- applied before all placements were available, then refresh PostgREST's cache.
ALTER TABLE public.website_settings
  ADD COLUMN IF NOT EXISTS wholesale_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS dates_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS announcements_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS services_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_background_url text NOT NULL DEFAULT '';

NOTIFY pgrst, 'reload schema';
