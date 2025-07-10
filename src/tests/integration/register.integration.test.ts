import { describe, it, expect } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

describe('Registration Integration Test', () => {
  it('should register new account and login', async () => {
    const timestamp = Date.now();
    const testEmail = 'robertjboulos@gmail.com';
    const testPassword = 'TestPassword123!';
    const testName = 'Robert Boulos';

    console.log('📝 Registering new account...');
    console.log('📧 Email:', testEmail);
    console.log('👤 Name:', testName);

    try {
      // Register new account
      const registerResponse = await apiClient.post(API_ENDPOINTS.auth.register, {
        email: testEmail,
        password: testPassword,
        name: testName,
        // Add any other required fields
        company: 'Test Company',
        phone: '6472965544'
      });

      console.log('✅ Registration response:', JSON.stringify(registerResponse.data, null, 2));

      expect(registerResponse.data).toBeDefined();
      
      // Check if we get an auth token immediately
      const authToken = registerResponse.data.authToken || registerResponse.data.token;
      
      if (authToken) {
        console.log('🔑 Got auth token from registration:', authToken.substring(0, 10) + '...');
        
        // Set up auth and test verify
        global.localStorage = {
          getItem: (key: string) => key === 'token' ? authToken : null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null,
        };

        // Test verify endpoint
        const verifyResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
        console.log('👤 User profile:', JSON.stringify(verifyResponse.data, null, 2));
        
        const userApiKey = verifyResponse.data.API_Key;
        console.log('🔑 API Key:', userApiKey?.substring(0, 15) + '...');
        
        // Test validation
        const testValidationEmail = `test-${timestamp}@gmail.com`;
        const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
          email: testValidationEmail,
          api_key: userApiKey,
        });

        console.log('🧪 Validation works:', JSON.stringify(validationResponse.data, null, 2));
        
      } else {
        console.log('⚠️  No auth token in registration response - need to login separately');
        
        // Try login after registration
        const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
          email: testEmail,
          password: testPassword,
        });
        
        console.log('🔐 Login after registration:', JSON.stringify(loginResponse.data, null, 2));
      }

    } catch (error: any) {
      console.error('❌ Registration error:', error.message);
      console.error('Response:', error.response?.data);
      
      // If registration fails because account exists, try login
      if (error.message.includes('exists') || error.message.includes('duplicate')) {
        console.log('🔄 Account exists, trying login...');
        
        const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
          email: testEmail,
          password: testPassword,
        });
        
        console.log('🔐 Login successful:', JSON.stringify(loginResponse.data, null, 2));
      } else {
        throw error;
      }
    }
  });
});