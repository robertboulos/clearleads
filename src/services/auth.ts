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
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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
  created_at: number;
  API_Key: string;
  plan_id: number;
  status: string;
  stripe_customer_id: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate credentials before sending
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    const response = await apiClient.post<XanoLoginResponse>(
      API_ENDPOINTS.auth.login,
      {
        email: credentials.email.trim(),
        password: credentials.password
      }
    );
    
    // Store token and fetch user data
    const token = response.data.authToken;
    localStorage.setItem('token', token);
    
    // Use auth/verify instead of auth/me since auth/me has 403 issues
    const userResponse = await apiClient.get<XanoUserResponse>(API_ENDPOINTS.auth.verify);
    
    // Map plan_id to plan name
    const planMap: Record<number, 'starter' | 'pro' | 'enterprise'> = {
      0: 'starter',
      1: 'pro', 
      2: 'enterprise'
    };
    
    const user: User = {
      id: userResponse.data.id.toString(),
      email: userResponse.data.email,
      name: userResponse.data.name,
      plan: planMap[userResponse.data.plan_id] || 'starter',
      credits: userResponse.data.lead_quota_remaining,
      apiKey: userResponse.data.API_Key,
      createdAt: new Date(userResponse.data.created_at).toISOString(),
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
    // Use auth/verify instead of auth/me since auth/me has 403 issues
    const response = await apiClient.get<XanoUserResponse>(API_ENDPOINTS.auth.verify);
    
    // Map plan_id to plan name
    const planMap: Record<number, 'starter' | 'pro' | 'enterprise'> = {
      0: 'starter',
      1: 'pro', 
      2: 'enterprise'
    };
    
    const user: User = {
      id: response.data.id.toString(),
      email: response.data.email,
      name: response.data.name,
      company: response.data.company,
      phone: response.data.phone,
      address: response.data.address,
      city: response.data.city,
      state: response.data.state,
      zip: response.data.zip,
      country: response.data.country,
      plan: planMap[response.data.plan_id] || 'starter',
      credits: response.data.lead_quota_remaining,
      apiKey: response.data.API_Key,
      createdAt: new Date(response.data.created_at).toISOString(),
      emailVerified: true
    };
    
    return user;
  },

  async updateProfile(data: Partial<RegisterData>): Promise<User> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      user: {
        id: number;
        name: string;
        email: string;
        company?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
      };
    }>(API_ENDPOINTS.auth.updateProfile, data);
    
    // Get current user data to preserve plan and credits
    const currentUser = await this.me();
    
    return {
      id: response.data.user.id.toString(),
      email: response.data.user.email,
      name: response.data.user.name,
      company: response.data.user.company,
      phone: response.data.user.phone,
      address: response.data.user.address,
      city: response.data.user.city,
      state: response.data.user.state,
      zip: response.data.user.zip,
      country: response.data.user.country,
      plan: currentUser.plan,
      credits: currentUser.credits,
      apiKey: currentUser.apiKey,
      createdAt: currentUser.createdAt,
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