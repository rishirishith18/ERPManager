/*
  # College ERP Database Schema

  1. New Tables
    - `users` - User authentication and role management
      - `id` (uuid, primary key)
      - `email` (text, unique, must be @matrusri.edu.in domain)
      - `name` (text)
      - `role` (enum: student, faculty, warden, librarian, admin)
      - `student_id` (text, nullable, auto-generated for students)
      - `created_at` (timestamp)

    - `students` - Student information
      - `id` (uuid, primary key)
      - `student_id` (text, unique, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `department` (text)
      - `year` (integer)
      - `semester` (integer)
      - `phone` (text)
      - `admission_date` (date)
      - `status` (enum: active, inactive, graduated)

    - `fee_transactions` - Fee management
      - `id` (uuid, primary key)
      - `student_id` (text, foreign key)
      - `amount` (decimal)
      - `fee_type` (text)
      - `status` (enum: pending, paid, overdue)
      - `due_date` (date)
      - `paid_date` (date, nullable)
      - `receipt_url` (text, nullable)
      - `semester` (text)
      - `year` (text)

    - `hostel_rooms` - Room management
      - `id` (uuid, primary key)
      - `room_number` (text, unique)
      - `capacity` (integer)
      - `current_occupancy` (integer, default 0)
      - `block` (text)
      - `floor` (integer)
      - `status` (enum: available, occupied, maintenance)

    - `hostel_allocations` - Student room allocations
      - `id` (uuid, primary key)
      - `student_id` (text, foreign key)
      - `room_id` (uuid, foreign key)
      - `check_in_date` (date)
      - `check_out_date` (date, nullable)
      - `status` (enum: active, checked_out)

    - `exams` - Exam management
      - `id` (uuid, primary key)
      - `subject` (text)
      - `exam_type` (text)
      - `date` (date)
      - `duration` (integer, minutes)
      - `max_marks` (integer)
      - `department` (text)
      - `year` (integer)
      - `semester` (integer)

    - `exam_results` - Student exam results
      - `id` (uuid, primary key)
      - `student_id` (text, foreign key)
      - `exam_id` (uuid, foreign key)
      - `marks_obtained` (integer)
      - `grade` (text)
      - `status` (enum: pass, fail, absent)

    - `library_books` - Library book catalog
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `isbn` (text, unique)
      - `category` (text)
      - `total_copies` (integer)
      - `available_copies` (integer)

    - `book_transactions` - Library book transactions
      - `id` (uuid, primary key)
      - `student_id` (text, foreign key)
      - `book_id` (uuid, foreign key)
      - `issue_date` (date)
      - `due_date` (date)
      - `return_date` (date, nullable)
      - `status` (enum: issued, returned, overdue)
      - `fine_amount` (decimal, default 0)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Domain validation for college emails

  3. Indexes and Constraints
    - Unique constraints for student IDs and room numbers
    - Foreign key relationships
    - Check constraints for valid data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'warden', 'librarian', 'admin');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'overdue');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance');
CREATE TYPE allocation_status AS ENUM ('active', 'checked_out');
CREATE TYPE exam_result_status AS ENUM ('pass', 'fail', 'absent');
CREATE TYPE transaction_status AS ENUM ('issued', 'returned', 'overdue');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
  student_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_email_domain CHECK (email LIKE '%@matrusri.edu.in')
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  department text NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1 AND 4),
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  phone text NOT NULL,
  admission_date date DEFAULT CURRENT_DATE,
  status student_status DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Fee transactions table
CREATE TABLE IF NOT EXISTS fee_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES students(student_id),
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  fee_type text NOT NULL,
  status fee_status DEFAULT 'pending',
  due_date date NOT NULL,
  paid_date date,
  receipt_url text,
  semester text NOT NULL,
  year text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Hostel rooms table
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text UNIQUE NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  current_occupancy integer DEFAULT 0 CHECK (current_occupancy >= 0),
  block text NOT NULL,
  floor integer NOT NULL CHECK (floor > 0),
  status room_status DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_occupancy CHECK (current_occupancy <= capacity)
);

-- Hostel allocations table
CREATE TABLE IF NOT EXISTS hostel_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES students(student_id),
  room_id uuid NOT NULL REFERENCES hostel_rooms(id),
  check_in_date date DEFAULT CURRENT_DATE,
  check_out_date date,
  status allocation_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (check_out_date IS NULL OR check_out_date >= check_in_date)
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  exam_type text NOT NULL,
  date date NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  max_marks integer NOT NULL CHECK (max_marks > 0),
  department text NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1 AND 4),
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  created_at timestamptz DEFAULT now()
);

-- Exam results table
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES students(student_id),
  exam_id uuid NOT NULL REFERENCES exams(id),
  marks_obtained integer NOT NULL CHECK (marks_obtained >= 0),
  grade text NOT NULL,
  status exam_result_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, exam_id)
);

-- Library books table
CREATE TABLE IF NOT EXISTS library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  category text NOT NULL,
  total_copies integer NOT NULL CHECK (total_copies > 0),
  available_copies integer NOT NULL CHECK (available_copies >= 0),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_available_copies CHECK (available_copies <= total_copies)
);

-- Book transactions table
CREATE TABLE IF NOT EXISTS book_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES students(student_id),
  book_id uuid NOT NULL REFERENCES library_books(id),
  issue_date date DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  return_date date,
  status transaction_status DEFAULT 'issued',
  fine_amount decimal(8,2) DEFAULT 0 CHECK (fine_amount >= 0),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_transaction_dates CHECK (due_date >= issue_date AND (return_date IS NULL OR return_date >= issue_date))
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can read own data"
  ON students FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'faculty', 'warden', 'librarian'))
  );

CREATE POLICY "Admin and faculty can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'faculty'))
  );

-- Fee transactions policies
CREATE POLICY "Students can read own fees"
  ON fee_transactions FOR SELECT
  TO authenticated
  USING (
    student_id IN (SELECT student_id FROM students WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin'))
  );

CREATE POLICY "Admin can manage all fees"
  ON fee_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Hostel policies
CREATE POLICY "Students can read own hostel data"
  ON hostel_allocations FOR SELECT
  TO authenticated
  USING (
    student_id IN (SELECT student_id FROM students WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'warden'))
  );

CREATE POLICY "Warden and admin can manage hostel"
  ON hostel_allocations FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'warden'))
  );

CREATE POLICY "Everyone can read room info"
  ON hostel_rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Warden and admin can manage rooms"
  ON hostel_rooms FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'warden'))
  );

-- Exam policies
CREATE POLICY "Students can read own results"
  ON exam_results FOR SELECT
  TO authenticated
  USING (
    student_id IN (SELECT student_id FROM students WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'faculty'))
  );

CREATE POLICY "Faculty and admin can manage exams"
  ON exams FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'faculty'))
  );

CREATE POLICY "Faculty and admin can manage results"
  ON exam_results FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'faculty'))
  );

-- Library policies
CREATE POLICY "Everyone can read books"
  ON library_books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Librarian and admin can manage books"
  ON library_books FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian'))
  );

CREATE POLICY "Students can read own transactions"
  ON book_transactions FOR SELECT
  TO authenticated
  USING (
    student_id IN (SELECT student_id FROM students WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian'))
  );

CREATE POLICY "Librarian and admin can manage transactions"
  ON book_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian'))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_transactions_student_id ON fee_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_transactions_status ON fee_transactions(status);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_student_id ON hostel_allocations(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_book_transactions_student_id ON book_transactions(student_id);

-- Function to auto-generate student ID
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_id IS NULL THEN
    NEW.student_id := 'MAT' || EXTRACT(YEAR FROM CURRENT_DATE) || 
                     LPAD(EXTRACT(DOY FROM CURRENT_DATE)::text, 3, '0') || 
                     LPAD(nextval('students_id_seq')::text, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for student ID generation
CREATE SEQUENCE IF NOT EXISTS students_id_seq START 1;

-- Create trigger for student ID generation
DROP TRIGGER IF EXISTS trigger_generate_student_id ON students;
CREATE TRIGGER trigger_generate_student_id
  BEFORE INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION generate_student_id();

-- Function to update room occupancy
CREATE OR REPLACE FUNCTION update_room_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  -- For new allocations
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE hostel_rooms 
    SET current_occupancy = current_occupancy + 1,
        status = CASE WHEN current_occupancy + 1 >= capacity THEN 'occupied' ELSE status END
    WHERE id = NEW.room_id;
  END IF;
  
  -- For status changes
  IF TG_OP = 'UPDATE' THEN
    -- Student checking out
    IF OLD.status = 'active' AND NEW.status = 'checked_out' THEN
      UPDATE hostel_rooms 
      SET current_occupancy = current_occupancy - 1,
          status = CASE WHEN current_occupancy - 1 = 0 THEN 'available' ELSE status END
      WHERE id = OLD.room_id;
    END IF;
    
    -- Student checking in
    IF OLD.status = 'checked_out' AND NEW.status = 'active' THEN
      UPDATE hostel_rooms 
      SET current_occupancy = current_occupancy + 1,
          status = CASE WHEN current_occupancy + 1 >= capacity THEN 'occupied' ELSE status END
      WHERE id = NEW.room_id;
    END IF;
  END IF;
  
  -- For deletions
  IF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE hostel_rooms 
    SET current_occupancy = current_occupancy - 1,
        status = CASE WHEN current_occupancy - 1 = 0 THEN 'available' ELSE status END
    WHERE id = OLD.room_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for room occupancy updates
DROP TRIGGER IF EXISTS trigger_update_room_occupancy ON hostel_allocations;
CREATE TRIGGER trigger_update_room_occupancy
  AFTER INSERT OR UPDATE OR DELETE ON hostel_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_room_occupancy();