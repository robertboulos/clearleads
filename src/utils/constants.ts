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
    refresh: '/auth/refresh'
  },
  validation: {
    single: '/api:73cwzomN/leads/validate',
    history: '/api:xJOhIs2L/validations/history',
    export: '/validations/export'
  },
  billing: {
    balance: '/api:W5kquLRH/credits/balance',
    checkout: '/api:tXGwpMzh/checkout/create-session',
    portal: '/subscriptions/create-billing-portal'
  }
};