export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'warden' | 'librarian' | 'admin';
  student_id?: string;
  created_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  semester: number;
  admission_date: string;
  status: 'active' | 'inactive' | 'graduated';
}

export interface FeeTransaction {
  id: string;
  student_id: string;
  amount: number;
  fee_type: string;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  paid_date?: string;
  receipt_url?: string;
  created_at: string;
}

export interface HostelRoom {
  id: string;
  room_number: string;
  capacity: number;
  current_occupancy: number;
  block: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface HostelAllocation {
  id: string;
  student_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date?: string;
  status: 'active' | 'checked_out';
}

export interface Exam {
  id: string;
  subject: string;
  exam_type: string;
  date: string;
  duration: number;
  max_marks: number;
  department: string;
  year: number;
  semester: number;
}

export interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number;
  grade: string;
  status: 'pass' | 'fail' | 'absent';
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
}

export interface BookTransaction {
  id: string;
  student_id: string;
  book_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine_amount?: number;
}