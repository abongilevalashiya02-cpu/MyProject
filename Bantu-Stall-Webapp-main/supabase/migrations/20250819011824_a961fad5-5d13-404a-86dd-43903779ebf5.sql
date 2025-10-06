-- Fix Function Search Path Security Issues
-- Update existing functions to have proper security settings

-- Update the has_role function to be more secure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$function$;

-- Update generate_quotation_number function
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

-- Update check_signup_rate_limit function
CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(_email text, _ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    attempt_count integer;
BEGIN
    SELECT COUNT(*) INTO attempt_count
    FROM public.signup_attempts s
    WHERE (s.email = _email OR s.ip_address = _ip_address)
      AND s.created_at > now() - interval '1 hour';

    IF attempt_count >= 5 THEN
        RETURN false;
    END IF;

    INSERT INTO public.signup_attempts (email, ip_address) VALUES (_email, _ip_address);

    RETURN true;
END;
$function$;

-- Add rate limiting table for API calls
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user_id
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for efficient rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_identifier_endpoint 
ON public.api_rate_limits(identifier, endpoint, window_start);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier text,
  _endpoint text,
  _max_requests integer DEFAULT 100,
  _window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  window_start_time := now() - (interval '1 minute' * _window_minutes);
  
  -- Clean up old entries
  DELETE FROM public.api_rate_limits 
  WHERE window_start < window_start_time;
  
  -- Count current requests in window
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM public.api_rate_limits
  WHERE identifier = _identifier 
    AND endpoint = _endpoint 
    AND window_start >= window_start_time;
  
  -- Check if limit exceeded
  IF current_count >= _max_requests THEN
    RETURN false;
  END IF;
  
  -- Record this request
  INSERT INTO public.api_rate_limits (identifier, endpoint, request_count, window_start)
  VALUES (_identifier, _endpoint, 1, now())
  ON CONFLICT (identifier, endpoint) 
  DO UPDATE SET 
    request_count = api_rate_limits.request_count + 1,
    window_start = CASE 
      WHEN api_rate_limits.window_start < window_start_time THEN now()
      ELSE api_rate_limits.window_start 
    END;
    
  RETURN true;
END;
$function$;