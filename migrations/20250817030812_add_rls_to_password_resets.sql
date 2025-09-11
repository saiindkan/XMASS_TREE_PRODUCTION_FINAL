-- Enable RLS on password_resets table
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Allow public access for inserts (needed for password reset requests)
CREATE POLICY "Allow public inserts"
ON public.password_resets
FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to read their own password resets
CREATE POLICY "Allow select for user's own email"
ON public.password_resets
FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow updates for OTP verification
CREATE POLICY "Allow updates for verification"
ON public.password_resets
FOR UPDATE
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow deletes (for cleanup after successful password reset)
CREATE POLICY "Allow deletes for user's own email"
ON public.password_resets
FOR DELETE
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow service role to perform any operation (for server-side operations)
CREATE POLICY "Allow all for service role"
ON public.password_resets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
