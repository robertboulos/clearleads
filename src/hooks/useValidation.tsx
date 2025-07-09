import { useState } from 'react';
import { useValidationStore } from '../store/validationStore';
import { useCredits } from './useCredits';
import { ValidationResult } from '../types/api';

export const useValidation = () => {
  const { validateSingle, isLoading } = useValidationStore();
  const { hasCredits, useCredits } = useCredits();
  const [result, setResult] = useState<ValidationResult | null>(null);

  const validate = async (data: { email?: string; phone?: string }) => {
    if (!hasCredits(1)) {
      throw new Error('Insufficient credits. Please purchase more credits to continue.');
    }

    try {
      const validationResult = await validateSingle(data);
      setResult(validationResult);
      useCredits(validationResult.creditsUsed);
      return validationResult;
    } catch (error) {
      throw error;
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    validate,
    result,
    isLoading,
    clearResult,
  };
};