import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';

describe('Xano-Specific Integration Tests - Real API Behavior', () => {
  let authToken: string;
  let userApiKey: string;
  let userId: number;
  let userEmail: string;

  beforeAll(async () => {
    console.log('🎯 XANO-SPECIFIC TESTING: Testing with correct parameters...');
    
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
    
    console.log('✅ Ready to test with:', userEmail);
  });

  describe('File Upload - Xano CSV Format', () => {
    it('should upload CSV with correct Xano parameters', async () => {
      console.log('\n📁 TESTING XANO CSV UPLOAD...');
      
      try {
        // Xano expects csv_content as a string parameter
        const csvContent = 'email,phone\ntest1@example.com,+1234567890\ntest2@example.com,555-1234';
        
        const uploadResponse = await apiClient.post(API_ENDPOINTS.batch.uploadCsv, {
          csv_content: csvContent,
          api_key: userApiKey,
        });
        
        console.log('✅ CSV upload response:', JSON.stringify(uploadResponse.data, null, 2));
        
        // Check if we got a batch ID or job ID
        if (uploadResponse.data.batch_id || uploadResponse.data.job_id) {
          console.log('📊 Batch/Job ID:', uploadResponse.data.batch_id || uploadResponse.data.job_id);
        }
      } catch (error: any) {
        console.log('❌ CSV upload error:', error.message);
        console.log('📝 Error details:', error.response?.data);
      }
    });
  });

  describe('Stripe Checkout - Xano Format', () => {
    it('should create checkout with correct Xano parameters', async () => {
      console.log('\n💳 TESTING XANO STRIPE CHECKOUT...');
      
      try {
        // Try different parameter combinations
        const checkoutParams = [
          { package_type: 'starter', credits: 1000 },
          { package_type: 'pro', credits: 5000 },
          { package_type: 'enterprise', credits: 20000 },
        ];
        
        for (const params of checkoutParams) {
          try {
            console.log('🔍 Trying params:', params);
            
            const checkoutResponse = await apiClient.post(API_ENDPOINTS.billing.checkout, params);
            
            console.log('✅ Checkout created:', JSON.stringify(checkoutResponse.data, null, 2));
            
            if (checkoutResponse.data.url || checkoutResponse.data.checkout_url) {
              console.log('💳 Checkout URL:', checkoutResponse.data.url || checkoutResponse.data.checkout_url);
            }
            break;
          } catch (error: any) {
            console.log('❌ Failed with:', error.message);
          }
        }
      } catch (error: any) {
        console.log('❌ All checkout attempts failed');
      }
    });
  });

  describe('User Profile - Find Working Endpoints', () => {
    it('should find working profile endpoints', async () => {
      console.log('\n👤 FINDING PROFILE ENDPOINTS...');
      
      // Test auth/me endpoint
      try {
        const meResponse = await apiClient.get(API_ENDPOINTS.auth.me);
        console.log('✅ /auth/me works:', JSON.stringify(meResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ /auth/me error:', error.message);
      }
      
      // Test auth/verify (we know this works)
      try {
        const verifyResponse = await apiClient.get(API_ENDPOINTS.auth.verify);
        console.log('✅ /auth/verify data:', {
          id: verifyResponse.data.id,
          email: verifyResponse.data.email,
          name: verifyResponse.data.name,
          company: verifyResponse.data.company,
          API_Key: verifyResponse.data.API_Key?.substring(0, 15) + '...',
          lead_quota_remaining: verifyResponse.data.lead_quota_remaining,
        });
      } catch (error: any) {
        console.log('❌ /auth/verify error:', error.message);
      }
    });
  });

  describe('Webhook Testing - Real Xano Format', () => {
    it('should test webhook with Xano expected format', async () => {
      console.log('\n🪝 TESTING XANO WEBHOOK FORMAT...');
      
      try {
        // Xano webhook might expect different structure
        const xanoWebhookPayload = {
          type: 'checkout.session.completed',
          id: 'evt_' + Date.now(),
          data: {
            object: {
              id: 'cs_test_' + Date.now(),
              customer: 'cus_' + Date.now(),
              payment_status: 'paid',
              amount_total: 1000,
              metadata: {
                user_id: userId.toString(),
                credits: '1000',
                package_type: 'starter'
              }
            }
          }
        };
        
        const headers = {
          'stripe-signature': 'whsec_test_' + Date.now(),
          'content-type': 'application/json'
        };
        
        console.log('📤 Sending webhook payload...');
        
        const webhookResponse = await apiClient.post(
          API_ENDPOINTS.webhooks.stripeCheckout, 
          xanoWebhookPayload,
          { headers }
        );
        
        console.log('✅ Webhook response:', JSON.stringify(webhookResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ Webhook error:', error.message);
        console.log('📝 Error details:', error.response?.data);
        
        // Try raw Stripe format
        console.log('\n🔄 Trying raw Stripe webhook format...');
        
        try {
          // This is the actual format Stripe sends
          const stripeRawPayload = {
            id: 'evt_' + Date.now(),
            object: 'event',
            api_version: '2023-10-16',
            created: Math.floor(Date.now() / 1000),
            type: 'checkout.session.completed',
            data: {
              object: {
                id: 'cs_test_' + Date.now(),
                object: 'checkout.session',
                amount_total: 1000,
                customer: 'cus_' + Date.now(),
                payment_status: 'paid',
                metadata: {
                  user_id: userId.toString(),
                  credits: '1000'
                }
              }
            }
          };
          
          const rawResponse = await apiClient.post(
            API_ENDPOINTS.webhooks.stripeCheckout,
            stripeRawPayload,
            { headers: { 'stripe-signature': 'test_sig' } }
          );
          
          console.log('✅ Raw format worked:', JSON.stringify(rawResponse.data, null, 2));
        } catch (rawError: any) {
          console.log('❌ Raw format also failed:', rawError.message);
        }
      }
    });
  });

  describe('Credit System - Real Behavior', () => {
    it('should understand credit deduction timing', async () => {
      console.log('\n💰 TESTING CREDIT DEDUCTION TIMING...');
      
      // Get initial balance
      const initialBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      const startCredits = initialBalance.data.data.current_balance;
      console.log('💰 Starting credits:', startCredits);
      
      // Run validation
      const testEmail = `timing-test-${Date.now()}@example.com`;
      const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
        email: testEmail,
        api_key: userApiKey,
      });
      
      console.log('📧 Validation credits_remaining:', validationResponse.data.credits_remaining);
      
      // Check balance immediately
      const immediateBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      console.log('💰 Credits immediately after:', immediateBalance.data.data.current_balance);
      
      // Wait a bit and check again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const delayedBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      console.log('💰 Credits after 1 second:', delayedBalance.data.data.current_balance);
      
      // The validation response should match the balance
      expect(validationResponse.data.credits_remaining).toBe(delayedBalance.data.data.current_balance);
    });
  });
});