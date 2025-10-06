-- Delete orphaned quotation request line items first (to avoid foreign key violations)
DELETE FROM public.quotation_request_line_items 
WHERE quotation_request_id IN (
    SELECT id FROM public.quotation_requests WHERE user_id IS NULL
);

-- Delete the orphaned quotation requests (these are the security risk)
DELETE FROM public.quotation_requests WHERE user_id IS NULL;

-- Now we can safely apply the NOT NULL constraint
ALTER TABLE public.quotation_requests
ALTER COLUMN user_id SET NOT NULL;

-- Add constraint for line items
ALTER TABLE public.quotation_request_line_items
ADD CONSTRAINT fk_quotation_request_id_not_null
CHECK (quotation_request_id IS NOT NULL);