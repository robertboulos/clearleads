import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useValidationStore } from '../store/validationStore';
import { useCreditsStore } from '../store/creditsStore';
import { ValidationResult } from '../types/api';
import { VALIDATION_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Mail, 
  Phone, 
  ArrowRight,
  Zap,
  Upload,
  History
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export const Validate: React.FC = () => {
  const { validateSingle, results, isLoading, clearResults } = useValidationStore();
  const { balance, deductCredits } = useCreditsStore();
  const [selectedResult, setSelectedResult] = useState<ValidationResult | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [validationType, setValidationType] = useState<'email' | 'phone' | 'both'>('email');

  // Clear any existing results that might have object fields on component mount
  useEffect(() => {
    clearResults();
  }, [clearResults]);

  const handleValidate = async () => {
    if (!email && !phone) {
      toast.error('Please enter an email or phone number');
      return;
    }

    if (balance < 1) {
      toast.error('Insufficient credits. Please purchase more credits.');
      return;
    }

    try {
      const data: { email?: string; phone?: string } = {};
      if (validationType === 'email' || validationType === 'both') {
        data.email = email;
      }
      if (validationType === 'phone' || validationType === 'both') {
        data.phone = phone;
      }

      const result = await validateSingle(data);
      deductCredits(result.creditsUsed);
      toast.success('Validation completed!');
      
      // Clear form
      setEmail('');
      setPhone('');
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Validation</h1>
            <p className="text-gray-600 mt-1">Validate emails and phone numbers instantly</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
              {balance} credits available
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Validation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Single Validation</h2>
                  <p className="text-gray-600">Validate individual leads quickly</p>
                </div>
              </div>

              {/* Validation Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Validation Type
                </label>
                <div className="flex space-x-4">
                  {[
                    { id: 'email', label: 'Email Only', icon: Mail },
                    { id: 'phone', label: 'Phone Only', icon: Phone },
                    { id: 'both', label: 'Both', icon: CheckCircle }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setValidationType(type.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        validationType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                {(validationType === 'email' || validationType === 'both') && (
                  <Input
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    placeholder="Enter email to validate"
                  />
                )}

                {(validationType === 'phone' || validationType === 'both') && (
                  <Input
                    type="tel"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                    placeholder="Enter phone number to validate"
                  />
                )}
              </div>

              {/* Validate Button */}
              <Button
                onClick={handleValidate}
                loading={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                disabled={(!email && !phone) || balance < 1}
              >
                <Zap className="w-5 h-5 mr-2" />
                Validate Lead (1 credit)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Additional Options */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Batch Upload</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <History className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">View History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
            
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No validations yet</p>
                <p className="text-gray-400 text-sm mt-1">Submit a lead to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 5).map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          VALIDATION_STATUSES[result.status as keyof typeof VALIDATION_STATUSES]?.color
                        }`}>
                          {VALIDATION_STATUSES[result.status as keyof typeof VALIDATION_STATUSES]?.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {result.creditsUsed} credit{result.creditsUsed !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {result.email && (
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {result.email}
                        </p>
                      )}
                      {result.phone && (
                        <p className="font-medium text-gray-900 text-sm">
                          {result.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDateTime(result.createdAt)}
                      </p>
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
            <div className="bg-white rounded-xl max-w-lg w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Validation Details</h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedResult.email ? 'Email Address' : 'Phone Number'}
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 font-mono">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validation Status
                    </label>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedResult.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        VALIDATION_STATUSES[selectedResult.status as keyof typeof VALIDATION_STATUSES]?.color
                      }`}>
                        {VALIDATION_STATUSES[selectedResult.status as keyof typeof VALIDATION_STATUSES]?.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confidence Score
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedResult.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedResult.confidence}%
                      </span>
                    </div>
                  </div>

                  {Object.keys(selectedResult.details).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        {selectedResult.details.domain && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Domain:</span>
                            <span className="font-medium">
                              {typeof selectedResult.details.domain === 'object' 
                                ? JSON.stringify(selectedResult.details.domain) 
                                : selectedResult.details.domain}
                            </span>
                          </div>
                        )}
                        {selectedResult.details.provider && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Provider:</span>
                            <span className="font-medium">
                              {typeof selectedResult.details.provider === 'object' 
                                ? JSON.stringify(selectedResult.details.provider) 
                                : selectedResult.details.provider}
                            </span>
                          </div>
                        )}
                        {selectedResult.details.carrier && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carrier:</span>
                            <span className="font-medium">
                              {typeof selectedResult.details.carrier === 'object' 
                                ? JSON.stringify(selectedResult.details.carrier) 
                                : selectedResult.details.carrier}
                            </span>
                          </div>
                        )}
                        {selectedResult.details.country && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Country:</span>
                            <span className="font-medium">
                              {typeof selectedResult.details.country === 'object' 
                                ? JSON.stringify(selectedResult.details.country) 
                                : selectedResult.details.country}
                            </span>
                          </div>
                        )}
                        {/* Handle any other detail fields that might be objects */}
                        {Object.entries(selectedResult.details).map(([key, value]) => {
                          // Skip already rendered fields
                          if (['domain', 'provider', 'carrier', 'country'].includes(key)) {
                            return null;
                          }
                          
                          return (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium">
                                {typeof value === 'object' && value !== null
                                  ? JSON.stringify(value)
                                  : String(value || 'N/A')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 pt-4 border-t border-gray-100">
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