import { DetectedTextInfo, PromptAnalysis, ImageQualityScores, QualityLevel, GeneratedImage, TextStyleIntent } from '../types';
import { REFINER_PRESETS } from "./refinerService";

export const STYLE_PRESETS: Record<string, { name: string; description: string; isPhotorealistic?: boolean }> = {
  auto: { name: 'Auto', description: 'Automatic style detection' },
  cinematic: { name: 'Cinematic', description: 'Hollywood movie-grade visuals' },
  photorealistic: { name: 'Photorealistic', description: 'Ultra-realistic photography', isPhotorealistic: true },
  editorial: { name: 'Editorial', description: 'Magazine-quality photography', isPhotorealistic: true },
  portrait: { name: 'Portrait', description: 'Professional portrait photography', isPhotorealistic: true },
  landscape: { name: 'Landscape', description: 'Epic landscape photography', isPhotorealistic: true },
  product: { name: 'Product', description: 'Commercial product photography', isPhotorealistic: true },
  artistic: { name: 'Artistic', description: 'Fine art and painterly styles' },
  anime: { name: 'Anime', description: 'Japanese animation style' },
  fantasy: { name: 'Fantasy', description: 'Fantasy and magical themes' },
  scifi: { name: 'Sci-Fi', description: 'Science fiction aesthetics' },
  vintage: { name: 'Vintage', description: 'Retro and nostalgic looks' },
  minimalist: { name: 'Minimalist', description: 'Clean and simple designs' },
};

export const QUALITY_PRESETS: Record<QualityLevel, { name: string; description: string; thinkingBudget: number; maxWords: number }> = {
  draft: { name: 'Draft', description: 'Quick preview generation', thinkingBudget: 512, maxWords: 70 },
  standard: { name: 'Standard', description: 'Balanced quality and speed', thinkingBudget: 1024, maxWords: 150 },
  premium: { name: 'Premium', description: 'High quality output', thinkingBudget: 4096, maxWords: 200 },
  ultra: { name: 'Ultra', description: 'Maximum quality', thinkingBudget: 8192, maxWords: 250 },
};

export const ASPECT_RATIOS: Record<string, { name: string; ratio: string }> = {
  '1:1': { name: 'Square', ratio: '1:1' },
  '16:9': { name: 'Landscape', ratio: '16:9' },
  '9:16': { name: 'Portrait', ratio: '9:16' },
  '4:3': { name: 'Standard', ratio: '4:3' },
  '3:4': { name: 'Portrait 3:4', ratio: '3:4' },
};

export const performInitialAnalysis = async (
  userPrompt: string, 
  processText: boolean
): Promise<{ textInfo: DetectedTextInfo[]; analysis: PromptAnalysis }> => {
  try {
    const response = await fetch('/api/deep-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: userPrompt,
        processText 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    const data = await response.json();
    
    return {
      textInfo: data.textInfo || [],
      analysis: data.analysis || {
        subject: { primary: 'general', secondary: [] },
        mood: { primary: 'neutral', secondary: [] },
        lighting: { scenario: 'natural' },
        environment: { type: 'outdoor', details: '' },
        style_intent: 'general',
      }
    };
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      textInfo: [],
      analysis: {
        subject: { primary: 'general', secondary: [] },
        mood: { primary: 'neutral', secondary: [] },
        lighting: { scenario: 'natural' },
        environment: { type: 'outdoor', details: '' },
        style_intent: 'general',
      }
    };
  }
};

export const enhanceStyle = async (
  userPrompt: string,
  analysis: PromptAnalysis,
  textInfo: DetectedTextInfo[],
  selectedStyle: string,
  quality: QualityLevel,
  compositionalEdits?: { finalText?: string; finalBackground?: string; textStyleIntent?: TextStyleIntent },
  referenceImage?: { base64Data: string }
): Promise<string> => {
  try {
    const response = await fetch('/api/generate-image-advanced', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userPrompt,
        style: selectedStyle,
        quality,
        enhanceOnly: true,
        textInfo,
        analysis,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Style enhancement failed');
    }
    
    const data = await response.json();
    return data.enhancedPrompt || userPrompt;
  } catch (error) {
    console.error('Style enhancement error:', error);
    return userPrompt;
  }
};

export const getNegativePrompts = (
  analysis: PromptAnalysis,
  textInfo: DetectedTextInfo[],
  selectedStyle: string
): string => {
  const negatives = [
    'blurry', 'low quality', 'distorted', 'deformed', 'ugly', 
    'bad anatomy', 'watermark', 'signature', 'text errors'
  ];
  
  if (analysis.subject.primary === 'portrait') {
    negatives.push('bad hands', 'extra fingers', 'mutated');
  }
  
  if (textInfo.length > 0) {
    negatives.push('misspelled text', 'wrong letters', 'garbled text');
  }
  
  return negatives.join(', ');
};

export interface ImageGenerationErrorDetails {
  message: string;
  model?: string;
  tier?: string;
  attempt?: number;
  totalAttempts?: number;
  fallbackAttempted?: boolean;
  isRetryable?: boolean;
  attemptHistory?: string[];
  imagenTriedAtLeastOnce?: boolean;
}

