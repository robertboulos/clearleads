import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useCreditsStore } from '../store/creditsStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { PLANS } from '../utils/constants';
import { formatCurrency, formatDateTime } from '../utils/formatting';
import { CreditCard, TrendingUp, Receipt, ExternalLink } from 'lucide-react';
import { stripeService } from '../services/stripe';
import toast from 'react-hot-toast';

export const Billing: React.FC = () => {
  const { balance, transactions, fetchBalance, fetchTransactions } = useCreditsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      const session = await stripeService.createCheckoutSession(planId);
      stripeService.redirectToCheckout(session.sessionId);
    } catch (error) {
      toast.error('Failed to start checkout process');
    }
  };

  const handleBillingPortal = async () => {
    try {
      const portal = await stripeService.createBillingPortal();
      stripeService.redirectToBillingPortal(portal.portalUrl);
    } catch (error) {
      toast.error('Failed to open billing portal');
    }
  };

  const currentPlan = PLANS.find(plan => plan.id === user?.plan);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Billing & Credits</h1>
          <Button onClick={handleBillingPortal} variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Billing Portal</span>
            <span className="sm:hidden">Portal</span>
          </Button>
        </div>

        {/* Current Plan & Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {currentPlan?.name}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Monthly Price</span>
                <span className="font-medium">{formatCurrency(currentPlan?.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Included Credits</span>
                <span className="font-medium">{currentPlan?.credits || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Credit Balance</h3>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {balance}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Available Credits</span>
                <span className="font-medium">{balance}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(balance / (currentPlan?.credits || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Plans */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upgrade Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 ${
                  plan.id === user?.plan
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(plan.price)}
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className="w-full"
                  variant={plan.id === user?.plan ? 'outline' : 'primary'}
                  disabled={plan.id === user?.plan}
                >
                  {plan.id === user?.plan ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'purchase' ? 'bg-green-100' :
                      transaction.type === 'usage' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      {transaction.type === 'purchase' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      ) : transaction.type === 'usage' ? (
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      ) : (
                        <Receipt className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {transaction.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end ml-9 sm:ml-0">
                    <p className={`font-medium text-sm sm:text-base ${
                      transaction.type === 'purchase' ? 'text-green-600' :
                      transaction.type === 'usage' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};