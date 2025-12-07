/**
 * GEMINI-POWERED BACKGROUND REMOVAL SERVICE
 * Production-level background removal using Alpha Mask approach
 * 
 * Architecture:
 * 1. AI generates a black/white alpha mask (white = subject, black = background)
 * 2. Server applies mask to original image using Sharp for true transparency
 */

import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import type {
  BackgroundRemovalOptions,
  BackgroundRemovalResult,
  BackgroundRemovalJob,
  BackgroundOutputType,
  BackgroundRemovalQuality,
  BackgroundRemovalJobStatus
} from "@shared/mockupTypes";

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY || ""
});

const MODELS = {
  IMAGE_GENERATION: "gemini-2.0-flash-exp",
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

async function applyAlphaMask(
  originalBase64: string,
  maskBase64: string
): Promise<string> {
  console.log('applyAlphaMask: Starting composite operation...');
  
  const originalBuffer = Buffer.from(originalBase64, 'base64');
  const maskBuffer = Buffer.from(maskBase64, 'base64');
  
  const originalImage = sharp(originalBuffer);
  const maskImage = sharp(maskBuffer);
  
  const originalMeta = await originalImage.metadata();
  const maskMeta = await maskImage.metadata();
  
  console.log(`applyAlphaMask: Original ${originalMeta.width}x${originalMeta.height}, Mask ${maskMeta.width}x${maskMeta.height}`);
  
  const targetWidth = originalMeta.width!;
  const targetHeight = originalMeta.height!;
  
  const resizedMask = await sharp(maskBuffer)
    .resize(targetWidth, targetHeight, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();
  
  const originalRaw = await sharp(originalBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer();
  
  const resultPixels = new Uint8Array(targetWidth * targetHeight * 4);
  
  for (let i = 0; i < targetWidth * targetHeight; i++) {
    const srcIdx = i * 4;
    const maskIdx = i;
    
    resultPixels[srcIdx] = originalRaw[srcIdx];
    resultPixels[srcIdx + 1] = originalRaw[srcIdx + 1];
    resultPixels[srcIdx + 2] = originalRaw[srcIdx + 2];
    resultPixels[srcIdx + 3] = resizedMask[maskIdx];
  }
  
  const transparentPixels = Array.from(resultPixels).filter((_, i) => i % 4 === 3 && resultPixels[i] === 0).length;
  console.log(`applyAlphaMask: ${transparentPixels}/${targetWidth * targetHeight} pixels made transparent`);
  
  const result = await sharp(resultPixels, {
    raw: {
      width: targetWidth,
      height: targetHeight,
      channels: 4
    }
  })
    .png()
    .toBuffer();
  
  console.log('applyAlphaMask: Composite complete');
  return result.toString('base64');
}

function buildAlphaMaskPrompt(
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

  const masterPrompt = `You are a professional image segmentation AI. Generate a precise ALPHA MASK for this image.

===== TASK: GENERATE ALPHA MASK =====

Create a BLACK AND WHITE alpha mask image where:
- WHITE (RGB 255,255,255) = The main subject/foreground (what to KEEP)
- BLACK (RGB 0,0,0) = The background (what to REMOVE)
- GRAY values = Semi-transparent areas (for soft edges, hair, fur, glass)

OUTPUT REQUIREMENTS:
- Output format: Grayscale PNG image
- Same dimensions as the input image
- Pure white for definite foreground areas
- Pure black for definite background areas
- Smooth gray gradients at edges for natural transitions
- Quality level: ${qualitySetting.detail} detail with ${qualitySetting.precision}

===== EDGE DETECTION & PRECISION =====

CRITICAL - Handle these with pixel-perfect accuracy:
1. HAIR & FUR: Use gray values for individual strands and wisps
2. SEMI-TRANSPARENT: Glass, smoke, sheer fabric should use appropriate gray levels
3. COMPLEX BOUNDARIES: Fingers, leaves, intricate patterns need precise masks
4. MICRO-DETAILS: Eyelashes, whiskers need proper gray anti-aliasing

EDGE QUALITY:
- ${featheringDesc}
- Smooth anti-aliased edges using gray gradients
- No harsh binary cutoffs at complex edges
- Natural transitions from white to black

===== MASK QUALITY CHECKLIST =====

✓ Main subject is completely white
✓ Background is completely black
✓ Edges have appropriate gray anti-aliasing
✓ Fine details (hair, fur) show gray gradations
✓ No holes or gaps in the subject mask
✓ No missed background areas (all black)
✓ Professional-grade segmentation quality`;

  const negativePrompts = [
    "colored output",
    "RGB colors in mask",
    "incomplete mask",
    "holes in subject",
    "background leakage",
    "harsh binary edges",
    "missing fine details",
    "inverted mask"
  ];

  return { prompt: masterPrompt, negativePrompts };
}

function buildBackgroundReplacementPrompt(
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

    default:
      outputSpecificPrompt = `Remove the background completely and replace with pure white (#FFFFFF).`;
      technicalRequirements = `Background color: Exact #FFFFFF`;
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

async function generateAlphaMask(
  imageBase64: string,
  options: BackgroundRemovalOptions
): Promise<string> {
  const { prompt, negativePrompts } = buildAlphaMaskPrompt(options);
  const fullPrompt = `${prompt}\n\nAVOID: ${negativePrompts.join(", ")}`;

  console.log('generateAlphaMask: Requesting mask from AI...');

  const response = await genAI.models.generateContent({
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

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('No response candidates from AI model');
  }

  const content = candidates[0].content;
  if (!content || !content.parts) {
    throw new Error('No content in AI response');
  }

  for (const part of content.parts) {
    if (part.inlineData && part.inlineData.data) {
      console.log('generateAlphaMask: Received mask from AI');
      return part.inlineData.data;
    }
  }

  throw new Error('No image data in AI response');
}

async function generateBackgroundReplacement(
  imageBase64: string,
  options: BackgroundRemovalOptions
): Promise<string> {
  const { prompt, negativePrompts } = buildBackgroundReplacementPrompt(options);
  const fullPrompt = `${prompt}\n\nAVOID: ${negativePrompts.join(", ")}`;

  console.log(`generateBackgroundReplacement: Requesting ${options.outputType} background...`);

  const response = await genAI.models.generateContent({
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

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('No response candidates from AI model');
  }

  const content = candidates[0].content;
  if (!content || !content.parts) {
    throw new Error('No content in AI response');
  }

  for (const part of content.parts) {
    if (part.inlineData && part.inlineData.data) {
      console.log('generateBackgroundReplacement: Received result from AI');
      return part.inlineData.data;
    }
  }

  throw new Error('No image data in AI response');
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

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < GENERATION_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Background removal timed out')),
          GENERATION_CONFIG.JOB_TIMEOUT_MS
        );
      });

      let resultImageData: string;

      if (normalizedOptions.outputType === 'transparent') {
        console.log('Using Alpha Mask approach for transparent background...');
        
        const maskPromise = (async () => {
          const maskData = await generateAlphaMask(imageBase64, normalizedOptions);
          const transparentImage = await applyAlphaMask(imageBase64, maskData);
          return transparentImage;
        })();
        
        resultImageData = await Promise.race([maskPromise, timeoutPromise]);
      } else {
        console.log(`Using direct replacement for ${normalizedOptions.outputType} background...`);
        
        const replacementPromise = generateBackgroundReplacement(imageBase64, normalizedOptions);
        resultImageData = await Promise.race([replacementPromise, timeoutPromise]);
      }

      return {
        success: true,
        imageData: resultImageData,
        mimeType: 'image/png',
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
    
    if (result.success && result.imageData) {
      updatedJob.status = 'completed';
      updatedJob.result = result;
      updatedJob.completedAt = Date.now();
    } else {
      throw new Error(result.error || 'Unknown error during processing');
    }
  } catch (error) {
    updatedJob.retryCount++;
    
    if (updatedJob.retryCount >= updatedJob.maxRetries) {
      updatedJob.status = 'failed';
      updatedJob.error = error instanceof Error ? error.message : String(error);
      updatedJob.completedAt = Date.now();
    } else {
      updatedJob.status = 'pending';
    }
  }

  return updatedJob;
}

export function getJobStatus(job: BackgroundRemovalJob): {
  id: string;
  status: BackgroundRemovalJobStatus;
  progress: number;
  result?: BackgroundRemovalResult;
  error?: string;
} {
  let progress = 0;
  
  switch (job.status) {
    case 'pending':
      progress = 0;
      break;
    case 'processing':
      progress = 50;
      break;
    case 'completed':
      progress = 100;
      break;
    case 'failed':
      progress = 100;
      break;
  }

  return {
    id: job.id,
    status: job.status,
    progress,
    result: job.result,
    error: job.error
  };
}

export function getDefaultBackgroundRemovalOptions(): BackgroundRemovalOptions {
  return {
    outputType: 'transparent',
    edgeFeathering: 2,
    quality: 'high'
  };
}

export function validateBackgroundRemovalOptions(
  options: Partial<BackgroundRemovalOptions>
): BackgroundRemovalOptions {
  const validOutputTypes: BackgroundOutputType[] = ['transparent', 'white', 'color', 'blur'];
  const validQualities: BackgroundRemovalQuality[] = ['standard', 'high', 'ultra'];

  return {
    outputType: validOutputTypes.includes(options.outputType as BackgroundOutputType) 
      ? options.outputType as BackgroundOutputType 
      : 'transparent',
    customColor: options.customColor,
    edgeFeathering: typeof options.edgeFeathering === 'number' 
      ? Math.max(0, Math.min(10, options.edgeFeathering)) 
      : 2,
    quality: validQualities.includes(options.quality as BackgroundRemovalQuality) 
      ? options.quality as BackgroundRemovalQuality 
      : 'high'
  };
}

export async function removeBackgroundBatch(
  images: Array<{ id: string; base64: string }>,
  options: BackgroundRemovalOptions
): Promise<Array<{ id: string; result: BackgroundRemovalResult }>> {
  const results: Array<{ id: string; result: BackgroundRemovalResult }> = [];

  for (const image of images) {
    try {
      const result = await removeBackground(image.base64, options);
      results.push({ id: image.id, result });
    } catch (error) {
      results.push({
        id: image.id,
        result: {
          success: false,
          mimeType: 'image/png',
          processingTimeMs: 0,
          outputType: options.outputType,
          quality: options.quality,
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }

  return results;
}
