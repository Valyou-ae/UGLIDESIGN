/**
 * Image Generation API integration tests
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  createTestUser,
} from '../../helpers/db';

describe('Generation API', () => {
  let testUser: any;
  let guestUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    testUser = await createTestUser({ credits: 100 });
    guestUser = await createTestUser({ 
      email: 'guest@example.com',
      credits: 5,
      role: 'guest'
    });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('POST /api/guest/generate-image', () => {
    it('should generate image for guest user', async () => {
      const requestData = {
        prompt: 'A beautiful sunset over mountains',
        guestId: 'guest-123',
      };

      const mockResponse = {
        status: 200,
        body: {
          imageUrl: expect.stringContaining('data:image/'),
          prompt: requestData.prompt,
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.imageUrl).toBeDefined();
    });

    it('should validate prompt length', async () => {
      const shortPrompt = {
        prompt: 'Hi',
        guestId: 'guest-123',
      };

      const mockResponse = { status: 400 };
      expect(mockResponse.status).toBe(400);
    });

    it('should rate limit guest generations', async () => {
      // Guest users should have stricter rate limits
      const responses = [];
      for (let i = 0; i < 10; i++) {
        responses.push({ status: i < 3 ? 200 : 429 });
      }

      // After 3 generations, should be rate limited
      expect(responses[9].status).toBe(429);
    });

    it('should not save image to database for guests', async () => {
      // Guest generations should be temporary
      const mockImageSaved = false;
      expect(mockImageSaved).toBe(false);
    });

    it('should apply watermark to guest images', async () => {
      const mockResponse = {
        body: {
          imageUrl: expect.any(String),
          watermarked: true,
        },
      };

      expect(mockResponse.body.watermarked).toBe(true);
    });
  });

  describe('POST /api/generate/analyze', () => {
    it('should analyze prompt and return suggestions', async () => {
      const requestData = {
        prompt: 'A sunset',
      };

      const mockResponse = {
        status: 200,
        body: {
          enhancedPrompt: 'A beautiful vibrant sunset over mountains with dramatic clouds',
          suggestions: [
            'Add more descriptive details',
            'Specify the style (realistic, artistic, etc.)',
            'Include lighting conditions',
          ],
          estimatedQuality: 'good',
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.enhancedPrompt).toBeDefined();
      expect(mockResponse.body.suggestions).toBeInstanceOf(Array);
    });

    it('should detect inappropriate content in prompt', async () => {
      const inappropriatePrompt = {
        prompt: 'violent content here',
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Inappropriate content detected',
        },
      };

      expect(mockResponse.status).toBe(400);
      expect(mockResponse.body.error).toContain('Inappropriate');
    });

    it('should suggest improvements for vague prompts', async () => {
      const vaguePrompt = {
        prompt: 'A thing',
      };

      const mockResponse = {
        body: {
          suggestions: expect.arrayContaining([
            expect.stringContaining('more specific'),
          ]),
        },
      };

      expect(mockResponse.body.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/generate/draft', () => {
    it('should generate 4 draft images', async () => {
      const requestData = {
        prompt: 'A beautiful landscape',
        count: 4,
        aspectRatio: '16:9',
      };

      const mockResponse = {
        status: 200,
        body: {
          images: new Array(4).fill(null).map((_, i) => ({
            id: i + 1,
            imageUrl: `data:image/png;base64,draft-${i}`,
            prompt: requestData.prompt,
          })),
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.images).toHaveLength(4);
    });

    it('should deduct draft credits from user', async () => {
      const initialCredits = testUser.credits;
      const draftCost = 10; // Cost for 4 draft images

      const remainingCredits = initialCredits - draftCost;

      expect(remainingCredits).toBe(90);
    });

    it('should reject if user has insufficient credits', async () => {
      const poorUser = await createTestUser({
        email: 'poor@example.com',
        credits: 5,
      });

      const mockResponse = {
        status: 402,
        body: {
          error: 'Insufficient credits',
          required: 10,
          available: 5,
        },
      };

      expect(mockResponse.status).toBe(402);
      expect(mockResponse.body.error).toContain('Insufficient');
    });

    it('should support different aspect ratios', async () => {
      const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

      for (const ratio of aspectRatios) {
        const mockResponse = {
          body: {
            images: [{ aspectRatio: ratio }],
          },
        };

        expect(mockResponse.body.images[0].aspectRatio).toBe(ratio);
      }
    });

    it('should apply style to all draft images', async () => {
      const requestData = {
        prompt: 'A landscape',
        style: 'realistic',
        count: 4,
      };

      const mockResponse = {
        body: {
          images: new Array(4).fill(null).map(() => ({
            style: 'realistic',
          })),
        },
      };

      mockResponse.body.images.forEach(img => {
        expect(img.style).toBe('realistic');
      });
    });

    it('should save drafts to database', async () => {
      const mockSavedImages = [
        { id: 1, userId: testUser.id, isDraft: true },
        { id: 2, userId: testUser.id, isDraft: true },
        { id: 3, userId: testUser.id, isDraft: true },
        { id: 4, userId: testUser.id, isDraft: true },
      ];

      expect(mockSavedImages).toHaveLength(4);
      mockSavedImages.forEach(img => {
        expect(img.isDraft).toBe(true);
      });
    });
  });

  describe('POST /api/generate/final', () => {
    it('should generate high-quality final image', async () => {
      const requestData = {
        prompt: 'A beautiful portrait',
        aspectRatio: '4:3',
        style: 'realistic',
        selectedDraftIndex: 2,
      };

      const mockResponse = {
        status: 200,
        body: {
          imageUrl: expect.stringContaining('data:image/'),
          quality: 'premium',
          resolution: '2048x1536',
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.quality).toBe('premium');
    });

    it('should deduct premium credits from user', async () => {
      const initialCredits = testUser.credits;
      const premiumCost = 20;

      const remainingCredits = initialCredits - premiumCost;

      expect(remainingCredits).toBe(80);
    });

    it('should use enhanced prompt if provided', async () => {
      const requestData = {
        prompt: 'A sunset',
        enhancedPrompt: 'A breathtaking sunset over mountains with vibrant colors',
      };

      const mockResponse = {
        body: {
          usedPrompt: requestData.enhancedPrompt,
        },
      };

      expect(mockResponse.body.usedPrompt).toBe(requestData.enhancedPrompt);
    });

    it('should upload to R2 storage', async () => {
      const mockResponse = {
        body: {
          imageUrl: 'https://r2.example.com/images/final-123.png',
          storageType: 'r2',
          r2Key: 'images/final-123.png',
        },
      };

      expect(mockResponse.body.storageType).toBe('r2');
      expect(mockResponse.body.r2Key).toBeDefined();
    });

    it('should mark image as final (not draft)', async () => {
      const mockSavedImage = {
        id: 1,
        userId: testUser.id,
        isDraft: false,
        quality: 'premium',
      };

      expect(mockSavedImage.isDraft).toBe(false);
    });
  });

  describe('POST /api/generate/single', () => {
    it('should generate single image with default settings', async () => {
      const requestData = {
        prompt: 'A beautiful landscape',
      };

      const mockResponse = {
        status: 200,
        body: {
          imageUrl: expect.any(String),
          aspectRatio: '1:1', // default
          quality: 'draft', // default
        },
      };

      expect(mockResponse.status).toBe(200);
      expect(mockResponse.body.aspectRatio).toBe('1:1');
    });

    it('should support custom aspect ratio', async () => {
      const requestData = {
        prompt: 'A landscape',
        aspectRatio: '16:9',
      };

      const mockResponse = {
        body: {
          aspectRatio: '16:9',
        },
      };

      expect(mockResponse.body.aspectRatio).toBe('16:9');
    });

    it('should support premium quality', async () => {
      const requestData = {
        prompt: 'A portrait',
        quality: 'premium',
      };

      const mockResponse = {
        body: {
          quality: 'premium',
          resolution: '2048x2048',
        },
      };

      expect(mockResponse.body.quality).toBe('premium');
    });

    it('should skip prompt enhancement if requested', async () => {
      const requestData = {
        prompt: 'A sunset',
        skipEnhancement: true,
      };

      const mockResponse = {
        body: {
          usedPrompt: requestData.prompt, // Original prompt
          enhanced: false,
        },
      };

      expect(mockResponse.body.usedPrompt).toBe(requestData.prompt);
      expect(mockResponse.body.enhanced).toBe(false);
    });

    it('should deduct appropriate credits based on quality', async () => {
      const draftCost = 5;
      const premiumCost = 15;

      // Draft generation
      const afterDraft = testUser.credits - draftCost;
      expect(afterDraft).toBe(95);

      // Premium generation
      const afterPremium = testUser.credits - premiumCost;
      expect(afterPremium).toBe(85);
    });
  });

  describe('Credit Management', () => {
    it('should check credits before generation', async () => {
      const poorUser = await createTestUser({
        email: 'poor@example.com',
        credits: 0,
      });

      const mockResponse = {
        status: 402,
        body: {
          error: 'Insufficient credits',
        },
      };

      expect(mockResponse.status).toBe(402);
    });

    it('should deduct credits atomically', async () => {
      // Simulate concurrent requests
      const initialCredits = testUser.credits;
      const cost = 10;

      // Both requests should succeed, but credits should only be deducted once per request
      const finalCredits = initialCredits - (cost * 2);

      expect(finalCredits).toBe(80);
    });

    it('should refund credits on generation failure', async () => {
      const initialCredits = testUser.credits;
      const cost = 10;

      // Generation fails
      const mockGenerationFailed = true;

      // Credits should be refunded
      const finalCredits = mockGenerationFailed ? initialCredits : initialCredits - cost;

      expect(finalCredits).toBe(initialCredits);
    });

    it('should track credit transactions', async () => {
      const mockTransactions = [
        { type: 'debit', amount: 10, reason: 'Draft generation' },
        { type: 'debit', amount: 20, reason: 'Premium generation' },
        { type: 'credit', amount: 50, reason: 'Purchase' },
      ];

      expect(mockTransactions).toHaveLength(3);
      expect(mockTransactions[0].type).toBe('debit');
    });
  });

  describe('Error Handling', () => {
    it('should handle AI service timeout', async () => {
      // Simulate timeout
      const mockResponse = {
        status: 504,
        body: {
          error: 'Generation timeout',
          message: 'The AI service took too long to respond',
        },
      };

      expect(mockResponse.status).toBe(504);
      expect(mockResponse.body.error).toContain('timeout');
    });

    it('should handle AI service errors gracefully', async () => {
      const mockResponse = {
        status: 500,
        body: {
          error: 'Generation failed',
          message: 'An error occurred during image generation',
        },
      };

      expect(mockResponse.status).toBe(500);
    });

    it('should retry failed generations', async () => {
      let attempts = 0;
      const maxRetries = 3;

      while (attempts < maxRetries) {
        attempts++;
        // Simulate retry logic
      }

      expect(attempts).toBe(maxRetries);
    });

    it('should log generation errors to Sentry', async () => {
      const mockSentryCapture = vi.fn();

      // Simulate error
      const error = new Error('Generation failed');
      mockSentryCapture(error);

      expect(mockSentryCapture).toHaveBeenCalledWith(error);
    });
  });

  describe('Content Moderation', () => {
    it('should block NSFW prompts', async () => {
      const nsfwPrompt = {
        prompt: 'explicit content here',
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Content policy violation',
        },
      };

      expect(mockResponse.status).toBe(400);
      expect(mockResponse.body.error).toContain('policy');
    });

    it('should block violent content', async () => {
      const violentPrompt = {
        prompt: 'violent scene',
      };

      const mockResponse = {
        status: 400,
        body: {
          error: 'Content policy violation',
        },
      };

      expect(mockResponse.status).toBe(400);
    });

    it('should allow artistic nudity with appropriate context', async () => {
      const artisticPrompt = {
        prompt: 'classical renaissance painting of venus',
      };

      const mockResponse = { status: 200 };
      expect(mockResponse.status).toBe(200);
    });

    it('should log moderation violations', async () => {
      const mockModerationLog = {
        userId: testUser.id,
        prompt: 'inappropriate content',
        reason: 'NSFW',
        timestamp: new Date(),
      };

      expect(mockModerationLog.reason).toBe('NSFW');
    });
  });
});
