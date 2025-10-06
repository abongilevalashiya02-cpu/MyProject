-- Fix critical security vulnerabilities by restricting access to customer data

-- 1. RESTRICT CUSTOMER DATA ACCESS TO ADMINS ONLY

-- Update newsletter_subscribers table policies
DROP POLICY IF EXISTS "Allow authenticated users to view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Only authenticated users can view waitlist entries" ON public.waitlist;

CREATE POLICY "Only admins can view newsletter subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update newsletter_subscriptions table policies  
DROP POLICY IF EXISTS "Authenticated users can view subscriptions" ON public.newsletter_subscriptions;

CREATE POLICY "Only admins can view newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update contact_inquiries table policies
DROP POLICY IF EXISTS "Authenticated users can view contact inquiries" ON public.contact_inquiries;

CREATE POLICY "Only admins can view contact inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update sponsor_inquiries table policies
DROP POLICY IF EXISTS "Authenticated users can view sponsor inquiries" ON public.sponsor_inquiries;

CREATE POLICY "Only admins can view sponsor inquiries" 
ON public.sponsor_inquiries 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update waitlist table policies
DROP POLICY IF EXISTS "Allow admin access to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Only authenticated users can view waitlist entries" ON public.waitlist;

CREATE POLICY "Only admins can view waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update vendor_listings to require authentication
DROP POLICY IF EXISTS "Anyone can view vendor listings" ON public.vendor_listings;

CREATE POLICY "Authenticated users can view vendor listings" 
ON public.vendor_listings 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);

-- 2. ADD MISSING RLS POLICY FOR SIGNUP_ATTEMPTS

-- Enable RLS on signup_attempts table
ALTER TABLE public.signup_attempts ENABLE ROW LEVEL SECURITY;

-- Only allow the system to manage signup attempts (no user access)
CREATE POLICY "System only access to signup attempts" 
ON public.signup_attempts 
FOR ALL 
USING (false);

-- 3. FIX DATABASE FUNCTION SECURITY ISSUES

-- Update functions to have proper search_path settings
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  next_number INTEGER;
  year_part TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(quotation_number FROM 'QTN-' || year_part || '-(\d+)') 
      AS INTEGER
    )
  ), 0) + 1
  INTO next_number
  FROM public.quotations
  WHERE quotation_number LIKE 'QTN-' || year_part || '-%';
  
  RETURN 'QTN-' || year_part || '-' || LPAD(next_number::TEXT, 3, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_quotation_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
    VALUES (NEW.id, 'created', 'Quotation created');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description, metadata)
      VALUES (
        NEW.id, 
        'status_changed', 
        'Status changed from ' || OLD.status || ' to ' || NEW.status,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    
    -- Log when quotation is sent
    IF OLD.sent_at IS NULL AND NEW.sent_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'sent', 'Quotation sent to client');
    END IF;
    
    -- Log when quotation is viewed
    IF OLD.viewed_at IS NULL AND NEW.viewed_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'viewed', 'Quotation viewed by client');
    END IF;
    
    -- Log when quotation is accepted
    IF OLD.accepted_at IS NULL AND NEW.accepted_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'accepted', 'Quotation accepted by client');
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_quotation_totals(quotation_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  calc_subtotal DECIMAL(10,2);
  calc_tax DECIMAL(10,2);
  calc_total DECIMAL(10,2);
BEGIN
  SELECT 
    COALESCE(SUM(quantity * unit_price), 0),
    COALESCE(SUM(quantity * unit_price * tax_rate / 100), 0)
  INTO calc_subtotal, calc_tax
  FROM public.quotation_line_items
  WHERE quotation_id = quotation_uuid;
  
  calc_total := calc_subtotal + calc_tax;
  
  UPDATE public.quotations
  SET 
    subtotal = calc_subtotal,
    tax_amount = calc_tax,
    total_amount = calc_total,
    updated_at = now()
  WHERE id = quotation_uuid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_quotation_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_quotation_totals(OLD.quotation_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_quotation_totals(NEW.quotation_id);
    RETURN NEW;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.send_quotation_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only trigger when status changes to 'sent'
  IF NEW.status = 'sent' AND (OLD.status IS NULL OR OLD.status != 'sent') THEN
    -- Call the quotation-notification edge function
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/quotation-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object(
        'quotation_id', NEW.id,
        'type', 'quotation_sent'
      )::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_automation_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Call the automation-emails edge function
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'type', TG_ARGV[0],
      'data', row_to_json(NEW)
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Trigger onboarding email
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'type', 'onboarding',
      'data', json_build_object('email', NEW.email)
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_payment_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
    -- Trigger payment confirmation email
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object(
        'type', 'payment_confirmation',
        'data', json_build_object(
          'contact_email', NEW.contact_email,
          'contact_name', NEW.contact_name,
          'amount', COALESCE(NEW.budget_range, 'TBD'),
          'booking_reference', NEW.id
        )
      )::jsonb
    );
  END IF;
  
  IF NEW.booking_status = 'confirmed' AND OLD.booking_status != 'confirmed' THEN
    -- Trigger booking confirmation email
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object(
        'type', 'booking_confirmation',
        'data', json_build_object(
          'contact_email', NEW.contact_email,
          'contact_name', NEW.contact_name,
          'venue_name', NEW.venue_name,
          'booking_details', json_build_object(
            'dates', NEW.preferred_dates,
            'guests', NEW.attendee_count
          )
        )
      )::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$function$;