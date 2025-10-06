-- Create enum for service pricing models
CREATE TYPE service_pricing_model AS ENUM (
  'hourly',
  'daily',
  'per_person',
  'per_event',
  'per_word',
  'per_page',
  'fixed'
);

-- Create service catalog table
CREATE TABLE public.service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_category TEXT NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  pricing_model service_pricing_model NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  avg_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  unit TEXT,
  popular BOOLEAN DEFAULT false,
  icon_name TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quotation service items table
CREATE TABLE public.quotation_service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  service_catalog_id UUID REFERENCES public.service_catalog(id),
  service_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  duration_hours NUMERIC,
  duration_days NUMERIC,
  attendee_count INTEGER,
  subtotal NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quotation service providers linking table
CREATE TABLE public.quotation_service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_service_item_id UUID REFERENCES public.quotation_service_items(id) ON DELETE CASCADE,
  service_provider_id UUID REFERENCES public.service_provider_applications(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_service_providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_catalog (public read)
CREATE POLICY "Anyone can view service catalog"
ON public.service_catalog
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage service catalog"
ON public.service_catalog
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quotation_service_items
CREATE POLICY "Users can manage their quotation service items"
ON public.quotation_service_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quotation_requests
    WHERE quotation_requests.id = quotation_service_items.quotation_id
    AND quotation_requests.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quotation_requests
    WHERE quotation_requests.id = quotation_service_items.quotation_id
    AND quotation_requests.user_id = auth.uid()
  )
);

-- RLS Policies for quotation_service_providers
CREATE POLICY "Admins can manage service provider assignments"
ON public.quotation_service_providers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_service_catalog_category ON public.service_catalog(service_category);
CREATE INDEX idx_service_catalog_popular ON public.service_catalog(popular);
CREATE INDEX idx_quotation_service_items_quotation ON public.quotation_service_items(quotation_id);
CREATE INDEX idx_quotation_service_providers_item ON public.quotation_service_providers(quotation_service_item_id);

-- Seed service catalog with Johannesburg pricing
INSERT INTO public.service_catalog (service_category, service_name, description, pricing_model, min_price, max_price, avg_price, unit, popular, icon_name, tags) VALUES
-- Tour Guides & Cultural Experiences
('Tour Guides', 'Half-Day Private Tour', 'Private guided tour for half day', 'per_person', 1500, 2500, 2000, 'person', true, 'MapPin', ARRAY['cultural', 'tour']),
('Tour Guides', 'Full-Day Private Tour', 'Private guided tour for full day', 'per_person', 2500, 3700, 3100, 'person', true, 'MapPin', ARRAY['cultural', 'tour']),
('Tour Guides', 'Cultural Historian Tour', 'Guided cultural and historical experience', 'per_person', 1380, 3500, 2440, 'person', false, 'Library', ARRAY['cultural', 'history']),

-- Event Entertainment - MCs
('Event Entertainment', 'MC/Compere (Professional)', 'Professional event host for up to 4 hours', 'per_event', 10000, 20000, 15000, 'event', true, 'Mic', ARRAY['entertainment', 'speaking']),
('Event Entertainment', 'MC/Compere (Celebrity)', 'Celebrity event host for up to 4 hours', 'per_event', 25000, 55000, 40000, 'event', false, 'Star', ARRAY['entertainment', 'speaking', 'celebrity']),

-- Event Entertainment - Dance & Performance
('Event Entertainment', 'Gumboot Dancer (Solo)', 'Individual gumboot dancer for 10-15 min show', 'per_event', 1600, 1600, 1600, 'performer', false, 'Users', ARRAY['entertainment', 'cultural', 'dance']),
('Event Entertainment', 'Gumboot Dance Group (5)', 'Group of 5 gumboot dancers', 'per_event', 7000, 7000, 7000, 'group', true, 'Users', ARRAY['entertainment', 'cultural', 'dance']),
('Event Entertainment', 'Gumboot Dance Group (8)', 'Group of 8 gumboot dancers', 'per_event', 11000, 11000, 11000, 'group', false, 'Users', ARRAY['entertainment', 'cultural', 'dance']),
('Event Entertainment', 'Street Performer', 'Professional street performance act', 'per_event', 3600, 11100, 7350, 'event', false, 'Music', ARRAY['entertainment']),
('Event Entertainment', 'Drummer', 'Professional drummer performance', 'per_event', 8833, 8833, 8833, 'event', false, 'Music', ARRAY['entertainment', 'music']),
('Event Entertainment', 'Percussionist', 'Professional percussion performance', 'per_event', 12530, 12530, 12530, 'event', false, 'Music', ARRAY['entertainment', 'music']),

-- Event Entertainment - Music Groups
('Event Entertainment', 'Brass Band', 'Professional brass band performance', 'per_event', 1758, 26000, 13879, 'event', true, 'Music', ARRAY['entertainment', 'music']),
('Event Entertainment', 'Trumpeter', 'Professional trumpet performance', 'per_event', 13488, 13488, 13488, 'event', false, 'Music', ARRAY['entertainment', 'music']),
('Event Entertainment', 'Cultural Choir', 'Traditional choir performance', 'per_event', 2759, 20000, 11380, 'event', true, 'Music', ARRAY['entertainment', 'cultural', 'music']),
('Event Entertainment', 'Poet/Spoken Word Artist', 'Poetry and spoken word performance', 'per_event', 5000, 50875, 27938, 'event', false, 'Mic', ARRAY['entertainment', 'speaking', 'poetry']),

