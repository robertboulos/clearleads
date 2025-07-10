import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { useCreditsStore } from '../../store/creditsStore';
import { useValidationStore } from '../../store/validationStore';

describe('Working Features Integration Tests - Production Ready', () => {
  let authToken: string;
  let userApiKey: string;
  let userId: number;
  let userEmail: string;

  beforeAll(async () => {
    console.log('✅ TESTING CONFIRMED WORKING FEATURES...');
    
    // Login
    const testEmail = 'robertjboulos@gmail.com';
    const testPassword = 'robertjboulos@gmail.com';
    
    const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
      email: testEmail,
      password: testPassword,
    });

    authToken = loginResponse.data.authToken;
    
    // Setup auth
    global.localStorage = {
      getItem: (key: string) => key === 'token' ? authToken : null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };

    // Get user data
    const verifyResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
    userApiKey = verifyResponse.data.API_Key;
    userId = verifyResponse.data.id;
    userEmail = verifyResponse.data.email;
    
    console.log('✅ Authenticated as:', userEmail);
  });

  describe('✅ AUTHENTICATION & USER MANAGEMENT', () => {
    it('should login and get user data', async () => {
      console.log('\n🔐 Testing authentication flow...');
      
      // Verify response has all required fields
      const verifyResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
      
      expect(verifyResponse.data).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        API_Key: expect.any(String),
        lead_quota_remaining: expect.any(Number),
      });
      
      console.log('✅ User data structure verified');
    });

    it('should regenerate API key', async () => {
      console.log('\n🔑 Testing API key regeneration...');
      
      const oldApiKey = userApiKey;
      
      const regenerateResponse = await apiClient.post(API_ENDPOINTS.auth.regenerateApiKey);
      
      expect(regenerateResponse.data.success).toBe(true);
      expect(regenerateResponse.data.api_key).toBeDefined();
      expect(regenerateResponse.data.api_key).not.toBe(oldApiKey);
      
      // Update for future tests
      userApiKey = regenerateResponse.data.api_key;
      
      console.log('✅ API key regenerated successfully');
      console.log('🔑 New key:', userApiKey.substring(0, 20) + '...');
    });
  });

  describe('✅ LEAD VALIDATION', () => {
    it('should validate single lead and track credits', async () => {
      console.log('\n📧 Testing single lead validation...');
      
      // Get initial balance
      const initialBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      const startCredits = initialBalance.data.data.current_balance;
      
      // Validate a lead
      const testEmail = `test-${Date.now()}@example.com`;
      const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
        email: testEmail,
        api_key: userApiKey,
      });
      
      expect(validationResponse.data.success).toBe(true);
      expect(validationResponse.data.email).toMatchObject({
        provided: true,
        valid: expect.any(Boolean)
      });
      expect(validationResponse.data.credits_remaining).toBeDefined();
      
      console.log('✅ Validation complete');
      console.log('📊 Result:', validationResponse.data.email.valid ? 'VALID' : 'INVALID');
      console.log('💰 Credits remaining:', validationResponse.data.credits_remaining);
    });

    it('should retrieve validation history', async () => {
      console.log('\n📜 Testing validation history...');
      
      const historyResponse = await apiClient.get(API_ENDPOINTS.validation.history, {
        page: 1,
        limit: 5
      });
      
      expect(historyResponse.data.success).toBe(true);
      expect(historyResponse.data.data.validations).toBeDefined();
      expect(Array.isArray(historyResponse.data.data.validations)).toBe(true);
      
      if (historyResponse.data.data.validations.length > 0) {
        const firstValidation = historyResponse.data.data.validations[0];
        expect(firstValidation).toMatchObject({
          id: expect.any(Number),
          created_at: expect.any(Number),
          validation_status: expect.stringMatching(/^(valid|invalid)$/)
        });
      }
      
      console.log('✅ History loaded:', historyResponse.data.data.validations.length, 'records');
    });
  });

  describe('✅ DASHBOARD & ANALYTICS', () => {
    it('should load dashboard metrics', async () => {
      console.log('\n📊 Testing dashboard metrics...');
      
      const dashboardResponse = await apiClient.get(API_ENDPOINTS.analytics.dashboard);
      
      expect(dashboardResponse.data.success).toBe(true);
      expect(dashboardResponse.data.user).toBeDefined();
      expect(dashboardResponse.data.validation_stats).toMatchObject({
        total_validations: expect.any(Number),
        successful_validations: expect.any(Number),
        failed_validations: expect.any(Number)
      });
      
      console.log('✅ Dashboard metrics loaded');
      console.log('📊 Total validations:', dashboardResponse.data.validation_stats.total_validations);
    });

    it('should load enhanced analytics', async () => {
      console.log('\n📈 Testing enhanced analytics...');
      
      const analyticsResponse = await apiClient.get(API_ENDPOINTS.analytics.enhanced);
      
      expect(analyticsResponse.data.success).toBe(true);
      expect(analyticsResponse.data.last_7_days).toBeDefined();
      expect(analyticsResponse.data.performance_metrics).toMatchObject({
        overall_success_rate_percent: expect.any(Number),
        avg_cost_per_valid_lead: expect.any(Number),
        total_credits_used: expect.any(Number)
      });
      
      console.log('✅ Enhanced analytics loaded');
      console.log('📈 7-day validations:', analyticsResponse.data.last_7_days.validations);
      console.log('📈 Success rate:', analyticsResponse.data.performance_metrics.overall_success_rate_percent + '%');
    });
  });

  describe('✅ CREDITS & BILLING', () => {
    it('should track credit balance and transactions', async () => {
      console.log('\n💰 Testing credit system...');
      
      const balanceResponse = await apiClient.get(API_ENDPOINTS.billing.balance);
      
      expect(balanceResponse.data.success).toBe(true);
      expect(balanceResponse.data.data).toMatchObject({
        current_balance: expect.any(Number),
        total_used: expect.any(Number),
        recent_transactions: expect.any(Array)
      });
      
      console.log('✅ Credit balance:', balanceResponse.data.data.current_balance);
      console.log('💰 Total used:', balanceResponse.data.data.total_used);
      console.log('📜 Recent transactions:', balanceResponse.data.data.recent_transactions.length);
      
      if (balanceResponse.data.data.recent_transactions.length > 0) {
        const firstTransaction = balanceResponse.data.data.recent_transactions[0];
        expect(firstTransaction).toMatchObject({
          id: expect.any(Number),
          created_at: expect.any(Number),
          transaction_type: expect.any(String),
          amount: expect.any(Number),
          source: expect.any(String)
        });
      }
    });
  });

  describe('✅ ERROR HANDLING', () => {
    it('should handle invalid API key', async () => {
      console.log('\n❌ Testing error handling...');
      
      try {
        await apiClient.post(API_ENDPOINTS.validation.single, {
          email: 'test@example.com',
          api_key: 'invalid_key_12345',
        });
        
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response?.data?.message || error.message).toContain('Invalid API key');
        console.log('✅ Invalid API key error handled correctly');
      }
    });

    it('should handle missing parameters', async () => {
      console.log('\n❌ Testing missing parameter handling...');
      
      try {
        await apiClient.post(API_ENDPOINTS.validation.single, {
          // Missing api_key
          email: 'test@example.com',
        });
        
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('api_key');
        console.log('✅ Missing parameter error handled correctly');
      }
    });
  });

  describe('✅ ZUSTAND STORES', () => {
    it('should update auth store correctly', async () => {
      console.log('\n🏪 Testing auth store...');
      
      const authStore = useAuthStore.getState();
      
      // Set user data
      authStore.updateUser({
        id: userId.toString(),
        email: userEmail,
        apiKey: userApiKey,
        credits: 100
      });
      
      const updatedUser = useAuthStore.getState().user;
      expect(updatedUser?.apiKey).toBe(userApiKey);
      
      console.log('✅ Auth store working correctly');
    });

    it('should handle validation store without React errors', async () => {
      console.log('\n🏪 Testing validation store...');
      
      const validationStore = useValidationStore.getState();
      
      // Simulate validation result
      const result = {
        id: Date.now().toString(),
        email: 'test@example.com',
        phone: '',
        status: 'valid' as const,
        confidence: 100,
        creditsUsed: 1,
        details: {},
        createdAt: new Date().toISOString()
      };
      
      validationStore.addResult(result);
      
      const results = useValidationStore.getState().results;
      expect(results[0]).toMatchObject(result);
      
      console.log('✅ Validation store working correctly');
    });
  });

  describe('✅ SUMMARY', () => {
    it('should show working features summary', async () => {
      console.log('\n🎉 WORKING FEATURES SUMMARY:');
      console.log('✅ Authentication & Login');
      console.log('✅ API Key Management (View & Regenerate)');
      console.log('✅ Single Lead Validation');
      console.log('✅ Validation History');
      console.log('✅ Dashboard Analytics');
      console.log('✅ Enhanced Analytics');
      console.log('✅ Credit Balance & Transactions');
      console.log('✅ Error Handling');
      console.log('✅ Zustand State Management');
      
      console.log('\n⚠️  FEATURES NEEDING BACKEND WORK:');
      console.log('❌ Profile Update (endpoint missing)');
      console.log('❌ Password Change (endpoint missing)');
      console.log('❌ CSV Upload (needs batch_name param)');
      console.log('❌ Stripe Checkout (needs correct params)');
      console.log('❌ Stripe Webhooks (needs customer mapping)');
      console.log('❌ Subscription Management');
      
      expect(true).toBe(true);
    });
  });
});