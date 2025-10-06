-- ----------------------------------------
-- Step 1: Ensure user_id cannot be NULL
-- ----------------------------------------
ALTER TABLE public.quotation_requests
ALTER COLUMN user_id SET NOT NULL;

-- Optional: ensure quotation_request_line_items always reference a valid quotation request
ALTER TABLE public.quotation_request_line_items
ADD CONSTRAINT fk_quotation_request_id_not_null
CHECK (quotation_request_id IS NOT NULL);

-- ----------------------------------------
-- Step 2: Secure policies for line items
-- ----------------------------------------
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage line items for their quotation requests" 
ON public.quotation_request_line_items;

-- Create new RLS policy for authenticated users
CREATE POLICY "Users can manage line items for their quotation requests" 
ON public.quotation_request_line_items 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.quotation_requests
    WHERE quotation_requests.id = quotation_request_line_items.quotation_request_id 
      AND quotation_requests.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.quotation_requests
    WHERE quotation_requests.id = quotation_request_line_items.quotation_request_id 
      AND quotation_requests.user_id = auth.uid()
  )
);

-- ----------------------------------------
-- Step 3: Secure policies for quotation requests
-- ----------------------------------------
DROP POLICY IF EXISTS "Users can manage their own quotation requests" 
ON public.quotation_requests;

DROP POLICY IF EXISTS "Anonymous users can create quotation requests" 
ON public.quotation_requests;

CREATE POLICY "Users can manage their own quotation requests" 
ON public.quotation_requests 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);