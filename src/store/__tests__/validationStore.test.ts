import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useValidationStore } from '../validationStore';
import { apiClient } from '../../services/api';

// Mock the API client
vi.mock('../../services/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock the auth store
vi.mock('../authStore', () => ({
  useAuthStore: {
    getState: () => ({
      user: {
        apiKey: 'test-api-key',
      },
    }),
  },
}));

describe('validationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useValidationStore.getState().clearResults();
  });

  describe('validateSingle', () => {
    it('should transform REAL Xano email validation response correctly', async () => {
      // Arrange: Mock ACTUAL Xano response structure 
      const xanoResponse = {
        data: {
          email: {
            valid: true,
            provided: true
          },
          phone: {
            valid: false, 
            provided: false
          },
          cached: false,
          success: true,
          credits_remaining: 496
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@gmail.com',
      });

      // Assert: Verify the transformation handles REAL response structure
      expect(result).toEqual({
        id: expect.any(String),
        email: 'test@gmail.com',
        phone: '',
        status: 'valid', // email.valid is true
        confidence: 100,
        creditsUsed: 1, // Should derive from credits_remaining change
        details: {}, // No additional details in this response format
        createdAt: expect.any(String),
      });

      // Verify API call was made with correct data
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api:T86UHsBm/leads/validate',
        {
          email: 'test@gmail.com',
          api_key: 'test-api-key',
        }
      );
    });

    it('should transform REAL Xano phone validation response correctly', async () => {
      // Arrange: Mock ACTUAL Xano response for phone validation
      const xanoResponse = {
        data: {
          email: {
            valid: false,
            provided: false
          },
          phone: {
            valid: true,
            provided: true
          },
          cached: false,
          success: true,
          credits_remaining: 495
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        phone: '+16472965544',
      });

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        email: '',
        phone: '+16472965544',
        status: 'valid', // phone.valid is true
        confidence: 100,
        creditsUsed: 1,
        details: {},
        createdAt: expect.any(String),
      });
    });

    it('should handle both email and phone validation', async () => {
      // Arrange: Mock REAL Xano response for both email and phone
      const xanoResponse = {
        data: {
          email: {
            valid: false,
            provided: true
          },
          phone: {
            valid: true,
            provided: true
          },
          cached: false,
          success: true,
          credits_remaining: 494
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@example.com',
        phone: '+16472965544',
      });

      // Assert: Should be valid if either email OR phone is valid
      expect(result).toEqual({
        id: expect.any(String),
        email: 'test@example.com',
        phone: '+16472965544',
        status: 'valid', // Phone is valid, so overall status is valid
        confidence: 100,
        creditsUsed: 1,
        details: {},
        createdAt: expect.any(String),
      });
    });

    it('should handle invalid validation results', async () => {
      // Arrange: Mock REAL Xano response with invalid results
      const xanoResponse = {
        data: {
          email: {
            valid: false,
            provided: true
          },
          phone: {
            valid: false,
            provided: true
          },
          cached: false,
          success: true,
          credits_remaining: 493
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'invalid@invalid.com',
        phone: '+1234567890',
      });

      // Assert
      expect(result).toEqual({
        id: expect.any(String),
        email: 'invalid@invalid.com',
        phone: '+1234567890',
        status: 'invalid',
        confidence: 0,
        creditsUsed: 1,
        details: {},
        createdAt: expect.any(String),
      });
    });

    it('should add result to store results', async () => {
      // Arrange: Mock REAL Xano response
      const xanoResponse = {
        data: {
          email: {
            valid: true,
            provided: true
          },
          phone: {
            valid: false,
            provided: false
          },
          cached: false,
          success: true,
          credits_remaining: 492
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      await useValidationStore.getState().validateSingle({
        email: 'store@test.com',
      });

      // Assert: Result should be added to store
      const storeResults = useValidationStore.getState().results;
      expect(storeResults).toHaveLength(1);
      expect(storeResults[0].email).toBe('store@test.com');
      expect(storeResults[0].status).toBe('valid');
    });

    // Note: Testing auth error scenarios requires more complex mocking setup
    // The main validation transformation logic is thoroughly tested above
  });

  describe('addResult', () => {
    it('should sanitize result details when adding to store', () => {
      // Arrange: Create a result with object values in details
      const resultWithObjects = {
        id: '999',
        email: 'test@test.com',
        phone: '',
        status: 'valid' as const,
        confidence: 100,
        creditsUsed: 1,
        details: {
          domain: 'test.com',
          objectField: { provided: 'test@test.com', valid: true }, // This should be stringified
          nullField: null,
          undefinedField: undefined,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Act
      useValidationStore.getState().addResult(resultWithObjects as any);

      // Assert: Object should be stringified, null/undefined should be empty strings
      const storeResults = useValidationStore.getState().results;
      expect(storeResults[0].details).toEqual({
        domain: 'test.com',
        objectField: '{"provided":"test@test.com","valid":true}',
        nullField: '',
        undefinedField: '',
      });
    });
  });
});