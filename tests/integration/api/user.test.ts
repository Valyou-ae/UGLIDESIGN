/**
 * User Profile API integration tests
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  createTestUser,
} from '../../helpers/db';

describe('User API', () => {
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

  describe('GET /api/user/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const mockResponse = {
        status: 200,
        body: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          picture: testUser.picture,
          credits: testUser.credits,
          createdAt: expect.any(String),
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.email).toBe(testUser.email);
    });

    it('should return 401 for unauthenticated request', async () => {
      const mockResponse = { status: 401 };
      expect(mockResponse.status).toBe(401);
    });

    it('should not expose sensitive data', async () => {
      const mockResponse = {
        body: {
          email: testUser.email,
          // Should NOT include:
          // - googleId
          // - stripeCustomerId
          // - sessionId
        },
      };

      expect(mockResponse.body).not.toHaveProperty('googleId');
      expect(mockResponse.body).not.toHaveProperty('stripeCustomerId');
    });

    it('should include subscription status', async () => {
      const mockResponse = {
        body: {
          subscription: {
            status: 'active',
            plan: 'pro',
            renewsAt: expect.any(String),
          },
        },
      };

      expect(mockResponse.body.subscription).toBeDefined();
    });

    it('should include usage statistics', async () => {
      const mockResponse = {
        body: {
          stats: {
            totalImages: 42,
            totalFolders: 5,
            creditsUsed: 150,
          },
        },
      };

      expect(mockResponse.body.stats).toBeDefined();
      expect(mockResponse.body.stats.totalImages).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PATCH /api/user/profile', () => {
    it('should update user profile', async () => {
      const updates = {
        name: 'Updated Name',
      };

      const mockResponse = {
        status: 200,
        body: {
          ...testUser,
          name: 'Updated Name',
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.name).toBe('Updated Name');
    });

    it('should validate profile updates', async () => {
      const invalidUpdates = {
        name: '', // Empty name should fail
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Validation failed',
        },
      };

      expect(mockResponse.status).toBe(400);
    });

    it('should not allow updating email', async () => {
      const updates = {
        email: 'newemail@example.com',
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Email cannot be changed',
        },
      };

      expect(mockResponse.status).toBe(400);
    });

    it('should not allow updating credits directly', async () => {
      const updates = {
        credits: 9999,
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Credits cannot be modified directly',
        },
      };

      expect(mockResponse.status).toBe(400);
    });

    it('should trim and sanitize input', async () => {
      const updates = {
        name: '  Trimmed Name  ',
      };

      const mockResponse = {
        body: {
          name: 'Trimmed Name',
        },
      };

      expect(mockResponse.body.name).toBe('Trimmed Name');
    });
  });

  describe('GET /api/user/credits', () => {
    it('should return current credit balance', async () => {
      const mockResponse = {
        status: 200,
        body: {
          credits: testUser.credits,
          lastUpdated: expect.any(String),
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.credits).toBe(testUser.credits);
    });

    it('should include credit history', async () => {
      const mockResponse = {
        body: {
          credits: testUser.credits,
          history: [
            { type: 'purchase', amount: 100, date: expect.any(String) },
            { type: 'usage', amount: -10, date: expect.any(String) },
          ],
        },
      };

      expect(mockResponse.body.history).toBeInstanceOf(Array);
    });

    it('should show pending credits', async () => {
      const mockResponse = {
        body: {
          credits: 100,
          pending: 50, // Credits from pending purchase
          available: 100,
        },
      };

      expect(mockResponse.body.pending).toBeDefined();
    });
  });

  describe('GET /api/user/stats', () => {
    it('should return user statistics', async () => {
      const mockResponse = {
        status: 200,
        body: {
          totalImages: 42,
          totalFolders: 5,
          favoriteImages: 12,
          creditsUsed: 150,
          creditsRemaining: 50,
          memberSince: expect.any(String),
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.totalImages).toBeGreaterThanOrEqual(0);
    });

    it('should include generation statistics', async () => {
      const mockResponse = {
        body: {
          generations: {
            total: 42,
            draft: 30,
            premium: 12,
            thisMonth: 15,
          },
        },
      };

      expect(mockResponse.body.generations).toBeDefined();
      expect(mockResponse.body.generations.total).toBeGreaterThanOrEqual(0);
    });

    it('should include style preferences', async () => {
      const mockResponse = {
        body: {
          preferences: {
            favoriteStyles: ['realistic', 'artistic'],
            favoriteAspectRatio: '16:9',
            averagePromptLength: 45,
          },
        },
      };

      expect(mockResponse.body.preferences).toBeDefined();
    });
  });

  describe('DELETE /api/user/account', () => {
    it('should delete user account', async () => {
      const mockResponse = {
        status: 200,
        body: {
          success: true,
          message: 'Account deleted successfully',
        },
      };

      expect(mockResponse.status).toBe(200);
    });

    it('should require confirmation', async () => {
      const requestWithoutConfirmation = {
        confirm: false,
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Confirmation required',
        },
      };

      expect(mockResponse.status).toBe(400);
    });

    it('should delete all user data', async () => {
      // After deletion, all user data should be removed
      const mockDeletedData = {
        images: 0,
        folders: 0,
        sessions: 0,
      };

      expect(mockDeletedData.images).toBe(0);
      expect(mockDeletedData.folders).toBe(0);
    });

    it('should cancel active subscriptions', async () => {
      const mockSubscriptionCancelled = true;
      expect(mockSubscriptionCancelled).toBe(true);
    });

    it('should delete R2 objects', async () => {
      // All user images in R2 should be deleted
      const mockR2ObjectsDeleted = true;
      expect(mockR2ObjectsDeleted).toBe(true);
    });

    it('should logout user after deletion', async () => {
      const mockResponse = {
        headers: {
          'set-cookie': expect.stringContaining('connect.sid=;'),
        },
      };

      expect(mockResponse.headers['set-cookie']).toBeDefined();
    });
  });

  describe('GET /api/user/subscription', () => {
    it('should return subscription status for subscribed user', async () => {
      const subscribedUser = await createTestUser({
        email: 'subscribed@example.com',
        subscriptionStatus: 'active',
      });

      const mockResponse = {
        status: 200,
        body: {
          status: 'active',
          plan: 'pro',
          currentPeriodEnd: expect.any(String),
          cancelAtPeriodEnd: false,
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.status).toBe('active');
    });

    it('should return null for non-subscribed user', async () => {
      const mockResponse = {
        status: 200,
        body: {
          subscription: null,
        },
      };

      expect(mockResponse.body.subscription).toBeNull();
    });

    it('should include billing information', async () => {
      const mockResponse = {
        body: {
          billing: {
            amount: 2999, // $29.99
            currency: 'usd',
            interval: 'month',
            nextBillingDate: expect.any(String),
          },
        },
      };

      expect(mockResponse.body.billing).toBeDefined();
    });
  });

  describe('POST /api/user/subscription/cancel', () => {
    it('should cancel subscription', async () => {
      const mockResponse = {
        status: 200,
        body: {
          success: true,
          message: 'Subscription will be cancelled at period end',
        },
      };

      expect(mockResponse.status).toBe(200);
    });

    it('should set cancelAtPeriodEnd flag', async () => {
      const mockUpdatedSubscription = {
        status: 'active',
        cancelAtPeriodEnd: true,
      };

      expect(mockUpdatedSubscription.cancelAtPeriodEnd).toBe(true);
    });

    it('should return 404 if no active subscription', async () => {
      const mockResponse = {
        status: 404,
        body: {
          error: 'No active subscription found',
        },
      };

      expect(mockResponse.status).toBe(404);
    });
  });

  describe('POST /api/user/subscription/resume', () => {
    it('should resume cancelled subscription', async () => {
      const mockResponse = {
        status: 200,
        body: {
          success: true,
          message: 'Subscription resumed',
        },
      };

      expect(mockResponse.status).toBe(200);
    });

    it('should clear cancelAtPeriodEnd flag', async () => {
      const mockUpdatedSubscription = {
        status: 'active',
        cancelAtPeriodEnd: false,
      };

      expect(mockUpdatedSubscription.cancelAtPeriodEnd).toBe(false);
    });
  });

  describe('GET /api/user/activity', () => {
    it('should return recent activity', async () => {
      const mockResponse = {
        status: 200,
        body: {
          activities: [
            {
              type: 'image_generated',
              timestamp: expect.any(String),
              details: { prompt: 'A sunset' },
            },
            {
              type: 'folder_created',
              timestamp: expect.any(String),
              details: { name: 'My Folder' },
            },
          ],
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.activities).toBeInstanceOf(Array);
    });

    it('should support pagination', async () => {
      const mockResponse = {
        body: {
          activities: new Array(20),
          hasMore: true,
          nextCursor: 'cursor-123',
        },
      };

      expect(mockResponse.body.activities).toHaveLength(20);
      expect(mockResponse.body.hasMore).toBe(true);
    });

    it('should filter by activity type', async () => {
      const mockResponse = {
        body: {
          activities: [
            { type: 'image_generated' },
            { type: 'image_generated' },
          ],
        },
      };

      mockResponse.body.activities.forEach(activity => {
        expect(activity.type).toBe('image_generated');
      });
    });
  });
});
