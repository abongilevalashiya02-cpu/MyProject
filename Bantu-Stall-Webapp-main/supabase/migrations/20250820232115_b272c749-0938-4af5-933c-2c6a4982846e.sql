-- ========================================
-- MOVE EXTENSIONS FROM PUBLIC SCHEMA
-- ========================================

-- Create dedicated schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move extensions from public schema to extensions schema
-- Note: This may require manual intervention depending on which extensions are installed
-- Common extensions that might be in public:
-- - pgcrypto, uuid-ossp, etc.

-- Move pgcrypto if it exists in public
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION pgcrypto SET SCHEMA extensions;
    END IF;
END $$;

-- Move uuid-ossp if it exists in public  
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
    END IF;
END $$;

-- Update search path to include extensions schema
ALTER DATABASE postgres SET search_path = "$user", public, extensions;