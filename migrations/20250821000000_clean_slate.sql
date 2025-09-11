-- Clean Slate: Drop all existing tables and start fresh
-- This will remove all the complex auth and user tables

-- Drop all existing tables in the public schema
DROP SCHEMA IF EXISTS public CASCADE;

-- Recreate the public schema
CREATE SCHEMA public;

-- Grant necessary permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Set the search path
SET search_path TO public;

-- Now we have a completely clean slate to build from scratch!
