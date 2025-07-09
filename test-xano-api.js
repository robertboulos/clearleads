#!/usr/bin/env node

const API_BASE = 'https://api.clearleads.io';
const TEST_USER = {
  email: 'claude-test@example.com',
  password: 'TestPassword123!',
  name: 'Claude Test User'
};

const REAL_USER = {
  email: 'robertjboulos@gmail.com',
  password: 'TestPassword123!'
};

// Correct endpoint format using Canonical ID from Xano documentation
const ENDPOINTS = {
  auth: {
    login: '/api:Is1L6GFg/auth/login',
    register: '/api:Is1L6GFg/auth/register',
    me: '/api:Is1L6GFg/auth/me',
    getApiKey: '/api:Is1L6GFg/get_api_key',
    changePassword: '/api:Is1L6GFg/auth/change-password'
  },
  credits: {
    balance: '/api:Is1L6GFg/credits/balance'
  },
  dashboard: {
    usage: '/api:Is1L6GFg/dashboard/usage'
  },
  validation: {
    single: '/api:T86UHsBm/leads/validate',
    agent: '/api:T86UHsBm/leads/validate_agent'
  },
  billing: {
    checkout: '/api:rKeV8O3i/checkout/create-session'
  }
};

let authToken = null;
let testResults = [];

