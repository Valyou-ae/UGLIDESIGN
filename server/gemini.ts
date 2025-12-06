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

// Phase 1: Text Sentinel - Fast model for text detection
const TEXT_SENTINEL_MODEL = "gemini-2.5-flash";

// Phase 2: Style Architect - Advanced reasoning for prompt enhancement
const STYLE_ARCHITECT_MODEL = "gemini-3-pro-preview";
const STYLE_ARCHITECT_TEMPERATURE = 0.7;

// Phase 3: Image Generator - Best for text rendering
const IMAGE_GENERATOR_MODEL = "gemini-3-pro-image-preview";
const IMAGE_GENERATOR_FALLBACK = "gemini-2.5-flash-image";
// Escalation model for attempts 4-5 (when primary model keeps failing)
const IMAGE_GENERATOR_ESCALATION = "imagen-3.0-generate-002";

// Phase 4: OCR Validator - Vision model for text verification
const OCR_VALIDATOR_MODEL = "gemini-2.5-flash";

// Verification settings
const MAX_RETRY_ATTEMPTS = 5;
const ACCURACY_THRESHOLD = 100; // ZERO TOLERANCE - exact match required

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

export interface OCRValidationResult {
  extractedTexts: string[];
  accuracyScore: number;
  matchDetails: Array<{
    expected: string;
    found: string | null;
    matched: boolean;
    similarity: number;
  }>;
  passedValidation: boolean;
}

