-- Fix rate limiting function signature error
DROP FUNCTION IF EXISTS public.check_signup_rate_limit(text,text);

CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(_email text, _ip_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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