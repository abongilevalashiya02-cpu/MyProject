-- First, let's create a system user UUID for orphaned records
-- Using a deterministic UUID for consistency
DO $$
DECLARE
    system_user_id UUID := 'ffffffff-ffff-ffff-ffff-ffffffffffff';
BEGIN
    -- Update NULL user_id records to use system user ID
    -- This preserves the data while making it secure
    UPDATE public.quotation_requests 
    SET user_id = system_user_id 
    WHERE user_id IS NULL;
    
    RAISE NOTICE 'Updated % records with NULL user_id', (SELECT COUNT(*) FROM public.quotation_requests WHERE user_id = system_user_id);
END $$;

-- Now we can safely apply the NOT NULL constraint
ALTER TABLE public.quotation_requests
ALTER COLUMN user_id SET NOT NULL;