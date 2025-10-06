-- Fix security linter issues

-- 1. Add RLS policies for api_rate_limits table
CREATE POLICY "System can manage rate limits" 
ON public.api_rate_limits 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- 2. Update remaining functions to have proper search path
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
    IF OLD.status != NEW.status THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description, metadata)
      VALUES (
        NEW.id, 
        'status_changed', 
        'Status changed from ' || OLD.status || ' to ' || NEW.status,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    
    IF OLD.sent_at IS NULL AND NEW.sent_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'sent', 'Quotation sent to client');
    END IF;
    
    IF OLD.viewed_at IS NULL AND NEW.viewed_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'viewed', 'Quotation viewed by client');
    END IF;
    
    IF OLD.accepted_at IS NULL AND NEW.accepted_at IS NOT NULL THEN
      INSERT INTO public.quotation_activities (quotation_id, activity_type, description)
      VALUES (NEW.id, 'accepted', 'Quotation accepted by client');
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;