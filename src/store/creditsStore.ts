import { create } from 'zustand';
import { CreditTransaction } from '../types/api';
import { apiClient } from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

interface CreditsStore {
  balance: number;
  transactions: CreditTransaction[];
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  updateBalance: (amount: number) => void;
  deductCredits: (amount: number) => void;
}

export const useCreditsStore = create<CreditsStore>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,

  fetchBalance: async () => {
    set({ isLoading: true });
    try {
      // Use the REAL credits balance endpoint that has transactions
      const response = await apiClient.get<{
        success: boolean;
        data: {
          current_balance: number;
          total_used: number;
          quota_reset_date: string | null;
          recent_transactions: any[];
        };
      }>(API_ENDPOINTS.billing.balance);
      
      // REAL structure confirmed by integration tests - the structure was correct!
      set({ 
        balance: response.data.data.current_balance,
        transactions: response.data.data.recent_transactions || [],
        isLoading: false 
      });
      
      console.log('✅ Credits balance updated:', response.data.data.current_balance);
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch balance:', error);
    }
  },

  fetchTransactions: async () => {
    try {
      // Use the balance endpoint which includes recent transactions
      // The hardcoded '/credits/transactions' endpoint doesn't exist
      const response = await apiClient.get<{
        success: boolean;
        data: {
          current_balance: number;
          total_used: number;
          quota_reset_date: string | null;
          recent_transactions: any[];
        };
      }>(API_ENDPOINTS.billing.balance);
      
      set({ transactions: response.data.data.recent_transactions || [] });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  },

  updateBalance: (amount: number) => {
    set({ balance: amount });
  },

  deductCredits: (amount: number) => {
    const currentBalance = get().balance;
    set({ balance: Math.max(0, currentBalance - amount) });
  },
}));