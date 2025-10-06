-- Create trigger to automatically send property listing notifications
CREATE OR REPLACE FUNCTION public.handle_property_listing_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Call the property-listing-notification edge function
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/property-listing-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'propertyData', json_build_object(
        'propertyName', NEW.property_name,
        'contactName', NEW.contact_name,
        'contactEmail', NEW.contact_email,
        'contactPhone', NEW.contact_phone,
        'propertyType', NEW.property_type,
        'location', NEW.location,
        'description', NEW.description
      )
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for property listing notifications
CREATE TRIGGER property_listing_notification_trigger
  AFTER INSERT ON public.property_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_property_listing_notification();