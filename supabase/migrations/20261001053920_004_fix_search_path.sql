/*
# Fix search_path on update_updated_at_column function

Sets the search_path to 'public' on the updated_at trigger function to resolve the security warning.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
