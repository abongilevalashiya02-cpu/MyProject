-- ========================================
-- CRITICAL SECURITY FIXES FOR DATA EXPOSURE
-- ========================================

-- Clean up orphaned horo_applications records with NULL user_id
DELETE FROM public.horo_applications WHERE user_id IS NULL;

-- Add NOT NULL constraint to horo_applications.user_id to prevent future orphaned records
ALTER TABLE public.horo_applications ALTER COLUMN user_id SET NOT NULL;

-- ========================================
-- FIX SMOKE_THUNDER_BOOKINGS RLS POLICIES
-- ========================================

-- Drop the insecure email-based access policy
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.smoke_thunder_bookings;

-- Add user_id column to smoke_thunder_bookings if it doesn't exist
ALTER TABLE public.smoke_thunder_bookings 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create secure RLS policy for smoke_thunder_bookings (authenticated users only)
CREATE POLICY "Users can view their own bookings" 
ON public.smoke_thunder_bookings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for authenticated users to update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.smoke_thunder_bookings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Allow public inserts but require user_id to be set for authenticated users
DROP POLICY IF EXISTS "Allow public form submissions" ON public.smoke_thunder_bookings;
CREATE POLICY "Allow public form submissions" 
ON public.smoke_thunder_bookings 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
    ELSE user_id IS NULL
  END
);

-- ========================================
-- FIX HORO_APPLICATIONS RLS POLICIES  
-- ========================================

-- Drop the insecure policy that allows access to NULL user_id records
DROP POLICY IF EXISTS "Users can view their own applications" ON public.horo_applications;

-- Create secure policy for authenticated users only
CREATE POLICY "Users can view their own applications" 
ON public.horo_applications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix insert policy to require authenticated users
DROP POLICY IF EXISTS "Anyone can submit horo applications" ON public.horo_applications;
CREATE POLICY "Authenticated users can submit horo applications" 
ON public.horo_applications 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ========================================
-- ADDITIONAL SECURITY HARDENING
-- ========================================

-- Ensure service_provider_applications can only be accessed by owners
DROP POLICY IF EXISTS "Users can view their own applications" ON public.service_provider_applications;
CREATE POLICY "Users can view their own applications" 
ON public.service_provider_applications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Add admin access to review applications
CREATE POLICY "Admins can view all service provider applications" 
ON public.service_provider_applications 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Secure clients table - ensure users can only access their own client data
DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clients;
CREATE POLICY "Users can manage their own clients" 
ON public.clients 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);