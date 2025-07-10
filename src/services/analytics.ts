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
    // Real API structure from integration tests
    const response = await apiClient.get<{
      success: boolean;
      user: {
        id: number;
        email: string;
        name: string;
        credits_remaining: number;
        credits_used_total: number;
      };
      period: {
        days: number;
        start_date: number;
      };
      validation_stats: {
        total_validations: number;
        successful_validations: number;
        failed_validations: number;
      };
      credit_stats: {
        credits_purchased: number;
        credits_used: number;
      };
    }>(API_ENDPOINTS.analytics.dashboard, params);

    // Transform real structure to expected interface
    const data = response.data;
    return {
      total_validations: data.validation_stats.total_validations,
      valid_leads: data.validation_stats.successful_validations,
      invalid_leads: data.validation_stats.failed_validations,
      credits_used: data.user.credits_used_total,
      credits_remaining: data.user.credits_remaining,
      success_rate: data.validation_stats.total_validations > 0 
        ? (data.validation_stats.successful_validations / data.validation_stats.total_validations) * 100 
        : 0,
      daily_usage: [] // Not provided in this endpoint
    };
  },

  async getEnhancedAnalytics(): Promise<EnhancedAnalytics> {
    // Real API structure from integration tests
    const response = await apiClient.get<{
      success: boolean;
      user_id: number;
      total_validations: number;
      quota_remaining: number;
      last_7_days: {
        validations: number;
        valid_leads: number;
        credits_used: number;
        success_rate_percent: number;
      };
      performance_metrics: {
        overall_success_rate_percent: number;
        avg_cost_per_valid_lead: number;
        total_credits_used: number;
      };
    }>(API_ENDPOINTS.analytics.enhanced);

    // Transform real structure to expected interface
    const data = response.data;
    const dailyData: EnhancedAnalytics['trends']['daily'] = [];
    
    // Create a simple 7-day trend from the aggregate data
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dailyData.push({
        date: date.toISOString().split('T')[0],
        validations: Math.floor(data.last_7_days.validations / 7),
        credits_used: Math.floor(data.last_7_days.credits_used / 7),
        success_rate: data.last_7_days.success_rate_percent,
      });
    }

    return {
      summary: {
        total_validations: data.total_validations,
        total_credits_used: data.performance_metrics.total_credits_used,
        success_rate: data.performance_metrics.overall_success_rate_percent,
        cost_per_lead: data.performance_metrics.avg_cost_per_valid_lead,
      },
      trends: {
        daily: dailyData,
        weekly_comparison: {
          this_week: data.last_7_days.validations,
          last_week: 0, // Not provided by API
          change_percent: 0, // Not provided by API
        },
      },
      breakdown: {
        email_validations: 0, // Not provided by API
        phone_validations: 0, // Not provided by API
        both_validations: data.total_validations,
      },
      top_domains: [], // Not provided by API
    };
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