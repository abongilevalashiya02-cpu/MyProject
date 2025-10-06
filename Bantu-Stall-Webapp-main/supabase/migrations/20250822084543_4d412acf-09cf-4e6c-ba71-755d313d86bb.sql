-- Create comprehensive security framework for public forms

-- 1. Rate limiting table for form submissions
CREATE TABLE IF NOT EXISTS public.form_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user identifier
  form_type TEXT NOT NULL, -- Type of form being submitted
  submission_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_rate_limits_identifier_type ON public.form_rate_limits(identifier, form_type);
CREATE INDEX IF NOT EXISTS idx_form_rate_limits_window ON public.form_rate_limits(window_start);

-- 2. Security audit log for form submissions
CREATE TABLE IF NOT EXISTS public.form_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL,
  identifier TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'submission', 'blocked', 'suspicious'
  severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'critical'
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_security_logs_type_time ON public.form_security_logs(form_type, created_at);
CREATE INDEX IF NOT EXISTS idx_form_security_logs_severity ON public.form_security_logs(severity);

-- 3. Suspicious patterns detection table
CREATE TABLE IF NOT EXISTS public.form_suspicious_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  pattern_type TEXT NOT NULL, -- 'rapid_submission', 'duplicate_data', 'invalid_data'
  detection_count INTEGER DEFAULT 1,
  first_detected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_detected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  auto_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Function to check and enforce rate limits for forms
CREATE OR REPLACE FUNCTION public.check_form_rate_limit(
  _identifier TEXT,
  _form_type TEXT,
  _max_submissions INTEGER DEFAULT 3,
  _window_minutes INTEGER DEFAULT 60,
  _block_minutes INTEGER DEFAULT 1440 -- 24 hours
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
  existing_block TIMESTAMP WITH TIME ZONE;
  result JSONB;
BEGIN
  window_start_time := now() - (interval '1 minute' * _window_minutes);
  
  -- Check if currently blocked
  SELECT blocked_until INTO existing_block
  FROM public.form_rate_limits
  WHERE identifier = _identifier 
    AND form_type = _form_type
    AND blocked_until > now()
  LIMIT 1;
  
  IF existing_block IS NOT NULL THEN
    -- Log blocked attempt
    INSERT INTO public.form_security_logs (
      form_type, identifier, event_type, severity, details
    ) VALUES (
      _form_type, _identifier, 'blocked', 'warning',
      jsonb_build_object(
        'blocked_until', existing_block,
        'reason', 'rate_limit_exceeded'
      )
    );
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'blocked_until', existing_block,
      'retry_after', EXTRACT(EPOCH FROM (existing_block - now()))
    );
  END IF;
  
  -- Clean up old entries
  DELETE FROM public.form_rate_limits 
  WHERE window_start < window_start_time;
  
  -- Count current submissions in window
  SELECT COALESCE(SUM(submission_count), 0) INTO current_count
  FROM public.form_rate_limits
  WHERE identifier = _identifier 
    AND form_type = _form_type
    AND window_start >= window_start_time;
  
  -- Check if limit exceeded
  IF current_count >= _max_submissions THEN
    -- Block the identifier
    INSERT INTO public.form_rate_limits (
      identifier, form_type, submission_count, blocked_until
    ) VALUES (
      _identifier, _form_type, 1, 
      now() + (interval '1 minute' * _block_minutes)
    )
    ON CONFLICT (identifier, form_type) 
    DO UPDATE SET 
      submission_count = form_rate_limits.submission_count + 1,
      blocked_until = now() + (interval '1 minute' * _block_minutes);
    
    -- Log security event
    INSERT INTO public.form_security_logs (
      form_type, identifier, event_type, severity, details
    ) VALUES (
      _form_type, _identifier, 'rate_limit_exceeded', 'warning',
      jsonb_build_object(
        'submission_count', current_count + 1,
        'limit', _max_submissions,
        'window_minutes', _window_minutes
      )
    );
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'current_count', current_count + 1,
      'limit', _max_submissions
    );
  END IF;
  
  -- Record the submission
  INSERT INTO public.form_rate_limits (identifier, form_type, submission_count)
  VALUES (_identifier, _form_type, 1)
  ON CONFLICT (identifier, form_type) 
  DO UPDATE SET 
    submission_count = form_rate_limits.submission_count + 1,
    window_start = CASE 
      WHEN form_rate_limits.window_start < window_start_time THEN now()
      ELSE form_rate_limits.window_start 
    END;
  
  -- Log successful submission
  INSERT INTO public.form_security_logs (
    form_type, identifier, event_type, severity, details
  ) VALUES (
    _form_type, _identifier, 'submission_allowed', 'info',
    jsonb_build_object('submission_count', current_count + 1)
  );
  
  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', _max_submissions - current_count - 1
  );
END;
$$;

-- 5. Function to detect suspicious patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_form_patterns(
  _identifier TEXT,
  _form_data JSONB,
  _form_type TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  suspicious_score INTEGER := 0;
  issues TEXT[] := '{}';
  should_block BOOLEAN := false;
BEGIN
  -- Check for rapid submissions (more than 3 in 5 minutes)
  IF (
    SELECT COUNT(*) 
    FROM public.form_security_logs 
    WHERE identifier = _identifier 
      AND form_type = _form_type
      AND event_type = 'submission_allowed'
      AND created_at > now() - interval '5 minutes'
  ) > 3 THEN
    suspicious_score := suspicious_score + 3;
    issues := array_append(issues, 'rapid_submission');
  END IF;
  
  -- Check for duplicate email patterns
  IF _form_data ? 'email' THEN
    IF (
      SELECT COUNT(*) 
      FROM public.form_security_logs 
      WHERE details->>'email' = _form_data->>'email'
        AND form_type = _form_type
        AND created_at > now() - interval '1 hour'
    ) > 2 THEN
      suspicious_score := suspicious_score + 2;
      issues := array_append(issues, 'duplicate_email');
    END IF;
  END IF;
  
  -- Check for suspicious data patterns
  IF _form_data ? 'email' AND (_form_data->>'email') SIMILAR TO '%test%|%fake%|%spam%' THEN
    suspicious_score := suspicious_score + 2;
    issues := array_append(issues, 'suspicious_email');
  END IF;
  
  -- Auto-block if score too high
  IF suspicious_score >= 5 THEN
    should_block := true;
    
    -- Log critical security event
    INSERT INTO public.form_security_logs (
      form_type, identifier, event_type, severity, details
    ) VALUES (
      _form_type, _identifier, 'suspicious_activity', 'critical',
      jsonb_build_object(
        'suspicious_score', suspicious_score,
        'issues', issues,
        'auto_blocked', true
      )
    );
    
    -- Block the identifier
    INSERT INTO public.form_rate_limits (
      identifier, form_type, submission_count, blocked_until
    ) VALUES (
      _identifier, _form_type, 1, now() + interval '24 hours'
    )
    ON CONFLICT (identifier, form_type) 
    DO UPDATE SET blocked_until = now() + interval '24 hours';
  END IF;
  
  RETURN jsonb_build_object(
    'suspicious_score', suspicious_score,
    'issues', issues,
    'should_block', should_block
  );
END;
$$;

-- 6. Enable RLS on new tables
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_suspicious_patterns ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies (admin only access)
CREATE POLICY "Only admins can access form rate limits" 
ON public.form_rate_limits 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can access form security logs" 
ON public.form_security_logs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can access suspicious patterns" 
ON public.form_suspicious_patterns 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));