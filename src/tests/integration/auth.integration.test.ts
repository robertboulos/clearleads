import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

describe('Auth Integration Tests', () => {
  let authToken: string;
  let userApiKey: string;

  beforeAll(async () => {
    const testEmail = process.env.TEST_EMAIL || 'robertjboulos@gmail.com';
    const testPassword = process.env.TEST_PASSWORD || 'TestPassword123!';

    console.log('🔐 Testing login with real credentials...');
    console.log('📧 Email:', testEmail);
    console.log('🔒 Password:', testPassword ? 'PROVIDED' : 'MISSING');
  });

  it('should login with real credentials and get auth token', async () => {
    const testEmail = process.env.TEST_EMAIL || 'robertjboulos@gmail.com';
    const testPassword = process.env.TEST_PASSWORD || 'TestPassword123!';

    const response = await apiClient.post(API_ENDPOINTS.auth.login, {
      email: testEmail,
      password: testPassword,
    });

    console.log('🔍 Login response:', JSON.stringify(response.data, null, 2));

    expect(response.data).toBeDefined();
    
    // Store token for other tests - the response has authToken directly
    authToken = response.data.authToken || response.data.token || response.data.data?.token;
    expect(authToken).toBeDefined();
    
    console.log('✅ Auth token received:', authToken?.substring(0, 10) + '...');
  });

  it('should get user data from auth/verify endpoint', async () => {
    expect(authToken).toBeDefined();

    console.log('🔍 Trying auth/verify endpoint to get user API key...');

    // Store token in localStorage so the client interceptor picks it up
    global.localStorage = {
      getItem: (key: string) => key === 'token' ? authToken : null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };

    const response = await apiClient.get(API_ENDPOINTS.auth.verify);
    
    console.log('🔍 Auth verify response:', JSON.stringify(response.data, null, 2));

    expect(response.data).toBeDefined();
    
    // Extract user API key from verify response - it's "API_Key" in the response
    userApiKey = response.data.API_Key || response.data.user?.API_Key || response.data.data?.API_Key;
    expect(userApiKey).toBeDefined();
    
    console.log('🔑 User API key found:', userApiKey?.substring(0, 10) + '...');
    console.log('💰 User credits:', response.data.user?.credits || response.data.data?.credits);
  });

  it('should validate email using real user API key', async () => {
    expect(userApiKey).toBeDefined();

    const testEmail = `test${Date.now()}@gmail.com`; // Use unique email to avoid duplicates
    
    console.log('🧪 Testing validation with real API key...');
    console.log('📧 Validating:', testEmail);

    const response = await apiClient.post(API_ENDPOINTS.validation.single, {
      email: testEmail,
      api_key: userApiKey,
    });

    console.log('📊 REAL Validation response:', JSON.stringify(response.data, null, 2));

    // This is the critical test - verify the ACTUAL response structure
    expect(response.data).toBeDefined();
    expect(response.data.success).toBe(true);

    // Log the exact structure so we know what we're working with
    if (response.data.email) {
      console.log('📧 Email structure:', typeof response.data.email, response.data.email);
    }
    if (response.data.phone) {
      console.log('📱 Phone structure:', typeof response.data.phone, response.data.phone);
    }

    // Verify it matches the structure you provided
    expect(response.data.email).toBeDefined();
    expect(typeof response.data.email).toBe('object');
    expect(response.data.email.valid).toBeDefined();
    expect(response.data.email.provided).toBeDefined();
    expect(response.data.credits_remaining).toBeDefined();
  });
});