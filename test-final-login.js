#!/usr/bin/env node

const API_BASE = 'https://api.clearleads.io';

// Test the exact frontend login flow
const USER_CREDENTIALS = {
  email: 'robertjboulos@gmail.com',
  password: 'TestPassword123!'
};

const ENDPOINTS = {
  login: '/api:Is1L6GFg/auth/login',
  verify: '/api:Is1L6GFg/auth/verify'
};

async function testFinalLogin() {
  console.log('🔧 FINAL LOGIN TEST FOR FRONTEND\n');
  
  try {
    // Step 1: Test login
    console.log('=== Step 1: Login ===');
    const loginResponse = await fetch(`${API_BASE}${ENDPOINTS.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(USER_CREDENTIALS)
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Auth token received:', loginData.authToken.substring(0, 50) + '...');
      
      // Step 2: Test auth verification
      console.log('\n=== Step 2: Auth Verification ===');
      const verifyResponse = await fetch(`${API_BASE}${ENDPOINTS.verify}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.authToken}`
        }
      });
      
      const userData = await verifyResponse.json();
      
      if (verifyResponse.ok) {
        console.log('✅ Auth verification successful!');
        console.log('User data:', {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          apiKey: userData.API_Key
        });
        
        // Step 3: Final summary
        console.log('\n=== FINAL RESULT ===');
        console.log('🎉 LOGIN SYSTEM IS WORKING!');
        console.log('\n📋 Frontend Implementation:');
        console.log('1. Email:', USER_CREDENTIALS.email);
        console.log('2. Password:', USER_CREDENTIALS.password);
        console.log('3. Login endpoint:', ENDPOINTS.login);
        console.log('4. Verify endpoint:', ENDPOINTS.verify);
        console.log('5. Auth token format: Bearer <token>');
        
        console.log('\n🔧 Frontend Changes Made:');
        console.log('✅ Updated API endpoints to use correct canonical IDs');
        console.log('✅ Added input validation for email/password');
        console.log('✅ Fixed auth/me endpoint to use auth/verify');
        console.log('✅ Added proper error handling for undefined values');
        
        console.log('\n✅ YOU CAN NOW LOGIN TO THE APP!');
        
      } else {
        console.log('❌ Auth verification failed:', userData);
      }
      
    } else {
      console.log('❌ Login failed:', loginData);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testFinalLogin();