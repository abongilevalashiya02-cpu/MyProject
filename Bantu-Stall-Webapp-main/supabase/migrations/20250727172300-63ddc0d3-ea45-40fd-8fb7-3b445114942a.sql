-- Update existing triggers to include HubSpot sync
-- Update contact inquiries to sync to HubSpot
CREATE OR REPLACE FUNCTION public.handle_contact_inquiry_automation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sync to HubSpot
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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
$$;

CREATE TRIGGER contact_inquiry_automation_trigger
  AFTER INSERT ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_contact_inquiry_automation();

-- Update newsletter subscriptions to sync to HubSpot and send welcome email
CREATE OR REPLACE FUNCTION public.handle_newsletter_subscription_automation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sync to HubSpot
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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

  -- Send welcome email
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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
$$;

CREATE TRIGGER newsletter_subscription_automation_trigger
  AFTER INSERT ON public.newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_newsletter_subscription_automation();

-- Update property listings to sync to HubSpot
CREATE OR REPLACE FUNCTION public.handle_property_listing_automation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sync contact to HubSpot
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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

  -- Sync company to HubSpot
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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
$$;

-- Drop existing trigger and create new one
DROP TRIGGER IF EXISTS property_listing_notification_trigger ON public.property_listings;
CREATE TRIGGER property_listing_automation_trigger
  AFTER INSERT ON public.property_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_property_listing_automation();

-- Update function search paths for security
ALTER FUNCTION public.handle_quotation_request_hubspot_sync() SET search_path = 'public';
ALTER FUNCTION public.handle_quotation_request_emails() SET search_path = 'public';