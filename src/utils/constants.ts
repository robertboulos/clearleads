export const PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: 9,
    credits: 100,
    features: [
      'Up to 100 validations/month',
      'Email validation',
      'Phone validation',
      'Basic analytics',
      'API access'
    ]
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 29,
    credits: 500,
    features: [
      'Up to 500 validations/month',
      'Email validation',
      'Phone validation',
      'Advanced analytics',
      'API access',
      'Batch processing',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    price: 79,
    credits: 2000,
    features: [
      'Up to 2000 validations/month',
      'Email validation',
      'Phone validation',
      'Advanced analytics',
      'API access',
      'Batch processing',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager'
    ]
  }
];

export const VALIDATION_STATUSES = {
  valid: { label: 'Valid', color: 'bg-green-100 text-green-800' },
  invalid: { label: 'Invalid', color: 'bg-red-100 text-red-800' },
  risky: { label: 'Risky', color: 'bg-yellow-100 text-yellow-800' },
  unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
};

export const API_ENDPOINTS = {
  auth: {
    login: '/api:Is1L6GFg/auth/login',
    register: '/api:Is1L6GFg/auth/register',
    me: '/api:Is1L6GFg/auth/me',
    verify: '/api:Is1L6GFg/auth/verify',
    updateProfile: '/api:Is1L6GFg/auth/update_profile',
    changePassword: '/api:Is1L6GFg/auth/change-password',
    apiKey: '/api:Is1L6GFg/auth/api_key',
    getApiKey: '/api:Is1L6GFg/get_api_key',
    regenerateApiKey: '/api:Is1L6GFg/api-keys/regenerate'
  },
  validation: {
    single: '/api:T86UHsBm/leads/validate',
    agent: '/api:T86UHsBm/leads/validate_agent',
    history: '/api:T86UHsBm/validations/history',
    export: '/api:T86UHsBm/validations/export'
  },
  batch: {
    uploadCsv: '/api:ZnbSzzpu/batch/upload-csv',
    process: '/api:ZnbSzzpu/batch/process',
    status: '/api:ZnbSzzpu/batch/status'
  },
  billing: {
    balance: '/api:Is1L6GFg/credits/balance',
    checkout: '/api:rKeV8O3i/checkout/create-session',
    subscriptions: {
      create: '/api:sXZrg4Gz/subscriptions/create',
      status: '/api:sXZrg4Gz/subscription/status',
      billingPortal: '/api:sXZrg4Gz/subscriptions/create-billing-portal'
    }
  },
  analytics: {
    dashboard: '/api:Is1L6GFg/dashboard/usage',
    enhanced: '/api:tBpehOS-/analytics/enhanced-dashboard',
    businessIntelligence: '/api:tBpehOS-/analytics/business-intelligence',
    creditUsage: '/api:tBpehOS-/analytics/credit-usage'
  },
  webhooks: {
    stripeCheckout: '/api:rKeV8O3i/webhooks/stripe-checkout',
    stripeSubscription: '/api:sXZrg4Gz/webhooks/stripe-subscription'
  }
};