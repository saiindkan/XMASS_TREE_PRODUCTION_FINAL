-- Create password_resets table
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

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets (email);
CREATE INDEX IF NOT EXISTS idx_password_resets_reset_token ON public.password_resets (reset_token);
