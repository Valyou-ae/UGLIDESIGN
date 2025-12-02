import { GoogleGenAI, Modality } from "@google/genai";
import { ASPECT_RATIO_DIMENSIONS } from "../../shared/imageGenTypes";

const USER_API_KEY = process.env.GOOGLE_AI_API_KEY || '';

export const isImagen3Available = (): boolean => {
  return !!USER_API_KEY;
};

export const getImagen3Client = () => {
  if (!USER_API_KEY) {
    throw new Error("Google AI API key not configured. Please add GOOGLE_AI_API_KEY to use Imagen 3.");
  }
  return new GoogleGenAI({
    apiKey: USER_API_KEY,
  });
};

export interface Imagen3Options {
  aspectRatio?: string;
  numberOfImages?: number;
  negativePrompt?: string;
}

export const generateWithImagen3 = async (
  prompt: string,
  options: Imagen3Options = {}
): Promise<{ base64: string; mimeType: string }[]> => {
  const ai = getImagen3Client();
  
  const {
    aspectRatio = "1:1",
    numberOfImages = 1,
    negativePrompt,
  } = options;

  console.log("[Imagen3] Generating image with prompt:", prompt.substring(0, 100) + "...");
  console.log("[Imagen3] Options:", { aspectRatio, numberOfImages });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        ...(negativePrompt && { negativePrompt }),
      }
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Imagen 3 did not return any images");
    }

    const results: { base64: string; mimeType: string }[] = [];
    
    for (const generatedImage of response.generatedImages) {
      if (generatedImage.image?.imageBytes) {
        const base64 = Buffer.from(generatedImage.image.imageBytes).toString('base64');
        results.push({
          base64,
          mimeType: 'image/png'
        });
      }
    }

    if (results.length === 0) {
      throw new Error("Failed to extract image data from Imagen 3 response");
    }

    console.log("[Imagen3] Successfully generated", results.length, "image(s)");
    return results;

  } catch (error: any) {
    console.error("[Imagen3] Generation error:", error);
    
    if (error.message?.includes('API key')) {
      throw new Error("Invalid Google AI API key. Please check your API key in settings.");
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error("Imagen 3 rate limit reached. Please try again in a few moments.");
    }
    if (error.message?.includes('imagen') && error.message?.includes('not found')) {
      throw new Error("Imagen 3 model not available. Your API key may not have access to Imagen 3.");
    }
    
    throw new Error(`Imagen 3 generation failed: ${error.message || 'Unknown error'}`);
  }
};

export const generateWithImagen3Smart = async (
  userPrompt: string,
  options: Imagen3Options = {}
): Promise<{ base64: string; mimeType: string; model: string }[]> => {
  const images = await generateWithImagen3(userPrompt, options);
  
  return images.map(img => ({
    ...img,
    model: 'imagen-3.0-generate-002'
  }));
};
