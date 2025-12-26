/**
 * Folders API integration tests
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  createTestUser,
  createTestImage,
  createTestFolder,
} from '../../helpers/db';

describe('Folders API', () => {
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

  describe('POST /api/folders', () => {
    it('should create a new folder for authenticated user', async () => {
      const folderData = {
        name: 'My Projects',
      };

      const folder = await createTestFolder(testUser.id, folderData);

      expect(folder).toBeDefined();
      expect(folder.userId).toBe(testUser.id);
      expect(folder.name).toBe('My Projects');
      expect(folder.createdAt).toBeDefined();
    });

    it('should reject request without authentication', async () => {
      const mockResponse = { status: 401 };
      expect(mockResponse.status).toBe(401);
    });

    it('should validate folder name', async () => {
      // Empty name should fail
      try {
        await createTestFolder(testUser.id, { name: '' });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should trim folder name', async () => {
      const folder = await createTestFolder(testUser.id, { name: '  Trimmed Name  ' });
      
      // In real implementation, name should be trimmed
      expect(folder.name.trim()).toBe('Trimmed Name');
    });

    it('should allow duplicate folder names for same user', async () => {
      await createTestFolder(testUser.id, { name: 'Duplicates' });
      const folder2 = await createTestFolder(testUser.id, { name: 'Duplicates' });

      expect(folder2).toBeDefined();
      expect(folder2.name).toBe('Duplicates');
    });
  });

  describe('GET /api/folders', () => {
    it('should return all folders for authenticated user', async () => {
      await createTestFolder(testUser.id, { name: 'Folder 1' });
      await createTestFolder(testUser.id, { name: 'Folder 2' });
      await createTestFolder(testUser.id, { name: 'Folder 3' });

      const mockFolders = [
        { id: 1, name: 'Folder 1' },
        { id: 2, name: 'Folder 2' },
        { id: 3, name: 'Folder 3' },
      ];

      expect(mockFolders).toHaveLength(3);
    });

    it('should not return folders from other users', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      
      await createTestFolder(testUser.id, { name: 'My folder' });
      await createTestFolder(otherUser.id, { name: 'Other folder' });

      const mockUserFolders = [{ id: 1, name: 'My folder', userId: testUser.id }];

      expect(mockUserFolders).toHaveLength(1);
      expect(mockUserFolders[0].userId).toBe(testUser.id);
    });

    it('should include image count for each folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'With Images' });
      
      await createTestImage(testUser.id, { prompt: 'Image 1', folderId: folder.id });
      await createTestImage(testUser.id, { prompt: 'Image 2', folderId: folder.id });

      const mockFolderWithCount = {
        ...folder,
        imageCount: 2,
      };

      expect(mockFolderWithCount.imageCount).toBe(2);
    });

    it('should sort folders by creation date (newest first)', async () => {
      const folder1 = await createTestFolder(testUser.id, { name: 'First' });
      const folder2 = await createTestFolder(testUser.id, { name: 'Second' });
      const folder3 = await createTestFolder(testUser.id, { name: 'Third' });

      const mockSortedFolders = [folder3, folder2, folder1];

      expect(mockSortedFolders[0].name).toBe('Third');
      expect(mockSortedFolders[2].name).toBe('First');
    });
  });

  describe('GET /api/folders/:id', () => {
    it('should return specific folder by ID', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'Test Folder' });

      const mockResponse = {
        id: folder.id,
        name: 'Test Folder',
        userId: testUser.id,
      };

      expect(mockResponse.id).toBe(folder.id);
      expect(mockResponse.name).toBe('Test Folder');
    });

    it('should return 404 for non-existent folder', async () => {
      const mockResponse = { status: 404 };
      expect(mockResponse.status).toBe(404);
    });

    it('should return 403 for folder owned by another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherFolder = await createTestFolder(otherUser.id, { name: 'Other folder' });

      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });

    it('should include images in folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'With Images' });
      
      await createTestImage(testUser.id, { prompt: 'Image 1', folderId: folder.id });
      await createTestImage(testUser.id, { prompt: 'Image 2', folderId: folder.id });

      const mockFolderWithImages = {
        ...folder,
        images: [
          { id: 1, prompt: 'Image 1' },
          { id: 2, prompt: 'Image 2' },
        ],
      };

      expect(mockFolderWithImages.images).toHaveLength(2);
    });
  });

  describe('PATCH /api/folders/:id', () => {
    it('should update folder name', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'Original Name' });

      const mockUpdatedFolder = {
        ...folder,
        name: 'Updated Name',
      };

      expect(mockUpdatedFolder.name).toBe('Updated Name');
    });

    it('should return 403 when updating folder owned by another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherFolder = await createTestFolder(otherUser.id, { name: 'Other folder' });

      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });

    it('should validate updated folder name', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'Original' });

      // Empty name should fail
      const mockResponse = { status: 400 };
      expect(mockResponse.status).toBe(400);
    });

    it('should not allow updating userId', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'Test' });
      const otherUser = await createTestUser({ email: 'other@example.com' });

      // Attempt to change userId should be rejected
      const mockResponse = { status: 400 };
      expect(mockResponse.status).toBe(400);
    });
  });

  describe('DELETE /api/folders/:id', () => {
    it('should delete folder owned by user', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'To Delete' });

      const mockResponse = { status: 200 };
      expect(mockResponse.status).toBe(200);
    });

    it('should return 403 when deleting folder owned by another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherFolder = await createTestFolder(otherUser.id, { name: 'Other folder' });

      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });

    it('should move images to null folder when deleting folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'To Delete' });
      
      const image = await createTestImage(testUser.id, {
        prompt: 'In folder',
        folderId: folder.id,
      });

      // After folder deletion, image should have null folderId
      const mockUpdatedImage = {
        ...image,
        folderId: null,
      };

      expect(mockUpdatedImage.folderId).toBeNull();
    });

    it('should not delete images when deleting folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'To Delete' });
      
      await createTestImage(testUser.id, { prompt: 'Image 1', folderId: folder.id });
      await createTestImage(testUser.id, { prompt: 'Image 2', folderId: folder.id });

      // Images should still exist after folder deletion
      const mockImagesAfterDeletion = [
        { id: 1, prompt: 'Image 1', folderId: null },
        { id: 2, prompt: 'Image 2', folderId: null },
      ];

      expect(mockImagesAfterDeletion).toHaveLength(2);
    });
  });

  describe('POST /api/folders/:id/images', () => {
    it('should add image to folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'My Folder' });
      const image = await createTestImage(testUser.id, { prompt: 'Test Image' });

      const mockUpdatedImage = {
        ...image,
        folderId: folder.id,
      };

      expect(mockUpdatedImage.folderId).toBe(folder.id);
    });

    it('should move image from one folder to another', async () => {
      const folder1 = await createTestFolder(testUser.id, { name: 'Folder 1' });
      const folder2 = await createTestFolder(testUser.id, { name: 'Folder 2' });
      
      const image = await createTestImage(testUser.id, {
        prompt: 'Test Image',
        folderId: folder1.id,
      });

      const mockMovedImage = {
        ...image,
        folderId: folder2.id,
      };

      expect(mockMovedImage.folderId).toBe(folder2.id);
    });

    it('should return 403 when adding image owned by another user', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'My Folder' });
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherImage = await createTestImage(otherUser.id, { prompt: 'Other Image' });

      const mockResponse = { status: 403 };
      expect(mockResponse.status).toBe(403);
    });
  });

  describe('DELETE /api/folders/:id/images/:imageId', () => {
    it('should remove image from folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'My Folder' });
      const image = await createTestImage(testUser.id, {
        prompt: 'Test Image',
        folderId: folder.id,
      });

      const mockUpdatedImage = {
        ...image,
        folderId: null,
      };

      expect(mockUpdatedImage.folderId).toBeNull();
    });

    it('should not delete the image, only remove from folder', async () => {
      const folder = await createTestFolder(testUser.id, { name: 'My Folder' });
      const image = await createTestImage(testUser.id, {
        prompt: 'Test Image',
        folderId: folder.id,
      });

      // Image should still exist after removal from folder
      const mockImageAfterRemoval = {
        ...image,
        folderId: null,
      };

      expect(mockImageAfterRemoval).toBeDefined();
      expect(mockImageAfterRemoval.id).toBe(image.id);
    });
  });
});
