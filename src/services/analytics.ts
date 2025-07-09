import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface DashboardUsage {
  total_validations: number;
  valid_leads: number;
  invalid_leads: number;
  credits_used: number;
  credits_remaining: number;
  success_rate: number;
  daily_usage: {
    date: string;
    validations: number;
    credits_used: number;
  }[];
}

export interface EnhancedAnalytics {
  summary: {
    total_validations: number;
    total_credits_used: number;
    success_rate: number;
    cost_per_lead: number;
  };
  trends: {
    daily: {
      date: string;
      validations: number;
      credits_used: number;
      success_rate: number;
    }[];
    weekly_comparison: {
      this_week: number;
      last_week: number;
      change_percent: number;
    };
  };
  breakdown: {
    email_validations: number;
    phone_validations: number;
    both_validations: number;
  };
  top_domains: {
    domain: string;
    count: number;
    success_rate: number;
  }[];
}

export interface BusinessIntelligence {
  summary: {
    total_validations: number;
    total_credits_used: number;
    average_success_rate: number;
    cost_efficiency: number;
  };
  trends: {
    daily_breakdown: {
      date: string;
      validations: number;
      success_rate: number;
      credits_used: number;
    }[];
    peak_usage_times: {
      hour: number;
      validations: number;
    }[];
  };
  insights: {
    top_performing_domains: {
      domain: string;
      success_rate: number;
      volume: number;
    }[];
    validation_patterns: {
      email_only: number;
      phone_only: number;
      both: number;
    };
    cost_analysis: {
      total_spent: number;
      cost_per_validation: number;
      cost_per_valid_lead: number;
    };
  };
  recommendations: string[];
}

export interface CreditUsageAnalytics {
  current_period: {
    start_date: string;
    end_date: string;
    credits_used: number;
    validations_performed: number;
  };
  historical_usage: {
    date: string;
    credits_used: number;
    validations: number;
  }[];
  projections: {
    estimated_monthly_usage: number;
    estimated_monthly_cost: number;
    recommended_plan: string;
  };
}

export const analyticsService = {
  async getDashboardUsage(params?: { days?: number }): Promise<DashboardUsage> {
    const response = await apiClient.get<DashboardUsage>(
      API_ENDPOINTS.analytics.dashboard,
      params
    );
    return response.data;
  },

  async getEnhancedAnalytics(): Promise<EnhancedAnalytics> {
    const response = await apiClient.get<EnhancedAnalytics>(
      API_ENDPOINTS.analytics.enhanced
    );
    return response.data;
  },

  async getBusinessIntelligence(params?: { 
    days_back?: number;
    include_insights?: boolean;
  }): Promise<BusinessIntelligence> {
    const response = await apiClient.get<BusinessIntelligence>(
      API_ENDPOINTS.analytics.businessIntelligence,
      params
    );
    return response.data;
  },

  async getCreditUsageAnalytics(params?: { 
    days_back?: number;
  }): Promise<CreditUsageAnalytics> {
    const response = await apiClient.get<CreditUsageAnalytics>(
      API_ENDPOINTS.analytics.creditUsage,
      params
    );
    return response.data;
  }
};