import { apiClient } from './api';
import { User } from '../types/api';
import { API_ENDPOINTS } from '../utils/constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.auth.me);
    return response.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.auth.refresh
    );
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};