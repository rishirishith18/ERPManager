-- Fix user creation by adding INSERT policy for users table
-- This allows new users to create their profile during signup

CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Alternative: Allow anonymous insert (if you need signup without authentication first)
-- CREATE POLICY "Allow anonymous user creation"
--   ON users FOR INSERT
--   TO anon
--   WITH CHECK (true);
