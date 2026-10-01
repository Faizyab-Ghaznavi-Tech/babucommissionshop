-- Let an administrator choose a previously uploaded Media Library image
-- as the homepage hero without storing the same file in multiple places.
ALTER TABLE public.website_settings
ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '';
