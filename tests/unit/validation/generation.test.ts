import { describe, it, expect } from 'vitest';
import {
  generateSingleSchema,
  generateDraftSchema,
  generateFinalSchema,
  analyzePromptSchema,
} from '@server/validation/generation';

describe('Generation Validation Schemas', () => {
  describe('generateSingleSchema', () => {
    it('should validate correct input with all fields', () => {
      const input = {
        prompt: 'A beautiful sunset over mountains',
        aspectRatio: '16:9' as const,
        style: 'realistic' as const,
        quality: 'premium' as const,
      };

      const result = generateSingleSchema.parse(input);
      
      expect(result.prompt).toBe('A beautiful sunset over mountains');
      expect(result.aspectRatio).toBe('16:9');
      expect(result.style).toBe('realistic');
      expect(result.quality).toBe('premium');
    });

    it('should validate correct input with minimal fields', () => {
      const input = {
        prompt: 'A beautiful sunset',
      };

      const result = generateSingleSchema.parse(input);
      
      expect(result.prompt).toBe('A beautiful sunset');
      expect(result.aspectRatio).toBeUndefined();
      expect(result.style).toBeUndefined();
    });

    it('should reject prompt that is too short', () => {
      const input = {
        prompt: 'Hi',
      };

      expect(() => generateSingleSchema.parse(input)).toThrow();
    });

    it('should reject prompt that is too long', () => {
      const input = {
        prompt: 'A'.repeat(2001),
      };

      expect(() => generateSingleSchema.parse(input)).toThrow();
    });

    it('should reject invalid aspect ratio', () => {
      const input = {
        prompt: 'A beautiful sunset',
        aspectRatio: '21:9',
      };

      expect(() => generateSingleSchema.parse(input)).toThrow();
    });

    it('should accept all valid aspect ratios', () => {
      const validRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

      validRatios.forEach(ratio => {
        const input = {
          prompt: 'A beautiful sunset',
          aspectRatio: ratio,
        };

        const result = generateSingleSchema.parse(input);
        expect(result.aspectRatio).toBe(ratio);
      });
    });

    it('should reject invalid style', () => {
      const input = {
        prompt: 'A beautiful sunset',
        style: 'invalid-style',
      };

      expect(() => generateSingleSchema.parse(input)).toThrow();
    });

    it('should accept all valid styles', () => {
      const validStyles = ['realistic', 'artistic', 'anime', 'abstract'];

      validStyles.forEach(style => {
        const input = {
          prompt: 'A beautiful sunset',
          style,
        };

        const result = generateSingleSchema.parse(input);
        expect(result.style).toBe(style);
      });
    });

    it('should reject invalid quality', () => {
      const input = {
        prompt: 'A beautiful sunset',
        quality: 'ultra',
      };

      expect(() => generateSingleSchema.parse(input)).toThrow();
    });
  });

  describe('generateDraftSchema', () => {
    it('should validate correct input', () => {
      const input = {
        prompt: 'A beautiful landscape',
        count: 4,
        aspectRatio: '16:9',
      };

      const result = generateDraftSchema.parse(input);
      
      expect(result.prompt).toBe('A beautiful landscape');
      expect(result.count).toBe(4);
      expect(result.aspectRatio).toBe('16:9');
    });

    it('should reject count less than 1', () => {
      const input = {
        prompt: 'A beautiful landscape',
        count: 0,
      };

      expect(() => generateDraftSchema.parse(input)).toThrow();
    });

    it('should reject count greater than 4', () => {
      const input = {
        prompt: 'A beautiful landscape',
        count: 5,
      };

      expect(() => generateDraftSchema.parse(input)).toThrow();
    });

    it('should accept valid count range (1-4)', () => {
      [1, 2, 3, 4].forEach(count => {
        const input = {
          prompt: 'A beautiful landscape',
          count,
        };

        const result = generateDraftSchema.parse(input);
        expect(result.count).toBe(count);
      });
    });
  });

  describe('generateFinalSchema', () => {
    it('should validate correct input', () => {
      const input = {
        prompt: 'A beautiful portrait',
        aspectRatio: '4:3' as const,
        style: 'realistic' as const,
      };

      const result = generateFinalSchema.parse(input);
      
      expect(result.prompt).toBe('A beautiful portrait');
      expect(result.aspectRatio).toBe('4:3');
      expect(result.style).toBe('realistic');
    });

    it('should trim whitespace from prompt', () => {
      const input = {
        prompt: '  A beautiful portrait  ',
      };

      const result = generateFinalSchema.parse(input);
      expect(result.prompt).toBe('A beautiful portrait');
    });
  });

  describe('analyzePromptSchema', () => {
    it('should validate correct input', () => {
      const input = {
        prompt: 'A beautiful sunset over mountains with vibrant colors',
      };

      const result = analyzePromptSchema.parse(input);
      expect(result.prompt).toBe('A beautiful sunset over mountains with vibrant colors');
    });

    it('should reject empty prompt', () => {
      const input = {
        prompt: '',
      };

      expect(() => analyzePromptSchema.parse(input)).toThrow();
    });

    it('should reject prompt with only whitespace', () => {
      const input = {
        prompt: '   ',
      };

      // After trim, this becomes empty string which should fail
      expect(() => analyzePromptSchema.parse(input)).toThrow();
    });
  });
});
