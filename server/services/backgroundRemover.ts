/**
 * GEMINI-POWERED BACKGROUND REMOVAL SERVICE
 * Production-level background removal with AI-powered edge detection
 */

import { GoogleGenAI, Modality } from "@google/genai";
import type {
  BackgroundRemovalOptions,
  BackgroundRemovalResult,
  BackgroundRemovalJob,
  BackgroundOutputType,
  BackgroundRemovalQuality,
  BackgroundRemovalJobStatus
} from "@shared/mockupTypes";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MODELS = {
  IMAGE_GENERATION: "gemini-3-pro-image-preview",
} as const;

const GENERATION_CONFIG = {
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  JOB_TIMEOUT_MS: 120000,
};

const QUALITY_SETTINGS: Record<BackgroundRemovalQuality, { detail: string; precision: string }> = {
  standard: {
    detail: "good",
    precision: "balanced speed and quality"
  },
  high: {
    detail: "excellent",
    precision: "high precision edge detection with careful attention to fine details"
  },
  ultra: {
    detail: "exceptional",
    precision: "ultra-precise sub-pixel edge detection with perfect preservation of semi-transparent edges, individual hair strands, and micro-details"
  }
};

function buildBackgroundRemovalPrompt(
  options: BackgroundRemovalOptions
): { prompt: string; negativePrompts: string[] } {
  const qualitySetting = QUALITY_SETTINGS[options.quality];
  const featheringDesc = options.edgeFeathering === 0 
    ? "sharp, crisp edges with no feathering"
    : options.edgeFeathering <= 3
    ? `subtle ${options.edgeFeathering}px edge feathering for natural transitions`
    : options.edgeFeathering <= 6
    ? `moderate ${options.edgeFeathering}px edge feathering for smooth, professional blending`
    : `pronounced ${options.edgeFeathering}px edge feathering for soft, dreamy transitions`;

  let outputSpecificPrompt = "";
  let technicalRequirements = "";

  switch (options.outputType) {
    case 'transparent':
      outputSpecificPrompt = `Remove the background completely and replace with full transparency (alpha channel = 0).
      
OUTPUT REQUIREMENTS:
- Output format: PNG with alpha transparency channel
- Background: Completely transparent (invisible/checkered pattern appearance)
- Subject: Fully preserved with original colors and details
- Edge handling: ${featheringDesc}
- Semi-transparent elements: Preserve opacity gradients in hair wisps, fabric edges, glass, smoke, etc.`;
      technicalRequirements = `
TRANSPARENCY TECHNICAL SPECS:
- Generate true RGBA image with alpha channel
- Background alpha: 0 (fully transparent)
- Subject alpha: 255 (fully opaque) except for naturally semi-transparent edges
- Preserve partial transparency in hair strands, fur, and delicate edges
- Anti-aliasing: Apply to subject edges for smooth compositing`;
      break;

    case 'white':
      outputSpecificPrompt = `Remove the background completely and replace with pure white (#FFFFFF).
      
OUTPUT REQUIREMENTS:
- Output format: High-quality image
- Background: Pure white (#FFFFFF, RGB 255,255,255)
- Subject: Fully preserved with original colors and details
- Edge handling: ${featheringDesc}
- Professional e-commerce quality with clean, uniform white background`;
      technicalRequirements = `
WHITE BACKGROUND TECHNICAL SPECS:
- Background color: Exact #FFFFFF with no color variation
- No shadows on background (unless specifically requested)
- Subject edges blend naturally with white
- Suitable for product photography and e-commerce listings
- Color-accurate subject preservation`;
      break;

    case 'color':
      const customColor = options.customColor || '#FFFFFF';
      outputSpecificPrompt = `Remove the background completely and replace with solid color ${customColor}.
      
OUTPUT REQUIREMENTS:
- Output format: High-quality image
- Background: Solid ${customColor} color, uniform throughout
- Subject: Fully preserved with original colors and details
- Edge handling: ${featheringDesc}
- Clean, professional result suitable for branding and marketing`;
      technicalRequirements = `
CUSTOM COLOR BACKGROUND TECHNICAL SPECS:
- Background color: Exact ${customColor} with no gradients or variations
- Uniform color coverage across entire background
- Subject edges blend naturally with the new background color
- Maintain subject color accuracy (no color contamination from background)
- Consider complementary color harmony`;
      break;

    case 'blur':
      outputSpecificPrompt = `Keep the main subject in sharp focus while applying a professional gaussian blur to the background.
      
OUTPUT REQUIREMENTS:
- Output format: High-quality image
- Background: Strong gaussian blur (bokeh-like depth of field effect)
- Subject: Crystal clear, sharp focus with original details preserved
- Edge handling: ${featheringDesc} - critical for natural blur transition
- Creates professional depth-of-field photography effect`;
      technicalRequirements = `
BLUR BACKGROUND TECHNICAL SPECS:
- Subject focus: 100% sharp with no blur contamination
- Background blur: Strong gaussian blur simulating f/1.4-f/2.8 depth of field
- Blur intensity: Professional portrait-quality bokeh
- Edge transition: Gradual blur transition at subject edges for realism
- Preserve any highlights in background as soft bokeh circles
- Maintain original background colors (just blurred)`;
      break;
  }

  const masterPrompt = `You are a professional image editor specializing in background removal and replacement. Process this image with ${qualitySetting.detail} detail and ${qualitySetting.precision}.

===== TASK: BACKGROUND REMOVAL/REPLACEMENT =====

${outputSpecificPrompt}

===== EDGE DETECTION & PRESERVATION =====

CRITICAL - Preserve these fine details with pixel-perfect accuracy:
1. HAIR & FUR: Individual strands, wisps, flyaways, and fine textures
2. FABRIC EDGES: Thread details, frayed edges, and textile boundaries  
3. SEMI-TRANSPARENT ELEMENTS: Glass, smoke, water spray, sheer fabrics
4. COMPLEX BOUNDARIES: Fingers, leaves, intricate patterns, jewelry
5. MICRO-DETAILS: Eyelashes, whiskers, delicate accessories

EDGE QUALITY REQUIREMENTS:
- No harsh cutout artifacts or jaggy edges
- Natural anti-aliasing on all subject boundaries
- Preserve color fringing at edges (natural light diffraction)
- ${featheringDesc}

${technicalRequirements}

===== SUBJECT PRESERVATION =====

MUST PRESERVE EXACTLY:
- Original subject colors, brightness, and contrast
- All textures and surface details
- Lighting and shadows ON the subject
- Reflections and highlights on the subject
- Natural skin tones (if applicable)
- Product details (if applicable)

===== QUALITY ASSURANCE =====

VERIFICATION CHECKLIST:
✓ Subject completely intact with no missing parts
✓ No background remnants or "halo" artifacts around edges
✓ Smooth, natural-looking edge transitions
✓ Consistent quality across all edges of the subject
✓ Professional-grade output suitable for commercial use`;

  const negativePrompts = [
    "halo artifacts",
    "jagged edges",
    "color bleeding",
    "incomplete removal",
    "missing subject parts",
    "blurry subject",
    "loss of detail",
    "harsh cutout edges",
    "background remnants",
    "color fringing artifacts",
    "pixelated edges",
    "unnatural transitions"
  ];

  return { prompt: masterPrompt, negativePrompts };
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateRetryDelay(attempt: number): number {
  const delay = GENERATION_CONFIG.BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * delay;
  return Math.min(delay + jitter, GENERATION_CONFIG.MAX_RETRY_DELAY_MS);
}

export async function removeBackground(
  imageBase64: string,
  options: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  const startTime = Date.now();

  if (!imageBase64) {
    return {
      success: false,
      mimeType: 'image/png',
      processingTimeMs: Date.now() - startTime,
      outputType: options.outputType,
      quality: options.quality,
      error: 'No image data provided'
    };
  }

  const normalizedOptions: BackgroundRemovalOptions = {
    outputType: options.outputType || 'transparent',
    customColor: options.customColor,
    edgeFeathering: Math.max(0, Math.min(10, options.edgeFeathering || 0)),
    quality: options.quality || 'high'
  };

  const { prompt, negativePrompts } = buildBackgroundRemovalPrompt(normalizedOptions);
  const fullPrompt = `${prompt}\n\nAVOID: ${negativePrompts.join(", ")}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < GENERATION_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Background removal timed out')),
          GENERATION_CONFIG.JOB_TIMEOUT_MS
        );
      });

      const generationPromise = genAI.models.generateContent({
        model: MODELS.IMAGE_GENERATION,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: "image/png"
                }
              },
              { text: fullPrompt }
            ]
          }
        ],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
      });

      const response = await Promise.race([generationPromise, timeoutPromise]);

      const candidates = response.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No response candidates from AI model');
      }

      const content = candidates[0].content;
      if (!content || !content.parts) {
        throw new Error('No content in AI response');
      }

      let resultImageData = "";
      let resultMimeType = "image/png";

      for (const part of content.parts) {
        if (part.inlineData && part.inlineData.data) {
          resultImageData = part.inlineData.data;
          resultMimeType = part.inlineData.mimeType || "image/png";
          break;
        }
      }

      if (!resultImageData) {
        throw new Error('No image data in AI response');
      }

      return {
        success: true,
        imageData: resultImageData,
        mimeType: resultMimeType,
        processingTimeMs: Date.now() - startTime,
        outputType: normalizedOptions.outputType,
        quality: normalizedOptions.quality
      };

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Background removal attempt ${attempt + 1}/${GENERATION_CONFIG.MAX_RETRIES} failed:`, lastError.message);

      if (attempt < GENERATION_CONFIG.MAX_RETRIES - 1) {
        const delay = calculateRetryDelay(attempt);
        console.log(`Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }
  }

  return {
    success: false,
    mimeType: 'image/png',
    processingTimeMs: Date.now() - startTime,
    outputType: normalizedOptions.outputType,
    quality: normalizedOptions.quality,
    error: lastError?.message || 'Background removal failed after all retries'
  };
}

export function createBackgroundRemovalJob(
  inputImage: string,
  options: BackgroundRemovalOptions
): BackgroundRemovalJob {
  return {
    id: `bgr_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    inputImage,
    options,
    status: 'pending',
    retryCount: 0,
    maxRetries: GENERATION_CONFIG.MAX_RETRIES,
    createdAt: Date.now()
  };
}

export async function processBackgroundRemovalJob(
  job: BackgroundRemovalJob
): Promise<BackgroundRemovalJob> {
  const updatedJob = { ...job };
  updatedJob.status = 'processing';
  updatedJob.startedAt = Date.now();

  try {
    const result = await removeBackground(job.inputImage, job.options);

    if (result.success) {
      updatedJob.status = 'completed';
      updatedJob.result = result;
    } else {
      if (job.retryCount < job.maxRetries - 1) {
        updatedJob.status = 'retrying';
        updatedJob.retryCount++;
        updatedJob.error = result.error;
      } else {
        updatedJob.status = 'failed';
        updatedJob.error = result.error;
        updatedJob.result = result;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (job.retryCount < job.maxRetries - 1) {
      updatedJob.status = 'retrying';
      updatedJob.retryCount++;
      updatedJob.error = errorMessage;
    } else {
      updatedJob.status = 'failed';
      updatedJob.error = errorMessage;
    }
  }

  updatedJob.completedAt = Date.now();
  return updatedJob;
}

export async function removeBackgroundBatch(
  images: Array<{ id: string; imageBase64: string }>,
  options: BackgroundRemovalOptions,
  onProgress?: (completed: number, total: number, result: { id: string; result: BackgroundRemovalResult }) => void
): Promise<Map<string, BackgroundRemovalResult>> {
  const results = new Map<string, BackgroundRemovalResult>();
  const total = images.length;
  let completed = 0;

  for (const { id, imageBase64 } of images) {
    const result = await removeBackground(imageBase64, options);
    results.set(id, result);
    completed++;

    if (onProgress) {
      onProgress(completed, total, { id, result });
    }
  }

  return results;
}

export function getDefaultBackgroundRemovalOptions(): BackgroundRemovalOptions {
  return {
    outputType: 'transparent',
    edgeFeathering: 2,
    quality: 'high'
  };
}

export function validateBackgroundRemovalOptions(options: Partial<BackgroundRemovalOptions>): BackgroundRemovalOptions {
  const validOutputTypes: BackgroundOutputType[] = ['transparent', 'white', 'color', 'blur'];
  const validQualities: BackgroundRemovalQuality[] = ['standard', 'high', 'ultra'];

  return {
    outputType: validOutputTypes.includes(options.outputType as BackgroundOutputType) 
      ? options.outputType as BackgroundOutputType
      : 'transparent',
    customColor: options.outputType === 'color' && options.customColor 
      ? options.customColor 
      : undefined,
    edgeFeathering: typeof options.edgeFeathering === 'number' 
      ? Math.max(0, Math.min(10, options.edgeFeathering)) 
      : 2,
    quality: validQualities.includes(options.quality as BackgroundRemovalQuality)
      ? options.quality as BackgroundRemovalQuality
      : 'high'
  };
}
