import { GoogleGenAI, Modality, Type } from "@google/genai";

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

// ============== MODEL CONFIGURATION ==============
// Multi-model pipeline for 100% text accuracy

// Phase 1: Text Sentinel - Fast model for text detection (using flash for better accuracy)
const TEXT_SENTINEL_MODEL = "gemini-2.5-flash";

// Phase 2: Style Architect - Advanced reasoning for prompt enhancement
const STYLE_ARCHITECT_MODEL = "gemini-3-pro-preview";
const STYLE_ARCHITECT_TEMPERATURE = 0.7;

// Phase 3: Image Generator - Best for text rendering
const IMAGE_GENERATOR_MODEL = "gemini-3-pro-image-preview";

// Fallback model if gemini-3-pro-image-preview fails
const IMAGE_GENERATOR_FALLBACK = "gemini-2.5-flash-image";

// ============== TYPES ==============

export interface TextAnalysisResult {
  hasExplicitText: boolean;
  extractedTexts: Array<{
    text: string;
    context: string;
    importance: "primary" | "secondary" | "decorative";
  }>;
  confidence: number;
}

export interface ArtDirectionResult {
  enhancedPrompt: string;
  textDirections: Array<{
    text: string;
    material: string;
    lighting: string;
    texture: string;
    environment: string;
    perspective: string;
  }>;
}

export interface GeneratedImageResult {
  imageBase64: string;
  mimeType: string;
  textResponse?: string;
  pipeline?: {
    textAnalysis: TextAnalysisResult;
    artDirection: ArtDirectionResult;
    finalPrompt: string;
  };
}

// ============== PHASE 1: TEXT SENTINEL ==============
// Detects and extracts explicit text requests from user prompts

const TEXT_SENTINEL_SYSTEM = `You are a "Text Detection Agent". Your critical mission is to identify ALL text the user wants rendered in the image.

PRIME DIRECTIVE: DETECT ALL EXPLICIT TEXT REQUESTS. Your job is to find every piece of text that must appear in the generated image.

DETECTION PATTERNS - Always extract text when you see:
- "says [text]" or "saying [text]" -> EXTRACT the text
- "that says [text]" -> EXTRACT the text  
- "with [text] on it" -> EXTRACT the text
- "titled [text]" or "title: [text]" -> EXTRACT the text
- "labeled [text]" -> EXTRACT the text
- "reading [text]" -> EXTRACT the text
- Text in quotation marks: 'text' or "text" -> EXTRACT the text
- Price patterns: "$X.XX" -> EXTRACT as price
- Names of establishments/businesses that appear on signs -> EXTRACT the name
- Menu items with prices -> EXTRACT each item and price

CRITICAL EXAMPLES:
- "A coffee shop sign that says The Daily Grind" -> hasExplicitText: TRUE, EXTRACT: "The Daily Grind"
- "Coffee shop menu with Espresso $3.00, Latte $4.50" -> hasExplicitText: TRUE, EXTRACT: "Espresso $3.00", "Latte $4.50"
- "A neon sign saying OPEN 24/7" -> hasExplicitText: TRUE, EXTRACT: "OPEN 24/7"
- "A poster with the title Metropolis" -> hasExplicitText: TRUE, EXTRACT: "Metropolis"
- "A t-shirt with 1970s psychedelic lettering style" -> hasExplicitText: FALSE (describes style, not specific text content)

DO NOT extract text from:
- Style descriptions only (e.g., "vintage lettering style", "art deco font")
- General scene descriptions without specific text content

For each extracted text, provide:
1. text: The exact text string (preserve case, punctuation, special characters EXACTLY)
2. context: What object/surface it appears on
3. importance: "primary" (main focus), "secondary" (supporting), or "decorative" (background)`;

export async function analyzeTextRequirements(userPrompt: string): Promise<TextAnalysisResult> {
  try {
    console.log("[Text Sentinel] Analyzing prompt for explicit text...");
    
    const response = await ai.models.generateContent({
      model: TEXT_SENTINEL_MODEL,
      config: {
        systemInstruction: TEXT_SENTINEL_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasExplicitText: { type: Type.BOOLEAN },
            extractedTexts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  context: { type: Type.STRING },
                  importance: { type: Type.STRING }
                },
                required: ["text", "context", "importance"]
              }
            },
            confidence: { type: Type.NUMBER }
          },
          required: ["hasExplicitText", "extractedTexts", "confidence"]
        }
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const result = JSON.parse(response.text || "{}");
    console.log("[Text Sentinel] Analysis complete:", JSON.stringify(result, null, 2));
    
    return {
      hasExplicitText: result.hasExplicitText || false,
      extractedTexts: result.extractedTexts || [],
      confidence: result.confidence || 0
    };
  } catch (error: any) {
    console.error("[Text Sentinel] Error:", error.message);
    return {
      hasExplicitText: false,
      extractedTexts: [],
      confidence: 0
    };
  }
}

// ============== PHASE 2: STYLE ARCHITECT ==============
// Creates detailed Art Direction prompts with physical text properties

