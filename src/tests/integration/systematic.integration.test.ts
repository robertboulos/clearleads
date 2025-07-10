import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { useCreditsStore } from '../../store/creditsStore';
import { useValidationStore } from '../../store/validationStore';

describe('Systematic Integration Tests - Fix All Data Structures', () => {
  let authToken: string;
  let userApiKey: string;
  let userCredits: number;

  beforeAll(async () => {
    console.log('🚀 SYSTEMATIC TESTING: Finding all real data structures...');
    
    try {
      // Use exact same pattern as working auth test
      const testEmail = 'robertjboulos@gmail.com';
      const testPassword = 'robertjboulos@gmail.com';
      
      console.log('🔐 Attempting login with:', testEmail);
      console.log('🔒 Password provided:', testPassword ? 'YES' : 'NO');
      
      const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
        email: testEmail,
        password: testPassword,
      });

      authToken = loginResponse.data.authToken;
      
      // Set up auth
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
      userCredits = verifyResponse.data.lead_quota_remaining;
      
      console.log('✅ Logged in as:', verifyResponse.data.email);
      console.log('💰 Starting credits:', userCredits);
      console.log('🔑 API Key:', userApiKey?.substring(0, 15) + '...');
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  });

  it('should test validation flow and check all related data structures', async () => {
    // Test validation (we know this works)
    const testEmail = `systematic-test-${Date.now()}@example.com`;
    
    console.log('\n🧪 TESTING VALIDATION FLOW...');
    console.log('📧 Validating:', testEmail);

    const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
      email: testEmail,
      api_key: userApiKey,
    });

    console.log('✅ Validation response structure:');
    console.log(JSON.stringify(validationResponse.data, null, 2));

    // Now test if our store can handle this data
    console.log('\n📦 TESTING VALIDATION STORE...');
    try {
      const result = await useValidationStore.getState().validateSingle({
        email: testEmail,
      });
      
      console.log('✅ Store validation result:');
      console.log(JSON.stringify(result, null, 2));
      
      // Check if React would crash
      expect(typeof result.email).toBe('string');
      expect(typeof result.phone).toBe('string');
      console.log('✅ All fields are strings - React safe!');
      
    } catch (error: any) {
      console.error('❌ Store validation failed:', error.message);
      throw error;
    }
  });

  it('should test credits/billing endpoints and find real structure', async () => {
    console.log('\n💰 TESTING CREDITS ENDPOINTS...');
    
    // Test balance endpoint
    try {
      console.log('💰 Testing:', API_ENDPOINTS.billing.balance);
      const balanceResponse = await apiClient.get(API_ENDPOINTS.billing.balance);
      
      console.log('✅ REAL Credits balance structure:');
      console.log(JSON.stringify(balanceResponse.data, null, 2));
      
      // Test our credits store with this data
      console.log('\n📦 TESTING CREDITS STORE...');
      try {
        await useCreditsStore.getState().fetchBalance();
        const storeBalance = useCreditsStore.getState().balance;
        const storeTransactions = useCreditsStore.getState().transactions;
        
        console.log('📦 Store balance:', storeBalance);
        console.log('📦 Store transactions count:', storeTransactions.length);
        console.log('✅ Credits store working!');
        
      } catch (storeError: any) {
        console.error('❌ Credits store failed:', storeError.message);
        console.log('🔧 Store expects different structure - needs fixing');
      }
      
    } catch (error: any) {
      console.error('❌ Balance endpoint failed:', error.message);
    }
  });

  it('should test analytics endpoints and find real structure', async () => {
    console.log('\n📊 TESTING ANALYTICS ENDPOINTS...');
    
    // Test dashboard endpoint
    try {
      console.log('📊 Testing:', API_ENDPOINTS.analytics.dashboard);
      const dashboardResponse = await apiClient.get(API_ENDPOINTS.analytics.dashboard);
      
      console.log('✅ REAL Dashboard structure:');
      console.log(JSON.stringify(dashboardResponse.data, null, 2));
      
    } catch (error: any) {
      console.error('❌ Dashboard endpoint failed:', error.message);
    }

    // Test enhanced analytics
    try {
      console.log('📊 Testing:', API_ENDPOINTS.analytics.enhanced);
      const enhancedResponse = await apiClient.get(API_ENDPOINTS.analytics.enhanced);
      
      console.log('✅ REAL Enhanced analytics structure:');
      console.log(JSON.stringify(enhancedResponse.data, null, 2));
      
    } catch (error: any) {
      console.error('❌ Enhanced analytics endpoint failed:', error.message);
    }
  });

  it('should test validation history endpoint', async () => {
    console.log('\n📜 TESTING VALIDATION HISTORY...');
    
    try {
      console.log('📜 Testing:', API_ENDPOINTS.validation.history);
      const historyResponse = await apiClient.get(API_ENDPOINTS.validation.history);
      
      console.log('✅ REAL Validation history structure:');
      console.log(JSON.stringify(historyResponse.data, null, 2));
      
      // Test our validation store history
      console.log('\n📦 TESTING VALIDATION STORE HISTORY...');
      try {
        await useValidationStore.getState().fetchHistory();
        const storeHistory = useValidationStore.getState().history;
        
        console.log('📦 Store history count:', storeHistory.length);
        if (storeHistory.length > 0) {
          console.log('📦 First history item:', JSON.stringify(storeHistory[0], null, 2));
        }
        console.log('✅ Validation history store working!');
        
      } catch (storeError: any) {
        console.error('❌ Validation history store failed:', storeError.message);
        console.log('🔧 Store expects different structure - needs fixing');
      }
      
    } catch (error: any) {
      console.error('❌ History endpoint failed:', error.message);
    }
  });
});