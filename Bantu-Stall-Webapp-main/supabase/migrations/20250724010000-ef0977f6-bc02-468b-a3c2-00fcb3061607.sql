-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Fix the property listing notification trigger function
CREATE OR REPLACE FUNCTION public.handle_property_listing_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Call the property-listing-notification edge function using pg_net
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/property-listing-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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