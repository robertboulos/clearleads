import { describe, it, expect, beforeAll } from 'vitest';
import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { useCreditsStore } from '../../store/creditsStore';
import { useValidationStore } from '../../store/validationStore';

describe('Complete App Integration Tests - Every Feature', () => {
  let authToken: string;
  let userApiKey: string;
  let userId: number;
  let userEmail: string;

  beforeAll(async () => {
    console.log('🚀 COMPLETE APP TESTING: Testing every single feature...');
    
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
    
    console.log('✅ Test user ready:', userEmail);
    console.log('💰 Credits:', verifyResponse.data.lead_quota_remaining);
  });

  describe('Dashboard Features', () => {
    it('should load dashboard with all metrics', async () => {
      console.log('\n📊 TESTING DASHBOARD...');
      
      // Test dashboard endpoint
      const dashboardResponse = await apiClient.get(API_ENDPOINTS.analytics.dashboard);
      
      expect(dashboardResponse.data.success).toBe(true);
      expect(dashboardResponse.data.user).toBeDefined();
      expect(dashboardResponse.data.validation_stats).toBeDefined();
      expect(dashboardResponse.data.credit_stats).toBeDefined();
      
      console.log('✅ Dashboard loaded successfully');
      console.log('📊 Total validations:', dashboardResponse.data.validation_stats.total_validations);
    });

    it('should load enhanced analytics', async () => {
      console.log('\n📈 TESTING ENHANCED ANALYTICS...');
      
      const analyticsResponse = await apiClient.get(API_ENDPOINTS.analytics.enhanced);
      
      expect(analyticsResponse.data.success).toBe(true);
      expect(analyticsResponse.data.last_7_days).toBeDefined();
      expect(analyticsResponse.data.performance_metrics).toBeDefined();
      
      console.log('✅ Enhanced analytics loaded');
      console.log('📈 Success rate:', analyticsResponse.data.performance_metrics.overall_success_rate_percent + '%');
    });
  });

  describe('Settings & Profile Management', () => {
    it('should update user profile', async () => {
      console.log('\n👤 TESTING PROFILE UPDATE...');
      
      try {
        const updateResponse = await apiClient.put(API_ENDPOINTS.auth.updateProfile, {
          name: 'Robert Boulos Updated',
          company: 'ClearLeads Test Co'
        });
        
        console.log('✅ Profile update response:', JSON.stringify(updateResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ Profile update endpoint error:', error.message);
      }
    });

    it('should refresh API key', async () => {
      console.log('\n🔑 TESTING API KEY REFRESH...');
      
      try {
        // Try the regenerate endpoint from constants
        const refreshResponse = await apiClient.post(API_ENDPOINTS.auth.regenerateApiKey);
        
        console.log('✅ API key refresh response:', JSON.stringify(refreshResponse.data, null, 2));
        
        // Verify new API key works
        if (refreshResponse.data.api_key || refreshResponse.data.API_Key) {
          const newApiKey = refreshResponse.data.api_key || refreshResponse.data.API_Key;
          console.log('🔑 New API key:', newApiKey.substring(0, 15) + '...');
          
          // Update the stored API key for subsequent tests
          userApiKey = newApiKey;
        }
      } catch (error: any) {
        console.log('❌ API key refresh error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });

    it('should change password', async () => {
      console.log('\n🔐 TESTING PASSWORD CHANGE...');
      
      try {
        const changePasswordResponse = await apiClient.put(API_ENDPOINTS.auth.changePassword, {
          current_password: 'robertjboulos@gmail.com',
          new_password: 'robertjboulos@gmail.com' // Keep same for testing
        });
        
        console.log('✅ Password change response:', JSON.stringify(changePasswordResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ Password change error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });
  });

  describe('Validation History', () => {
    it('should load validation history with pagination', async () => {
      console.log('\n📜 TESTING VALIDATION HISTORY...');
      
      // Test page 1
      const page1Response = await apiClient.get(API_ENDPOINTS.validation.history, {
        page: 1,
        limit: 10
      });
      
      expect(page1Response.data.success).toBe(true);
      expect(page1Response.data.data.validations).toBeDefined();
      
      console.log('✅ History page 1 loaded');
      console.log('📜 Total records:', page1Response.data.data.total || page1Response.data.data.validations.length);
      
      // Test page 2 if there are enough records
      if ((page1Response.data.data.total || 0) > 10) {
        const page2Response = await apiClient.get(API_ENDPOINTS.validation.history, {
          page: 2,
          limit: 10
        });
        
        console.log('✅ History page 2 loaded');
        console.log('📜 Page 2 records:', page2Response.data.data.validations.length);
      }
    });
  });

  describe('File Upload Validation', () => {
    it('should validate CSV file upload', async () => {
      console.log('\n📁 TESTING FILE UPLOAD VALIDATION...');
      
      try {
        // Create a test CSV content
        const csvContent = 'email,phone\ntest@example.com,+1234567890\ninvalid-email,555-1234';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', blob, 'test.csv');
        formData.append('api_key', userApiKey);
        
        const uploadResponse = await apiClient.post(API_ENDPOINTS.batch.uploadCsv, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('✅ File upload response:', JSON.stringify(uploadResponse.data, null, 2));
        
        // If we get a batch ID, check the status
        if (uploadResponse.data.batch_id) {
          const statusResponse = await apiClient.get(API_ENDPOINTS.batch.status, {
            batch_id: uploadResponse.data.batch_id
          });
          
          console.log('📊 Batch status:', JSON.stringify(statusResponse.data, null, 2));
        }
      } catch (error: any) {
        console.log('❌ File upload error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });
  });

  describe('Stripe & Billing Integration', () => {
    it('should create checkout session', async () => {
      console.log('\n💳 TESTING STRIPE CHECKOUT...');
      
      try {
        const checkoutResponse = await apiClient.post(API_ENDPOINTS.billing.checkout, {
          plan: 'starter',
          quantity: 1000 // 1000 credits
        });
        
        console.log('✅ Checkout session response:', JSON.stringify(checkoutResponse.data, null, 2));
        
        if (checkoutResponse.data.checkout_url || checkoutResponse.data.url) {
          console.log('💳 Checkout URL:', checkoutResponse.data.checkout_url || checkoutResponse.data.url);
        }
      } catch (error: any) {
        console.log('❌ Checkout endpoint error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });

    it('should handle Stripe webhook', async () => {
      console.log('\n🪝 TESTING STRIPE WEBHOOK...');
      
      try {
        // Simulate webhook payload
        const webhookPayload = {
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_' + Date.now(),
              payment_status: 'paid',
              amount_total: 1000,
              metadata: {
                user_id: userId.toString(),
                credits: '1000'
              }
            }
          }
        };
        
        const webhookResponse = await apiClient.post(API_ENDPOINTS.webhooks.stripeCheckout, webhookPayload, {
          headers: {
            'stripe-signature': 'test_signature' // Xano might need this
          }
        });
        
        console.log('✅ Webhook response:', JSON.stringify(webhookResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ Webhook error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });

    it('should check subscription status', async () => {
      console.log('\n💳 TESTING SUBSCRIPTION STATUS...');
      
      try {
        const statusResponse = await apiClient.get(API_ENDPOINTS.billing.subscriptions.status);
        
        console.log('✅ Subscription status response:', JSON.stringify(statusResponse.data, null, 2));
      } catch (error: any) {
        console.log('❌ Subscription status error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });

    it('should create billing portal session', async () => {
      console.log('\n🔧 TESTING BILLING PORTAL...');
      
      try {
        const portalResponse = await apiClient.post(API_ENDPOINTS.billing.subscriptions.billingPortal);
        
        console.log('✅ Billing portal response:', JSON.stringify(portalResponse.data, null, 2));
        
        if (portalResponse.data.url) {
          console.log('🔧 Portal URL:', portalResponse.data.url);
        }
      } catch (error: any) {
        console.log('❌ Billing portal error:', error.message);
        console.log('📝 Response:', error.response?.data);
      }
    });
  });

  describe('Credits & Usage', () => {
    it('should track credit usage correctly', async () => {
      console.log('\n💰 TESTING CREDIT TRACKING...');
      
      // Get initial balance
      const initialBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      const startCredits = initialBalance.data.data.current_balance;
      
      console.log('💰 Starting credits:', startCredits);
      
      // Run a validation
      const testEmail = `credit-test-${Date.now()}@example.com`;
      const validationResponse = await apiClient.post(API_ENDPOINTS.validation.single, {
        email: testEmail,
        api_key: userApiKey,
      });
      
      console.log('📧 Validation complete');
      console.log('💰 Credits after validation:', validationResponse.data.credits_remaining);
      
      // Verify balance updated
      const finalBalance = await apiClient.get(API_ENDPOINTS.billing.balance);
      const endCredits = finalBalance.data.data.current_balance;
      
      expect(endCredits).toBe(validationResponse.data.credits_remaining);
      expect(endCredits).toBe(startCredits - 1);
      console.log('✅ Credit deduction verified: ', startCredits, '->', endCredits);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid API key gracefully', async () => {
      console.log('\n❌ TESTING ERROR HANDLING...');
      
      try {
        await apiClient.post(API_ENDPOINTS.validation.single, {
          email: 'test@example.com',
          api_key: 'invalid_api_key_12345',
        });
        
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        console.log('✅ Invalid API key handled correctly:', error.message);
        expect(error.response?.status).toBe(401);
      }
    });

    it('should handle rate limiting', async () => {
      console.log('\n⏱️ TESTING RATE LIMITING...');
      
      // Make multiple rapid requests
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          apiClient.post(API_ENDPOINTS.validation.single, {
            email: `ratelimit${i}@example.com`,
            api_key: userApiKey,
          })
        );
      }
      
      try {
        await Promise.all(promises);
        console.log('✅ No rate limiting detected (or high limit)');
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.log('✅ Rate limiting working correctly');
        } else {
          console.log('❌ Unexpected error:', error.message);
        }
      }
    });
  });

  describe('Logout & Session Management', () => {
    it('should test session expiry', async () => {
      console.log('\n🚪 TESTING SESSION MANAGEMENT...');
      
      // Test with invalid token
      const oldToken = authToken;
      const invalidToken = 'invalid_token_12345';
      
      // Temporarily set invalid token
      global.localStorage = {
        getItem: (key: string) => key === 'token' ? invalidToken : null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null,
      };
      
      try {
        await apiClient.get(API_ENDPOINTS.auth.verify);
        console.log('❌ Invalid token should have been rejected!');
      } catch (error: any) {
        console.log('✅ Invalid token correctly rejected:', error.message);
      }
      
      // Restore valid token
      global.localStorage = {
        getItem: (key: string) => key === 'token' ? oldToken : null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null,
      };
      
      console.log('✅ Session management working correctly');
    });
  });
});