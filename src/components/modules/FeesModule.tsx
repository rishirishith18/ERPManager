import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye
} from 'lucide-react';

interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  semester: string;
  year: string;
}

const FeesModule: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<FeeTransaction | null>(null);

  // Mock data - Add current user's transaction if they're a student
  const transactions: FeeTransaction[] = [
    {
      id: '1',
      studentId: 'MAT2024001',
      studentName: 'Rajesh Kumar',
      feeType: 'Tuition Fee',
      amount: 25000,
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      status: 'paid',
      semester: '2',
      year: '2024'
    },
    {
      id: '2',
      studentId: 'MAT2024002',
      studentName: 'Priya Sharma',
      feeType: 'Hostel Fee',
      amount: 15000,
      dueDate: '2024-02-15',
      status: 'pending',
      semester: '2',
      year: '2024'
    },
    {
      id: '3',
      studentId: 'MAT2024003',
      studentName: 'Amit Patel',
      feeType: 'Lab Fee',
      amount: 5000,
      dueDate: '2024-01-20',
      status: 'overdue',
      semester: '2',
      year: '2024'
    },
    // Add current student's paid fees if they're logged in as a student
    ...(user?.role === 'student' ? [
      {
        id: '4',
        studentId: user?.student_id || '16082733185',
        studentName: user?.name || 'KORIVI RISHIT',
        feeType: 'Tuition Fee',
        amount: 30000,
        dueDate: '2024-01-15',
        paidDate: '2024-01-10',
        status: 'paid' as const,
        semester: '1',
        year: '2024'
      },
      {
        id: '5',
        studentId: user?.student_id || '16082733185',
        studentName: user?.name || 'KORIVI RISHIT',
        feeType: 'Library Fee',
        amount: 2000,
        dueDate: '2024-02-01',
        paidDate: '2024-01-28',
        status: 'paid' as const,
        semester: '1',
        year: '2024'
      }
    ] : [])
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    
    // For students: show only their own paid fees
    if (user?.role === 'student') {
      const isOwnTransaction = transaction.studentId === user?.student_id;
      const isPaidFee = transaction.status === 'paid';
      return isOwnTransaction && isPaidFee && matchesSearch && matchesFilter;
    }
    
    // For other roles (admin, faculty): show all transactions based on search and filter
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics based on user role
  const getStatistics = () => {
    if (user?.role === 'student') {
      // For students: show only their own fees
      const ownTransactions = transactions.filter(t => t.studentId === user?.student_id);
      const ownPaidTransactions = ownTransactions.filter(t => t.status === 'paid');
      const ownPendingTransactions = ownTransactions.filter(t => t.status !== 'paid');
      
      return {
        totalAmount: ownTransactions.reduce((sum, t) => sum + t.amount, 0),
        paidAmount: ownPaidTransactions.reduce((sum, t) => sum + t.amount, 0),
        pendingAmount: ownPendingTransactions.reduce((sum, t) => sum + t.amount, 0)
      };
    } else {
      // For admin/faculty: show all fees
      return {
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        paidAmount: transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0),
        pendingAmount: transactions.filter(t => t.status !== 'paid').reduce((sum, t) => sum + t.amount, 0)
      };
    }
  };

  const { totalAmount, paidAmount, pendingAmount } = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'student' ? 'My Fee Payments' : 'Fee Management'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'student' 
            ? 'View your paid fee transactions and payment history' 
            : 'Manage student fee payments and collections'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {user?.role === 'student' ? 'Total My Fees' : 'Total Fees'}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">₹{totalAmount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {user?.role === 'student' ? 'Paid by Me' : 'Collected'}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">₹{paidAmount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {user?.role === 'student' ? 'My Pending' : 'Pending'}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">₹{pendingAmount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                        <div className="text-sm text-gray-500">{transaction.studentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.feeType}</div>
                      <div className="text-sm text-gray-500">{transaction.semester}/{transaction.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(transaction.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {transaction.status !== 'paid' && (
                          <button className="text-green-600 hover:text-green-500">
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-500">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Fee Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fee Type</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.feeType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-sm text-gray-900">₹{selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                {selectedTransaction.status !== 'paid' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Process Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesModule;