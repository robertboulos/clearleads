import { create } from 'zustand';
import { ValidationResult, BatchValidation } from '../types/api';
import { ValidationStats } from '../types/validation';
import { apiClient } from '../services/api';
import { analyticsService } from '../services/analytics';
import { API_ENDPOINTS } from '../utils/constants';
import { useAuthStore } from './authStore';

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
  sanitizeExistingResults: () => void;
}

// Helper function to ensure all values are safe for React rendering
const sanitizeForReact = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const useValidationStore = create<ValidationStore>((set, get) => ({
  results: [],
  history: [],
  batchValidations: [],
  stats: null,
  isLoading: false,

  validateSingle: async (data: { email?: string; phone?: string }) => {
    set({ isLoading: true });
    try {
      // Get user's actual API key from auth store
      const authState = useAuthStore.getState();
      const userApiKey = authState.user?.apiKey;
      
      if (!userApiKey) {
        throw new Error('User API key not found. Please login again.');
      }
      
      // Add actual API key to validation request
      const validationData = {
        ...data,
        api_key: userApiKey // Use the actual user's API key
      };
      
      const response = await apiClient.post<any>(
        API_ENDPOINTS.validation.single,
        validationData
      );
      
      // Transform REAL Xano response to match ValidationResult interface
      // ACTUAL Xano response structure:
      // {
      //   email: {valid: true, provided: true},
      //   phone: {valid: false, provided: false}, 
      //   cached: false,
      //   success: true,
      //   credits_remaining: 496
      // }
      
      const emailResult = response.data.email || {};
      const phoneResult = response.data.phone || {};
      
      // Determine overall status based on email/phone validation
      let status = 'unknown';
      if (emailResult.valid === true || phoneResult.valid === true) {
        status = 'valid';
      } else if (emailResult.valid === false || phoneResult.valid === false) {
        status = 'invalid';
      }
      
      // Calculate confidence: 100 if valid, 0 if invalid
      const confidence = status === 'valid' ? 100 : 0;
      
      // Extract the actual email/phone strings from input data (not from response objects)
      const emailString = data.email || '';
      const phoneString = data.phone || '';
      
      // For now, details are minimal since this response format doesn't include domain/carrier info
      const details: Record<string, string> = {};
      
      // Handle timestamp robustly - use current time since response doesn't include timestamp
      const createdAt = new Date().toISOString();

      const result: ValidationResult = {
        id: Date.now().toString(), // Generate ID since response doesn't include one
        email: emailString,
        phone: phoneString,
        status,
        confidence,
        creditsUsed: 1, // Default since response doesn't specify credits used per validation
        details,
        createdAt
      };
      
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
      const response = await apiClient.get<{
        success: boolean;
        data: {
          validations: ValidationResult[];
          total: number;
        };
      }>(API_ENDPOINTS.validation.history, { page, limit });
      
      set({ 
        history: response.data.data.validations,
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
    // Sanitize the result to ensure no objects are in details
    const sanitizedResult: ValidationResult = {
      ...result,
      details: Object.fromEntries(
        Object.entries(result.details).map(([key, value]) => [
          key,
          sanitizeForReact(value)
        ])
      )
    };
    
    set(state => ({
      results: [sanitizedResult, ...state.results]
    }));
  },

  clearResults: () => {
    set({ results: [] });
  },

  // Clear any existing results that might have object fields
  sanitizeExistingResults: () => {
    set(state => ({
      results: state.results.map(result => ({
        ...result,
        details: Object.fromEntries(
          Object.entries(result.details).map(([key, value]) => [
            key,
            sanitizeForReact(value)
          ])
        )
      }))
    }));
  },
}));