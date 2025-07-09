import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { ApiResponse } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T,>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await apiCall();
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error: any) {
      setState({ 
        data: null, 
        loading: false, 
        error: error.message || 'An error occurred' 
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};