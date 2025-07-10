import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { useValidationStore } from '../store/validationStore';
import { ValidationResult } from '../types/api';
import { VALIDATION_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Search, Filter, Download } from 'lucide-react';

export const History: React.FC = () => {
  const { history, fetchHistory, isLoading } = useValidationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(result => {
    const matchesSearch = searchTerm === '' || 
      (result.email && result.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.phone && result.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'email' as keyof ValidationResult,
      label: 'Lead',
      render: (value: any, item: ValidationResult) => (
        <div>
          <div className="font-medium">{item.email || item.phone}</div>
          <div className="text-sm text-gray-500">
            {item.email ? 'Email' : 'Phone'}
          </div>
        </div>
      )
    },
    {
      key: 'status' as keyof ValidationResult,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          VALIDATION_STATUSES[value as keyof typeof VALIDATION_STATUSES]?.color
        }`}>
          {VALIDATION_STATUSES[value as keyof typeof VALIDATION_STATUSES]?.label}
        </span>
      )
    },
    {
      key: 'confidence' as keyof ValidationResult,
      label: 'Confidence',
      hideOnMobile: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      )
    },
    {
      key: 'creditsUsed' as keyof ValidationResult,
      label: 'Credits',
      hideOnMobile: true,
      render: (value: number) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'createdAt' as keyof ValidationResult,
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{formatDateTime(value)}</span>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Validation History</h1>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 self-start sm:self-auto">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="valid">Valid</option>
                <option value="invalid">Invalid</option>
                <option value="risky">Risky</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-md">
          <Table
            data={filteredHistory}
            columns={columns}
            loading={isLoading}
            emptyMessage="No validation history found"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {filteredHistory.length}
            </div>
            <div className="text-sm text-gray-600">Total Validations</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {filteredHistory.filter(r => r.status === 'valid').length}
            </div>
            <div className="text-sm text-gray-600">Valid</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {filteredHistory.filter(r => r.status === 'invalid').length}
            </div>
            <div className="text-sm text-gray-600">Invalid</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {filteredHistory.filter(r => r.status === 'risky').length}
            </div>
            <div className="text-sm text-gray-600">Risky</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};