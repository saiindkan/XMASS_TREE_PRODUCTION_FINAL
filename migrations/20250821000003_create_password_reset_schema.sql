-- Create Password Reset Schema for OTP-based flow
-- This ensures all tables needed for the password reset flow exist

-- Create password_resets table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    reset_token TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_email_reset UNIQUE (email)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets (email);
CREATE INDEX IF NOT EXISTS idx_password_resets_reset_token ON public.password_resets (reset_token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON public.password_resets (expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_reset_token_expires_at ON public.password_resets (reset_token_expires_at);

-- Enable Row Level Security
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Create policies for password_resets table
CREATE POLICY "Allow password reset operations" ON public.password_resets
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON public.password_resets TO postgres;
GRANT ALL ON public.password_resets TO public;
GRANT ALL ON public.password_resets TO anon;
GRANT ALL ON public.password_resets TO authenticated;
GRANT ALL ON public.password_resets TO service_role;

-- Ensure users table has all required fields
DO $$ 
BEGIN
    -- Add google_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'google_id') THEN
        ALTER TABLE public.users ADD COLUMN google_id VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'image_url') THEN
        ALTER TABLE public.users ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_auth_method') THEN
        ALTER TABLE public.users ADD CONSTRAINT check_auth_method 
            CHECK ((password IS NOT NULL) OR (google_id IS NOT NULL));
    END IF;
END $$;

-- Create indexes for users table if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON public.users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create trigger for password_resets table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_password_resets_updated_at') THEN
        CREATE TRIGGER update_password_resets_updated_at 
            BEFORE UPDATE ON public.password_resets 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
