-- Create table for Horo application submissions
CREATE TABLE public.horo_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact Information (Step 1)
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  phone_number TEXT,
  
  -- Organizational Context (Step 2)
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  team_size TEXT NOT NULL,
  
  -- Experience Requirements (Step 3)
  objectives TEXT[] NOT NULL DEFAULT '{}',
  experience_details TEXT,
  locations TEXT,
  budget_range TEXT,
  source TEXT,
  
  -- Application status
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Optional user association
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.horo_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit horo applications" 
ON public.horo_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own applications" 
ON public.horo_applications 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create function to update timestamps
CREATE TRIGGER update_horo_applications_updated_at
BEFORE UPDATE ON public.horo_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification trigger for new applications
CREATE OR REPLACE FUNCTION public.handle_horo_application_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Call the horo-application-notification edge function using pg_net
  PERFORM net.http_post(
    url := 'https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/horo-application-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'applicationData', jsonb_build_object(
        'fullName', NEW.full_name,
        'workEmail', NEW.work_email,
        'phoneNumber', NEW.phone_number,
        'companyName', NEW.company_name,
        'jobTitle', NEW.job_title,
        'teamSize', NEW.team_size,
        'objectives', NEW.objectives,
        'experienceDetails', NEW.experience_details,
        'locations', NEW.locations,
        'budgetRange', NEW.budget_range,
        'source', NEW.source,
        'applicationId', NEW.id
      )
    )
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for notifications
CREATE TRIGGER horo_application_notification_trigger
AFTER INSERT ON public.horo_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_horo_application_notification();