-- Fix security vulnerability: Restrict access to property contact information
-- Remove the overly permissive policy that exposes contact details to all authenticated users
DROP POLICY IF EXISTS "Approved properties visible to authenticated users" ON public.property_listings;

-- Create a new restrictive policy that only allows access via the secure RPC function
-- This ensures contact information is not exposed to general authenticated users
CREATE POLICY "Public properties accessible via secure RPC only" 
ON public.property_listings 
FOR SELECT 
USING (false);  -- Block direct SELECT access, force use of secure RPC

-- Keep existing policies for admins and owners intact (they can still access contact info)
-- Admin policy: "Admin access to all property listings" (already exists)
-- Owner policy: "Owners can view their own property listings" (already exists)

-- Create a new policy specifically for the public RPC function to access approved properties
-- This uses SECURITY DEFINER to bypass RLS when called from the secure function
CREATE OR REPLACE FUNCTION public.get_property_listings_public()
RETURNS TABLE(
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
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
) 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  -- Return only approved properties WITHOUT contact information
  SELECT 
    p.id, p.property_name, p.description, p.property_type, p.location, p.area, p.proximity_to_landmark,
    p.min_capacity, p.max_capacity, p.total_rooms, p.meeting_rooms,
    p.eco_friendly, p.luxury, p.indoor_focus, p.outdoor_focus, p.csr_alignment,
    p.activities, p.amenities, p.languages_spoken, p.accessibility, p.unique_selling_points,
    p.booking_flexibility, p.media_urls, p.price_range_usd, p.price_range_zar, 
    p.status, p.created_at, p.updated_at
  FROM public.property_listings p
  WHERE p.status = 'approved'
$$;

-- Create a separate function for admins to access property contact information
CREATE OR REPLACE FUNCTION public.get_property_contact_info_admin(property_id uuid)
RETURNS TABLE(
  id uuid,
  contact_name text,
  contact_email text, 
  contact_phone text
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Only admins can access contact information
  SELECT p.id, p.contact_name, p.contact_email, p.contact_phone
  FROM public.property_listings p
  WHERE p.id = property_id
    AND has_role(auth.uid(), 'admin'::app_role)
$$;