-- Event Planning & Coordination
('Event Planning', 'Event Planner (Hourly)', 'Professional event planning services per hour', 'hourly', 186, 186, 186, 'hour', false, 'Calendar', ARRAY['planning', 'coordination']),
('Event Planning', 'Wedding Coordinator', 'Complete wedding coordination service', 'per_event', 10000, 75000, 42500, 'event', true, 'Heart', ARRAY['planning', 'wedding']),
('Event Planning', 'Retreat Organizer', 'Corporate retreat organization package', 'per_event', 4300, 15000, 9650, 'event', true, 'Mountain', ARRAY['planning', 'retreat']),
('Event Planning', 'Bespoke Travel Concierge', 'Luxury travel planning (7-day plan)', 'per_event', 185000, 185000, 185000, 'event', false, 'Plane', ARRAY['planning', 'luxury', 'travel']),

-- Photography & Videography
('Photography', 'Couple Photography', 'Professional couple photo session per hour', 'hourly', 1000, 1500, 1250, 'hour', false, 'Camera', ARRAY['photography']),
('Photography', 'Corporate Photography', 'Business and corporate photography per hour', 'hourly', 1700, 2500, 2100, 'hour', true, 'Camera', ARRAY['photography', 'corporate']),
('Photography', 'Product Photography', 'Professional product photography per hour', 'hourly', 2000, 3000, 2500, 'hour', false, 'Camera', ARRAY['photography', 'product']),
('Photography', 'Event Photography (Half Day)', 'Professional event coverage for half day', 'per_event', 8500, 8500, 8500, 'event', true, 'Camera', ARRAY['photography', 'event']),
('Photography', 'Event Photography (Full Day)', 'Professional event coverage for full day', 'per_event', 16500, 16500, 16500, 'event', true, 'Camera', ARRAY['photography', 'event']),

-- Wellness & Spa Services
('Wellness', 'Full Body Massage (60 min)', 'Professional full body massage 60 minutes', 'per_person', 400, 960, 680, 'session', true, 'Heart', ARRAY['wellness', 'spa']),
('Wellness', 'Full Body Massage (90 min)', 'Professional full body massage 90 minutes', 'per_person', 1270, 1320, 1295, 'session', false, 'Heart', ARRAY['wellness', 'spa']),
('Wellness', 'Back & Neck Massage (30 min)', 'Targeted back and neck massage 30 minutes', 'per_person', 250, 250, 250, 'session', false, 'Heart', ARRAY['wellness', 'spa']),

-- Content Creation & Digital
('Content Creation', 'Content Creator (Beginner)', 'Beginner content creation services per hour', 'hourly', 150, 250, 200, 'hour', false, 'Video', ARRAY['digital', 'content']),
('Content Creation', 'Content Creator (Junior)', 'Junior content creation services per hour', 'hourly', 250, 450, 350, 'hour', false, 'Video', ARRAY['digital', 'content']),
('Content Creation', 'Social Media Management', 'Monthly social media management service', 'per_event', 1000, 6500, 3750, 'month', true, 'Smartphone', ARRAY['digital', 'social']),
('Content Creation', 'Influencer Post (Micro)', 'Social media influencer post (micro-influencer)', 'per_event', 500, 500, 500, 'post', false, 'Smartphone', ARRAY['digital', 'social', 'influencer']),
('Content Creation', 'Influencer Post (Celebrity)', 'Social media influencer post (celebrity)', 'per_event', 17667, 17667, 17667, 'post', false, 'Star', ARRAY['digital', 'social', 'influencer', 'celebrity']),

-- Translation Services
('Translation', 'Translation (Per Word)', 'Professional translation service per word', 'per_word', 0.90, 1.50, 1.20, 'word', false, 'Languages', ARRAY['language', 'translation']),
('Translation', 'Translation (Per Page)', 'Professional translation service per page', 'per_page', 500, 500, 500, 'page', true, 'Languages', ARRAY['language', 'translation']),

-- Adventure & Outdoor
('Adventure', 'Adventure Tour', 'Full day adventure tour experience', 'daily', 3180, 6700, 4940, 'day', true, 'Mountain', ARRAY['adventure', 'outdoor']),
('Adventure', 'Zipline/Activity', 'Zipline or adventure activity experience', 'per_person', 3180, 3180, 3180, 'person', false, 'Zap', ARRAY['adventure', 'outdoor']),

-- Culinary Services
('Culinary', 'Private Chef (2 guests)', 'Private chef service for 2 guests', 'per_person', 940, 940, 940, 'person', false, 'ChefHat', ARRAY['culinary', 'food']),
('Culinary', 'Private Chef (3-6 guests)', 'Private chef service for 3-6 guests', 'per_person', 700, 700, 700, 'person', true, 'ChefHat', ARRAY['culinary', 'food']),
('Culinary', 'Private Chef (Weekend 4-course)', 'Private chef weekend 4-course meal', 'per_person', 1400, 4700, 3050, 'person', false, 'ChefHat', ARRAY['culinary', 'food', 'luxury']),
('Culinary', 'Food Tour Guide', 'Guided culinary and food tour', 'per_person', 925, 1850, 1388, 'person', true, 'Utensils', ARRAY['culinary', 'tour']),
('Culinary', 'Mixologist (Daily)', 'Professional mixology service per day', 'daily', 1800, 1800, 1800, 'day', false, 'Wine', ARRAY['culinary', 'beverage']),
('Culinary', 'Mixologist (Event)', 'Professional mixology for event', 'per_event', 20000, 21000, 20500, 'event', true, 'Wine', ARRAY['culinary', 'beverage']),

-- Transportation & Logistics
('Transportation', 'Private Driver (Short Trip)', 'Private driver for short trips/few hours', 'per_event', 500, 1500, 1000, 'trip', true, 'Car', ARRAY['transport', 'logistics']);