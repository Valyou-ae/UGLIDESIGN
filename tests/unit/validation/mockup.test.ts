import { describe, it, expect } from 'vitest';
import {
  generateMockupSchema,
  textToMockupSchema,
} from '@server/validation/mockup';

describe('Mockup Validation Schemas', () => {
  describe('generateMockupSchema', () => {
    it('should validate correct input with all fields', () => {
      const input = {
        designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        productType: 't-shirt',
        quality: 'premium',
        scene: 'studio',
        angle: 'front',
      };

      const result = generateMockupSchema.parse(input);
      
      expect(result.designImage).toBe('data:image/png;base64,iVBORw0KGgoAAAANS...');
      expect(result.productType).toBe('t-shirt');
      expect(result.quality).toBe('premium');
      expect(result.scene).toBe('studio');
      expect(result.angle).toBe('front');
    });

    it('should validate correct input with minimal fields', () => {
      const input = {
        designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      };

      const result = generateMockupSchema.parse(input);
      
      expect(result.designImage).toBe('data:image/png;base64,iVBORw0KGgoAAAANS...');
      expect(result.productType).toBeUndefined();
    });

    it('should reject empty design image', () => {
      const input = {
        designImage: '',
      };

      expect(() => generateMockupSchema.parse(input)).toThrow();
    });

    it('should reject invalid product type', () => {
      const input = {
        designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        productType: 'invalid-product',
      };

      expect(() => generateMockupSchema.parse(input)).toThrow();
    });

    it('should accept all valid product types', () => {
      const validTypes = ['t-shirt', 'hoodie', 'mug', 'poster', 'phone-case'];

      validTypes.forEach(productType => {
        const input = {
          designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
          productType,
        };

        const result = generateMockupSchema.parse(input);
        expect(result.productType).toBe(productType);
      });
    });

    it('should reject invalid quality', () => {
      const input = {
        designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        quality: 'ultra',
      };

      expect(() => generateMockupSchema.parse(input)).toThrow();
    });

    it('should accept valid quality levels', () => {
      const validQualities = ['standard', 'premium'];

      validQualities.forEach(quality => {
        const input = {
          designImage: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
          quality,
        };

        const result = generateMockupSchema.parse(input);
        expect(result.quality).toBe(quality);
      });
    });
  });

  describe('textToMockupSchema', () => {
    it('should validate correct input with all fields', () => {
      const input = {
        prompt: 'A minimalist logo for a coffee shop',
        productType: 'mug',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      };

      const result = textToMockupSchema.parse(input);
      
      expect(result.prompt).toBe('A minimalist logo for a coffee shop');
      expect(result.productType).toBe('mug');
      expect(result.backgroundColor).toBe('#FFFFFF');
      expect(result.textColor).toBe('#000000');
    });

    it('should validate correct input with minimal fields', () => {
      const input = {
        prompt: 'A minimalist logo',
      };

      const result = textToMockupSchema.parse(input);
      
      expect(result.prompt).toBe('A minimalist logo');
      expect(result.productType).toBeUndefined();
    });

    it('should reject prompt that is too short', () => {
      const input = {
        prompt: 'Logo',
      };

      expect(() => textToMockupSchema.parse(input)).toThrow();
    });

    it('should reject prompt that is too long', () => {
      const input = {
        prompt: 'A'.repeat(2001),
      };

      expect(() => textToMockupSchema.parse(input)).toThrow();
    });

    it('should trim whitespace from prompt', () => {
      const input = {
        prompt: '  A minimalist logo  ',
      };

      const result = textToMockupSchema.parse(input);
      expect(result.prompt).toBe('A minimalist logo');
    });

    it('should accept valid hex color codes', () => {
      const validColors = ['#FFFFFF', '#000000', '#FF5733', '#C70039'];

      validColors.forEach(color => {
        const input = {
          prompt: 'A minimalist logo',
          backgroundColor: color,
        };

        const result = textToMockupSchema.parse(input);
        expect(result.backgroundColor).toBe(color);
      });
    });

    it('should reject invalid hex color codes', () => {
      const invalidColors = ['FFFFFF', '#FFF', '#GGGGGG', 'red'];

      invalidColors.forEach(color => {
        const input = {
          prompt: 'A minimalist logo',
          backgroundColor: color,
        };

        expect(() => textToMockupSchema.parse(input)).toThrow();
      });
    });
  });
});
