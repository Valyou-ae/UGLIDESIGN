import { GoogleGenAI, Modality, Type } from "@google/genai";

// Use user's GEMINI_API_KEY directly (bypasses Replit proxy for full model access)
// Only fall back to AI Integrations if user hasn't provided their own key
const hasUserKey = !!process.env.GEMINI_API_KEY;
const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "";

// IMPORTANT: Only use Replit's baseUrl when using their AI Integrations key
// When user provides their own key, connect directly to Google for full model access
const baseUrl = hasUserKey ? undefined : process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const ai = new GoogleGenAI({
  apiKey,
  ...(baseUrl && {
    httpOptions: {
      apiVersion: "",
      baseUrl,
    },
  }),
});

console.log(`[Gemini] Using ${hasUserKey ? "user's API key (direct Google access)" : "Replit AI Integrations"}`);

// ============== MODEL CONFIGURATION ==============
// AI Studio Flow: Fast analysis → Draft prompt → Image generation

// Phase 1: Initial Analysis - Ultra-fast model for combined text + deep analysis
const ANALYSIS_MODEL = "gemini-flash-lite-latest";

// Phase 2: Style Enhancement - Fast model for prompt enhancement
const STYLE_MODEL = "gemini-flash-lite-latest";
const STYLE_TEMPERATURE = 0.7;

// Phase 3: Image Generation - Model selection based on text presence
const IMAGE_MODEL_FAST = "gemini-2.5-flash-image"; // Fast model for no-text prompts
const IMAGE_MODEL_TEXT = "gemini-3-pro-image-preview"; // Best text accuracy for text prompts

// ============== TYPES ==============

export interface InitialAnalysisResult {
  // Text Analysis (Text SFX Artist logic)
  hasExplicitText: boolean;
  textInfo: {
    texts: Array<{
      content: string;
      surface: string;
      style: string;
      importance: "primary" | "secondary" | "decorative";
    }>;
    artDirection: string;
  } | null;
  
  // Deep Analysis
  deepAnalysis: {
    subject: string;
    mood: string;
    lighting: string;
    environment: string;
    styleIntent: string;
    isPortrait: boolean;
    hasAnimals: boolean;
    hasArchitecture: boolean;
  };
}

export interface DraftPromptResult {
  draftPrompt: string;
  cinematicDNA: {
    lighting: string;
    camera: string;
    color: string;
  };
}

export interface GeneratedImageResult {
  imageBase64: string;
  mimeType: string;
  textResponse?: string;
  textInfo?: InitialAnalysisResult["textInfo"];
  pipeline?: {
    analysis: InitialAnalysisResult;
    draftPrompt: DraftPromptResult;
    finalPrompt: string;
    modelUsed: string;
  };
}

// ============== PHASE 1: INITIAL ANALYSIS ==============
// ONE consolidated call that does text analysis + deep analysis

const INITIAL_ANALYSIS_SYSTEM = `You are an AI Image Generation Analysis Agent. Perform TWO tasks in ONE response:

## TASK 1: TEXT ANALYSIS (Text SFX Artist)

Detect if the user has EXPLICITLY requested text to appear in the image.

DETECTION PATTERNS - Extract text when you see:
- "says [text]" or "saying [text]"
- "that says [text]"
- "with [text] on it"
- "titled [text]" or "title: [text]"
- "labeled [text]"
- "reading [text]"
- Text in quotation marks: 'text' or "text"
- Price patterns: "$X.XX"
- Names on signs/establishments

For each detected text, provide:
- content: The exact text string
- surface: What it appears on (sign, shirt, menu, etc.)
- style: How it should look (neon, handwritten, vintage, etc.)
- importance: primary/secondary/decorative

Also provide artDirection: A brief describing how text should integrate visually.

DO NOT extract text from style descriptions only (e.g., "vintage lettering style").

## TASK 2: DEEP ANALYSIS

Analyze the prompt's core visual concepts:
- subject: Main subject/focus
- mood: Emotional tone (joyful, mysterious, dramatic, etc.)
- lighting: Natural/artificial, time of day, quality
- environment: Setting/location
- styleIntent: Art style (photorealistic, illustrated, painterly, etc.)
- isPortrait: Is this a person/face portrait?
- hasAnimals: Are animals involved?
- hasArchitecture: Are buildings/structures involved?`;

