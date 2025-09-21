import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vahobepdovxzaovutweg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaG9iZXBkb3Z4emFvdnV0d2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDI0MjYsImV4cCI6MjA3NDAxODQyNn0.H2SJTpHbfdzInSFuKtikw9KG7rIQYY6s3j4eLMXFjpQ';

// Direct PostgreSQL connection string (for server-side use only)
// WARNING: Never use this in client-side code for security reasons
export const databaseUrl = import.meta.env.DATABASE_URL || 'postgresql://postgres:[rishi123]@db.vahobepdovxzaovutweg.supabase.co:5432/postgres';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const validateCollegeDomain = (email: string): boolean => {
  return email.endsWith('@matrusri.edu.in') || 
         email.endsWith('@faculty.matrusri.edu.in') ||
         email.endsWith('@admin.matrusri.edu.in') ||
         email.endsWith('@warden.matrusri.edu.in') ||
         email.endsWith('@librarian.matrusri.edu.in') ||
         email.endsWith('@student.matrusri.edu.in');
};

export const extractRoleFromEmail = (email: string): string => {
  if (!email) return 'student';
  
  // Handle subdomain-based roles
  if (email.includes('@faculty.matrusri.edu.in')) return 'faculty';
  if (email.includes('@admin.matrusri.edu.in')) return 'admin';
  if (email.includes('@warden.matrusri.edu.in')) return 'warden';
  if (email.includes('@librarian.matrusri.edu.in')) return 'librarian';
  if (email.includes('@student.matrusri.edu.in')) return 'student';
  
  // Default to student for any @matrusri.edu.in email
  if (email.includes('@matrusri.edu.in')) return 'student';
  
  return 'student';
};