export const generateImage = async (
  stylePrompt: string,
  textInfo: DetectedTextInfo[],
  referenceImage: { base64Data: string; mimeType: string } | undefined,
  aspectRatio: string,
  negativePrompt: string,
  numberOfVariations: number,
  useCuratedSelection: boolean,
  quality: QualityLevel,
  progressCallback?: (message: string) => void,
  onDraftGenerated?: (image: GeneratedImage, index: number, total: number) => void
): Promise<GeneratedImage[]> => {
  const results: GeneratedImage[] = [];
  
  for (let i = 0; i < numberOfVariations; i++) {
    if (progressCallback) {
      progressCallback(`Generating image ${i + 1} of ${numberOfVariations}...`);
    }
    
    try {
      const response = await fetch('/api/generate-image-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: stylePrompt,
          style: 'auto',
          quality,
          aspectRatio,
          negativePrompt,
          referenceImage: referenceImage?.base64Data,
        }),
      });
      
      // Check response.ok BEFORE parsing JSON to handle non-JSON error responses
      if (!response.ok) {
        let errorDetails: ImageGenerationErrorDetails = { message: 'Unknown error' };
        try {
          const errorData = await response.json();
          errorDetails = errorData.errorDetails || { message: errorData.error || 'Unknown error' };
        } catch {
          // Response wasn't JSON (network error, HTML error page, etc.)
          errorDetails = { message: `Server error (${response.status}): ${response.statusText}` };
        }
        
        const errorMessage = `Image generation failed: ${errorDetails.message}`;
        
        console.error(`[QUAD] Generation error for image ${i + 1}:`, {
          error: errorDetails.message,
          model: errorDetails.model || 'unknown',
          tier: errorDetails.tier || 'unknown',
          attempt: errorDetails.attempt,
          totalAttempts: errorDetails.totalAttempts,
          fallbackAttempted: errorDetails.fallbackAttempted,
          attemptHistory: errorDetails.attemptHistory
        });
        
        if (errorDetails.attemptHistory && errorDetails.attemptHistory.length > 0) {
          console.error(`[QUAD] Attempt history:`, errorDetails.attemptHistory);
        }
        
        if (progressCallback) {
          const modelInfo = errorDetails.model && errorDetails.model !== 'unknown' ? ` (${errorDetails.model})` : '';
          const attemptInfo = errorDetails.attempt ? ` after ${errorDetails.attempt} attempts` : '';
          const fallbackInfo = errorDetails.fallbackAttempted ? ' [fallback also failed]' : '';
          progressCallback(`Error${modelInfo}${attemptInfo}${fallbackInfo}: ${errorDetails.message.substring(0, 80)}`);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.image) {
        // Handle both string and object formats for data.image
        let imageUrl: string;
        let base64Data: string;
        let mimeType: string = 'image/png';
        
        if (typeof data.image === 'string') {
          // Legacy format: data.image is a string (URL or base64)
          imageUrl = data.image.startsWith('data:') ? data.image : `data:image/png;base64,${data.image}`;
          base64Data = data.image.replace(/^data:image\/[^;]+;base64,/, '');
        } else if (typeof data.image === 'object') {
          // New format: data.image is an object with url and/or base64Data, mimeType
          mimeType = data.image.mimeType || 'image/png';
          
          if (data.image.url) {
            // Has URL - use it directly
            imageUrl = data.image.url;
            base64Data = data.image.base64Data || data.image.url.replace(/^data:image\/[^;]+;base64,/, '');
          } else if (data.image.base64Data) {
            // No URL but has base64Data - construct data URL
            base64Data = data.image.base64Data;
            imageUrl = `data:${mimeType};base64,${base64Data}`;
          } else {
            console.warn('[QUAD] Image object missing both url and base64Data:', data.image);
            throw new Error('Image object missing required data');
          }
        } else {
          console.warn('[QUAD] Unexpected image format:', typeof data.image);
          throw new Error('Unexpected image format in response');
        }
        
        const image: GeneratedImage = {
          url: imageUrl,
          prompt: stylePrompt,
          base64Data,
          mimeType,
        };
        
        results.push(image);
        
        if (onDraftGenerated) {
          onDraftGenerated(image, i, numberOfVariations);
        }
      } else if (data.images && data.images.length > 0) {
        // Handle array response format
        const imageData = data.images[0];
        const base64Data = imageData.base64Data || imageData.url?.replace(/^data:image\/[^;]+;base64,/, '') || '';
        const image: GeneratedImage = {
          url: imageData.url || `data:image/png;base64,${base64Data}`,
          prompt: stylePrompt,
          base64Data,
          mimeType: imageData.mimeType || 'image/png',
        };
        
        results.push(image);
        
        if (onDraftGenerated) {
          onDraftGenerated(image, i, numberOfVariations);
        }
      } else {
        console.warn(`[QUAD] No image in response for variation ${i + 1}`);
      }
    } catch (error: any) {
      console.error(`[QUAD] Error generating image ${i + 1}:`, error.message || error);
      // Continue to next variation instead of stopping entirely
    }
  }
  
  return results;
};

export const scoreImageQuality = async (imageBase64: string): Promise<ImageQualityScores> => {
  return {
    composition: 7,
    detail: 7,
    lighting: 7,
    color: 7,
    overall: 7,
  };
};
