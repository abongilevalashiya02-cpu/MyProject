-- Create missing enterprise quotation tables

-- Quotation approvals table
CREATE TABLE public.quotation_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  approver_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'requested_changes')),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer feedback table
CREATE TABLE public.customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quotation versions table
CREATE TABLE public.quotation_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  is_current BOOLEAN DEFAULT false,
  change_summary TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User notifications table
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User notification settings table
CREATE TABLE public.user_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  quotation_updates BOOLEAN DEFAULT true,
  approval_alerts BOOLEAN DEFAULT true,
  payment_notifications BOOLEAN DEFAULT true,
  system_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.quotation_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their quotation approvals" ON public.quotation_approvals FOR ALL USING (auth.uid() = approver_id);
CREATE POLICY "Users can manage their feedback" ON public.customer_feedback FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Users can manage their quotation versions" ON public.quotation_versions FOR ALL USING (EXISTS (SELECT 1 FROM quotation_requests WHERE quotation_requests.id = quotation_versions.quotation_id AND quotation_requests.user_id = auth.uid()));
CREATE POLICY "Users can manage their notifications" ON public.user_notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their notification settings" ON public.user_notification_settings FOR ALL USING (auth.uid() = user_id);