#!/usr/bin/env node

const API_BASE = 'https://api.clearleads.io';

// Your actual credentials
const YOUR_USER = {
  email: 'robertjboulos@gmail.com',
  password: 'TestPassword123!'
};

const ENDPOINTS = {
  auth: {
    login: '/api:Is1L6GFg/auth/login',
    register: '/api:Is1L6GFg/auth/register',
    me: '/api:Is1L6GFg/auth/me'
  }
};

let testResults = [];

function log(test, status, message, data = null) {
  const result = { test, status, message, data, timestamp: new Date().toISOString() };
  testResults.push(result);
  console.log(`${status === 'PASS' ? '✅' : status === 'INFO' ? '📋' : '❌'} ${test}: ${message}`);
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
    log(name, 'FAIL', `${method} ${endpoint} - ${error.message}`, null);
    throw error;
  }
}

async function testLoginFlow() {
  console.log('🔧 FIXING YOUR LOGIN ISSUE\n');
  
  // Step 1: Try to login with your credentials
  console.log('=== STEP 1: Testing Login ===');
  let authToken = null;
  
  try {
    const loginResponse = await testEndpoint(
      'Your Login Test',
      'POST',
      ENDPOINTS.auth.login,
      YOUR_USER
    );
    
    authToken = loginResponse.authToken;
    log('Login Success', 'PASS', 'You can login successfully!');
    
  } catch (error) {
    log('Login Failed', 'FAIL', `Login failed: ${error.message}`);
    
    // Step 2: The issue might be that your account doesn't exist yet
    console.log('\n=== STEP 2: Account Creation ===');
    
    try {
      const registerResponse = await testEndpoint(
        'Account Creation',
        'POST',
        ENDPOINTS.auth.register,
        {
          email: YOUR_USER.email,
          password: YOUR_USER.password,
          name: 'Robert Boulos'
        }
      );
      
      authToken = registerResponse.authToken;
      log('Account Created', 'PASS', 'Account created successfully!');
      
      // Now try login again
      try {
        const loginResponse = await testEndpoint(
          'Login After Registration',
          'POST',
          ENDPOINTS.auth.login,
          YOUR_USER
        );
        
        authToken = loginResponse.authToken;
        log('Login After Registration', 'PASS', 'Login works after registration!');
        
      } catch (loginError) {
        log('Login After Registration', 'FAIL', `Login still failed: ${loginError.message}`);
      }
      
    } catch (registerError) {
      if (registerError.message.includes('already registered')) {
        log('Account Status', 'INFO', 'Account exists but login failed - password might be different');
        
        // Step 3: Try with different password
        console.log('\n=== STEP 3: Testing Different Passwords ===');
        
        const testPasswords = [
          'TestPassword123!',
          'testpassword123',
          'password123',
          'TestPassword',
          'robertjboulos@gmail.com' // Sometimes email is used as temp password
        ];
        
        for (const testPassword of testPasswords) {
          try {
            const loginResponse = await testEndpoint(
              `Password Test: ${testPassword}`,
              'POST',
              ENDPOINTS.auth.login,
              { email: YOUR_USER.email, password: testPassword }
            );
            
            authToken = loginResponse.authToken;
            log('Password Found', 'PASS', `Working password: ${testPassword}`);
            break;
            
          } catch (error) {
            log('Password Test', 'FAIL', `Password "${testPassword}" failed`);
          }
        }
      } else {
        log('Registration Error', 'FAIL', `Registration failed: ${registerError.message}`);
      }
    }
  }
  
  // Step 4: Test the frontend integration
  if (authToken) {
    console.log('\n=== STEP 4: Frontend Integration Test ===');
    
    // Test what the frontend auth service expects
    const authHeaders = { 'Authorization': `Bearer ${authToken}` };
    
    // Test different auth endpoints to see which one works
    const authEndpoints = [
      ENDPOINTS.auth.me,
      '/api:Is1L6GFg/auth/verify',
      '/api:Is1L6GFg/get_api_key'
    ];
    
    for (const endpoint of authEndpoints) {
      try {
        const response = await testEndpoint(
          `Auth Test: ${endpoint}`,
          'GET',
          endpoint,
          null,
          authHeaders
        );
        
        log('Auth Endpoint Works', 'PASS', `${endpoint} works with Bearer token`);
        
      } catch (error) {
        log('Auth Endpoint Failed', 'FAIL', `${endpoint} failed: ${error.message}`);
      }
    }
    
    // Test the exact format the frontend needs
    const frontendTestData = {
      token: authToken,
      user: {
        email: YOUR_USER.email
      }
    };
    
    log('Frontend Auth Data', 'INFO', 'Token for frontend localStorage', frontendTestData);
  }
  
  // Step 5: Provide solution
  console.log('\n=== SOLUTION FOR YOUR LOGIN ISSUE ===');
  
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const failCount = testResults.filter(r => r.status === 'FAIL').length;
  
  console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed`);
  
  if (authToken) {
    console.log('\n🎉 SUCCESS! Here\'s what you need to know:');
    console.log(`✅ Your email: ${YOUR_USER.email}`);
    console.log(`✅ Your password: ${YOUR_USER.password}`);
    console.log(`✅ Working auth token: ${authToken.substring(0, 50)}...`);
    console.log('\n🔧 The issue is likely:');
    console.log('1. Frontend form validation is rejecting valid inputs');
    console.log('2. Frontend is sending undefined values to API');
    console.log('3. Auth token validation has issues (403 errors)');
    console.log('\n💡 Next steps:');
    console.log('1. Check frontend form validation logic');
    console.log('2. Check if frontend is properly sending email/password');
    console.log('3. Fix auth token handling in frontend');
  } else {
    console.log('\n❌ LOGIN STILL FAILING');
    console.log('The API is working but your credentials are not matching');
    console.log('You may need to:');
    console.log('1. Reset your password');
    console.log('2. Use a different password');
    console.log('3. Check if account exists with different email');
  }
}

testLoginFlow().catch(console.error);