export async function performInitialAnalysis(
  userPrompt: string,
  processTextInPrompt: boolean = true
): Promise<InitialAnalysisResult> {
  try {
    console.log("[Phase 1: Initial Analysis] Analyzing prompt...");
    console.log("[Phase 1] Process Text in Prompt:", processTextInPrompt);
    
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      config: {
        systemInstruction: INITIAL_ANALYSIS_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasExplicitText: { type: Type.BOOLEAN },
            textInfo: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                texts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      content: { type: Type.STRING },
                      surface: { type: Type.STRING },
                      style: { type: Type.STRING },
                      importance: { type: Type.STRING }
                    },
                    required: ["content", "surface", "style", "importance"]
                  }
                },
                artDirection: { type: Type.STRING }
              },
              required: ["texts", "artDirection"]
            },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                mood: { type: Type.STRING },
                lighting: { type: Type.STRING },
                environment: { type: Type.STRING },
                styleIntent: { type: Type.STRING },
                isPortrait: { type: Type.BOOLEAN },
                hasAnimals: { type: Type.BOOLEAN },
                hasArchitecture: { type: Type.BOOLEAN }
              },
              required: ["subject", "mood", "lighting", "environment", "styleIntent", "isPortrait", "hasAnimals", "hasArchitecture"]
            }
          },
          required: ["hasExplicitText", "deepAnalysis"]
        }
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const result = JSON.parse(response.text || "{}");
    
    // If processTextInPrompt is false, ignore detected text
    if (!processTextInPrompt) {
      result.hasExplicitText = false;
      result.textInfo = null;
    }
    
    console.log("[Phase 1: Initial Analysis] Complete:", JSON.stringify(result, null, 2));
    
    return {
      hasExplicitText: result.hasExplicitText || false,
      textInfo: result.textInfo || null,
      deepAnalysis: result.deepAnalysis || {
        subject: "unknown",
        mood: "neutral",
        lighting: "natural",
        environment: "unspecified",
        styleIntent: "photorealistic",
        isPortrait: false,
        hasAnimals: false,
        hasArchitecture: false
      }
    };
  } catch (error: any) {
    console.error("[Phase 1: Initial Analysis] Error:", error.message);
    return {
      hasExplicitText: false,
      textInfo: null,
      deepAnalysis: {
        subject: "unknown",
        mood: "neutral",
        lighting: "natural",
        environment: "unspecified",
        styleIntent: "photorealistic",
        isPortrait: false,
        hasAnimals: false,
        hasArchitecture: false
      }
    };
  }
}

// ============== PHASE 2: DRAFT PROMPT CREATION ==============
// Style Architect in draft mode - focuses on Cinematic DNA

const STYLE_ARCHITECT_SYSTEM = `You are a Cinematic Style Architect. Create enhanced prompts using the THREE most impactful Cinematic DNA components:

## CINEMATIC DNA (Focus on these 3)

1. **LIGHTING** - The soul of the image
   - Golden hour, blue hour, rim lighting, soft diffused, dramatic shadows
   - Chiaroscuro, volumetric rays, neon glow, candlelight, moonlight
   
2. **CAMERA** - The perspective and depth
   - Shallow depth of field, bokeh, 35mm lens, wide angle, telephoto
   - Dutch angle, bird's eye, worm's eye, tracking shot feel
   
3. **COLOR** - The emotional palette
   - Warm tones, cool palette, complementary colors, monochromatic
   - Cinematic color grading, teal and orange, desaturated, vibrant

## OUTPUT FORMAT

Create a concise but vivid prompt that enhances the original with cinematic DNA.
Keep it focused - quality over quantity.

## TEXT HANDLING

If textInfo is provided:
- Include the text naturally in the scene description
- Specify exactly how it should appear (the surface, style, placement)
- Be explicit about the text content

If no text is requested:
- Do NOT add any text elements
- Add instruction: "No text, words, or letters in the image"`;

