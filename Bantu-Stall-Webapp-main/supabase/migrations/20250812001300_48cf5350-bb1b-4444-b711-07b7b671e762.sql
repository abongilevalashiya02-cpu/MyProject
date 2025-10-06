-- Secure property_listings: restrict sensitive access, provide safe public view

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive public SELECT policy if it exists
DROP POLICY IF EXISTS "Anyone can view property listings" ON public.property_listings;

-- Allow owners to view their own listings
CREATE POLICY "Owners can view their own property listings"
ON public.property_listings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to view all listings
CREATE POLICY "Admins can view all property listings"
ON public.property_listings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users with a related quotation request to view listings (for legitimate inquiries)
CREATE POLICY "Requesters can view property contact details"
ON public.property_listings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quotation_requests qr
    WHERE qr.selected_venue_id = public.property_listings.id
      AND qr.user_id = auth.uid()
  )
);

-- Public-safe exposure: create a SECURITY DEFINER function returning only non-sensitive columns
CREATE OR REPLACE FUNCTION public.get_property_listings_public()
RETURNS TABLE (
  id uuid,
  property_name text,
  description text,
  property_type text,
  location text,
  area text,
  proximity_to_landmark text,
  min_capacity integer,
  max_capacity integer,
  total_rooms integer,
  meeting_rooms integer,
  eco_friendly boolean,
  luxury boolean,
  indoor_focus boolean,
  outdoor_focus boolean,
  csr_alignment boolean,
  activities text,
  amenities text[],
  languages_spoken text[],
  accessibility text[],
  unique_selling_points text,
  booking_flexibility text,
  media_urls text[],
  price_range_usd text,
  price_range_zar text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    id, property_name, description, property_type, location, area, proximity_to_landmark,
    min_capacity, max_capacity, total_rooms, meeting_rooms,
    eco_friendly, luxury, indoor_focus, outdoor_focus, csr_alignment,
    activities, amenities, languages_spoken, accessibility, unique_selling_points,
    booking_flexibility, media_urls, price_range_usd, price_range_zar, status, created_at, updated_at
  FROM public.property_listings
$$;

-- Create a view leveraging the function so public can browse safe fields
DROP VIEW IF EXISTS public.property_listings_public;
CREATE VIEW public.property_listings_public AS
SELECT * FROM public.get_property_listings_public();

-- Grant public read access to the safe view only
GRANT SELECT ON public.property_listings_public TO anon, authenticated;