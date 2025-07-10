import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export interface ValidationRequest {
  email: string;
  phone?: string;
  api_key?: string;
}

export interface XanoValidationResponse {
  id: number;
  email: string;
  phone?: string;
  validation_status: 'valid' | 'invalid' | 'pending' | 'error';
  validation_details: {
    email_result?: {
      status: string;
      sub_status: string;
      account: string;
      domain: string;
      disposable: boolean;
      toxic: boolean;
      firstname: string;
      lastname: string;
      gender: string;
      country: string;
      region: string;
      city: string;
      zipcode: string;
      processed_at: string;
    };
    phone_result?: {
      valid: boolean;
      number: string;
      local_format: string;
      international_format: string;
      country_prefix: string;
      country_code: string;
      country_name: string;
      location: string;
      carrier: string;
      line_type: string;
    };
  };
  credits_used: number;
  created_at: string;
  cached?: boolean;
}

export interface ValidationHistory {
  validations: XanoValidationResponse[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface BatchUploadResponse {
  batch_id: string;
  file_name: string;
  total_rows: number;
  preview: any[];
}

export interface BatchProcessRequest {
  batch_id: string;
  email_column: string;
  phone_column?: string;
}

export interface BatchStatusResponse {
  batch_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_rows: number;
  processed_rows: number;
  valid_count: number;
  invalid_count: number;
  results_url?: string;
  created_at: string;
  completed_at?: string;
}

export const validationService = {
  async validateSingle(request: ValidationRequest): Promise<XanoValidationResponse> {
    const response = await apiClient.post<XanoValidationResponse>(
      API_ENDPOINTS.validation.single,
      request
    );
    return response.data;
  },

  async validateAgent(request: ValidationRequest): Promise<XanoValidationResponse> {
    const response = await apiClient.post<XanoValidationResponse>(
      API_ENDPOINTS.validation.agent,
      request
    );
    return response.data;
  },

  async getHistory(params?: {
    page?: number;
    per_page?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<ValidationHistory> {
    const response = await apiClient.get<ValidationHistory>(
      API_ENDPOINTS.validation.history,
      params
    );
    return response.data;
  },

  async exportHistory(params?: {
    format?: 'csv' | 'json';
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      API_ENDPOINTS.validation.export,
      params
    );
    return response.data;
  },

  async uploadCsv(file: File, batchName?: string): Promise<BatchUploadResponse> {
    // Read file content as text
    const csvContent = await file.text();
    
    // Get API key from localStorage or auth store
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    // Get user's API key
    const verifyResponse = await apiClient.get('/api:Is1L6GFg/auth/verify');
    const apiKey = verifyResponse.data.API_Key;
    
    const response = await apiClient.post<{
      success: boolean;
      batch_id: number;
      csv_data_id: number;
      message: string;
      user: string;
    }>(API_ENDPOINTS.batch.uploadCsv, {
      csv_content: csvContent,
      api_key: apiKey,
      batch_name: batchName || `Batch Upload ${new Date().toISOString()}`
    });
    
    // Transform to expected interface
    return {
      batch_id: response.data.batch_id.toString(),
      file_name: batchName || file.name,
      total_rows: csvContent.split('\n').length - 1, // Subtract header
      preview: []
    };
  },

  async processBatch(request: BatchProcessRequest): Promise<{ batch_id: string }> {
    const response = await apiClient.post<{ batch_id: string }>(
      API_ENDPOINTS.batch.process,
      request
    );
    return response.data;
  },

  async getBatchStatus(batchId: string): Promise<BatchStatusResponse> {
    const response = await apiClient.get<BatchStatusResponse>(
      `${API_ENDPOINTS.batch.status}/${batchId}`
    );
    return response.data;
  }
};