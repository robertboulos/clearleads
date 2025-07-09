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
      const response = await apiClient.get<{ balance: number }>(
        API_ENDPOINTS.billing.balance
      );
      set({ balance: response.data.balance, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch balance:', error);
    }
  },

  fetchTransactions: async () => {
    try {
      const response = await apiClient.get<CreditTransaction[]>(
        '/credits/transactions'
      );
      set({ transactions: response.data });
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