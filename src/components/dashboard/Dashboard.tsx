import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardStats from './DashboardStats';
import { 
  Calendar, 
  Bell, 
  Clock, 
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  const getRecentActivities = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Users, text: '25 new admissions this week', time: '2 hours ago' },
          { icon: BookOpen, text: 'Fee reminder sent to 156 students', time: '4 hours ago' },
          { icon: Calendar, text: 'Exam schedule published', time: '1 day ago' },
          { icon: TrendingUp, text: 'Monthly report generated', time: '2 days ago' }
        ];
      case 'student':
        return [
          { icon: BookOpen, text: 'Assignment submitted for CS301', time: '1 hour ago' },
          { icon: Calendar, text: 'Upcoming exam: Database Systems', time: '3 days' },
          { icon: Bell, text: 'Fee payment reminder', time: '1 day ago' },
          { icon: Clock, text: 'Library book due tomorrow', time: '1 day left' }
        ];
      default:
        return [
          { icon: Bell, text: 'System maintenance scheduled', time: '2 hours ago' },
          { icon: Users, text: 'New user registrations', time: '1 day ago' }
        ];
    }
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white">
            {getWelcomeMessage()}
          </h1>
          <p className="text-blue-100 mt-2 capitalize">
            Welcome to your {user?.role} dashboard
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats userRole={user?.role || ''} />

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {user?.role === 'admin' && (
                <>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">View Students</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Fee Reports</p>
                  </button>
                </>
              )}
              {user?.role === 'student' && (
                <>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Pay Fees</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">View Results</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8 space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <li key={index}>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar or Chart Preview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {user?.role === 'student' ? 'Upcoming Schedule' : 'System Overview'}
          </h3>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {user?.role === 'student' 
                ? 'Your class schedule and exam dates will appear here'
                : 'Analytics charts and system metrics will be displayed here'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;