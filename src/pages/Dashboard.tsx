import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useCreditsStore } from '../store/creditsStore';
import { useValidationStore } from '../store/validationStore';
import { Chart } from '../components/ui/Chart';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useCreditsStore();
  const { stats, fetchStats } = useValidationStore();

  useEffect(() => {
    fetchBalance();
    fetchStats();
  }, []);

  const mockChartData = [
    { name: 'Mon', validations: 12, success: 10 },
    { name: 'Tue', validations: 19, success: 16 },
    { name: 'Wed', validations: 15, success: 14 },
    { name: 'Thu', validations: 25, success: 22 },
    { name: 'Fri', validations: 22, success: 20 },
    { name: 'Sat', validations: 18, success: 16 },
    { name: 'Sun', validations: 8, success: 7 },
  ];

  const statCards = [
    {
      title: 'Total Validations',
      value: stats?.totalValidations || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Success Rate',
      value: `${((stats?.successRate || 0) * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Credits Used',
      value: stats?.creditsUsed || 0,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Credits Remaining',
      value: balance,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100">
            Here's an overview of your lead validation activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Weekly Validation Trends</h3>
            <Chart
              data={mockChartData}
              type="line"
              dataKey="validations"
              height={300}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Success Rate by Day</h3>
            <Chart
              data={mockChartData}
              type="bar"
              dataKey="success"
              height={300}
              color="#10b981"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Validated email', details: 'john.doe@example.com', time: '2 minutes ago', status: 'valid' },
              { action: 'Batch processing', details: 'leads_batch_1.csv (150 leads)', time: '1 hour ago', status: 'completed' },
              { action: 'Validated phone', details: '+1 (555) 123-4567', time: '3 hours ago', status: 'valid' },
              { action: 'Credits purchased', details: '500 credits added', time: '1 day ago', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-medium">Validate Single Lead</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <p className="font-medium">Batch Processing</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-medium">Buy Credits</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};