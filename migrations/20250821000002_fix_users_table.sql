-- Fix Users Table for Credentials + Google OAuth
-- This table will handle both email/password and Google OAuth users

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Create the users table
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    
    -- For credential-based users
    password VARCHAR(255), -- NULL for OAuth users
    
    -- For OAuth users
    google_id VARCHAR(255) UNIQUE, -- Google OAuth ID
    image_url TEXT, -- Profile picture from Google
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either password or google_id is present
    CONSTRAINT check_auth_method CHECK (
        (password IS NOT NULL) OR (google_id IS NOT NULL)
    )
);

-- Create indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_google_id ON public.users(google_id);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO public;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
