export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  credits: number;
  apiKey: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface ValidationResult {
  id: string;
  email?: string;
  phone?: string;
  status: 'valid' | 'invalid' | 'risky' | 'unknown';
  emailStatus?: 'deliverable' | 'undeliverable' | 'risky' | 'unknown';
  phoneStatus?: 'valid' | 'invalid' | 'mobile' | 'landline' | 'unknown';
  confidence: number;
  details: {
    domain?: string;
    provider?: string;
    disposable?: boolean;
    roleAccount?: boolean;
    carrier?: string;
    lineType?: string;
    country?: string;
  };
  creditsUsed: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  createdAt: string;
  relatedValidation?: string;
}

export interface BatchValidation {
  id: string;
  fileName: string;
  totalRows: number;
  processedRows: number;
  validResults: number;
  invalidResults: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  creditsUsed: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}