const STYLE_ARCHITECT_SYSTEM = `You are an expert AI Art Director. Your job is to create a master prompt for an advanced AI image generator that renders text with 100% accuracy.

PRIME DIRECTIVE: PHYSICAL TEXT RENDERING. When the image includes text, this text MUST be rendered as a physical object within the scene's 3D space, NOT as a 2D overlay.

For each piece of text that must appear in the image, provide detailed "Art Direction for Text" covering:

1. **Material**: What is the text physically made of? 
   Examples: 'carved ice', 'glowing neon tube', 'embossed leather', 'painted wooden sign', 'chalk on blackboard', 'gold leaf on marble'

2. **Lighting Interaction**: How does the scene's light affect it?
   Examples: 'catches rim light', 'casts a soft shadow below', 'glows with inner luminescence', 'reflects ambient light'

3. **Surface Texture**: What is its surface like?
   Examples: 'rough chiseled stone', 'smooth polished chrome', 'matte paint with subtle cracking', 'glossy enamel'

4. **Environmental Interaction**: How does it affect its surroundings?
   Examples: 'emits a soft glow onto the snow', 'creates reflections on nearby surfaces', 'weathered by rain exposure'

5. **Perspective & Depth**: Where is it in 3D space?
   Examples: 'in the foreground, matching the ground perspective', 'mounted flat against the wall, seen from slight angle'

CRITICAL RULES:
- NEVER paraphrase or modify the exact text strings - they must appear EXACTLY as provided
- Include the exact text in quotation marks in your prompt
- Specify the font style appropriate for the context
- Add technical photography details (camera, lens, lighting setup) for realism

OUTPUT FORMAT:
Return a complete, detailed prompt ready to send to the image generation model. The prompt should be comprehensive but focused.`;

export async function createArtDirection(
  userPrompt: string, 
  textAnalysis: TextAnalysisResult,
  style?: string
): Promise<ArtDirectionResult> {
  try {
    console.log("[Style Architect] Creating Art Direction...");
    
    let textRequirements = "";
    if (textAnalysis.hasExplicitText && textAnalysis.extractedTexts.length > 0) {
      textRequirements = "\n\nEXACT TEXT THAT MUST APPEAR IN THE IMAGE (do not modify these):\n";
      textAnalysis.extractedTexts.forEach((t, i) => {
        textRequirements += `${i + 1}. "${t.text}" - Context: ${t.context} (${t.importance} importance)\n`;
      });
    }

    const styleNote = style && style !== "auto" ? `\nRequested visual style: ${style}` : "";
    
    const fullPrompt = `Original user request: ${userPrompt}${styleNote}${textRequirements}

Create a detailed Art Direction prompt that will produce an image with 100% accurate text rendering.`;

    const response = await ai.models.generateContent({
      model: STYLE_ARCHITECT_MODEL,
      config: {
        systemInstruction: STYLE_ARCHITECT_SYSTEM,
        temperature: STYLE_ARCHITECT_TEMPERATURE,
      },
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const enhancedPrompt = response.text || userPrompt;
    console.log("[Style Architect] Art Direction complete");
    
    // Build text directions from analysis
    const textDirections = textAnalysis.extractedTexts.map(t => ({
      text: t.text,
      material: "as specified in Art Direction",
      lighting: "scene-appropriate",
      texture: "contextual",
      environment: t.context,
      perspective: "integrated in scene"
    }));

    return {
      enhancedPrompt,
      textDirections
    };
  } catch (error: any) {
    console.error("[Style Architect] Error:", error.message);
    return {
      enhancedPrompt: userPrompt,
      textDirections: []
    };
  }
}

// ============== PHASE 3: IMAGE GENERATOR ==============
// Generates the final image using the Art Direction prompt

export async function generateImageWithPipeline(
  prompt: string,
  style?: string
): Promise<GeneratedImageResult> {
  try {
    console.log("=".repeat(60));
    console.log("[Pipeline] Starting 3-phase image generation");
    console.log("=".repeat(60));
    
    // Phase 1: Text Sentinel
    const textAnalysis = await analyzeTextRequirements(prompt);
    
    // Phase 2: Style Architect
    const artDirection = await createArtDirection(prompt, textAnalysis, style);
    
    // Phase 3: Image Generation
    console.log("[Image Generator] Generating image with model:", IMAGE_GENERATOR_MODEL);
    
    let response;
    let modelUsed = IMAGE_GENERATOR_MODEL;
    
    try {
      response = await ai.models.generateContent({
        model: IMAGE_GENERATOR_MODEL,
        contents: [{ role: "user", parts: [{ text: artDirection.enhancedPrompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
    } catch (primaryError: any) {
      console.log("[Image Generator] Primary model failed, trying fallback:", IMAGE_GENERATOR_FALLBACK);
      modelUsed = IMAGE_GENERATOR_FALLBACK;
      
      response = await ai.models.generateContent({
        model: IMAGE_GENERATOR_FALLBACK,
        contents: [{ role: "user", parts: [{ text: artDirection.enhancedPrompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
    }

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
    
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data in response");
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const textPart = candidate?.content?.parts?.find((part: any) => part.text);

    console.log("[Pipeline] Image generation complete with model:", modelUsed);
    console.log("=".repeat(60));

    return {
      imageBase64: imagePart.inlineData.data,
      mimeType,
      textResponse: textPart?.text,
      pipeline: {
        textAnalysis,
        artDirection,
        finalPrompt: artDirection.enhancedPrompt
      }
    };
  } catch (error: any) {
    console.error("[Pipeline] Error:", error.message);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

// ============== LEGACY FUNCTIONS (for backward compatibility) ==============

export async function generateImage(prompt: string): Promise<GeneratedImageResult> {
  // Use the new pipeline for all image generation
  return generateImageWithPipeline(prompt);
}

export async function enhancePrompt(userPrompt: string, style: string): Promise<string> {
  try {
    const textAnalysis = await analyzeTextRequirements(userPrompt);
    const artDirection = await createArtDirection(userPrompt, textAnalysis, style);
    return artDirection.enhancedPrompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return userPrompt;
  }
}
