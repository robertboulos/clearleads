import { create } from 'zustand';
import { ValidationResult, BatchValidation } from '../types/api';
import { ValidationStats } from '../types/validation';
import { apiClient } from '../services/api';
import { analyticsService } from '../services/analytics';
import { API_ENDPOINTS } from '../utils/constants';

interface ValidationStore {
  results: ValidationResult[];
  history: ValidationResult[];
  batchValidations: BatchValidation[];
  stats: ValidationStats | null;
  isLoading: boolean;
  validateSingle: (data: { email?: string; phone?: string }) => Promise<ValidationResult>;
  fetchHistory: (page?: number, limit?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  addResult: (result: ValidationResult) => void;
  clearResults: () => void;
}

export const useValidationStore = create<ValidationStore>((set, get) => ({
  results: [],
  history: [],
  batchValidations: [],
  stats: null,
  isLoading: false,

  validateSingle: async (data: { email?: string; phone?: string }) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post<ValidationResult>(
        API_ENDPOINTS.validation.single,
        data
      );
      const result = response.data;
      
      // Add to results
      set(state => ({
        results: [result, ...state.results],
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchHistory: async (page = 1, limit = 20) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.paginated<ValidationResult>(
        API_ENDPOINTS.validation.history,
        { page, limit }
      );
      set({ 
        history: response.data,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch history:', error);
    }
  },

  fetchStats: async () => {
    try {
      const dashboardData = await analyticsService.getDashboardUsage();
      
      // Map DashboardUsage to ValidationStats
      const stats: ValidationStats = {
        totalValidations: dashboardData.total_validations,
        successRate: dashboardData.success_rate,
        creditsUsed: dashboardData.credits_used,
        averageConfidence: 0, // Not available in DashboardUsage, using default
        topDomains: [], // Not available in DashboardUsage, using empty array
        dailyUsage: dashboardData.daily_usage.map(day => ({
          date: day.date,
          count: day.validations,
          successRate: 0 // Not available in daily_usage, using default
        }))
      };
      
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  addResult: (result: ValidationResult) => {
    set(state => ({
      results: [result, ...state.results]
    }));
  },

  clearResults: () => {
    set({ results: [] });
  },
}));