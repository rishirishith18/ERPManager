# EduNex

A comprehensive Education Management System built with React, TypeScript, and Supabase.

## Features

### Role-Based Access Control
- **Admin**: Complete system access with analytics and user management
- **Student**: Personal dashboard with fees, hostel, exams, and library access
- **Faculty**: Exam management and student oversight
- **Warden**: Hostel management and student administration
- **Librarian**: Library management and book transactions

### Modules
- 📊 **Dashboard**: Role-specific overview and statistics
- 💰 **Fee Management**: Track and manage student fees
- 🏠 **Hostel Management**: Room allocation and student housing
- 📚 **Library Management**: Book catalog and transaction tracking
- 📝 **Examination System**: Exam scheduling and result management
- 👥 **User Management**: Student and staff administration
- 📈 **Analytics**: Comprehensive reporting and insights

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rishirishith18/EduNex.git
cd EduNex
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
- Run the migration file `supabase/migrations/20250921080615_frosty_gate.sql` in your Supabase SQL editor
- Apply the user creation policy from `fix_user_creation.sql`

5. Start the development server:
```bash
npm run dev
```


## Email Domain-Based Role Assignment

The system automatically assigns roles based on email domains:

- `@admin.matrusri.edu.in` → Admin
- `@student.matrusri.edu.in` → Student  
- `@faculty.matrusri.edu.in` → Faculty
- `@warden.matrusri.edu.in` → Warden
- `@librarian.matrusri.edu.in` → Librarian
- `@matrusri.edu.in` → Student (default)

## Database Schema

The system includes comprehensive tables for:
- User management and authentication
- Student information and enrollment
- Fee transactions and payments
- Hostel rooms and allocations
- Exam scheduling and results
- Library books and transactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/rishirishith18/EduNex](https://github.com/rishirishith18/EduNex)

---

Built with ❤️ for Matrusri College
