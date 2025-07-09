export interface ValidationRequest {
  email?: string;
  phone?: string;
}

export interface BatchValidationFile {
  file: File;
  preview: string[][];
  columns: {
    email?: number;
    phone?: number;
  };
}

export interface ValidationHistory {
  id: string;
  type: 'single' | 'batch';
  email?: string;
  phone?: string;
  fileName?: string;
  status: 'valid' | 'invalid' | 'risky' | 'unknown';
  creditsUsed: number;
  createdAt: string;
  results?: ValidationResult[];
}

export interface ValidationStats {
  totalValidations: number;
  successRate: number;
  creditsUsed: number;
  averageConfidence: number;
  topDomains: Array<{
    domain: string;
    count: number;
    successRate: number;
  }>;
  dailyUsage: Array<{
    date: string;
    count: number;
    successRate: number;
  }>;
}