export async function createDraftPrompt(
  userPrompt: string,
  analysis: InitialAnalysisResult,
  style?: string
): Promise<DraftPromptResult> {
  try {
    console.log("[Phase 2: Draft Prompt] Creating enhanced prompt...");
    
    // Build context about detected text
    let textContext = "";
    if (analysis.hasExplicitText && analysis.textInfo) {
      textContext = "\n\n## TEXT TO INCLUDE\n";
      for (const text of analysis.textInfo.texts) {
        textContext += `- "${text.content}" on ${text.surface} in ${text.style} style\n`;
      }
      textContext += `\nArt Direction: ${analysis.textInfo.artDirection}`;
    }
    
    const styleNote = style && style !== "auto" ? `\nRequested visual style: ${style}` : "";
    
    const fullPrompt = `## USER REQUEST
${userPrompt}${styleNote}${textContext}

## DEEP ANALYSIS
- Subject: ${analysis.deepAnalysis.subject}
- Mood: ${analysis.deepAnalysis.mood}
- Lighting: ${analysis.deepAnalysis.lighting}
- Environment: ${analysis.deepAnalysis.environment}
- Style: ${analysis.deepAnalysis.styleIntent}

Create a cinematic draft prompt focusing on Lighting, Camera, and Color.
${!analysis.hasExplicitText ? "IMPORTANT: No text should appear in this image." : ""}`;

    const response = await ai.models.generateContent({
      model: STYLE_MODEL,
      config: {
        systemInstruction: STYLE_ARCHITECT_SYSTEM,
        temperature: STYLE_TEMPERATURE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            draftPrompt: { type: Type.STRING },
            cinematicDNA: {
              type: Type.OBJECT,
              properties: {
                lighting: { type: Type.STRING },
                camera: { type: Type.STRING },
                color: { type: Type.STRING }
              },
              required: ["lighting", "camera", "color"]
            }
          },
          required: ["draftPrompt", "cinematicDNA"]
        }
      },
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const result = JSON.parse(response.text || "{}");
    
    console.log("[Phase 2: Draft Prompt] Complete");
    console.log("[Phase 2] Cinematic DNA:", result.cinematicDNA);
    
    return {
      draftPrompt: result.draftPrompt || userPrompt,
      cinematicDNA: result.cinematicDNA || {
        lighting: "natural",
        camera: "standard",
        color: "balanced"
      }
    };
  } catch (error: any) {
    console.error("[Phase 2: Draft Prompt] Error:", error.message);
    return {
      draftPrompt: userPrompt,
      cinematicDNA: {
        lighting: "natural",
        camera: "standard",
        color: "balanced"
      }
    };
  }
}

// ============== DYNAMIC NEGATIVE PROMPTS ==============
// Generated based on analysis to prevent common errors

function generateNegativePrompts(analysis: InitialAnalysisResult): string {
  const negatives: string[] = [
    "low quality",
    "blurry",
    "distorted",
    "poorly composed",
    "amateur"
  ];
  
  // Portrait-specific negatives
  if (analysis.deepAnalysis.isPortrait) {
    negatives.push(
      "extra fingers",
      "missing fingers",
      "deformed hands",
      "bad anatomy",
      "asymmetrical face",
      "cross-eyed",
      "double face"
    );
  }
  
  // Animal-specific negatives
  if (analysis.deepAnalysis.hasAnimals) {
    negatives.push(
      "extra legs",
      "missing limbs",
      "deformed body",
      "unnatural proportions"
    );
  }
  
  // If NO text requested, prevent random text
  if (!analysis.hasExplicitText) {
    negatives.push(
      "text",
      "words",
      "letters",
      "watermark",
      "signature",
      "logo",
      "caption",
      "subtitle"
    );
  }
  
  // If text IS requested, prevent text errors
  if (analysis.hasExplicitText) {
    negatives.push(
      "misspelled text",
      "garbled letters",
      "illegible text",
      "backwards text",
      "distorted letters"
    );
  }
  
  return negatives.join(", ");
}

// ============== PHASE 3: IMAGE GENERATION ==============
// Uses appropriate model based on text presence

