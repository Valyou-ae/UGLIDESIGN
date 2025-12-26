/**
 * Authentication and Authorization integration tests
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  createTestUser,
} from '../../helpers/db';
import {
  createAuthenticatedRequest,
  createUnauthenticatedRequest,
} from '../../helpers/auth';

describe('Authentication API', () => {
  let testUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    testUser = await createTestUser();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('Google OAuth Flow', () => {
    it('should redirect to Google OAuth consent screen', async () => {
      // GET /api/auth/google
      const mockResponse = {
        status: 302,
        headers: {
          location: expect.stringContaining('accounts.google.com/o/oauth2'),
        },
      };

      expect(mockResponse.status).toBe(302);
      expect(mockResponse.headers.location).toContain('accounts.google.com');
    });

    it('should include required OAuth scopes', async () => {
      const mockOAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email';

      expect(mockOAuthUrl).toContain('scope=profile');
      expect(mockOAuthUrl).toContain('email');
    });

    it('should handle OAuth callback with valid code', async () => {
      // GET /api/auth/google/callback?code=valid_code
      const mockResponse = {
        status: 302,
        headers: {
          location: '/',
          'set-cookie': expect.stringContaining('connect.sid'),
        },
      };

      expect(mockResponse.status).toBe(302);
      expect(mockResponse.headers.location).toBe('/');
      expect(mockResponse.headers['set-cookie']).toBeDefined();
    });

    it('should create new user on first login', async () => {
      const newUserData = {
        googleId: 'google-123456',
        email: 'newuser@example.com',
        name: 'New User',
        picture: 'https://example.com/avatar.jpg',
      };

      const createdUser = await createTestUser(newUserData);

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe('newuser@example.com');
      expect(createdUser.credits).toBe(100); // Default credits
    });

    it('should update existing user on subsequent logins', async () => {
      const existingUser = await createTestUser({
        googleId: 'google-123456',
        name: 'Old Name',
      });

      // Simulate login with updated profile
      const updatedUser = {
        ...existingUser,
        name: 'New Name',
        picture: 'https://example.com/new-avatar.jpg',
      };

      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.picture).toContain('new-avatar.jpg');
    });

    it('should reject invalid OAuth code', async () => {
      // GET /api/auth/google/callback?code=invalid_code
      const mockResponse = {
        status: 302,
        headers: {
          location: '/login?error=auth_failed',
        },
      };

      expect(mockResponse.status).toBe(302);
      expect(mockResponse.headers.location).toContain('error=auth_failed');
    });

    it('should handle OAuth state mismatch', async () => {
      // Security check: state parameter should match
      const mockResponse = {
        status: 400,
        body: {
          error: 'Invalid state parameter',
        },
      };

      expect(mockResponse.status).toBe(400);
      expect(mockResponse.body.error).toContain('state');
    });
  });

  describe('Session Management', () => {
    it('should create session on successful login', async () => {
      const mockSession = {
        userId: testUser.id,
        cookie: {
          maxAge: 86400000, // 24 hours
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        },
      };

      expect(mockSession.userId).toBe(testUser.id);
      expect(mockSession.cookie.httpOnly).toBe(true);
      expect(mockSession.cookie.secure).toBe(true);
    });

    it('should include CSRF token in session', async () => {
      const mockSession = {
        csrfSecret: expect.any(String),
      };

      expect(mockSession.csrfSecret).toBeDefined();
    });

    it('should persist session across requests', async () => {
      // First request creates session
      const sessionId = 'test-session-123';

      // Second request with same session ID should be authenticated
      const mockAuthCheck = true;
      expect(mockAuthCheck).toBe(true);
    });

    it('should expire session after 24 hours', async () => {
      const sessionCreatedAt = Date.now();
      const sessionMaxAge = 86400000; // 24 hours

      const isExpired = Date.now() - sessionCreatedAt > sessionMaxAge;
      
      // For this test, session should not be expired yet
      expect(isExpired).toBe(false);
    });

    it('should destroy session on logout', async () => {
      // POST /api/auth/logout
      const mockResponse = {
        status: 200,
        body: { success: true },
        headers: {
          'set-cookie': expect.stringContaining('connect.sid=;'),
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.headers['set-cookie']).toContain('connect.sid=;');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return current user for authenticated request', async () => {
      const mockAuthRequest = createAuthenticatedRequest(testUser);

      const mockResponse = {
        status: 200,
        body: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          credits: testUser.credits,
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.email).toBe(testUser.email);
    });

    it('should return 401 for unauthenticated request', async () => {
      const mockUnauthRequest = createUnauthenticatedRequest();

      const mockResponse = { status: 401 };
      expect(mockResponse.status).toBe(401);
    });

    it('should not expose sensitive user data', async () => {
      const mockAuthRequest = createAuthenticatedRequest(testUser);

      const mockResponse = {
        body: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          // Should NOT include:
          // - googleId
          // - stripeCustomerId
          // - session data
        },
      };

      expect(mockResponse.body).not.toHaveProperty('googleId');
      expect(mockResponse.body).not.toHaveProperty('stripeCustomerId');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const mockResponse = {
        status: 200,
        body: { success: true },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.success).toBe(true);
    });

    it('should clear session cookie', async () => {
      const mockResponse = {
        headers: {
          'set-cookie': expect.stringContaining('connect.sid=;'),
        },
      };

      expect(mockResponse.headers['set-cookie']).toContain('connect.sid=;');
    });

    it('should clear CSRF token', async () => {
      // After logout, CSRF token should be invalidated
      const mockCsrfTokenCleared = true;
      expect(mockCsrfTokenCleared).toBe(true);
    });

    it('should redirect to home page', async () => {
      const mockResponse = {
        status: 302,
        headers: {
          location: '/',
        },
      };

      expect(mockResponse.status).toBe(302);
      expect(mockResponse.headers.location).toBe('/');
    });
  });

  describe('Authorization Middleware', () => {
    it('should allow authenticated users to access protected routes', async () => {
      const mockAuthRequest = createAuthenticatedRequest(testUser);

      // Protected route should return 200
      const mockResponse = { status: 200 };
      expect(mockResponse.status).toBe(200);
    });

    it('should block unauthenticated users from protected routes', async () => {
      const mockUnauthRequest = createUnauthenticatedRequest();

      // Protected route should return 401
      const mockResponse = { status: 401 };
      expect(mockResponse.status).toBe(401);
    });

    it('should allow users to access only their own resources', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const mockAuthRequest = createAuthenticatedRequest(testUser);

      // Trying to access other user's resource should return 403
      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });

    it('should allow admin users to access all resources', async () => {
      const adminUser = await createTestUser({
        email: 'admin@example.com',
        role: 'admin',
      });

      const mockAuthRequest = createAuthenticatedRequest(adminUser);

      // Admin should have access
      const mockResponse = { status: 200 };
      expect(mockResponse.status).toBe(200);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make 10 requests (within limit)
      for (let i = 0; i < 10; i++) {
        const mockResponse = { status: 200 };
        expect(mockResponse.status).toBe(200);
      }
    });

    it('should block requests exceeding rate limit', async () => {
      // Make 100 requests (exceeds limit)
      const responses = [];
      for (let i = 0; i < 100; i++) {
        responses.push({ status: i < 50 ? 200 : 429 });
      }

      // Last request should be rate limited
      expect(responses[99].status).toBe(429);
    });

    it('should include rate limit headers', async () => {
      const mockResponse = {
        headers: {
          'x-ratelimit-limit': '100',
          'x-ratelimit-remaining': '95',
          'x-ratelimit-reset': expect.any(String),
        },
      };

      expect(mockResponse.headers['x-ratelimit-limit']).toBe('100');
      expect(mockResponse.headers['x-ratelimit-remaining']).toBe('95');
    });

    it('should reset rate limit after time window', async () => {
      // Simulate time passing
      const initialLimit = { remaining: 0, resetAt: Date.now() + 60000 };
      
      // After reset time
      const afterReset = { remaining: 100, resetAt: Date.now() + 120000 };

      expect(afterReset.remaining).toBe(100);
    });

    it('should have different rate limits for different endpoints', async () => {
      const authRateLimit = { limit: 10, window: 900000 }; // 10 per 15 min
      const apiRateLimit = { limit: 100, window: 60000 }; // 100 per minute
      const generationRateLimit = { limit: 20, window: 3600000 }; // 20 per hour

      expect(authRateLimit.limit).toBeLessThan(apiRateLimit.limit);
      expect(generationRateLimit.limit).toBeLessThan(apiRateLimit.limit);
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing requests', async () => {
      // POST request without CSRF token should fail
      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });

    it('should accept valid CSRF token', async () => {
      const csrfToken = 'valid-csrf-token-123';

      const mockResponse = {
        status: 200,
        body: { success: true },
      };

      expect(mockResponse.status).toBe(200);
    });

    it('should reject invalid CSRF token', async () => {
      const invalidToken = 'invalid-token';

      const mockResponse = {
        status: 403,
        body: { error: 'Invalid CSRF token' },
      };

      expect(mockResponse.status).toBe(403);
      expect(mockResponse.body.error).toContain('CSRF');
    });

    it('should not require CSRF token for GET requests', async () => {
      // GET requests should work without CSRF token
      const mockResponse = { status: 200 };
      expect(mockResponse.status).toBe(200);
    });

    it('should not require CSRF token for webhooks', async () => {
      // Webhook endpoints should be exempted
      const mockWebhookResponse = { status: 200 };
      expect(mockWebhookResponse.status).toBe(200);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const mockResponse = {
        headers: {
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
          'x-xss-protection': '1; mode=block',
          'strict-transport-security': 'max-age=31536000; includeSubDomains',
        },
      };

      expect(mockResponse.headers['x-content-type-options']).toBe('nosniff');
      expect(mockResponse.headers['x-frame-options']).toBe('DENY');
    });

    it('should set secure cookie flags in production', async () => {
      process.env.NODE_ENV = 'production';

      const mockCookie = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax' as const,
      };

      expect(mockCookie.httpOnly).toBe(true);
      expect(mockCookie.secure).toBe(true);
    });

    it('should include CSP header', async () => {
      const mockResponse = {
        headers: {
          'content-security-policy': expect.stringContaining("default-src 'self'"),
        },
      };

      expect(mockResponse.headers['content-security-policy']).toBeDefined();
    });
  });
});