function log(test, status, message, data = null) {
  const result = { test, status, message, data, timestamp: new Date().toISOString() };
  testResults.push(result);
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`);
  if (data) console.log('   Data:', JSON.stringify(data, null, 2));
}

async function testEndpoint(name, method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: AbortSignal.timeout(10000)
    };
    
    if (data) config.body = JSON.stringify(data);
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const responseData = await response.json();
    
    if (response.ok) {
      log(name, 'PASS', `${method} ${endpoint} - ${response.status}`, responseData);
      return responseData;
    } else {
      throw new Error(`HTTP ${response.status}: ${responseData.message || responseData.error || 'Unknown error'}`);
    }
  } catch (error) {
    const status = error.status || 'NO_RESPONSE';
    const message = error.message || 'Unknown error';
    log(name, 'FAIL', `${method} ${endpoint} - ${status}: ${message}`, null);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Testing ClearLeads Xano API Integration\n');
  
  // Test 1: Test actual login flow with your real email
  console.log('=== TESTING REAL USER LOGIN FLOW ===\n');
  
  try {
    const loginResponse = await testEndpoint(
      'Real User Login',
      'POST',
      ENDPOINTS.auth.login,
      { email: REAL_USER.email, password: REAL_USER.password }
    );
    
    if (loginResponse.authToken) {
      log('Real User Login', 'PASS', 'Successfully logged in with real account');
      authToken = loginResponse.authToken;
      
      // Test the auth token immediately
      const authHeaders = { 'Authorization': `Bearer ${authToken}` };
      
      try {
        const userResponse = await testEndpoint(
          'Real User Auth Check',
          'GET',
          ENDPOINTS.auth.me,
          null,
          authHeaders
        );
        
        if (userResponse.email === REAL_USER.email) {
          log('Real User Auth', 'PASS', 'Auth token works correctly');
        } else {
          log('Real User Auth', 'FAIL', 'Auth token returned wrong user data');
        }
      } catch (authError) {
        log('Real User Auth', 'FAIL', `Auth token validation failed: ${authError.message}`);
      }
    } else {
      log('Real User Login', 'FAIL', 'No auth token received');
    }
  } catch (error) {
    log('Real User Login', 'FAIL', `Login failed: ${error.message}`);
    
    // If login fails, try to register the user first
    console.log('\n=== TRYING TO REGISTER REAL USER ===\n');
    try {
      const registerResponse = await testEndpoint(
        'Real User Registration',
        'POST',
        ENDPOINTS.auth.register,
        { email: REAL_USER.email, password: REAL_USER.password, name: 'Robert Boulos' }
      );
      
      if (registerResponse.authToken) {
        log('Real User Registration', 'PASS', 'Successfully registered real user');
        authToken = registerResponse.authToken;
        
        // Test login after registration
        try {
          const loginResponse = await testEndpoint(
            'Real User Login After Registration',
            'POST',
            ENDPOINTS.auth.login,
            { email: REAL_USER.email, password: REAL_USER.password }
          );
          
          if (loginResponse.authToken) {
            log('Real User Login After Registration', 'PASS', 'Login works after registration');
            authToken = loginResponse.authToken;
          }
        } catch (loginError) {
          log('Real User Login After Registration', 'FAIL', `Login failed after registration: ${loginError.message}`);
        }
      }
    } catch (registerError) {
      log('Real User Registration', 'FAIL', `Registration failed: ${registerError.message}`);
    }
  }
  
  console.log('\n=== TESTING FRONTEND PAYLOAD FORMATS ===\n');
  
  // Test different payload formats that frontend might be sending
  if (authToken) {
    const authHeaders = { 'Authorization': `Bearer ${authToken}` };
    
    // Test 1: Empty payload (what frontend might be sending)
    try {
      const emptyResponse = await testEndpoint(
        'Empty Payload Test',
        'POST',
        ENDPOINTS.auth.login,
        {},
        {}
      );
      log('Empty Payload Test', 'FAIL', 'Should have failed with empty payload');
    } catch (error) {
      log('Empty Payload Test', 'PASS', `Correctly rejected empty payload: ${error.message}`);
    }
    
    // Test 2: Undefined values (what frontend error suggests)
    try {
      const undefinedResponse = await testEndpoint(
        'Undefined Values Test',
        'POST',
        ENDPOINTS.auth.login,
        { email: undefined, password: undefined },
        {}
      );
      log('Undefined Values Test', 'FAIL', 'Should have failed with undefined values');
    } catch (error) {
      log('Undefined Values Test', 'PASS', `Correctly rejected undefined values: ${error.message}`);
    }
    
    // Test 3: Null values
    try {
      const nullResponse = await testEndpoint(
        'Null Values Test',
        'POST',
        ENDPOINTS.auth.login,
        { email: null, password: null },
        {}
      );
      log('Null Values Test', 'FAIL', 'Should have failed with null values');
    } catch (error) {
      log('Null Values Test', 'PASS', `Correctly rejected null values: ${error.message}`);
    }
    
    // Test 4: Missing fields
    try {
      const missingResponse = await testEndpoint(
        'Missing Fields Test',
        'POST',
        ENDPOINTS.auth.login,
        { email: REAL_USER.email }, // Missing password
        {}
      );
      log('Missing Fields Test', 'FAIL', 'Should have failed with missing password');
    } catch (error) {
      log('Missing Fields Test', 'PASS', `Correctly rejected missing password: ${error.message}`);
    }
    
    // Test 5: Test auth/me with different auth formats
    try {
      const meResponse1 = await testEndpoint(
        'Auth Me Test - Bearer',
        'GET',
        ENDPOINTS.auth.me,
        null,
        { 'Authorization': `Bearer ${authToken}` }
      );
      log('Auth Me Test - Bearer', 'PASS', 'Bearer token format works');
    } catch (error) {
      log('Auth Me Test - Bearer', 'FAIL', `Bearer token failed: ${error.message}`);
    }
    
    try {
      const meResponse2 = await testEndpoint(
        'Auth Me Test - Direct',
        'GET',
        ENDPOINTS.auth.me,
        null,
        { 'Authorization': authToken }
      );
      log('Auth Me Test - Direct', 'PASS', 'Direct token format works');
    } catch (error) {
      log('Auth Me Test - Direct', 'FAIL', `Direct token failed: ${error.message}`);
    }
  }
  
  console.log('\n=== TESTING API VALIDATION ===\n');
  
  // Test 2: Health check (try to access a protected endpoint without auth)
  try {
    await testEndpoint('Health Check', 'GET', ENDPOINTS.auth.me);
  } catch (error) {
    if (error.message.includes('401') || error.message.includes('403')) {
      log('Health Check', 'PASS', 'API is responding (401/403 as expected for unauthed request)');
    } else {
      log('Health Check', 'FAIL', 'Unexpected error', error.message);
    }
  }
  
  // Test 2: User Registration
  try {
    const registerResponse = await testEndpoint(
      'User Registration',
      'POST',
      ENDPOINTS.auth.register,
      TEST_USER
    );
    
    authToken = registerResponse.authToken;
    if (authToken) {
      log('Auth Token', 'PASS', 'Received auth token from registration');
    }
  } catch (error) {
    // If user exists, try to login instead
    if (error.message.includes('400') && error.message.includes('already')) {
      log('User Registration', 'INFO', 'User already exists, trying login instead');
      
      try {
        const loginResponse = await testEndpoint(
          'User Login',
          'POST',
          ENDPOINTS.auth.login,
          { email: TEST_USER.email, password: TEST_USER.password }
        );
        
        authToken = loginResponse.authToken;
        if (authToken) {
          log('Auth Token', 'PASS', 'Received auth token from login');
        }
      } catch (loginError) {
        log('User Login', 'FAIL', 'Login failed after registration failed');
        return;
      }
    } else {
      log('User Registration', 'FAIL', 'Registration failed unexpectedly');
      return;
    }
  }
  
  if (!authToken) {
    log('Authentication', 'FAIL', 'No auth token available for subsequent tests');
    return;
  }
  
  const authHeaders = { 'Authorization': `Bearer ${authToken}` };
  
  // Test 3: Get current user
  try {
    const userResponse = await testEndpoint(
      'Get Current User',
      'GET',
      ENDPOINTS.auth.me,
      null,
      authHeaders
    );
    
    if (userResponse.email === TEST_USER.email) {
      log('User Data', 'PASS', 'User data matches expected values');
    }
  } catch (error) {
    log('Get Current User', 'FAIL', 'Failed to get user data');
  }
  
  // Test 4: Get API Key
  try {
    const apiKeyResponse = await testEndpoint(
      'Get API Key',
      'GET',
      ENDPOINTS.auth.getApiKey,
      null,
      authHeaders
    );
    
    if (apiKeyResponse.api_key && apiKeyResponse.api_key.startsWith('clkey_')) {
      log('API Key Format', 'PASS', 'API key has correct format');
    }
  } catch (error) {
    log('Get API Key', 'FAIL', 'Failed to get API key');
  }
  
  // Test 5: Check credit balance
  try {
    const balanceResponse = await testEndpoint(
      'Credit Balance',
      'GET',
      ENDPOINTS.credits.balance,
      null,
      authHeaders
    );
    
    if (typeof balanceResponse.balance === 'number') {
      log('Credit Balance', 'PASS', `Credit balance: ${balanceResponse.balance}`);
    }
  } catch (error) {
    log('Credit Balance', 'FAIL', 'Failed to get credit balance');
  }
  
  // Test 6: Test lead validation (if we have credits)
  try {
    const validationResponse = await testEndpoint(
      'Lead Validation',
      'POST',
      ENDPOINTS.validation.single,
      { api_key: 'test_api_key', email: 'test@gmail.com' },
      authHeaders
    );
    
    if (validationResponse.validation_status) {
      log('Lead Validation', 'PASS', `Validation status: ${validationResponse.validation_status}`);
    }
  } catch (error) {
    if (error.message.includes('402')) {
      log('Lead Validation', 'INFO', 'Insufficient credits for validation test');
    } else {
      log('Lead Validation', 'FAIL', 'Validation test failed');
    }
  }
  
  // Test 7: Test checkout session creation
  try {
    const checkoutResponse = await testEndpoint(
      'Checkout Session',
      'POST',
      ENDPOINTS.billing.checkout,
      { package_type: 'starter' },
      authHeaders
    );
    
    if (checkoutResponse.checkout_url && checkoutResponse.checkout_url.includes('stripe')) {
      log('Stripe Integration', 'PASS', 'Stripe checkout URL generated');
    }
  } catch (error) {
    log('Checkout Session', 'FAIL', 'Failed to create checkout session');
  }
  
  // Test 8: Test analytics dashboard
  try {
    const analyticsResponse = await testEndpoint(
      'Analytics Dashboard',
      'GET',
      ENDPOINTS.dashboard.usage,
      null,
      authHeaders
    );
    
    if (typeof analyticsResponse.total_validations === 'number') {
      log('Analytics', 'PASS', `Total validations: ${analyticsResponse.total_validations}`);
    }
  } catch (error) {
    log('Analytics Dashboard', 'FAIL', 'Failed to get analytics data');
  }
  
  // Summary
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const failCount = testResults.filter(r => r.status === 'FAIL').length;
  const totalTests = testResults.filter(r => r.status !== 'INFO').length;
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📋 Total: ${totalTests}`);
  console.log(`📈 Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`);
  
  if (failCount === 0) {
    console.log('\n🎉 All tests passed! The Xano backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the details above for issues.');
  }
}

runTests().catch(console.error);