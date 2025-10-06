-- Security hardening migration

-- 1) Newsletter subscribers/subscriptions: restrict SELECT to admins only
DROP POLICY IF EXISTS "Allow authenticated users to view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 2) Contact and Sponsor inquiries: admin-only SELECT
DROP POLICY IF EXISTS "Authenticated users can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can view contact inquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view sponsor inquiries" ON public.sponsor_inquiries;
CREATE POLICY "Admins can view sponsor inquiries"
ON public.sponsor_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 3) Waitlist: remove permissive SELECT and duplicate INSERT
DROP POLICY IF EXISTS "Only authenticated users can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert waitlist entries" ON public.waitlist;
DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='waitlist' AND policyname='Allow admin access to waitlist'
) THEN
  CREATE POLICY "Allow admin access to waitlist"
  ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));
END IF;
END $$;

-- 4) Horo applications: owner-only + admin SELECT
DROP POLICY IF EXISTS "Users can view their own applications" ON public.horo_applications;
CREATE POLICY "Users can view their own applications"
ON public.horo_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all horo applications"
ON public.horo_applications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 5) Vendor listings: remove public SELECT; add admin-only SELECT
DROP POLICY IF EXISTS "Anyone can view vendor listings" ON public.vendor_listings;
CREATE POLICY "Admins can view vendor listings"
ON public.vendor_listings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Public-safe RPC for vendor listings (no contact fields)
CREATE OR REPLACE FUNCTION public.get_vendor_listings_public()
RETURNS TABLE (
  id uuid,
  vendor_name text,
  description text,
  business_type text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, vendor_name, description, business_type, status, created_at, updated_at
  FROM public.vendor_listings
$$;

-- 6) quotation_request_line_items: remove NULL-user loophole
DROP POLICY IF EXISTS "Users can manage line items for their quotation requests" ON public.quotation_request_line_items;
CREATE POLICY "Users can manage their own quotation request line items"
ON public.quotation_request_line_items
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.quotation_requests qr
  WHERE qr.id = quotation_request_id AND qr.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.quotation_requests qr
  WHERE qr.id = quotation_request_id AND qr.user_id = auth.uid()
));
CREATE POLICY "Admins can manage all quotation request line items"
ON public.quotation_request_line_items
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 7) smoke_thunder_bookings: fix UUID/email comparison; admin SELECT
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.smoke_thunder_bookings;
CREATE POLICY "Users can view their own bookings by email"
ON public.smoke_thunder_bookings
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email') IS NOT NULL
  AND (
    (auth.jwt() ->> 'email') = email
    OR (auth.jwt() ->> 'email') = partner_email
  )
);
CREATE POLICY "Admins can view all bookings"
ON public.smoke_thunder_bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 8) Fix rate limiting function and lock attempts table
CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(_email text, _ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    attempt_count integer;
BEGIN
    SELECT COUNT(*) INTO attempt_count
    FROM public.signup_attempts s
    WHERE (s.email = _email OR s.ip_address = _ip_address)
      AND s.created_at > now() - interval '1 hour';

    IF attempt_count >= 5 THEN
        RETURN false;
    END IF;

    INSERT INTO public.signup_attempts (email, ip_address) VALUES (_email, _ip_address);

    RETURN true;
END;
$function$;

ALTER TABLE public.signup_attempts ENABLE ROW LEVEL SECURITY;

-- 9) Add Authorization header to Edge function calls from DB

-- handle_property_listing_notification
CREATE OR REPLACE FUNCTION public.handle_property_listing_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/property-listing-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'propertyData', jsonb_build_object(
        'propertyName', NEW.property_name,
        'contactName', NEW.contact_name,
        'contactEmail', NEW.contact_email,
        'contactPhone', NEW.contact_phone,
        'propertyType', NEW.property_type,
        'location', NEW.location,
        'description', NEW.description
      )
    )
  );
  
  RETURN NEW;
END;
$function$;

-- handle_horo_application_notification
CREATE OR REPLACE FUNCTION public.handle_horo_application_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/horo-application-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'applicationData', jsonb_build_object(
        'fullName', NEW.full_name,
        'workEmail', NEW.work_email,
        'phoneNumber', NEW.phone_number,
        'companyName', NEW.company_name,
        'jobTitle', NEW.job_title,
        'teamSize', NEW.team_size,
        'objectives', NEW.objectives,
        'experienceDetails', NEW.experience_details,
        'locations', NEW.locations,
        'budgetRange', NEW.budget_range,
        'source', NEW.source,
        'applicationId', NEW.id
      )
    )
  );
  
  RETURN NEW;
END;
$function$;

-- handle_contact_inquiry_automation
CREATE OR REPLACE FUNCTION public.handle_contact_inquiry_automation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'contact',
      'email', NEW.email,
      'data', jsonb_build_object(
        'email', NEW.email,
        'name', NEW.name,
        'source', 'contact_inquiry'
      )
    )
  );

  RETURN NEW;
END;
$function$;

-- handle_newsletter_subscription_automation
CREATE OR REPLACE FUNCTION public.handle_newsletter_subscription_automation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'contact',
      'email', NEW.email,
      'data', jsonb_build_object(
        'email', NEW.email,
        'source', 'newsletter_subscription'
      )
    )
  );

  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'newsletter_welcome',
      'data', jsonb_build_object(
        'email', NEW.email
      )
    )
  );

  RETURN NEW;
END;
$function$;

-- handle_property_listing_automation
CREATE OR REPLACE FUNCTION public.handle_property_listing_automation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'contact',
      'email', NEW.contact_email,
      'data', jsonb_build_object(
        'email', NEW.contact_email,
        'name', NEW.contact_name,
        'phone', NEW.contact_phone,
        'source', 'property_listing'
      )
    )
  );

  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'company',
      'email', NEW.contact_email,
      'data', jsonb_build_object(
        'company_name', NEW.property_name,
        'contact_phone', NEW.contact_phone,
        'website_url', NEW.website_url,
        'description', NEW.description,
        'property_type', NEW.property_type
      )
    )
  );

  RETURN NEW;
END;
$function$;

-- handle_quotation_request_hubspot_sync
CREATE OR REPLACE FUNCTION public.handle_quotation_request_hubspot_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', 'contact',
        'email', NEW.contact_email,
        'data', jsonb_build_object(
          'email', NEW.contact_email,
          'name', NEW.contact_name,
          'phone', NEW.contact_phone,
          'company', NEW.company_name,
          'source', 'quotation_request'
        )
      )
    );
    
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', 'deal',
        'email', NEW.contact_email,
        'data', jsonb_build_object(
          'service_type', 'Corporate Retreat',
          'company', NEW.company_name,
          'budget_range', NEW.budget_range,
          'total_amount', NEW.total_amount
        )
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- handle_quotation_request_emails
CREATE OR REPLACE FUNCTION public.handle_quotation_request_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', 'quote_follow_up',
        'data', jsonb_build_object(
          'email', NEW.contact_email,
          'name', NEW.contact_name,
          'company', NEW.company_name,
          'quote_reference', NEW.quote_reference
        )
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 10) Storage: private bucket for sensitive docs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'provider-docs') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('provider-docs', 'provider-docs', false);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage their own files in provider-docs') THEN
    DROP POLICY "Users can manage their own files in provider-docs" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage all files in provider-docs') THEN
    DROP POLICY "Admins can manage all files in provider-docs" ON storage.objects;
  END IF;
END $$;

CREATE POLICY "Users can manage their own files in provider-docs"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'provider-docs' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'provider-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all files in provider-docs"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'provider-docs' AND has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'provider-docs' AND has_role(auth.uid(), 'admin'));
