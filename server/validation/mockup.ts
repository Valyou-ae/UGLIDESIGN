/**
 * Validation schemas for mockup generation endpoints
 */

import { z } from 'zod';

// Valid product types
export const VALID_PRODUCT_TYPES = [
  't-shirt',
  'hoodie',
  'mug',
  'poster',
  'phone-case',
  'tote-bag',
  'pillow',
  'canvas',
  'sticker',
  'business-card',
  'book-cover',
] as const;

// Valid quality levels
export const VALID_QUALITY_LEVELS = ['standard', 'high', 'ultra'] as const;

// Valid scenes
export const VALID_SCENES = ['studio', 'lifestyle', 'flat-lay', 'outdoor', 'indoor'] as const;

// Valid angles
export const VALID_ANGLES = ['front', 'back', 'side', '3d', 'angled'] as const;

// Color validation (hex color or named color)
const colorSchema = z.string().max(50, 'Color name/hex must be less than 50 characters');

/**
 * Mockup analyze validation
 */
export const analyzeMockupSchema = z.object({
  designImage: z.string()
    .min(1, 'Design image is required'),
});

/**
 * Mockup generate validation
 */
export const generateMockupSchema = z.object({
  designImage: z.string()
    .min(1, 'Design image is required'),
  productType: z.enum(VALID_PRODUCT_TYPES)
    .default('t-shirt'),
  productColor: colorSchema
    .default('white'),
  scene: z.enum(VALID_SCENES)
    .default('studio'),
  angle: z.enum(VALID_ANGLES)
    .default('front'),
  style: z.string()
    .max(100, 'Style must be less than 100 characters')
    .default('minimal'),
  quality: z.enum(VALID_QUALITY_LEVELS)
    .default('high'),
});

/**
 * Batch mockup generate validation
 */
export const generateBatchMockupSchema = z.object({
  designImage: z.string()
    .min(1, 'Design image is required'),
  products: z.array(z.object({
    productType: z.enum(VALID_PRODUCT_TYPES),
    productColor: colorSchema.optional(),
    scene: z.enum(VALID_SCENES).optional(),
    angle: z.enum(VALID_ANGLES).optional(),
  }))
    .min(1, 'At least one product is required')
    .max(10, 'Maximum 10 products allowed'),
  quality: z.enum(VALID_QUALITY_LEVELS)
    .default('high'),
});

/**
 * Elite mockup generate validation
 */
export const generateEliteMockupSchema = z.object({
  designImage: z.string()
    .min(1, 'Design image is required'),
  productType: z.enum(VALID_PRODUCT_TYPES),
  scene: z.enum(VALID_SCENES)
    .default('studio'),
  style: z.string()
    .max(200, 'Style description must be less than 200 characters')
    .optional(),
  quality: z.enum(VALID_QUALITY_LEVELS)
    .default('ultra'),
});

/**
 * Text-to-mockup validation
 */
export const textToMockupSchema = z.object({
  prompt: z.string()
    .min(5, 'Prompt must be at least 5 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  outputQuality: z.enum(VALID_QUALITY_LEVELS)
    .default('high'),
  overrides: z.object({
    productType: z.enum(VALID_PRODUCT_TYPES).optional(),
    productColor: colorSchema.optional(),
    scene: z.enum(VALID_SCENES).optional(),
    style: z.string().max(200).optional(),
  }).optional(),
});

/**
 * Parse prompt validation
 */
export const parsePromptSchema = z.object({
  prompt: z.string()
    .min(5, 'Prompt must be at least 5 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
});

/**
 * Seamless pattern validation
 */
export const seamlessPatternSchema = z.object({
  prompt: z.string()
    .min(5, 'Prompt must be at least 5 characters')
    .max(1000, 'Prompt must be less than 1000 characters')
    .trim(),
  style: z.string()
    .max(100, 'Style must be less than 100 characters')
    .optional(),
  colorScheme: z.string()
    .max(100, 'Color scheme must be less than 100 characters')
    .optional(),
  complexity: z.enum(['simple', 'medium', 'complex'])
    .optional(),
  tileSize: z.number()
    .int('Tile size must be an integer')
    .min(256, 'Tile size must be at least 256')
    .max(2048, 'Tile size must be at most 2048')
    .optional(),
});

/**
 * Validation helper types
 */
export type AnalyzeMockupInput = z.infer<typeof analyzeMockupSchema>;
export type GenerateMockupInput = z.infer<typeof generateMockupSchema>;
export type GenerateBatchMockupInput = z.infer<typeof generateBatchMockupSchema>;
export type GenerateEliteMockupInput = z.infer<typeof generateEliteMockupSchema>;
export type TextToMockupInput = z.infer<typeof textToMockupSchema>;
export type ParsePromptInput = z.infer<typeof parsePromptSchema>;
export type SeamlessPatternInput = z.infer<typeof seamlessPatternSchema>;
