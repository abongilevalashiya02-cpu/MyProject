-- Create quotation_requests table for the new 5-step quotation system
CREATE TABLE public.quotation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- Company Information
  company_name TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Step 1: Objectives & Outcomes
  event_objectives TEXT[] NOT NULL DEFAULT '{}',
  desired_outcomes TEXT[] NOT NULL DEFAULT '{}',
  additional_goals TEXT,
  
  -- Step 2: Event Details
  attendee_count INTEGER,
  event_duration INTEGER, -- in days
  preferred_dates TEXT,
  budget_range TEXT,
  special_requirements TEXT,
  
  -- Step 3: Venue Selection
  selected_venue_id UUID,
  venue_preferences TEXT,
  location_preference TEXT,
  
  -- Step 4: Services
  selected_services TEXT[] DEFAULT '{}',
  catering_requirements TEXT,
  transportation_needs TEXT,
  accommodation_type TEXT,
  
  -- Step 5: Review & Pricing
  subtotal NUMERIC(10,2) DEFAULT 0,
  vat_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  
  -- Workflow Status
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewing', 'quoted', 'accepted', 'declined')),
  quote_reference TEXT,
  quote_valid_until DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  quoted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own quotation requests" 
ON public.quotation_requests 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create quotation requests" 
ON public.quotation_requests 
FOR INSERT 
WITH CHECK (true);

-- Create quotation_request_line_items table
CREATE TABLE public.quotation_request_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_request_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  
  item_type TEXT NOT NULL, -- 'venue', 'service', 'accommodation', 'catering', 'transport'
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotation_request_line_items ENABLE ROW LEVEL SECURITY;

-- Create policy for line items
CREATE POLICY "Users can manage line items for their quotation requests" 
ON public.quotation_request_line_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.quotation_requests 
    WHERE id = quotation_request_line_items.quotation_request_id 
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_quotation_requests_updated_at
  BEFORE UPDATE ON public.quotation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for HubSpot sync
CREATE OR REPLACE FUNCTION public.handle_quotation_request_hubspot_sync()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Sync to HubSpot when quotation request is submitted
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
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
          'company', NEW.company_name,
          'source', 'quotation_request'
        )
      )
    );
    
    -- Also create a deal
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
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
$$;

CREATE TRIGGER quotation_request_hubspot_sync_trigger
  AFTER INSERT OR UPDATE ON public.quotation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quotation_request_hubspot_sync();

-- Create trigger for email automation
CREATE OR REPLACE FUNCTION public.handle_quotation_request_emails()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Send confirmation email when quotation request is submitted
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    PERFORM net.http_post(
      url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/automation-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
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
$$;

CREATE TRIGGER quotation_request_email_trigger
  AFTER INSERT OR UPDATE ON public.quotation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quotation_request_emails();