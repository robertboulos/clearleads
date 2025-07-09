import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/user';
import { authService, LoginCredentials, RegisterData } from '../services/auth';

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshUser: async () => {
        if (!get().isAuthenticated) return;
        
        try {
          const user = await authService.me();
          set({ user });
        } catch (error) {
          get().logout();
        }
      },

      updateUser: (updates: Partial<UserProfile>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);