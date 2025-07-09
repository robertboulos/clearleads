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
    it('should transform Xano email validation response correctly', async () => {
      // Arrange: Mock Xano response for email validation
      const xanoResponse = {
        data: {
          id: 123,
          email: 'test@gmail.com',
          phone: null,
          credits_used: 1,
          created_at: 1704067200000, // 2024-01-01T00:00:00.000Z in milliseconds
          validation_details: {
            email_result: {
              valid: true,
              domain: 'gmail.com',
              disposable: false,
              country: 'US',
              provider: 'Google',
            },
            phone_result: null,
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@gmail.com',
      });

      // Assert: Verify the transformation
      expect(result).toEqual({
        id: '123',
        email: 'test@gmail.com',
        phone: '',
        status: 'valid',
        confidence: 100,
        creditsUsed: 1,
        details: {
          domain: 'gmail.com',
          disposable: 'false',
          country: 'US',
          provider: 'Google',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
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

    it('should transform Xano phone validation response correctly', async () => {
      // Arrange: Mock Xano response for phone validation
      const xanoResponse = {
        data: {
          id: 124,
          email: null,
          phone: '+16472965544',
          credits_used: 1,
          created_at: 1704067200000,
          validation_details: {
            email_result: null,
            phone_result: {
              valid: true,
              carrier: 'T-Mobile',
              lineType: 'mobile',
              country: 'CA',
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        phone: '+16472965544',
      });

      // Assert
      expect(result).toEqual({
        id: '124',
        email: '',
        phone: '+16472965544',
        status: 'valid',
        confidence: 100,
        creditsUsed: 1,
        details: {
          carrier: 'T-Mobile',
          lineType: 'mobile',
          country: 'CA',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle both email and phone validation', async () => {
      // Arrange: Mock Xano response for both email and phone
      const xanoResponse = {
        data: {
          id: 125,
          email: 'test@example.com',
          phone: '+16472965544',
          credits_used: 2,
          created_at: 1704067200000,
          validation_details: {
            email_result: {
              valid: false,
              domain: 'example.com',
              disposable: true,
              country: 'US',
              provider: 'Unknown',
            },
            phone_result: {
              valid: true,
              carrier: 'Bell',
              lineType: 'mobile',
              country: 'CA',
            },
          },
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
        id: '125',
        email: 'test@example.com',
        phone: '+16472965544',
        status: 'valid', // Phone is valid, so overall status is valid
        confidence: 100,
        creditsUsed: 2,
        details: {
          domain: 'example.com',
          disposable: 'true',
          country: 'US', // Email country takes precedence, phone country not added if email country exists
          provider: 'Unknown',
          carrier: 'Bell',
          lineType: 'mobile',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle invalid validation results', async () => {
      // Arrange: Mock Xano response with invalid results
      const xanoResponse = {
        data: {
          id: 126,
          email: 'invalid@invalid.com',
          phone: '+1234567890',
          credits_used: 2,
          created_at: 1704067200000,
          validation_details: {
            email_result: {
              valid: false,
              domain: 'invalid.com',
              disposable: false,
              country: null,
              provider: null,
            },
            phone_result: {
              valid: false,
              carrier: null,
              lineType: null,
              country: null,
            },
          },
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
        id: '126',
        email: 'invalid@invalid.com',
        phone: '+1234567890',
        status: 'invalid',
        confidence: 0,
        creditsUsed: 2,
        details: {
          domain: 'invalid.com',
          disposable: 'false',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle missing validation_details gracefully', async () => {
      // Arrange: Mock Xano response without validation_details
      const xanoResponse = {
        data: {
          id: 127,
          email: 'test@test.com',
          phone: null,
          credits_used: 1,
          created_at: 1704067200000,
          // Missing validation_details entirely
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@test.com',
      });

      // Assert
      expect(result).toEqual({
        id: '127',
        email: 'test@test.com',
        phone: '',
        status: 'unknown',
        confidence: 0,
        creditsUsed: 1,
        details: {},
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle invalid timestamp gracefully', async () => {
      // Arrange: Mock Xano response with invalid timestamp
      const xanoResponse = {
        data: {
          id: 128,
          email: 'test@test.com',
          phone: null,
          credits_used: 1,
          created_at: 'invalid-timestamp',
          validation_details: {
            email_result: {
              valid: true,
              domain: 'test.com',
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@test.com',
      });

      // Assert: Should use fallback timestamp
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result.status).toBe('valid');
    });

    it('should handle missing timestamp gracefully', async () => {
      // Arrange: Mock Xano response without timestamp
      const xanoResponse = {
        data: {
          id: 129,
          email: 'test@test.com',
          credits_used: 1,
          // Missing created_at
          validation_details: {
            email_result: {
              valid: true,
              domain: 'test.com',
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(xanoResponse);

      // Act
      const result = await useValidationStore.getState().validateSingle({
        email: 'test@test.com',
      });

      // Assert: Should use fallback timestamp
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should add result to store results', async () => {
      // Arrange
      const xanoResponse = {
        data: {
          id: 130,
          email: 'store@test.com',
          credits_used: 1,
          created_at: 1704067200000,
          validation_details: {
            email_result: {
              valid: true,
              domain: 'test.com',
            },
          },
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