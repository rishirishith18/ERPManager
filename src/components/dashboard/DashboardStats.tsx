import React from 'react';
import { 
  Users, 
  DollarSign, 
  Building, 
  BookOpen, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor()}`}>
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    <span className="ml-1">{change}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  userRole: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Total Students',
            value: '1,247',
            change: '+5.2%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Fee Collection',
            value: '₹12.4L',
            change: '+12.8%',
            changeType: 'positive' as const,
            icon: DollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'Hostel Occupancy',
            value: '89%',
            change: '+2.1%',
            changeType: 'positive' as const,
            icon: Building,
            color: 'bg-purple-500'
          },
          {
            title: 'Library Books',
            value: '15,678',
            change: '+234',
            changeType: 'positive' as const,
            icon: BookOpen,
            color: 'bg-orange-500'
          }
        ];
      
      case 'student':
        return [
          {
            title: 'Current CGPA',
            value: '8.4',
            icon: BookOpen,
            color: 'bg-blue-500'
          },
          {
            title: 'Pending Fees',
            value: '₹2,500',
            icon: DollarSign,
            color: 'bg-red-500'
          },
          {
            title: 'Books Issued',
            value: '3',
            icon: BookOpen,
            color: 'bg-green-500'
          },
          {
            title: 'Attendance',
            value: '92%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'bg-purple-500'
          }
        ];
      
      case 'faculty':
        return [
          {
            title: 'Total Students',
            value: '156',
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Pending Evaluations',
            value: '23',
            icon: AlertCircle,
            color: 'bg-orange-500'
          },
          {
            title: 'Classes This Week',
            value: '18',
            icon: BookOpen,
            color: 'bg-green-500'
          },
          {
            title: 'Average Attendance',
            value: '87%',
            icon: TrendingUp,
            color: 'bg-purple-500'
          }
        ];
      
      default:
        return [
          {
            title: 'Active Users',
            value: '1,247',
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'System Health',
            value: '99.9%',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'bg-green-500'
          }
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;