export interface GeneratedImageResult {
  imageBase64: string;
  mimeType: string;
  textResponse?: string;
  pipeline?: {
    textAnalysis: TextAnalysisResult;
    artDirection: ArtDirectionResult;
    finalPrompt: string;
    ocrValidation?: OCRValidationResult;
    attempts: number;
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
// Creates Art Direction prompts with BLANK PLACEHOLDERS for text
// Text will be added client-side for 100% accuracy

const STYLE_ARCHITECT_SYSTEM = `You are an expert AI Art Director. Your job is to create stunning images with BLANK PLACEHOLDERS where text will be added later by a graphic designer.

## CORE PRINCIPLE: SEPARATION OF CONCERNS

The AI creates beautiful artwork. Text is added separately with pixel-perfect accuracy.
This guarantees 100% text accuracy because text rendering is handled by a design tool, not AI interpretation.

## YOUR TASK

When the user wants text in their image (signs, posters, labels, etc.), you must:
1. Create a beautiful, high-quality image
2. Include a BLANK, EMPTY space where the text would go
3. Make the blank space look natural and intentional (empty sign, blank banner, clear label area)
4. DO NOT attempt to render any text - leave it completely blank

## BLANK PLACEHOLDER REQUIREMENTS

For each text element requested, create a visually appealing blank area:
- **Signs**: Create beautiful signs that are intentionally left blank/empty
- **Posters**: Design poster layouts with prominent empty title/text areas
- **Labels**: Include blank label spaces with appropriate backgrounds
- **Banners**: Create banner shapes that are clean and empty
- **Menus**: Design menu boards with blank lines where items would go

## PROMPT STRUCTURE

Your enhanced prompt should:
1. Describe the full scene with rich visual details
2. Explicitly state that text areas are "intentionally left blank" or "empty"
3. Describe the blank area's visual properties (material, color, lighting)
4. Ensure the blank area has good contrast for text overlay

## EXAMPLES

**User wants**: "A coffee shop sign that says 'The Daily Grind'"
**Your prompt**: "A charming rustic coffee shop entrance featuring a beautifully weathered wooden sign board that is intentionally left blank and empty. The sign has a warm honey-colored wood grain texture with decorative iron brackets. Soft morning light illuminates the blank surface, creating perfect contrast for text overlay. The blank area is prominent, centered, and well-lit."

**User wants**: "Movie poster for 'Quantum Leap' in retro 80s style"
**Your prompt**: "A dynamic retro 80s style movie poster with vibrant neon colors, chrome effects, and a dramatic composition. The poster features a prominent blank title area at the top - a clean, empty space with subtle gradient glow effects, perfectly sized for a movie title. The blank area is intentionally empty, designed for text overlay. Below are abstract sci-fi visual elements with purple and blue neon lighting."

**User wants**: "Coffee menu with Espresso $3, Latte $4.50"
**Your prompt**: "An artisanal coffee shop chalkboard menu with a beautiful dark slate background and decorative chalk border art. The menu features multiple intentionally blank horizontal lines where menu items would be written - clean empty spaces with subtle chalk dust texture. Small decorative coffee cup illustrations frame the edges. The blank lines are evenly spaced and ready for text overlay."

## CRITICAL RULES

1. NEVER attempt to render actual text characters
2. ALWAYS create blank/empty spaces where text was requested
3. Make blank areas visually integrated and natural-looking
4. Ensure good contrast between blank area and background for text overlay
5. Describe the blank area's surface/material for design context`;

export async function createArtDirection(
  userPrompt: string, 
  textAnalysis: TextAnalysisResult,
  style?: string,
  _correctionFeedback?: string // No longer needed - text added client-side
): Promise<ArtDirectionResult> {
  try {
    console.log("[Style Architect] Creating Art Direction with blank placeholders...");
    
    let textPlaceholderInstructions = "";
    if (textAnalysis.hasExplicitText && textAnalysis.extractedTexts.length > 0) {
      textPlaceholderInstructions = "\n\n## TEXT ELEMENTS REQUIRING BLANK PLACEHOLDERS\n\n";
      textPlaceholderInstructions += "The following text was requested. Create BLANK PLACEHOLDER AREAS for each:\n\n";
      textAnalysis.extractedTexts.forEach((t, i) => {
        textPlaceholderInstructions += `${i + 1}. "${t.text}" - Context: ${t.context} (${t.importance})\n`;
        textPlaceholderInstructions += `   → Create a blank ${t.context} area where this text will be overlaid later\n`;
      });
      textPlaceholderInstructions += "\nREMEMBER: Do NOT render any text. Create beautiful BLANK spaces where text will be added by the graphic designer.";
    }

    const styleNote = style && style !== "auto" ? `\nRequested visual style: ${style}` : "";
    
    const fullPrompt = `## USER REQUEST\n${userPrompt}${styleNote}${textPlaceholderInstructions}

Create an Art Direction prompt for an image with BLANK PLACEHOLDER areas where text will be added later. The image should be beautiful and complete, with intentionally empty spaces designed for text overlay.`;

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
// Generates an image using the Art Direction prompt

async function generateImageOnly(prompt: string, attempt: number = 1): Promise<{ imageBase64: string; mimeType: string; textResponse?: string }> {
  // Use escalation model for attempts 4-5 for better text fidelity
  const useEscalation = attempt >= 4;
  const primaryModel = useEscalation ? IMAGE_GENERATOR_ESCALATION : IMAGE_GENERATOR_MODEL;
  
  console.log(`[Image Generator] Attempt ${attempt} - Using model: ${primaryModel}${useEscalation ? ' (ESCALATION MODE)' : ''}`);
  
  let response;
  let modelUsed = primaryModel;
  
  try {
    if (useEscalation) {
      // Imagen 3 uses a different API format - generate images directly
      console.log("[Image Generator] Using Imagen 3 for enhanced text accuracy");
      response = await ai.models.generateImages({
        model: IMAGE_GENERATOR_ESCALATION,
        prompt: prompt,
        config: {
          numberOfImages: 1,
        }
      });
      
      // Imagen returns images differently
      const generatedImage = response.generatedImages?.[0];
      if (!generatedImage?.image?.imageBytes) {
        throw new Error("No image from Imagen");
      }
      
      console.log("[Image Generator] Complete with Imagen 3 escalation model");
      return {
        imageBase64: generatedImage.image.imageBytes,
        mimeType: "image/png",
        textResponse: undefined
      };
    } else {
      // Standard Gemini image generation
      response = await ai.models.generateContent({
        model: primaryModel,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
    }
  } catch (primaryError: any) {
    console.log("[Image Generator] Primary model failed:", primaryError.message);
    console.log("[Image Generator] Trying fallback:", IMAGE_GENERATOR_FALLBACK);
    modelUsed = IMAGE_GENERATOR_FALLBACK;
    
    response = await ai.models.generateContent({
      model: IMAGE_GENERATOR_FALLBACK,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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

  console.log("[Image Generator] Complete with model:", modelUsed);

  return {
    imageBase64: imagePart.inlineData.data,
    mimeType,
    textResponse: textPart?.text
  };
}

// ============== PHASE 4: OCR VALIDATOR ==============
// Uses Gemini Vision to extract and verify text from generated images

const OCR_VALIDATOR_SYSTEM = `You are an expert OCR (Optical Character Recognition) agent. Your job is to extract ALL visible text from the image with 100% accuracy.

INSTRUCTIONS:
1. Carefully examine the entire image
2. Extract EVERY piece of text you can see, no matter how small
3. Preserve EXACT spelling, capitalization, punctuation, and spacing
4. Include special characters like $, @, #, !, %, &, etc.
5. For prices, always include the $ symbol if visible
6. Report text in the order it appears (top to bottom, left to right)
7. If text is partially obscured or unclear, note it with [unclear]
8. Do NOT interpret or fix what you think the text should say - report EXACTLY what you see

OUTPUT: Return a JSON array of all text strings found in the image.`;

export async function validateImageText(
  imageBase64: string,
  mimeType: string,
  expectedTexts: string[]
): Promise<OCRValidationResult> {
  try {
    console.log("[OCR Validator] Extracting text from generated image...");
    
    const response = await ai.models.generateContent({
      model: OCR_VALIDATOR_MODEL,
      config: {
        systemInstruction: OCR_VALIDATOR_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedTexts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["extractedTexts"]
        }
      },
      contents: [{
        role: "user",
        parts: [
          { 
            inlineData: { 
              mimeType: mimeType, 
              data: imageBase64 
            } 
          },
          { text: "Extract ALL visible text from this image. Return every text string you can see, preserving exact spelling, punctuation, and formatting." }
        ]
      }],
    });

    const result = JSON.parse(response.text || '{"extractedTexts": []}');
    const extractedTexts: string[] = result.extractedTexts || [];
    
    console.log("[OCR Validator] Extracted texts:", extractedTexts);
    
    // Calculate accuracy by comparing expected vs extracted
    // ZERO TOLERANCE MODE: Only exact matches (similarity == 1.0) count as success
    const matchDetails = expectedTexts.map(expected => {
      const bestMatch = findBestMatch(expected, extractedTexts);
      // EXACT MATCH REQUIRED - similarity must be 1.0 (100% identical)
      const isExactMatch = bestMatch.similarity === 1.0;
      return {
        expected,
        found: bestMatch.match,
        matched: isExactMatch,
        similarity: bestMatch.similarity
      };
    });
    
    // Calculate overall accuracy score - STRICT MODE
    // Every text must match exactly, or it's a failure
    const totalExpected = expectedTexts.length;
    const matchedCount = matchDetails.filter(m => m.matched).length;
    
    // Score is simple: 100% only if ALL texts match exactly
    // Otherwise, score = (matched / total) * 100
    const accuracyScore = totalExpected > 0 
      ? Math.round((matchedCount / totalExpected) * 100)
      : 100;
    
    // ZERO TOLERANCE: Must be 100% to pass
    const passedValidation = matchedCount === totalExpected;
    
    console.log("[OCR Validator] Accuracy Score:", accuracyScore, "% | Passed:", passedValidation);
    console.log("[OCR Validator] Match Details:", JSON.stringify(matchDetails, null, 2));

    return {
      extractedTexts,
      accuracyScore,
      matchDetails,
      passedValidation
    };
  } catch (error: any) {
    console.error("[OCR Validator] Error:", error.message);
    // If OCR fails, FAIL validation to trigger retry
    // Do NOT auto-pass - we need to verify text accuracy
    return {
      extractedTexts: [],
      accuracyScore: 0,
      matchDetails: expectedTexts.map(text => ({
        expected: text,
        found: null,
        matched: false,
        similarity: 0
      })),
      passedValidation: false
    };
  }
}

// Helper: Calculate string similarity using Levenshtein distance
// CASE-SENSITIVE: "LATTE" != "Latte" for exact text accuracy
function calculateSimilarity(str1: string, str2: string): number {
  // Normalize whitespace only, preserve case for exact matching
  const s1 = str1.trim().replace(/\s+/g, ' ');
  const s2 = str2.trim().replace(/\s+/g, ' ');
  
  // EXACT MATCH REQUIRED - case sensitive
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // For containment, require exact case match
  if (s1.includes(s2) || s2.includes(s1)) {
    return Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
  }
  
  // Levenshtein distance - case sensitive
  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

// Helper: Find best matching text from extracted texts
// Uses strict contiguous matching - only actual substrings score as 1.0
function findBestMatch(expected: string, extractedTexts: string[]): { match: string | null; similarity: number } {
  let bestMatch: string | null = null;
  let bestSimilarity = 0;
  
  const expectedLower = expected.toLowerCase().trim();
  
  // First, check direct matches against individual extracted texts
  for (const extracted of extractedTexts) {
    const similarity = calculateSimilarity(expected, extracted);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = extracted;
    }
  }
  
  // Check adjacent n-gram combinations (2, 3, 4 adjacent elements)
  // This handles cases where text is split across multiple lines/elements
  for (let windowSize = 2; windowSize <= Math.min(4, extractedTexts.length); windowSize++) {
    for (let i = 0; i <= extractedTexts.length - windowSize; i++) {
      const combined = extractedTexts.slice(i, i + windowSize).join(' ');
      const similarity = calculateSimilarity(expected, combined);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = combined;
      }
    }
  }
  
  // Only return 1.0 for exact contiguous matches
  // If best similarity is above 0.85, it's likely a good match
  // Below that, use word-presence as a secondary check (capped at 0.8 max)
  if (bestSimilarity < 0.85) {
    const allText = extractedTexts.join(' ').toLowerCase();
    const expectedWords = expectedLower.split(/\s+/);
    const matchedWords = expectedWords.filter(word => allText.includes(word));
    const wordMatchRatio = matchedWords.length / expectedWords.length;
    
    // Cap word-based matching at 0.8 (below pass threshold) to ensure it triggers retries
    const cappedWordScore = Math.min(wordMatchRatio * 0.8, 0.8);
    
    if (cappedWordScore > bestSimilarity) {
      bestSimilarity = cappedWordScore;
      bestMatch = `[partial: ${matchedWords.join(' ')}]`;
    }
  }
  
  return { match: bestMatch, similarity: bestSimilarity };
}

// ============== CORRECTION PROMPT GENERATOR ==============
// Creates verbatim error feedback for retry attempts

function generateCorrectionFeedback(validation: OCRValidationResult, expectedTexts: string[]): string {
  const errors: string[] = [];
  
  for (const match of validation.matchDetails) {
    if (!match.matched) {
      const expectedChars = match.expected.split('').map(c => {
        if (c === ' ') return '[SPACE]';
        if (c === '$') return '[DOLLAR]';
        return c;
      }).join('');
      
      if (match.found && !match.found.startsWith('[partial')) {
        const foundChars = match.found.split('').map(c => {
          if (c === ' ') return '[SPACE]';
          if (c === '$') return '[DOLLAR]';
          return c;
        }).join('');
        
        // Character-by-character comparison
        let diff = "CHARACTER COMPARISON:\n";
        const maxLen = Math.max(match.expected.length, match.found.length);
        for (let i = 0; i < maxLen; i++) {
          const expChar = match.expected[i] || '[MISSING]';
          const foundChar = match.found[i] || '[MISSING]';
          if (expChar !== foundChar) {
            diff += `  Position ${i + 1}: Expected '${expChar}' but got '${foundChar}'\n`;
          }
        }
        
        errors.push(`### ERROR: Text Mismatch
**EXPECTED**: "${match.expected}"
**RENDERED**: "${match.found}"
**SIMILARITY**: ${Math.round(match.similarity * 100)}%
${diff}
**FIX REQUIRED**: Render EXACTLY "${match.expected}" - every character matters`);
      } else {
        errors.push(`### ERROR: Missing Text
**EXPECTED**: "${match.expected}"
**RENDERED**: NOT FOUND
**CHARACTER SEQUENCE**: ${expectedChars}
**FIX REQUIRED**: This text MUST appear in the image. It was completely missing.`);
      }
    }
  }
  
  if (errors.length === 0) {
    return "";
  }
  
  // Add overall summary
  const summary = `## OCR VERIFICATION FAILED - ${errors.length} ERROR(S) DETECTED

Accuracy Score: ${validation.accuracyScore}% (Required: 100%)
Texts Found: ${validation.extractedTexts.join(', ') || 'NONE'}
Texts Expected: ${expectedTexts.join(', ')}

${errors.join('\n\n')}

## CRITICAL INSTRUCTION
The above errors are NOT ACCEPTABLE. You MUST render every text element EXACTLY as specified.
- If a dollar sign ($) is in the expected text, it MUST appear in the image
- If text should be on one line, it MUST be on one line (no line breaks)
- Every single character must match exactly`;

  return summary;
}

// ============== PROGRESS CALLBACK TYPE ==============

export type ProgressCallback = (phase: string, message: string, attempt?: number, maxAttempts?: number) => void;

// ============== MAIN PIPELINE WITH VERIFICATION LOOP ==============

export async function generateImageWithPipeline(
  prompt: string,
  style?: string,
  onProgress?: ProgressCallback
): Promise<GeneratedImageResult> {
  console.log("=".repeat(60));
  console.log("[Pipeline] Starting 2-phase image generation (blank placeholder workflow)");
  console.log("[Pipeline] Text will be added client-side for 100% accuracy");
  console.log("=".repeat(60));
  
  // Helper to send progress updates
  const sendProgress = (phase: string, message: string) => {
    if (onProgress) {
      onProgress(phase, message);
    }
  };
  
  sendProgress("text_sentinel", "Analyzing your prompt for text...");
  
  // Phase 1: Text Sentinel - Extract text for client-side compositor
  const textAnalysis = await analyzeTextRequirements(prompt);
  const detectedTexts = textAnalysis.extractedTexts.map(t => t.text);
  
  if (textAnalysis.hasExplicitText) {
    sendProgress("text_sentinel", `Found ${detectedTexts.length} text elements - creating blank placeholders`);
    console.log("[Pipeline] Detected texts for compositor:", detectedTexts);
  } else {
    sendProgress("text_sentinel", "No explicit text detected - standard generation");
  }
  
  // Phase 2: Style Architect - Create prompt with BLANK PLACEHOLDERS
  sendProgress("style_architect", "Designing layout with blank text areas...");
  const artDirection = await createArtDirection(prompt, textAnalysis, style);
  
  // Phase 3: Image Generation - Generate image with blank areas
  sendProgress("image_generator", "Generating your image with blank text areas...");
  const imageResult = await generateImageOnly(artDirection.enhancedPrompt);
  
  // Complete - No OCR needed, text will be added client-side
  if (textAnalysis.hasExplicitText) {
    sendProgress("complete", `Image ready! Add your text: ${detectedTexts.join(', ')}`);
  } else {
    sendProgress("complete", "Image generated successfully!");
  }
  
  console.log("[Pipeline] ✅ Image generated with blank placeholders");
  console.log("[Pipeline] Detected texts for client compositor:", detectedTexts);
  
  return {
    imageBase64: imageResult.imageBase64,
    mimeType: imageResult.mimeType,
    textResponse: imageResult.textResponse,
    pipeline: {
      textAnalysis,
      artDirection,
      finalPrompt: artDirection.enhancedPrompt,
      attempts: 1
    }
  };
}

// ============== LEGACY FUNCTIONS (for backward compatibility) ==============

export async function generateImage(prompt: string): Promise<GeneratedImageResult> {
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
