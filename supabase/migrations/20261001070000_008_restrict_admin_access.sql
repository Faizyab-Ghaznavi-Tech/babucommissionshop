-- Limit authenticated dashboard and media writes to the shop's designated
-- administrator. Public read policies and anonymous enquiry submission stay
-- available for the public site. The allowlist stores an Auth user ID so a
-- later email change does not transfer admin access to a different account.

CREATE TABLE IF NOT EXISTS public.site_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.site_admins FROM PUBLIC, anon, authenticated;

-- Add the designated account if it already exists in this Supabase project.
INSERT INTO public.site_admins (user_id)
SELECT id
FROM auth.users
WHERE lower(email) = 'admin@babucommissionshop.com'
ORDER BY created_at
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_babu_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.site_admins
    WHERE user_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_babu_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_babu_admin() TO authenticated;

-- Website settings
DROP POLICY IF EXISTS "auth_update_settings" ON public.website_settings;
DROP POLICY IF EXISTS "auth_insert_settings" ON public.website_settings;
DROP POLICY IF EXISTS "admin_update_settings" ON public.website_settings;
DROP POLICY IF EXISTS "admin_insert_settings" ON public.website_settings;
CREATE POLICY "admin_update_settings" ON public.website_settings
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_insert_settings" ON public.website_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());

-- About content
DROP POLICY IF EXISTS "auth_update_about" ON public.about_content;
DROP POLICY IF EXISTS "auth_insert_about" ON public.about_content;
DROP POLICY IF EXISTS "admin_update_about" ON public.about_content;
DROP POLICY IF EXISTS "admin_insert_about" ON public.about_content;
CREATE POLICY "admin_update_about" ON public.about_content
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_insert_about" ON public.about_content
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());

-- Products
DROP POLICY IF EXISTS "auth_read_all_products" ON public.products;
DROP POLICY IF EXISTS "auth_insert_products" ON public.products;
DROP POLICY IF EXISTS "auth_update_products" ON public.products;
DROP POLICY IF EXISTS "auth_delete_products" ON public.products;
DROP POLICY IF EXISTS "admin_read_all_products" ON public.products;
DROP POLICY IF EXISTS "admin_insert_products" ON public.products;
DROP POLICY IF EXISTS "admin_update_products" ON public.products;
DROP POLICY IF EXISTS "admin_delete_products" ON public.products;
CREATE POLICY "admin_read_all_products" ON public.products
  FOR SELECT TO authenticated USING (public.is_babu_admin());
CREATE POLICY "admin_insert_products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_update_products" ON public.products
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_products" ON public.products
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Services
DROP POLICY IF EXISTS "auth_read_all_services" ON public.services;
DROP POLICY IF EXISTS "auth_insert_services" ON public.services;
DROP POLICY IF EXISTS "auth_update_services" ON public.services;
DROP POLICY IF EXISTS "auth_delete_services" ON public.services;
DROP POLICY IF EXISTS "admin_read_all_services" ON public.services;
DROP POLICY IF EXISTS "admin_insert_services" ON public.services;
DROP POLICY IF EXISTS "admin_update_services" ON public.services;
DROP POLICY IF EXISTS "admin_delete_services" ON public.services;
CREATE POLICY "admin_read_all_services" ON public.services
  FOR SELECT TO authenticated USING (public.is_babu_admin());
CREATE POLICY "admin_insert_services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_update_services" ON public.services
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_services" ON public.services
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Enquiries (anonymous INSERT remains available in public_insert_messages)
DROP POLICY IF EXISTS "auth_read_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "auth_update_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "auth_delete_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_read_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_update_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_delete_messages" ON public.contact_messages;
CREATE POLICY "admin_read_messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_babu_admin());
CREATE POLICY "admin_update_messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Announcements
DROP POLICY IF EXISTS "auth_read_all_announcements" ON public.announcements;
DROP POLICY IF EXISTS "auth_insert_announcements" ON public.announcements;
DROP POLICY IF EXISTS "auth_update_announcements" ON public.announcements;
DROP POLICY IF EXISTS "auth_delete_announcements" ON public.announcements;
DROP POLICY IF EXISTS "admin_read_all_announcements" ON public.announcements;
DROP POLICY IF EXISTS "admin_insert_announcements" ON public.announcements;
DROP POLICY IF EXISTS "admin_update_announcements" ON public.announcements;
DROP POLICY IF EXISTS "admin_delete_announcements" ON public.announcements;
CREATE POLICY "admin_read_all_announcements" ON public.announcements
  FOR SELECT TO authenticated USING (public.is_babu_admin());
CREATE POLICY "admin_insert_announcements" ON public.announcements
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_update_announcements" ON public.announcements
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_announcements" ON public.announcements
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Gallery
DROP POLICY IF EXISTS "auth_read_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "auth_insert_gallery" ON public.gallery;
DROP POLICY IF EXISTS "auth_update_gallery" ON public.gallery;
DROP POLICY IF EXISTS "auth_delete_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_read_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_insert_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_update_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_delete_gallery" ON public.gallery;
CREATE POLICY "admin_read_all_gallery" ON public.gallery
  FOR SELECT TO authenticated USING (public.is_babu_admin());
CREATE POLICY "admin_insert_gallery" ON public.gallery
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_update_gallery" ON public.gallery
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_gallery" ON public.gallery
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Media library table
DROP POLICY IF EXISTS "auth_insert_media" ON public.media;
DROP POLICY IF EXISTS "auth_update_media" ON public.media;
DROP POLICY IF EXISTS "auth_delete_media" ON public.media;
DROP POLICY IF EXISTS "admin_insert_media" ON public.media;
DROP POLICY IF EXISTS "admin_update_media" ON public.media;
DROP POLICY IF EXISTS "admin_delete_media" ON public.media;
CREATE POLICY "admin_insert_media" ON public.media
  FOR INSERT TO authenticated WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_update_media" ON public.media
  FOR UPDATE TO authenticated USING (public.is_babu_admin()) WITH CHECK (public.is_babu_admin());
CREATE POLICY "admin_delete_media" ON public.media
  FOR DELETE TO authenticated USING (public.is_babu_admin());

-- Storage objects in the public media bucket
DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_read_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_upload_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_update_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "admin_read_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_media_bucket" ON storage.objects;
CREATE POLICY "admin_read_media_bucket" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_babu_admin());
CREATE POLICY "admin_upload_media_bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_babu_admin());
CREATE POLICY "admin_update_media_bucket" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_babu_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_babu_admin());
CREATE POLICY "admin_delete_media_bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_babu_admin());
