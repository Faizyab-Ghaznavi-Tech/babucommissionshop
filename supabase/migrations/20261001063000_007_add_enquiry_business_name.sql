-- Add the optional company field used by the wholesale enquiry form.
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS business_name text NOT NULL DEFAULT '';
