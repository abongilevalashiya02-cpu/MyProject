-- ========================================
-- CRITICAL SECURITY HARDENING (POLICY CLEANUP)
-- ========================================

-- Fix Critical Issue #1: Secure clients table
DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clients;

CREATE POLICY "Users can view their own clients"
ON public.clients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
ON public.clients FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
ON public.clients FOR DELETE 
USING (auth.uid() = user_id);

-- Fix Critical Issue #2: Secure property listings
-- Drop all existing property listing policies
DROP POLICY IF EXISTS "Anyone can insert property listings" ON public.property_listings;
DROP POLICY IF EXISTS "Requesters can view property contact details" ON public.property_listings;
DROP POLICY IF EXISTS "Public can view basic property info only" ON public.property_listings;

-- Recreate with proper security
CREATE POLICY "Authenticated users can insert property listings"
ON public.property_listings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Approved properties visible to authenticated users"
ON public.property_listings FOR SELECT 
USING (
  status = 'approved' 
  AND user_id IS NOT NULL 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin access to all property listings"
ON public.property_listings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Critical Issue #3: Secure service provider applications
DROP POLICY IF EXISTS "Admins can view all service provider applications" ON public.service_provider_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.service_provider_applications;
DROP POLICY IF EXISTS "Admins can manage all service provider applications" ON public.service_provider_applications;

CREATE POLICY "Users can view only their own applications"
ON public.service_provider_applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own applications"
ON public.service_provider_applications FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all service provider applications"
ON public.service_provider_applications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Critical Issue #4: Secure speaker applications
DROP POLICY IF EXISTS "Allow admin access to speaker_applications" ON public.speaker_applications;
DROP POLICY IF EXISTS "Allow public inserts to speaker_applications" ON public.speaker_applications;
DROP POLICY IF EXISTS "Anyone can submit a speaker application" ON public.speaker_applications;
DROP POLICY IF EXISTS "Only admins can view applications" ON public.speaker_applications;
DROP POLICY IF EXISTS "Only admins can manage speaker applications" ON public.speaker_applications;

CREATE POLICY "Anyone can submit speaker applications"
ON public.speaker_applications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view speaker applications"
ON public.speaker_applications FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Clean up orphaned property listings data
UPDATE property_listings 
SET user_id = (
  SELECT user_id FROM user_roles 
  WHERE role = 'admin'::app_role 
  LIMIT 1
) 
WHERE user_id IS NULL;

-- Add NOT NULL constraint to prevent future orphaned records
ALTER TABLE property_listings 
ALTER COLUMN user_id SET NOT NULL;