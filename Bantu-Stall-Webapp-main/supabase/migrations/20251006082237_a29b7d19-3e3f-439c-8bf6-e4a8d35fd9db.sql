-- Add new fields for enhanced quotation form

-- Add venue type field
ALTER TABLE public.quotation_requests 
ADD COLUMN IF NOT EXISTS venue_type TEXT;

-- Add accommodation requirement toggle
ALTER TABLE public.quotation_requests 
ADD COLUMN IF NOT EXISTS requires_accommodation BOOLEAN DEFAULT false;

-- Add room count fields
ALTER TABLE public.quotation_requests 
ADD COLUMN IF NOT EXISTS standard_rooms INTEGER;

ALTER TABLE public.quotation_requests 
ADD COLUMN IF NOT EXISTS executive_rooms INTEGER;

ALTER TABLE public.quotation_requests 
ADD COLUMN IF NOT EXISTS presidential_rooms INTEGER;

-- Add comment to explain the new fields
COMMENT ON COLUMN public.quotation_requests.venue_type IS 'Type of venue preferred: urban conference center, bush lodge, beach resort, etc.';
COMMENT ON COLUMN public.quotation_requests.requires_accommodation IS 'Whether client requires accommodation as part of the package';
COMMENT ON COLUMN public.quotation_requests.standard_rooms IS 'Number of standard rooms needed';
COMMENT ON COLUMN public.quotation_requests.executive_rooms IS 'Number of executive rooms needed';
COMMENT ON COLUMN public.quotation_requests.presidential_rooms IS 'Number of presidential/luxury suites needed';