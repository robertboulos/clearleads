import { useEffect } from 'react';
import { useCreditsStore } from '../store/creditsStore';

export const useCredits = () => {
  const { balance, fetchBalance, deductCredits } = useCreditsStore();

  useEffect(() => {
    fetchBalance();
  }, []);

  const hasCredits = (required: number = 1) => {
    return balance >= required;
  };

  const useCredits = (amount: number) => {
    if (!hasCredits(amount)) {
      throw new Error('Insufficient credits');
    }
    deductCredits(amount);
  };

  return {
    balance,
    hasCredits,
    useCredits,
    refetchBalance: fetchBalance,
  };
};