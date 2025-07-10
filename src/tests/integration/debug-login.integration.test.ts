import { describe, it, expect } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

describe('Debug Login Issues', () => {
  it('should debug login step by step', async () => {
    console.log('🔍 DEBUGGING LOGIN STEP BY STEP...');
    
    // Check API client configuration
    console.log('🌐 API Client base URL:', (apiClient as any).client?.defaults?.baseURL);
    console.log('🌐 Environment VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL);
    
    // Check endpoints
    console.log('🔗 Login endpoint:', API_ENDPOINTS.auth.login);
    console.log('🔗 Full URL would be:', `${(apiClient as any).client?.defaults?.baseURL}${API_ENDPOINTS.auth.login}`);
    
    // Test credentials - password is same as email
    const testEmail = 'robertjboulos@gmail.com';
    const testPassword = 'robertjboulos@gmail.com';
    
    console.log('👤 Email:', testEmail);
    console.log('🔒 Password length:', testPassword.length);
    console.log('🔒 Password starts with:', testPassword.substring(0, 4));
    console.log('🔒 Password ends with:', testPassword.substring(testPassword.length - 2));
    
    // Check if there are any request headers or interceptors affecting this
    console.log('📋 Default headers:', (apiClient as any).client?.defaults?.headers);
    
    try {
      console.log('🚀 Attempting login...');
      
      const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
        email: testEmail,
        password: testPassword,
      });

      console.log('✅ Login successful!');
      console.log('📊 Response status:', loginResponse.status);
      console.log('📊 Response data:', JSON.stringify(loginResponse.data, null, 2));
      
      expect(loginResponse.data).toBeDefined();
      expect(loginResponse.data.authToken).toBeDefined();
      
    } catch (error: any) {
      console.error('❌ Login failed with error:', error.message);
      console.error('📊 Error status:', error.response?.status);
      console.error('📊 Error data:', error.response?.data);
      console.error('📊 Error config:', {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
        data: error.config?.data
      });
      
      throw error;
    }
  });

  it('should test multiple login attempts in sequence', async () => {
    console.log('🔄 TESTING MULTIPLE LOGIN ATTEMPTS...');
    
    const credentials = {
      email: 'robertjboulos@gmail.com',
      password: 'robertjboulos@gmail.com'
    };

    for (let i = 1; i <= 3; i++) {
      console.log(`\n🔄 Login attempt ${i}/3`);
      
      try {
        const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials);
        console.log(`✅ Attempt ${i} successful:`, response.data.authToken?.substring(0, 10) + '...');
        
        // Small delay between attempts
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        console.error(`❌ Attempt ${i} failed:`, error.message);
        
        // If first attempt fails, don't continue
        if (i === 1) {
          throw error;
        }
      }
    }
  });
});