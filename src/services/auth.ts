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
  company?: string;
}

export interface XanoLoginResponse {
  authToken: string;
}

export interface XanoRegisterResponse {
  user_id: number;
  email: string;
  name: string;
  stripe_customer_id: string;
  api_key: string;
  authToken: string;
  message: string;
}

export interface XanoUserResponse {
  id: number;
  email: string;
  name: string;
  company?: string;
  lead_quota_remaining: number;
  leads_used: number;
  created_at: string;
  API_Key: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<XanoLoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    
    // Store token and fetch user data
    const token = response.data.authToken;
    localStorage.setItem('token', token);
    
    const userResponse = await apiClient.get<XanoUserResponse>(API_ENDPOINTS.auth.me);
    
    const user: User = {
      id: userResponse.data.id.toString(),
      email: userResponse.data.email,
      name: userResponse.data.name,
      plan: 'starter', // Default plan, should be determined by backend
      credits: userResponse.data.lead_quota_remaining,
      apiKey: userResponse.data.API_Key,
      createdAt: userResponse.data.created_at,
      emailVerified: true
    };
    
    return { user, token };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<XanoRegisterResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    
    const token = response.data.authToken;
    localStorage.setItem('token', token);
    
    const user: User = {
      id: response.data.user_id.toString(),
      email: response.data.email,
      name: response.data.name,
      plan: 'starter', // Default plan for new users
      credits: 0, // New users start with 0 credits
      apiKey: response.data.api_key,
      createdAt: new Date().toISOString(),
      emailVerified: true
    };
    
    return { user, token };
  },

  async me(): Promise<User> {
    const response = await apiClient.get<XanoUserResponse>(API_ENDPOINTS.auth.me);
    
    const user: User = {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.name,
      plan: 'starter', // Should be determined by backend
      credits: response.data.lead_quota_remaining,
      apiKey: response.data.API_Key,
      createdAt: response.data.created_at,
      emailVerified: true
    };
    
    return user;
  },

  async updateProfile(data: Partial<RegisterData>): Promise<User> {
    const response = await apiClient.patch<XanoUserResponse>(
      API_ENDPOINTS.auth.updateProfile,
      data
    );
    
    return {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.name,
      plan: 'starter',
      credits: response.data.lead_quota_remaining,
      apiKey: response.data.API_Key,
      createdAt: response.data.created_at,
      emailVerified: true
    };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.changePassword, {
      current_password: currentPassword,
      new_password: newPassword
    });
  },

  async getApiKey(): Promise<string> {
    const response = await apiClient.get<{ api_key: string }>(API_ENDPOINTS.auth.getApiKey);
    return response.data.api_key;
  },

  async regenerateApiKey(): Promise<string> {
    const response = await apiClient.post<{ api_key: string }>(API_ENDPOINTS.auth.regenerateApiKey);
    return response.data.api_key;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};