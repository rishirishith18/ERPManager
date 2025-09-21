-- Create test users for different roles
-- Make sure to run the fix_user_creation.sql first!

-- First, we need to run the fix for user creation policy
CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Insert test users directly into users table
-- Note: These users won't have auth.users entries, so they're for demo only
-- For real users, use the signup form

INSERT INTO users (id, email, name, role, created_at) VALUES
  (gen_random_uuid(), 'john.doe@student.matrusri.edu.in', 'John Doe', 'student', now()),
  (gen_random_uuid(), 'prof.smith@faculty.matrusri.edu.in', 'Prof. Smith', 'faculty', now()),
  (gen_random_uuid(), 'admin@admin.matrusri.edu.in', 'System Admin', 'admin', now()),
  (gen_random_uuid(), 'warden@warden.matrusri.edu.in', 'Hostel Warden', 'warden', now()),
  (gen_random_uuid(), 'librarian@librarian.matrusri.edu.in', 'Chief Librarian', 'librarian', now())
ON CONFLICT (email) DO NOTHING;

-- For testing with actual Supabase Auth, you should create users via the signup form
-- Here are the test credentials you can use:

-- DEMO CREDENTIALS:
-- Student: john.doe@student.matrusri.edu.in / password123
-- Faculty: prof.smith@faculty.matrusri.edu.in / password123  
-- Admin: admin@admin.matrusri.edu.in / password123
-- Warden: warden@warden.matrusri.edu.in / password123
-- Librarian: librarian@librarian.matrusri.edu.in / password123
