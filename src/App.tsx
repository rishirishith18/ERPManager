import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import AdmissionsModule from './components/modules/AdmissionsModule';
import FeesModule from './components/modules/FeesModule';
import LibraryDashboard from './components/library/LibraryDashboard';
import HostelDashboard from './components/hostel/HostelDashboard';
import ResultsPage from './components/results/ResultsPage';
import AttendanceDashboard from './components/attendance/AttendanceDashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Role-based default page redirection
  React.useEffect(() => {
    if (user) {
      const getDefaultTabForRole = (role: string) => {
        switch (role) {
          case 'admin':
            return 'analytics'; // Admin sees analytics/overview first
          case 'student':
            return 'fees'; // Students see their fees first
          case 'faculty':
            return 'exams'; // Faculty sees exam management first
          case 'warden':
            return 'hostel'; // Warden sees hostel management first
          case 'librarian':
            return 'library-dashboard'; // Librarian gets their own dashboard
          default:
            return 'dashboard';
        }
      };
      
      const defaultTab = getDefaultTabForRole(user.role);
      setActiveTab(defaultTab);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    // Show library dashboard for librarian users
    if (user?.role === 'librarian') {
      return <LibraryDashboard />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'admissions':
        return <AdmissionsModule />;
      case 'fees':
        return <FeesModule />;
      case 'hostel':
        return <HostelDashboard />;
      case 'exams':
        return <ResultsPage />;
      case 'attendance':
        return <AttendanceDashboard />;
      case 'library':
        return <LibraryDashboard />;
      case 'users':
        return (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Analytics and reporting features coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  // Librarian users get their own dashboard without the regular layout
  if (user?.role === 'librarian') {
    return renderContent();
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;