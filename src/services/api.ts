import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types/api';

class ApiClient {
  private client: AxiosInstance;
  private baseURL = 'https://api.clearleads.io';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.post('/auth/refresh', { refreshToken });
              const { token } = response.data;
              localStorage.setItem('token', token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.request({
        method,
        url,
        data,
        params,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Network error occurred',
        data: null,
      };
    }
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, params);
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  async paginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    const response = await this.get<PaginatedResponse<T>>(url, params);
    return response.data;
  }
}

export const apiClient = new ApiClient();