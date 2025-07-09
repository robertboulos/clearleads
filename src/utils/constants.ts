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
    login: '/api:OPOJNxNZ/auth/login',
    register: '/api:AVa3mtMm/auth/register',
    me: '/api:Cq9vw928/auth/me',
    updateProfile: '/api:zuALhZYZ/auth/update_profile',
    changePassword: '/api:iH9tR1Te/auth/change-password',
    apiKey: '/api:7Z7a5X-n/auth/api_key',
    getApiKey: '/api:Xb-EGH2D/get_api_key',
    regenerateApiKey: '/api:y9reEK3Z/api-keys/regenerate'
  },
  validation: {
    single: '/api:73cwzomN/leads/validate',
    agent: '/api:wq8hJ7zF/leads/validate_agent',
    history: '/api:xJOhIs2L/validations/history',
    export: '/api:xJOhIs2L/validations/export'
  },
  batch: {
    uploadCsv: '/api:nR5KbC_9/batch/upload-csv',
    process: '/api:tQ2MhW6L/batch/process',
    status: '/api:pN4GhS8X/batch/status'
  },
  billing: {
    balance: '/api:W5kquLRH/credits/balance',
    checkout: '/api:tXGwpMzh/checkout/create-session',
    subscriptions: {
      create: '/api:eSGW4xYH/subscriptions/create',
      status: '/api:0HSeUiV4/subscription/status',
      billingPortal: '/api:HJabX04n/subscriptions/create-billing-portal'
    }
  },
  analytics: {
    dashboard: '/api:MEZwdqMc/dashboard/usage',
    enhanced: '/api:5H3BZ2_O/analytics/enhanced-dashboard',
    businessIntelligence: '/api:Go-dcsSE/analytics/business-intelligence',
    creditUsage: '/api:yHA-snLK/analytics/credit-usage'
  },
  webhooks: {
    stripeCheckout: '/api:07sxU8qI/webhooks/stripe-checkout',
    stripeSubscription: '/api:a0kwUccs/webhooks/stripe-subscription'
  }
};