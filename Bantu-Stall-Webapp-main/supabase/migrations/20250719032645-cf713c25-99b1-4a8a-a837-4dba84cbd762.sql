
-- Drop existing quotation tables and recreate with proper structure
DROP TABLE IF EXISTS public.venue_quotation_requests CASCADE;
DROP TABLE IF EXISTS public.quotation_line_items CASCADE;
DROP TABLE IF EXISTS public.quotation_templates CASCADE;
DROP TABLE IF EXISTS public.quotation_activities CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  vat_id TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotation templates table
CREATE TABLE public.quotation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_notes TEXT,
  default_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create main quotations table
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.quotation_templates(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired', 'paid')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  client_notes TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Create quotation line items table
CREATE TABLE public.quotation_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  line_total DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotation activities table for tracking
CREATE TABLE public.quotation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Users can manage their own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for quotation templates
CREATE POLICY "Users can manage their own templates" ON public.quotation_templates
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for quotations
CREATE POLICY "Users can manage their own quotations" ON public.quotations
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for quotation line items (access through quotation ownership)
CREATE POLICY "Users can manage line items for their quotations" ON public.quotation_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quotations 
      WHERE quotations.id = quotation_line_items.quotation_id 
      AND quotations.user_id = auth.uid()
    )
  );

-- RLS Policies for quotation activities
CREATE POLICY "Users can view activities for their quotations" ON public.quotation_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quotations 
      WHERE quotations.id = quotation_activities.quotation_id 
      AND quotations.user_id = auth.uid()
    )
  );

-- Create function to generate quotation numbers
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_quotation_templates_updated_at BEFORE UPDATE ON public.quotation_templates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create trigger function to log quotation activities
CREATE OR REPLACE FUNCTION log_quotation_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for quotation activities
CREATE TRIGGER quotation_activity_trigger
  AFTER INSERT OR UPDATE ON public.quotations
  FOR EACH ROW EXECUTE PROCEDURE log_quotation_activity();

-- Create function to calculate quotation totals
CREATE OR REPLACE FUNCTION calculate_quotation_totals(quotation_uuid UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger function to update quotation totals when line items change
CREATE OR REPLACE FUNCTION update_quotation_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_quotation_totals(OLD.quotation_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_quotation_totals(NEW.quotation_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for line items to update quotation totals
CREATE TRIGGER update_quotation_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.quotation_line_items
  FOR EACH ROW EXECUTE PROCEDURE update_quotation_totals();

-- Create function to send quotation notification emails
CREATE OR REPLACE FUNCTION send_quotation_emails()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email notifications
CREATE TRIGGER quotation_email_notification_trigger
  AFTER UPDATE ON public.quotations
  FOR EACH ROW EXECUTE PROCEDURE send_quotation_emails();
