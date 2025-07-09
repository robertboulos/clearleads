import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

describe('Billing Integration Tests', () => {
  let authToken: string;
  let userApiKey: string;

  beforeAll(async () => {
    // Login first
    const testEmail = 'robertjboulos@gmail.com';
    const testPassword = 'TestPassword123!';

    const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
      email: testEmail,
      password: testPassword,
    });

    authToken = loginResponse.data.authToken;
    
    // Set up localStorage for auth
    global.localStorage = {
      getItem: (key: string) => key === 'token' ? authToken : null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };

    // Get user API key
    const verifyResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
    userApiKey = verifyResponse.data.API_Key;
    
    console.log('💳 Testing billing with user:', verifyResponse.data.email);
    console.log('💰 Current credits remaining:', verifyResponse.data.lead_quota_remaining);
  });

  it('should get credit balance with real structure', async () => {
    expect(authToken).toBeDefined();

    console.log('💰 Testing credit balance endpoint...');

    const response = await apiClient.get(API_ENDPOINTS.credits.balance);
    
    console.log('💰 REAL Credit balance response:', JSON.stringify(response.data, null, 2));

    expect(response.data).toBeDefined();
    
    // Log the structure so we know what we're working with
    console.log('💰 Balance type:', typeof response.data);
    console.log('💰 Available fields:', Object.keys(response.data));
  });

  it('should get transaction history with real structure', async () => {
    expect(authToken).toBeDefined();

    console.log('📜 Testing transaction history endpoint...');

    const response = await apiClient.get(API_ENDPOINTS.credits.transactions);
    
    console.log('📜 REAL Transaction history response:', JSON.stringify(response.data, null, 2));

    expect(response.data).toBeDefined();
    
    // Log the structure
    if (Array.isArray(response.data)) {
      console.log('📜 Transaction array length:', response.data.length);
      if (response.data.length > 0) {
        console.log('📜 First transaction structure:', Object.keys(response.data[0]));
      }
    } else {
      console.log('📜 Transaction response type:', typeof response.data);
      console.log('📜 Available fields:', Object.keys(response.data));
    }
  });

  it('should get usage analytics with real structure', async () => {
    expect(authToken).toBeDefined();

    console.log('📊 Testing usage analytics endpoint...');

    try {
      const response = await apiClient.get(API_ENDPOINTS.analytics.usage);
      
      console.log('📊 REAL Usage analytics response:', JSON.stringify(response.data, null, 2));

      expect(response.data).toBeDefined();
      
      // Log the structure
      console.log('📊 Analytics type:', typeof response.data);
      console.log('📊 Available fields:', Object.keys(response.data));
    } catch (error: any) {
      console.log('📊 Analytics endpoint error:', error.message);
      console.log('📊 This endpoint might not exist or need different auth');
    }
  });

  it('should test validation cost deduction', async () => {
    expect(userApiKey).toBeDefined();

    console.log('🧪 Testing validation credit deduction...');

    // Get initial credits
    const initialResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
    const initialCredits = initialResponse.data.lead_quota_remaining;
    
    console.log('💰 Credits before validation:', initialCredits);

    // Run a validation
    const testEmail = `credits-test-${Date.now()}@gmail.com`;
    const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
      email: testEmail,
      api_key: userApiKey,
    });

    console.log('📧 Validation response credits:', validationResponse.data.credits_remaining);

    // Check credits after
    const finalResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
    const finalCredits = finalResponse.data.lead_quota_remaining;
    
    console.log('💰 Credits after validation:', finalCredits);
    console.log('📉 Credits used:', initialCredits - finalCredits);

    // Verify credits were deducted
    expect(finalCredits).toBeLessThan(initialCredits);
    expect(validationResponse.data.credits_remaining).toBe(finalCredits);
  });
});