import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';

export const useAuth = () => {
  const { user, isAuthenticated, refreshUser } = useAuthStore();

  useEffect(() => {
    const token = authService.getToken();
    if (token && !user) {
      refreshUser();
    }
  }, []);

  return {
    user,
    isAuthenticated,
    refreshUser,
  };
};