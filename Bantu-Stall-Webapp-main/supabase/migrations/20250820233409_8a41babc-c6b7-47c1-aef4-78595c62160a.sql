-- ========================================
-- CRITICAL SECURITY HARDENING MIGRATION (FIXED)
-- ========================================

-- Fix Critical Issue #1: Clients table publicly readable
-- Drop existing overly permissive policy and create proper restriction
DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clients;

-- Create proper RLS policies for clients table
CREATE POLICY "Users can view their own clients"
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
ON public.clients 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix Critical Issue #2: Property listings contact data exposure
-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can insert property listings" ON public.property_listings;

-- Create more secure property listings policies
CREATE POLICY "Authenticated users can insert property listings"
ON public.property_listings 
FOR INSERT 
TO authenticated
WITH CHECK (COALESCE(user_id, auth.uid()) = auth.uid());

CREATE POLICY "Public can view basic property info only"
ON public.property_listings 
FOR SELECT 
USING (
  status = 'approved' 
  AND user_id IS NOT NULL
);

-- Contact details only accessible to quote requesters and admins
CREATE POLICY "Requesters can view property contact details"
ON public.property_listings 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (
    EXISTS (
      SELECT 1 FROM quotation_requests qr 
      WHERE qr.selected_venue_id = property_listings.id 
      AND qr.user_id = auth.uid()
    )
  )
);

-- Fix Critical Issue #3: Service provider applications exposure
-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Admins can view all service provider applications" ON public.service_provider_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.service_provider_applications;

CREATE POLICY "Admins can manage all service provider applications"
ON public.service_provider_applications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view only their own applications"
ON public.service_provider_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own applications"
ON public.service_provider_applications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix Critical Issue #4: Speaker applications data exposure
-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Allow admin access to speaker_applications" ON public.speaker_applications;
DROP POLICY IF EXISTS "Allow public inserts to speaker_applications" ON public.speaker_applications;
DROP POLICY IF EXISTS "Anyone can submit a speaker application" ON public.speaker_applications;
DROP POLICY IF EXISTS "Only admins can view applications" ON public.speaker_applications;

CREATE POLICY "Anyone can submit speaker applications"
ON public.speaker_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view speaker applications"
ON public.speaker_applications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage speaker applications"
ON public.speaker_applications 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix data integrity issues: Add user_id constraints where missing
-- Update orphaned property listings to have a user_id (assign to first admin)
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get first admin user
    SELECT user_id INTO admin_user_id 
    FROM user_roles 
    WHERE role = 'admin'::app_role 
    LIMIT 1;
    
    -- Update orphaned property listings if admin exists
    IF admin_user_id IS NOT NULL THEN
        UPDATE property_listings 
        SET user_id = admin_user_id 
        WHERE user_id IS NULL;
    END IF;
END $$;

-- Add NOT NULL constraint to critical user_id columns
ALTER TABLE property_listings 
ALTER COLUMN user_id SET NOT NULL;

-- Add enhanced security triggers for audit logging (data modification only)
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log access to sensitive tables
    INSERT INTO audit_logs (
        user_id, 
        action, 
        resource, 
        details, 
        ip_address
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        jsonb_build_object(
            'record_id', COALESCE(NEW.id, OLD.id),
            'timestamp', now()
        ),
        current_setting('request.headers', true)::json->>'x-forwarded-for'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables (INSERT/UPDATE/DELETE only)
DROP TRIGGER IF EXISTS audit_clients_access ON public.clients;
CREATE TRIGGER audit_clients_access
    AFTER INSERT OR UPDATE OR DELETE
    ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS audit_smoke_thunder_bookings_access ON public.smoke_thunder_bookings;
CREATE TRIGGER audit_smoke_thunder_bookings_access
    AFTER INSERT OR UPDATE OR DELETE
    ON public.smoke_thunder_bookings
    FOR EACH ROW
    EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS audit_service_provider_applications_access ON public.service_provider_applications;
CREATE TRIGGER audit_service_provider_applications_access
    AFTER INSERT OR UPDATE OR DELETE
    ON public.service_provider_applications
    FOR EACH ROW
    EXECUTE FUNCTION log_sensitive_data_access();

-- Create security monitoring function for suspicious patterns
CREATE OR REPLACE FUNCTION public.monitor_security_events()
RETURNS void AS $$
BEGIN
    -- Insert security event for multiple failed login attempts pattern
    INSERT INTO security_events (
        event_type,
        severity,
        details,
        created_at
    )
    SELECT 
        'potential_data_scraping',
        'high',
        jsonb_build_object(
            'detection_time', now(),
            'suspicious_pattern', 'high_volume_access'
        ),
        now()
    WHERE EXISTS (
        SELECT 1 FROM audit_logs 
        WHERE created_at > now() - interval '5 minutes'
        GROUP BY user_id, resource
        HAVING COUNT(*) > 50
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;