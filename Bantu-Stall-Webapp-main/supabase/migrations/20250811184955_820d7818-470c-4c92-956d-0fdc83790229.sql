-- Secure golden_tickets: restrict SELECT to admins only, keep public INSERTS

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.golden_tickets ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive or incorrect SELECT policy
DROP POLICY IF EXISTS "Allow admins to view all tickets" ON public.golden_tickets;

-- Create an explicit admin-only SELECT policy
CREATE POLICY "Admins can view all golden tickets"
ON public.golden_tickets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep existing public INSERT policy to allow submissions without login
-- If it doesn't exist for some reason, (re)create it idempotently
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'golden_tickets' 
      AND policyname = 'Allow public inserts'
  ) THEN
    CREATE POLICY "Allow public inserts"
    ON public.golden_tickets
    FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;
END $$;