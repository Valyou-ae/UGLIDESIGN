/**
 * Validation schemas for user and folder endpoints
 */

import { z } from 'zod';

/**
 * User profile update validation
 */
export const updateProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional(),
  displayName: z.string()
    .min(1, 'Display name must be at least 1 character')
    .max(50, 'Display name must be less than 50 characters')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: z.string()
    .url('Invalid website URL')
    .max(200, 'Website URL must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    behance: z.string().url().optional().or(z.literal('')),
    dribbble: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

/**
 * Profile photo upload validation
 */
export const uploadProfilePhotoSchema = z.object({
  photo: z.string()
    .min(1, 'Photo data is required'),
  // Validate base64 or URL format
}).refine(
  (data) => data.photo.startsWith('data:image/') || data.photo.startsWith('http'),
  'Photo must be a valid base64 image or URL'
);

/**
 * User preferences validation
 */
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto'])
    .optional(),
  language: z.string()
    .length(2, 'Language code must be 2 characters (ISO 639-1)')
    .optional(),
  emailNotifications: z.boolean()
    .optional(),
  marketingEmails: z.boolean()
    .optional(),
  defaultImageQuality: z.enum(['draft', 'premium'])
    .optional(),
  defaultAspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4'])
    .optional(),
  autoSaveImages: z.boolean()
    .optional(),
});

/**
 * Folder creation validation
 */
export const createFolderSchema = z.object({
  name: z.string()
    .min(1, 'Folder name is required')
    .max(50, 'Folder name must be less than 50 characters')
    .trim(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

/**
 * Folder update validation
 */
export const updateFolderSchema = z.object({
  name: z.string()
    .min(1, 'Folder name is required')
    .max(50, 'Folder name must be less than 50 characters')
    .trim()
    .optional(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

/**
 * Move image to folder validation
 */
export const moveImageToFolderSchema = z.object({
  folderId: z.string()
    .min(1, 'Folder ID is required')
    .nullable(),
});

/**
 * Validation helper types
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UploadProfilePhotoInput = z.infer<typeof uploadProfilePhotoSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type MoveImageToFolderInput = z.infer<typeof moveImageToFolderSchema>;
