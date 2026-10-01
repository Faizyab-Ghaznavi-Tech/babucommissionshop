/*
  Ensure the public media bucket and authenticated upload policies are present
  and match the admin image uploader's supported file types and size limit.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public buckets serve image downloads publicly without an anon SELECT policy.
-- Keep SELECT permission for authenticated uploads that return object metadata.
DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
DROP POLICY IF EXISTS "auth_read_media_bucket" ON storage.objects;
CREATE POLICY "auth_read_media_bucket" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_upload_media_bucket" ON storage.objects;
CREATE POLICY "auth_upload_media_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media_bucket" ON storage.objects;
CREATE POLICY "auth_update_media_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_delete_media_bucket" ON storage.objects;
CREATE POLICY "auth_delete_media_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
