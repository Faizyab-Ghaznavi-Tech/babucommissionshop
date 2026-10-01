/*
  Create the public media bucket used by the admin image uploader.
  The storage access policies are defined in 20261001052242_002_storage_policies.sql.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
