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
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useCreditsStore();
  const { stats, fetchStats } = useValidationStore();

  useEffect(() => {
    fetchBalance();
    fetchStats();
  }, []);

  // Use real data from stats if available, otherwise fallback to mock data
  const chartData = stats?.dailyUsage?.length ? 
    stats.dailyUsage.map(day => ({
      name: new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
      validations: day.count,
      success: Math.floor(day.count * (stats.successRate || 0.8)) // Estimate success count
    })) :
    [
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
      change: '+12%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Success Rate',
      value: `${((stats?.successRate || 0) * 100).toFixed(1)}%`,
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Credits Used',
      value: stats?.creditsUsed || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Credits Remaining',
      value: balance,
      change: '-15%',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-blue-100 text-base sm:text-lg">
                Here's your validation activity overview
              </p>
            </div>
            <div className="sm:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xl sm:text-2xl font-bold">{balance}</div>
                <div className="text-blue-100 text-sm">Credits Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs sm:text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Validation Trends</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <Chart
              data={chartData}
              type="line"
              dataKey="validations"
              height={250}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Success Rate</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <Chart
              data={chartData}
              type="bar"
              dataKey="success"
              height={250}
              color="#10b981"
            />
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { 
                  action: 'Email Validated', 
                  details: 'john.doe@example.com', 
                  time: '2 minutes ago', 
                  status: 'valid',
                  statusColor: 'bg-green-100 text-green-800'
                },
                { 
                  action: 'Batch Processing', 
                  details: 'leads_batch_1.csv (150 leads)', 
                  time: '1 hour ago', 
                  status: 'completed',
                  statusColor: 'bg-blue-100 text-blue-800'
                },
                { 
                  action: 'Phone Validated', 
                  details: '+1 (555) 123-4567', 
                  time: '3 hours ago', 
                  status: 'valid',
                  statusColor: 'bg-green-100 text-green-800'
                },
                { 
                  action: 'Credits Purchased', 
                  details: '500 credits added', 
                  time: '1 day ago', 
                  status: 'success',
                  statusColor: 'bg-purple-100 text-purple-800'
                }
              ].map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.action}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{activity.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end ml-5 sm:ml-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.statusColor}`}>
                      {activity.status}
                    </span>
                    <div className="text-xs sm:text-sm text-gray-500 sm:mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
            <div className="space-y-3 sm:space-y-4">
              <button className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Validate Single Lead</p>
                    <p className="text-xs sm:text-sm text-gray-600">Quick validation</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Batch Processing</p>
                    <p className="text-xs sm:text-sm text-gray-600">Upload CSV file</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Buy Credits</p>
                    <p className="text-xs sm:text-sm text-gray-600">Add more credits</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};