async function generateImage(
  prompt: string,
  analysis: InitialAnalysisResult
): Promise<{ imageBase64: string; mimeType: string; textResponse?: string; modelUsed: string }> {
  // Select model based on text presence
  const modelToUse = analysis.hasExplicitText ? IMAGE_MODEL_TEXT : IMAGE_MODEL_FAST;
  
  // Generate negative prompts based on analysis
  const negativePrompts = generateNegativePrompts(analysis);
  
  // Build final prompt with negative prompts
  const fullPrompt = `${prompt}

---
AVOID: ${negativePrompts}`;
  
  console.log(`[Phase 3: Image Generation] Using model: ${modelToUse}`);
  console.log(`[Phase 3] Has text: ${analysis.hasExplicitText}`);
  
  try {
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
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

    console.log("[Phase 3: Image Generation] Complete");

    return {
      imageBase64: imagePart.inlineData.data,
      mimeType,
      textResponse: textPart?.text,
      modelUsed: modelToUse
    };
  } catch (error: any) {
    console.error(`[Phase 3: Image Generation] Error with ${modelToUse}:`, error.message);
    
    // Fallback to text model if fast model fails
    if (modelToUse === IMAGE_MODEL_FAST) {
      console.log("[Phase 3: Image Generation] Falling back to text model...");
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL_TEXT,
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const candidate = response.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
      
      if (!imagePart?.inlineData?.data) {
        throw new Error("No image data in fallback response");
      }

      return {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || "image/png",
        textResponse: candidate?.content?.parts?.find((part: any) => part.text)?.text,
        modelUsed: IMAGE_MODEL_TEXT
      };
    }
    
    throw error;
  }
}

// ============== MAIN PIPELINE ==============
// AI Studio Flow: Analysis → Draft Prompt → Generate Image

export type ProgressPhase = "analysis" | "draft_prompt" | "image_generation" | "complete" | "error";

export type ProgressCallback = (phase: ProgressPhase, message: string) => void;

export interface PipelineOptions {
  processTextInPrompt?: boolean;
  style?: string;
  onProgress?: ProgressCallback;
}

export async function generateImageWithPipeline(
  userPrompt: string,
  options: PipelineOptions = {}
): Promise<GeneratedImageResult> {
  const { processTextInPrompt = true, style, onProgress } = options;
  
  const sendProgress = (phase: ProgressPhase, message: string) => {
    console.log(`[Pipeline] ${phase}: ${message}`);
    if (onProgress) {
      onProgress(phase, message);
    }
  };
  
  console.log("=".repeat(60));
  console.log("[AI Studio Pipeline] Starting image generation");
  console.log("[AI Studio Pipeline] Process Text:", processTextInPrompt);
  console.log("=".repeat(60));

  // Phase 1: Initial Analysis (ONE call for text + deep analysis)
  sendProgress("analysis", "Analyzing your prompt for text and visual elements...");
  const analysis = await performInitialAnalysis(userPrompt, processTextInPrompt);
  
  // Phase 2: Draft Prompt Creation (Cinematic DNA)
  sendProgress("draft_prompt", "Creating cinematic draft with Lighting, Camera, Color...");
  const draftPrompt = await createDraftPrompt(userPrompt, analysis, style);
  
  // Phase 3: Image Generation (model selected based on text presence)
  const modelName = analysis.hasExplicitText ? "text-optimized model" : "fast model";
  sendProgress("image_generation", `Generating your image with ${modelName}...`);
  const imageResult = await generateImage(draftPrompt.draftPrompt, analysis);
  
  sendProgress("complete", "Image generation complete!");
  
  console.log("\n" + "=".repeat(60));
  console.log("[AI Studio Pipeline] Complete!");
  console.log("[AI Studio Pipeline] Model used:", imageResult.modelUsed);
  console.log("=".repeat(60));

  return {
    imageBase64: imageResult.imageBase64,
    mimeType: imageResult.mimeType,
    textResponse: imageResult.textResponse,
    textInfo: analysis.textInfo,
    pipeline: {
      analysis,
      draftPrompt,
      finalPrompt: draftPrompt.draftPrompt,
      modelUsed: imageResult.modelUsed
    }
  };
}

// ============== SIMPLE GENERATION (for non-pipeline use) ==============

export async function generateImageSimple(prompt: string): Promise<GeneratedImageResult> {
  console.log("[Simple Generation] Generating image without pipeline...");
  
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL_TEXT,
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

  return {
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
    textResponse: candidate?.content?.parts?.find((part: any) => part.text)?.text
  };
}

// ============== PROMPT ENHANCEMENT (standalone) ==============

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: STYLE_MODEL,
      config: {
        systemInstruction: "You are a prompt enhancement expert. Improve the given prompt with more vivid, detailed descriptions while keeping the core concept. Return only the enhanced prompt, nothing else.",
        temperature: 0.7,
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || prompt;
  } catch (error: any) {
    console.error("[Enhance Prompt] Error:", error.message);
    return prompt;
  }
}
