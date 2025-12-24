import { GoogleGenAI, Modality } from "@google/genai";
import { logger } from "../logger";
import { keyManager, MODELS } from "./gemini";
import type {
  TextToMockupParsedPrompt,
  TextToMockupProgressEvent,
  TextToMockupResult,
  OutputQuality,
  SceneType,
  Sex,
  AgeGroup,
  Ethnicity,
} from "@shared/mockupTypes";

type ProgressCallback = (event: TextToMockupProgressEvent) => void;

const DEFAULT_PARSED_PROMPT: TextToMockupParsedPrompt = {
  designConcept: "abstract design",
  designStyle: "modern",
  productType: "t-shirt",
  productCategory: "mens",
  productColor: "white",
  sceneType: "lifestyle",
  sceneDescription: "studio setting",
};

export async function parseTextToMockupPrompt(
  userPrompt: string
): Promise<TextToMockupParsedPrompt> {
  const systemInstruction = `You are an expert at understanding mockup generation requests. Parse the user's natural language description to extract structured mockup parameters.

Extract the following from the user's request:
1. designConcept: What should the design/artwork be? (e.g., "wolf howling at moon", "geometric pattern", "vintage rose illustration")
2. designStyle: Art style for the design (e.g., "minimalist", "vintage", "bold", "watercolor", "realistic", "cartoon")
3. productType: What product to put it on (e.g., "t-shirt", "hoodie", "mug", "tote bag", "phone case")
4. productCategory: Target demographic (e.g., "mens", "womens", "unisex", "kids")
5. productColor: Color of the product (e.g., "white", "black", "navy", "heather gray")
6. sceneType: Either "lifestyle" (person wearing/using), "flatlay" (product laid flat), or "model" (model wearing)
7. sceneDescription: Environment/setting details (e.g., "urban street", "cozy coffee shop", "beach sunset", "studio")
8. modelSex: If lifestyle/model scene, the model's sex ("Male" or "Female")
9. modelAge: If lifestyle/model scene, age group ("Young Adult", "Adult", "Teen", etc.)
10. modelEthnicity: If mentioned, the model's ethnicity ("White", "Black", "Hispanic", "Asian", "Indian", "Southeast Asian", "Middle Eastern", "Indigenous", "Diverse")
11. seasonalTheme: If seasonal elements mentioned ("christmas", "valentines", "summer", "halloween", etc.)
12. brandStyle: Photography/brand style ("minimal", "urban", "natural", "bold", "premium", "editorial")
13. additionalDetails: Any other specific requirements

Respond with JSON only:
{
  "designConcept": "string",
  "designStyle": "string",
  "productType": "string",
  "productCategory": "string",
  "productColor": "string",
  "sceneType": "lifestyle" | "flatlay" | "model",
  "sceneDescription": "string",
  "modelSex": "Male" | "Female" | null,
  "modelAge": "Young Adult" | "Adult" | "Teen" | null,
  "modelEthnicity": "string or null",
  "seasonalTheme": "string or null",
  "brandStyle": "string or null",
  "additionalDetails": "string or null"
}`;

  try {
    const client = keyManager.getNextClient();
    const response = await client.models.generateContent({
      model: MODELS.FAST_ANALYSIS,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0,
        topP: 1,
        topK: 1,
      },
    });

    const rawJson = response.text;
    if (rawJson) {
      let cleaned = rawJson.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      const parsed = JSON.parse(cleaned) as Partial<TextToMockupParsedPrompt>;
      keyManager.reportSuccess(client);

      return {
        designConcept: parsed.designConcept || DEFAULT_PARSED_PROMPT.designConcept,
        designStyle: parsed.designStyle || DEFAULT_PARSED_PROMPT.designStyle,
        productType: parsed.productType || DEFAULT_PARSED_PROMPT.productType,
        productCategory: parsed.productCategory || DEFAULT_PARSED_PROMPT.productCategory,
        productColor: parsed.productColor || DEFAULT_PARSED_PROMPT.productColor,
        sceneType: (parsed.sceneType as SceneType) || DEFAULT_PARSED_PROMPT.sceneType,
        sceneDescription: parsed.sceneDescription || DEFAULT_PARSED_PROMPT.sceneDescription,
        modelSex: parsed.modelSex as Sex | undefined,
        modelAge: parsed.modelAge as AgeGroup | undefined,
        modelEthnicity: parsed.modelEthnicity as Ethnicity | undefined,
        seasonalTheme: parsed.seasonalTheme || undefined,
        brandStyle: parsed.brandStyle || undefined,
        additionalDetails: parsed.additionalDetails || undefined,
      };
    }

    return DEFAULT_PARSED_PROMPT;
  } catch (error) {
    logger.error("Text-to-mockup prompt parsing failed", error, { source: "textToMockupOrchestrator" });
    return DEFAULT_PARSED_PROMPT;
  }
}

