-- Step 1: Create the dedicated schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Step 2: Alter the extension to move it to the new schema
ALTER EXTENSION pg_net SET SCHEMA extensions;

-- Step 3: Verify it moved
SELECT extname, extnamespace::regnamespace AS schema_name
FROM pg_extension
WHERE extname = 'pg_net';