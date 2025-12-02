import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  performInitialAnalysis, 
  enhanceStyle, 
  generateImage, 
  analyzeImage,
  getNegativePrompts,
  STYLE_PRESETS,
  QUALITY_PRESETS 
} from "./services/geminiService";
import type { GenerateImageRequest, GenerateImageResponse, QualityLevel } from "../shared/imageGenTypes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/generate-image", async (req, res) => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ success: false, error: "Invalid request body" });
      }

      const { prompt, style, quality, aspectRatio, variations } = req.body as GenerateImageRequest;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ success: false, error: "Prompt is required" });
      }

      const { textInfo, analysis } = await performInitialAnalysis(prompt.trim(), true);

      const enhancedPrompt = await enhanceStyle(
        prompt.trim(),
        analysis,
        textInfo,
        style || 'auto',
        (quality || 'standard') as QualityLevel
      );

      const images = await generateImage(
        enhancedPrompt,
        aspectRatio || '1:1',
        Math.min(Math.max(variations || 1, 1), 4)
      );

      const response: GenerateImageResponse = {
        success: true,
        images,
        enhancedPrompt,
        analysis
      };

      res.json(response);
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to generate image" 
      });
    }
  });

  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { base64Data, mimeType } = req.body;

      if (!base64Data || !mimeType) {
        return res.status(400).json({ success: false, error: "Image data is required" });
      }

      const promptDescription = await analyzeImage(base64Data, mimeType);

      res.json({ success: true, prompt: promptDescription });
    } catch (error: any) {
      console.error("Image analysis error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to analyze image" 
      });
    }
  });

  app.get("/api/style-presets", (req, res) => {
    res.json(STYLE_PRESETS);
  });

  app.get("/api/quality-presets", (req, res) => {
    res.json(QUALITY_PRESETS);
  });

  return httpServer;
}