export async function generateDesignAsset(
  parsedPrompt: TextToMockupParsedPrompt
): Promise<string | null> {
  const designPrompt = `Create a high-quality design asset suitable for printing on products.

DESIGN REQUIREMENTS:
- Concept: ${parsedPrompt.designConcept}
- Style: ${parsedPrompt.designStyle}
- Purpose: This will be printed on a ${parsedPrompt.productType}

CRITICAL REQUIREMENTS:
1. Create the design on a PURE WHITE or TRANSPARENT background
2. The design should be centered and well-composed
3. Use clean, print-ready artwork
4. No background textures or patterns behind the main design
5. Design should work well on ${parsedPrompt.productColor} colored products
6. Make it visually striking and professional

The design must be isolated artwork, NOT a mockup. Just the graphic/illustration/logo itself.`;

  const negativePrompt = "mockup, product photo, t-shirt, clothing, model, person wearing, fabric texture, wrinkles, background scene, environment, busy background";

  try {
    const client = keyManager.getNextClient();
    const config: any = {
      responseModalities: [Modality.IMAGE],
      aspectRatio: "1:1",
    };

    const response = await client.models.generateContent({
      model: MODELS.IMAGE_PREMIUM,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${designPrompt}\n\nAvoid: ${negativePrompt}`,
            },
          ],
        },
      ],
      config,
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      logger.error("No candidates in design generation response", null, { source: "textToMockupOrchestrator" });
      return null;
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      logger.error("No content parts in design response", null, { source: "textToMockupOrchestrator" });
      return null;
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        keyManager.reportSuccess(client);
        logger.info("Design asset generated successfully", { source: "textToMockupOrchestrator" });
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    logger.error("Design asset generation failed", error, { source: "textToMockupOrchestrator" });
    return null;
  }
}

export async function generateMockupFromDesign(
  designBase64: string,
  parsedPrompt: TextToMockupParsedPrompt,
  outputQuality: OutputQuality = "high"
): Promise<string | null> {
  const isLifestyle = parsedPrompt.sceneType === "lifestyle" || parsedPrompt.sceneType === "model";
  
  const modelDescription = isLifestyle && parsedPrompt.modelSex
    ? `${parsedPrompt.modelAge || "Adult"} ${parsedPrompt.modelSex}${parsedPrompt.modelEthnicity ? ` (${parsedPrompt.modelEthnicity})` : ""}`
    : "";

  const seasonalElements = parsedPrompt.seasonalTheme
    ? `Incorporate ${parsedPrompt.seasonalTheme} seasonal elements in the scene.`
    : "";

  const mockupPrompt = isLifestyle
    ? `Create a professional lifestyle product mockup photograph.

PRODUCT: ${parsedPrompt.productColor} ${parsedPrompt.productType}
DESIGN: Apply the provided design artwork prominently on the ${parsedPrompt.productType}

SCENE:
- Setting: ${parsedPrompt.sceneDescription}
- Model: ${modelDescription} wearing/using the product
- Style: ${parsedPrompt.brandStyle || "natural, editorial"} photography
${seasonalElements}

CRITICAL REQUIREMENTS:
1. The design MUST be clearly visible and properly placed on the product
2. Professional, commercial-quality photography
3. Natural lighting and composition
4. The model should be posed naturally, product clearly visible
5. High-end e-commerce/brand photography quality

This is a mockup photo for a ${parsedPrompt.productCategory} ${parsedPrompt.productType} with the custom design applied.`
    : `Create a professional flat lay product mockup photograph.

PRODUCT: ${parsedPrompt.productColor} ${parsedPrompt.productType}
DESIGN: Apply the provided design artwork prominently on the ${parsedPrompt.productType}

SCENE:
- Setting: ${parsedPrompt.sceneDescription}
- Style: Clean flat lay photography
${seasonalElements}

CRITICAL REQUIREMENTS:
1. The design MUST be clearly visible and properly placed on the product
2. Product laid flat on clean surface
3. Professional lighting, minimal shadows
4. High-end e-commerce photography quality
5. Clean, uncluttered composition

This is a mockup photo for a ${parsedPrompt.productCategory} ${parsedPrompt.productType} with the custom design applied.`;

  const negativePrompt = "blurry, low quality, distorted, deformed, watermark, text overlay, logo, signature, amateur, poorly lit, grainy";

  try {
    const client = keyManager.getNextClient();
    const config: any = {
      responseModalities: [Modality.IMAGE],
      aspectRatio: "4:3",
    };

    const response = await client.models.generateContent({
      model: MODELS.IMAGE_PREMIUM,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: designBase64,
                mimeType: "image/png",
              },
            },
            {
              text: `${mockupPrompt}\n\nAvoid: ${negativePrompt}`,
            },
          ],
        },
      ],
      config,
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      logger.error("No candidates in mockup generation response", null, { source: "textToMockupOrchestrator" });
      return null;
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      logger.error("No content parts in mockup response", null, { source: "textToMockupOrchestrator" });
      return null;
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        keyManager.reportSuccess(client);
        logger.info("Mockup generated successfully", { source: "textToMockupOrchestrator" });
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    logger.error("Mockup generation failed", error, { source: "textToMockupOrchestrator" });
    return null;
  }
}

export async function orchestrateTextToMockup(
  userPrompt: string,
  outputQuality: OutputQuality = "high",
  overrides?: Partial<TextToMockupParsedPrompt>,
  onProgress?: ProgressCallback
): Promise<TextToMockupResult> {
  const sendProgress = (event: TextToMockupProgressEvent) => {
    if (onProgress) {
      onProgress(event);
    }
  };

  try {
    sendProgress({
      stage: "parsing",
      message: "Understanding your mockup request...",
      progress: 10,
    });

    let parsedPrompt = await parseTextToMockupPrompt(userPrompt);

    if (overrides) {
      parsedPrompt = { ...parsedPrompt, ...overrides };
    }

    sendProgress({
      stage: "parsing",
      message: "Request understood! Preparing to create your design...",
      progress: 20,
      parsedPrompt,
    });

    sendProgress({
      stage: "generating_design",
      message: `Creating ${parsedPrompt.designStyle} ${parsedPrompt.designConcept} design...`,
      progress: 30,
      parsedPrompt,
    });

    const designImage = await generateDesignAsset(parsedPrompt);
    
    if (!designImage) {
      sendProgress({
        stage: "error",
        message: "Failed to generate design asset",
        progress: 0,
        error: "Design generation failed",
      });
      return {
        success: false,
        parsedPrompt,
        designImage: "",
        mockupImage: "",
        error: "Failed to generate design asset",
      };
    }

    sendProgress({
      stage: "generating_design",
      message: "Design created! Now applying to product...",
      progress: 50,
      parsedPrompt,
      designImage,
    });

    sendProgress({
      stage: "preparing_mockup",
      message: `Preparing ${parsedPrompt.productColor} ${parsedPrompt.productType} mockup...`,
      progress: 60,
      parsedPrompt,
      designImage,
    });

    sendProgress({
      stage: "generating_mockup",
      message: `Creating ${parsedPrompt.sceneType} mockup in ${parsedPrompt.sceneDescription}...`,
      progress: 70,
      parsedPrompt,
      designImage,
    });

    const mockupImage = await generateMockupFromDesign(designImage, parsedPrompt, outputQuality);

    if (!mockupImage) {
      sendProgress({
        stage: "error",
        message: "Failed to generate mockup",
        progress: 0,
        error: "Mockup generation failed",
        designImage,
      });
      return {
        success: false,
        parsedPrompt,
        designImage,
        mockupImage: "",
        error: "Failed to generate mockup from design",
      };
    }

    sendProgress({
      stage: "complete",
      message: "Your mockup is ready!",
      progress: 100,
      parsedPrompt,
      designImage,
      mockupImage,
    });

    return {
      success: true,
      parsedPrompt,
      designImage,
      mockupImage,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error("Text-to-mockup orchestration failed", error, { source: "textToMockupOrchestrator" });
    
    sendProgress({
      stage: "error",
      message: errorMessage,
      progress: 0,
      error: errorMessage,
    });

    return {
      success: false,
      parsedPrompt: DEFAULT_PARSED_PROMPT,
      designImage: "",
      mockupImage: "",
      error: errorMessage,
    };
  }
}
