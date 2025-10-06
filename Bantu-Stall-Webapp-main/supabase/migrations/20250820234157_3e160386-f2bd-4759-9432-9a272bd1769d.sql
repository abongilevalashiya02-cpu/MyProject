-- Fix remaining vendor listings security issue
DROP POLICY IF EXISTS "Authenticated users can view vendor listings" ON public.vendor_listings;

-- Create admin-only access policy for vendor listings
CREATE POLICY "Only admins can view vendor listings"
ON public.vendor_listings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage vendor listings"
ON public.vendor_listings 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));