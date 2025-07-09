import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCreditsStore } from '../store/creditsStore';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { fetchBalance } = useCreditsStore();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refresh balance after successful payment
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your credits have been added to your account. You can now start validating leads.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                Transaction ID: {sessionId?.substring(0, 16)}...
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/dashboard" className="block">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/validate" className="block">
              <Button variant="outline" className="w-full">
                Start Validating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};