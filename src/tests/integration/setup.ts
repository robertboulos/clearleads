import { beforeAll } from 'vitest';

beforeAll(() => {
  // Log test environment info
  console.log('🚀 Starting Integration Tests');
  console.log('🌐 Base URL:', process.env.VITE_API_BASE_URL || 'default');
  console.log('📧 Test Email:', process.env.TEST_EMAIL || 'NOT SET - will use default');
  console.log('⚠️  Using REAL API - credits will be consumed');
});