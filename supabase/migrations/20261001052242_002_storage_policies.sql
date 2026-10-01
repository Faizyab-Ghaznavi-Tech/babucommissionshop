/*
# Storage policies for media bucket

1. Security
- Public can read objects in the media bucket (images shown on website)
- Only authenticated users can upload/update/delete objects
*/

DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
CREATE POLICY "public_read_media_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_upload_media_bucket" ON storage.objects;
CREATE POLICY "auth_upload_media_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media_bucket" ON storage.objects;
CREATE POLICY "auth_update_media_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_delete_media_bucket" ON storage.objects;
CREATE POLICY "auth_delete_media_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
