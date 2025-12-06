import { GoogleGenAI, Modality } from "@google/genai";

// Use user's GEMINI_API_KEY if available, otherwise use AI Integrations
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "";
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const ai = new GoogleGenAI({
  apiKey,
  ...(baseUrl && {
    httpOptions: {
      apiVersion: "",
      baseUrl,
    },
  }),
});

// Gemini models - Using latest available for each capability
// Image generation: gemini-2.5-flash-image (native image gen, most reliable)
// Text/reasoning: gemini-3-pro-preview (latest for prompt enhancement)
const IMAGE_MODEL = "gemini-2.5-flash-image";
const TEXT_MODEL = "gemini-3-pro-preview";

export interface GeneratedImageResult {
  imageBase64: string;
  mimeType: string;
  textResponse?: string;
}

export async function generateImage(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log(`Using Gemini 3 Pro Image model: ${IMAGE_MODEL}`);
    
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
    
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data in response");
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const textPart = candidate?.content?.parts?.find((part: any) => part.text);

    return {
      imageBase64: imagePart.inlineData.data,
      mimeType,
      textResponse: textPart?.text,
    };
  } catch (error: any) {
    console.error("Gemini image generation error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export async function enhancePrompt(userPrompt: string, style: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert at crafting prompts for AI image generation. 
Take the user's simple prompt and enhance it with more descriptive details, artistic direction, and style elements.
The style requested is: ${style}
Keep the enhanced prompt under 200 words. Return only the enhanced prompt, nothing else.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      config: {
        systemInstruction: systemPrompt,
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    return response.text || userPrompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return userPrompt;
  }
}
