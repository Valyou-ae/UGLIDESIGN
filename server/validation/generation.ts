/**
 * Validation schemas for image generation endpoints
 */

import { z } from 'zod';

// Valid aspect ratios
export const VALID_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

// Valid styles
export const VALID_STYLES = [
  'realistic',
  'artistic',
  'anime',
  'abstract',
  'watercolor',
  'oil-painting',
  'digital-art',
  'sketch',
  'minimalist',
  'vintage',
  'modern',
  'fantasy',
  'sci-fi',
] as const;

// Valid quality levels
export const VALID_QUALITY = ['draft', 'premium'] as const;

/**
 * Guest image generation validation
 */
export const guestGenerateImageSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  guestId: z.string()
    .min(1, 'Guest ID is required')
    .max(100, 'Invalid guest ID'),
});

/**
 * Analyze prompt validation
 */
export const analyzePromptSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
});

/**
 * Draft generation validation
 */
export const generateDraftSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  aspectRatio: z.enum(VALID_ASPECT_RATIOS)
    .default('1:1'),
  style: z.enum(VALID_STYLES)
    .optional(),
  count: z.number()
    .int('Count must be an integer')
    .min(1, 'Count must be at least 1')
    .max(4, 'Count must be at most 4')
    .default(4),
});

/**
 * Final generation validation
 */
export const generateFinalSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  aspectRatio: z.enum(VALID_ASPECT_RATIOS)
    .default('1:1'),
  style: z.enum(VALID_STYLES)
    .optional(),
  selectedDraftIndex: z.number()
    .int('Selected draft index must be an integer')
    .min(0, 'Selected draft index must be at least 0')
    .max(3, 'Selected draft index must be at most 3')
    .optional(),
  enhancedPrompt: z.string()
    .min(3, 'Enhanced prompt must be at least 3 characters')
    .max(3000, 'Enhanced prompt must be less than 3000 characters')
    .optional(),
});

/**
 * Single image generation validation
 */
export const generateSingleSchema = z.object({
  prompt: z.string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(2000, 'Prompt must be less than 2000 characters')
    .trim(),
  aspectRatio: z.enum(VALID_ASPECT_RATIOS)
    .default('1:1'),
  style: z.enum(VALID_STYLES)
    .optional(),
  quality: z.enum(VALID_QUALITY)
    .default('draft'),
  skipEnhancement: z.boolean()
    .optional()
    .default(false),
});

/**
 * Validation helper types
 */
export type GuestGenerateImageInput = z.infer<typeof guestGenerateImageSchema>;
export type AnalyzePromptInput = z.infer<typeof analyzePromptSchema>;
export type GenerateDraftInput = z.infer<typeof generateDraftSchema>;
export type GenerateFinalInput = z.infer<typeof generateFinalSchema>;
export type GenerateSingleInput = z.infer<typeof generateSingleSchema>;
