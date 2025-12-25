import type { Express, Request, Response } from "express";
import type { Middleware } from "./middleware";
import type { AuthenticatedRequest } from "../types";
import { storage } from "../storage";
import { logger } from "../logger";
import multer from "multer";

const IMAGE_EDIT_CREDIT_COST = 1;

async function checkAndDeductCredits(
  userId: string,
  cost: number,
  operationType: string
): Promise<{ success: boolean; credits?: number; error?: string }> {
  if (cost === 0) return { success: true };
  
  const currentCredits = await storage.getUserCredits(userId);
  
  if (currentCredits < cost) {
    return {
      success: false,
      credits: currentCredits,
      error: `Insufficient credits. You need ${cost} credits for ${operationType}, but only have ${currentCredits}.`
    };
  }
  
  const updatedUser = await storage.deductCredits(userId, cost);
  return {
    success: true,
    credits: updatedUser?.credits ?? currentCredits - cost
  };
}

async function refundCredits(userId: string, amount: number, reason: string): Promise<void> {
  try {
    await storage.addCredits(userId, amount);
    logger.info(`Refunded ${amount} credits to user ${userId}: ${reason}`, { source: 'image-editor' });
  } catch (error) {
    logger.error(`Failed to refund ${amount} credits to user ${userId}`, error, { source: 'image-editor' });
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function registerImageEditorRoutes(app: Express, middleware: Middleware) {
  const { requireAuth, getUserId } = middleware;
  app.post("/api/image-editor/upload", requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req as AuthenticatedRequest);
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const base64Image = file.buffer.toString("base64");
      const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

      const image = await storage.createImage({
        userId,
        imageUrl,
        prompt: "Uploaded image",
        style: null,
        aspectRatio: null,
        generationType: "upload",
        folderId: null,
        parentImageId: null,
        editPrompt: null,
        versionNumber: 0,
      });

      res.json({
        imageId: image?.id,
        imageUrl: `/api/images/${image?.id}/image`,
      });
    } catch (error) {
      logger.error("Image upload error", error, { source: "image-editor" });
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/image-editor/edit", requireAuth, async (req: Request, res: Response) => {
    const userId = getUserId(req as AuthenticatedRequest);
    
    try {
      const { imageId, prompt } = req.body;

      if (!imageId || !prompt) {
        return res.status(400).json({ message: "Image ID and prompt are required" });
      }

      const creditCheck = await checkAndDeductCredits(userId, IMAGE_EDIT_CREDIT_COST, "image editing");
      if (!creditCheck.success) {
        return res.status(402).json({
          message: creditCheck.error,
          credits: creditCheck.credits,
          required: IMAGE_EDIT_CREDIT_COST,
        });
      }

      const originalImage = await storage.getImageById(imageId, userId);
      if (!originalImage) {
        await refundCredits(userId, IMAGE_EDIT_CREDIT_COST, "Image not found");
        return res.status(404).json({ message: "Image not found" });
      }

      let imageBase64 = originalImage.imageUrl;
      let mimeType = "image/png";
      
      if (imageBase64.startsWith("data:")) {
        const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          imageBase64 = matches[2];
        }
      }

      const { editImage } = await import("../services/gemini");
      const result = await editImage(imageBase64, prompt.trim(), mimeType);

      if (!result) {
        await refundCredits(userId, IMAGE_EDIT_CREDIT_COST, "Image edit failed");
        return res.status(500).json({ message: "Failed to edit image. Please try again." });
      }

      let rootImageId = originalImage.id;
      let currentImage = originalImage;
      let chainDepth = 0;
      const MAX_CHAIN_DEPTH = 100;
      
      while (currentImage.parentImageId && chainDepth < MAX_CHAIN_DEPTH) {
        chainDepth++;
        const parentImage = await storage.getImageById(currentImage.parentImageId, userId);
        if (!parentImage) {
          await refundCredits(userId, IMAGE_EDIT_CREDIT_COST, "Security violation");
          return res.status(403).json({ message: "Cannot edit: ancestor image not owned by you" });
        }
        currentImage = parentImage;
        rootImageId = parentImage.id;
      }
      
      const versions = await storage.getImageVersionHistory(rootImageId, userId);
      const nextVersion = versions.length > 0 ? versions.length : 1;

      const newImageUrl = `data:${result.mimeType};base64,${result.imageData}`;
      const newImage = await storage.createImage({
        userId,
        imageUrl: newImageUrl,
        prompt: originalImage.prompt,
        style: originalImage.style,
        aspectRatio: originalImage.aspectRatio,
        generationType: "edit",
        folderId: originalImage.folderId,
        parentImageId: rootImageId,
        editPrompt: prompt.trim(),
        versionNumber: nextVersion,
      });

      res.json({
        imageId: newImage?.id,
        imageUrl: `/api/images/${newImage?.id}/image`,
        versionNumber: nextVersion,
      });
    } catch (error) {
      await refundCredits(userId, IMAGE_EDIT_CREDIT_COST, "Image edit error");
      logger.error("Image edit error", error, { source: "image-editor" });
      res.status(500).json({ message: "Failed to edit image. Please try again." });
    }
  });
}
