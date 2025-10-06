-- Remove security-definer-backed view to satisfy linter and avoid privilege escalation via views
DROP VIEW IF EXISTS public.property_listings_public;

-- Ensure RPC is usable publicly for safe fields
GRANT EXECUTE ON FUNCTION public.get_property_listings_public() TO anon, authenticated;