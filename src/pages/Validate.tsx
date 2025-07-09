import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ValidationForm } from '../components/forms/ValidationForm';
import { useValidationStore } from '../store/validationStore';
import { useCreditsStore } from '../store/creditsStore';
import { ValidationResult } from '../types/api';
import { VALIDATION_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const Validate: React.FC = () => {
  const { validateSingle, results, isLoading } = useValidationStore();
  const { deductCredits } = useCreditsStore();
  const [selectedResult, setSelectedResult] = useState<ValidationResult | null>(null);

  const handleValidate = async (data: { email?: string; phone?: string }) => {
    try {
      const result = await validateSingle(data);
      deductCredits(result.creditsUsed);
      toast.success('Validation completed!');
    } catch (error: any) {
      toast.error(error.message || 'Validation failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'risky':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Lead Validation</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Validation Form */}
          <div>
            <ValidationForm onSubmit={handleValidate} isLoading={isLoading} />
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
            
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No validations yet. Submit a lead to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 5).map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {result.email || result.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(result.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          VALIDATION_STATUSES[result.status as keyof typeof VALIDATION_STATUSES]?.color
                        }`}>
                          {VALIDATION_STATUSES[result.status as keyof typeof VALIDATION_STATUSES]?.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {result.creditsUsed} credits
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result Details Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Validation Details</h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedResult.email ? 'Email' : 'Phone'}
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">
                        {selectedResult.email || selectedResult.phone}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedResult.email || selectedResult.phone || '')}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedResult.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        VALIDATION_STATUSES[selectedResult.status as keyof typeof VALIDATION_STATUSES]?.color
                      }`}>
                        {VALIDATION_STATUSES[selectedResult.status as keyof typeof VALIDATION_STATUSES]?.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confidence Score
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedResult.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedResult.confidence}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Details
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
                      {selectedResult.details.domain && (
                        <div>Domain: {selectedResult.details.domain}</div>
                      )}
                      {selectedResult.details.provider && (
                        <div>Provider: {selectedResult.details.provider}</div>
                      )}
                      {selectedResult.details.carrier && (
                        <div>Carrier: {selectedResult.details.carrier}</div>
                      )}
                      {selectedResult.details.country && (
                        <div>Country: {selectedResult.details.country}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Validated on {formatDateTime(selectedResult.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};