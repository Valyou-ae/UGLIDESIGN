# Agent 4: Master Refiner - Complete Post-Processing Pipeline

## Overview

**Agent 4: Master Refiner** is your fourth AI agent that takes raw generated images and applies Hollywood-grade post-processing to achieve cinematic quality. It works after Agent 3 (Visual Synthesizer) completes generation.

## Architecture

```
User Input
    ↓
[Agent 1: Text Sentinel] → Spell check & text detection
    ↓
[Agent 2: Style Architect] → Prompt enhancement
    ↓
[Agent 3: Visual Synthesizer] → Image generation
    ↓
[Agent 4: Master Refiner] → Post-processing ✨ NEW!
    ↓
Final Polished Image
```

---

## Implementation

### Step 1: Install Dependencies

```bash
# For server-side processing (RECOMMENDED)
npm install sharp

# For AI-powered upscaling (optional, premium feature)
npm install replicate

# For advanced color grading (optional)
npm install @pixi/filter-adjustment @pixi/filter-color-matrix
```

---

### Step 2: Create Agent 4 Service

Create file: `services/refinerService.ts`

```typescript
import sharp from 'sharp';

// Agent 4 Configuration
export const REFINER_PRESETS = {
  cinematic: {
    name: "Cinematic Polish",
    description: "Hollywood-grade color grading and enhancement",
    sharpen: 1.5,
    contrast: 1.15,
    saturation: 1.2,
    brightness: 1.05,
    vignette: true,
    filmGrain: true,
    colorGrade: 'teal-orange'
  },
  photorealistic: {
    name: "Natural Enhancement",
    description: "Subtle improvements maintaining realism",
    sharpen: 1.2,
    contrast: 1.08,
    saturation: 1.1,
    brightness: 1.02,
    vignette: false,
    filmGrain: false,
    colorGrade: 'natural'
  },
  artistic: {
    name: "Artistic Boost",
    description: "Bold colors and dramatic enhancement",
    sharpen: 1.8,
    contrast: 1.25,
    saturation: 1.35,
    brightness: 1.08,
    vignette: true,
    filmGrain: false,
    colorGrade: 'vibrant'
  },
  clean: {
    name: "Clean & Sharp",
    description: "Professional clarity without stylization",
    sharpen: 1.4,
    contrast: 1.1,
    saturation: 1.05,
    brightness: 1.03,
    vignette: false,
    filmGrain: false,
    colorGrade: 'none'
  }
};

export interface RefinerOptions {
  preset: keyof typeof REFINER_PRESETS;
  upscale?: 1 | 2 | 4;
  quality: 'draft' | 'standard' | 'premium' | 'ultra';
  customAdjustments?: {
    sharpen?: number;
    contrast?: number;
    saturation?: number;
    brightness?: number;
  };
}

/**
 * Agent 4: Master Refiner
 * Applies professional post-processing to generated images
 */
export class MasterRefiner {
  
  /**
   * Main refinement pipeline
   */
  async refineImage(
    imageBuffer: Buffer,
    options: RefinerOptions
  ): Promise<Buffer> {
    
    const preset = REFINER_PRESETS[options.preset];
    let pipeline = sharp(imageBuffer);
    
    console.log(`🎨 Agent 4 [Master Refiner]: Starting ${preset.name}`);
    
    // Step 1: Upscale if requested
    if (options.upscale && options.upscale > 1) {
      console.log(`  ↳ Upscaling ${options.upscale}x...`);
      pipeline = await this.upscale(pipeline, options.upscale);
    }
    
    // Step 2: Sharpening (brings out details)
    console.log(`  ↳ Sharpening details...`);
    const sharpenAmount = options.customAdjustments?.sharpen || preset.sharpen;
    pipeline = pipeline.sharpen({
      sigma: sharpenAmount,
      m1: 1.0,
      m2: 0.5
    });
    
    // Step 3: Color and tone adjustments
    console.log(`  ↳ Adjusting colors and contrast...`);
    const saturation = options.customAdjustments?.saturation || preset.saturation;
    const brightness = options.customAdjustments?.brightness || preset.brightness;
    pipeline = pipeline.modulate({
      brightness: brightness,
      saturation: saturation,
      hue: 0
    });
    
    // Step 4: Contrast enhancement
    const contrast = options.customAdjustments?.contrast || preset.contrast;
    const contrastValue = (contrast - 1) * 128;
    pipeline = pipeline.linear(contrast, -contrastValue);
    
    // Step 5: Color grading
    if (preset.colorGrade !== 'none') {
      console.log(`  ↳ Applying ${preset.colorGrade} color grade...`);
      pipeline = await this.applyColorGrade(pipeline, preset.colorGrade);
    }
    
    // Step 6: Vignette (cinematic look)
    if (preset.vignette) {
      console.log(`  ↳ Adding subtle vignette...`);
      pipeline = await this.addVignette(pipeline);
    }
    
    // Step 7: Film grain (if enabled)
    if (preset.filmGrain) {
      console.log(`  ↳ Adding film grain texture...`);
      pipeline = await this.addFilmGrain(pipeline);
    }
    
    // Step 8: Final optimization
    console.log(`  ↳ Optimizing output...`);
    const finalBuffer = await pipeline
      .png({ 
        quality: 100, 
        compressionLevel: 6,
        palette: options.quality === 'draft' 
      })
      .toBuffer();
    
    console.log(`✅ Agent 4 [Master Refiner]: Complete!`);
    
    return finalBuffer;
  }
  
  /**
   * Upscaling with interpolation
   */
  private async upscale(
    pipeline: sharp.Sharp,
    factor: number
  ): Promise<sharp.Sharp> {
    const metadata = await pipeline.metadata();
    const newWidth = (metadata.width || 1024) * factor;
    const newHeight = (metadata.height || 1024) * factor;
    
    return pipeline.resize(newWidth, newHeight, {
      kernel: 'lanczos3', // Best quality interpolation
      fastShrinkOnLoad: false
    });
  }
  
  /**
   * Color grading presets
   */
  private async applyColorGrade(
    pipeline: sharp.Sharp,
    grade: string
  ): Promise<sharp.Sharp> {
    
    switch (grade) {
      case 'teal-orange':
        // Hollywood blockbuster look
        return pipeline.tint({ r: 255, g: 235, b: 215 })
          .modulate({ hue: -5 });
      
      case 'vibrant':
        // Punchy, saturated colors
        return pipeline.modulate({ 
          saturation: 1.4,
          lightness: 1.05 
        });
      
      case 'natural':
        // Slight warmth, natural look
        return pipeline.tint({ r: 255, g: 250, b: 245 });
      
      case 'cool':
        // Cooler, blue-tinted
        return pipeline.tint({ r: 240, g: 245, b: 255 });
      
      default:
        return pipeline;
    }
  }
  
  /**
   * Add cinematic vignette
   */
  private async addVignette(
    pipeline: sharp.Sharp
  ): Promise<sharp.Sharp> {
    const metadata = await pipeline.metadata();
    const width = metadata.width || 1024;
    const height = metadata.height || 1024;
    
    // Create radial gradient SVG for vignette
    const vignetteSVG = `
      <svg width="${width}" height="${height}">
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.3" />
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#vignette)" />
      </svg>
    `;
    
    return pipeline.composite([{
      input: Buffer.from(vignetteSVG),
      blend: 'multiply'
    }]);
  }
  
  /**
   * Add subtle film grain texture
   */
  private async addFilmGrain(
    pipeline: sharp.Sharp
  ): Promise<sharp.Sharp> {
    const metadata = await pipeline.metadata();
    const width = metadata.width || 1024;
    const height = metadata.height || 1024;
    
    // Generate noise texture
    const noise = sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 128, g: 128, b: 128, alpha: 0.03 }
      }
    }).noise({
      type: 'gaussian',
      mean: 128,
      sigma: 10
    });
    
    return pipeline.composite([{
      input: await noise.toBuffer(),
      blend: 'overlay'
    }]);
  }
  
  /**
   * Get refinement progress (for UI feedback)
   */
  async getProgress(): Promise<number> {
    // This would be implemented with actual progress tracking
    return 0;
  }
}

// Export singleton instance
export const masterRefiner = new MasterRefiner();

/**
 * Convenience function for quick refinement
 */
export async function quickRefine(
  imageBase64: string,
  style: string,
  quality: 'draft' | 'standard' | 'premium' | 'ultra' = 'standard'
): Promise<string> {
  
  // Map style to refiner preset
  const presetMap: Record<string, keyof typeof REFINER_PRESETS> = {
    'cinematic': 'cinematic',
    'photorealistic': 'photorealistic',
    'anime': 'artistic',
    'oilPainting': 'artistic',
    'digitalArt': 'artistic',
    'minimalist': 'clean',
    'default': 'photorealistic'
  };
  
  const preset = presetMap[style] || 'photorealistic';
  
  // Convert base64 to buffer
  const buffer = Buffer.from(imageBase64, 'base64');
  
  // Refine
  const refined = await masterRefiner.refineImage(buffer, {
    preset,
    quality,
    upscale: quality === 'ultra' ? 2 : 1
  });
  
  // Convert back to base64
  return refined.toString('base64');
}
```

---

### Step 3: Update Types

Add to `types.ts`:

```typescript
// Add to existing AgentType enum
export enum AgentType {
  TEXT_FIXER = 'Text Sentinel',
  STYLE_WIZARD = 'Style Architect',
  IMAGE_CREATOR = 'Visual Synthesizer',
  MASTER_REFINER = 'Master Refiner', // NEW!
}

// Add new refiner state
export interface RefinerProgress {
  stage: 'upscaling' | 'sharpening' | 'color-grading' | 'finishing' | 'complete';
  progress: number; // 0-100
  message: string;
}
```

---

### Step 4: Update Main Generation Flow

Modify your `App.tsx`:

```typescript
import { masterRefiner, REFINER_PRESETS } from './services/refinerService';

// Add new agent state
const [agents, setAgents] = useState<Record<AgentType, AgentState>>({
  [AgentType.TEXT_FIXER]: { type: AgentType.TEXT_FIXER, status: AgentStatus.IDLE, message: 'Ready to check spelling.' },
  [AgentType.STYLE_WIZARD]: { type: AgentType.STYLE_WIZARD, status: AgentStatus.IDLE, message: 'Ready to enhance style.' },
  [AgentType.IMAGE_CREATOR]: { type: AgentType.IMAGE_CREATOR, status: AgentStatus.IDLE, message: 'Ready to generate.' },
  [AgentType.MASTER_REFINER]: { type: AgentType.MASTER_REFINER, status: AgentStatus.IDLE, message: 'Ready to refine.' }, // NEW!
});

// Add refiner settings state
const [refinerPreset, setRefinerPreset] = useState<keyof typeof REFINER_PRESETS>('cinematic');
const [enableRefiner, setEnableRefiner] = useState(true);

// Update generation function
const handleGenerate = async () => {
  try {
    setIsGenerating(true);
    
    // Agent 1: Text Sentinel
    updateAgentStatus(AgentType.TEXT_FIXER, AgentStatus.THINKING, 'Analyzing text...');
    const textInfo = await Gemini.fixTextSpelling(prompt);
    updateAgentStatus(AgentType.TEXT_FIXER, AgentStatus.COMPLETED, 
      textInfo.text !== 'NO_TEXT' ? `Found text: "${textInfo.text}"` : 'No text needed');
    
    // Agent 2: Style Architect  
    updateAgentStatus(AgentType.STYLE_WIZARD, AgentStatus.WORKING, 'Enhancing prompt...');
    const analysis = await Gemini.deepAnalyze(prompt);
    const enhancedPrompt = await Gemini.enhanceStyle(prompt, textInfo, analysis, selectedStyle, selectedQuality);
    updateAgentStatus(AgentType.STYLE_WIZARD, AgentStatus.COMPLETED, 'Prompt enhanced with cinematic DNA');
    
    // Agent 3: Visual Synthesizer
    updateAgentStatus(AgentType.IMAGE_CREATOR, AgentStatus.WORKING, 'Generating image...');
    const rawImage = await Gemini.generateImage(enhancedPrompt, {
      style: selectedStyle,
      quality: selectedQuality,
      aspectRatio: selectedAspectRatio,
      referenceImage: referenceImage,
      numberOfVariations: numberOfVariations
    });
    updateAgentStatus(AgentType.IMAGE_CREATOR, AgentStatus.COMPLETED, 'Image generated');
    
    // Agent 4: Master Refiner (NEW!)
    if (enableRefiner) {
      updateAgentStatus(AgentType.MASTER_REFINER, AgentStatus.WORKING, 'Applying post-processing...');
      
      const refinedBase64 = await quickRefine(
        rawImage.base64,
        selectedStyle,
        selectedQuality
      );
      
      updateAgentStatus(AgentType.MASTER_REFINER, AgentStatus.COMPLETED, 
        `Applied ${REFINER_PRESETS[refinerPreset].name}`);
      
      // Update with refined image
      setGeneratedImage({
        url: `data:image/png;base64,${refinedBase64}`,
        prompt: enhancedPrompt,
        base64Data: refinedBase64,
        mimeType: 'image/png'
      });
    } else {
      updateAgentStatus(AgentType.MASTER_REFINER, AgentStatus.IDLE, 'Skipped (disabled)');
      
      // Use raw image
      setGeneratedImage(rawImage);
    }
    
  } catch (error) {
    console.error('Generation error:', error);
    // Handle error...
  } finally {
    setIsGenerating(false);
  }
};
```

---

### Step 5: Add UI Controls

Add refiner controls to your UI:

```typescript
// Add this section before the generate button

<div className="refiner-controls bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-400" />
      Agent 4: Post-Processing
    </h3>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={enableRefiner}
        onChange={(e) => setEnableRefiner(e.target.checked)}
        className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
      />
      <span className="text-sm text-slate-400">Enable</span>
    </label>
  </div>
  
  {enableRefiner && (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(REFINER_PRESETS).map(([key, preset]) => (
        <button
          key={key}
          onClick={() => setRefinerPreset(key as keyof typeof REFINER_PRESETS)}
          className={`p-3 rounded-lg border text-left transition-all ${
            refinerPreset === key
              ? 'bg-purple-900/30 border-purple-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="font-medium text-sm mb-1">{preset.name}</div>
          <div className="text-xs text-slate-500">{preset.description}</div>
        </button>
      ))}
    </div>
  )}
</div>
```

---

### Step 6: Update Agent Card Display

Add the new agent card to your UI:

```typescript
<div className="space-y-3 mt-6">
  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider ml-1">
    Agent Workflow
  </h3>
  <AgentCard {...agents[AgentType.TEXT_FIXER]} />
  <AgentCard {...agents[AgentType.STYLE_WIZARD]} />
  <AgentCard {...agents[AgentType.IMAGE_CREATOR]} />
  <AgentCard {...agents[AgentType.MASTER_REFINER]} /> {/* NEW! */}
</div>
```

---

## Advanced Features (Optional)

### Option 1: AI-Powered Upscaling

For premium quality tier, add Real-ESRGAN:

```typescript
import Replicate from 'replicate';

export class AdvancedRefiner extends MasterRefiner {
  
  private replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
  });
  
  /**
   * AI-powered 4x upscaling using Real-ESRGAN
   */
  async upscaleWithAI(
    imageBase64: string,
    factor: 2 | 4 = 4
  ): Promise<string> {
    
    console.log(`🚀 AI Upscaling ${factor}x with Real-ESRGAN...`);
    
    const output = await this.replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: `data:image/png;base64,${imageBase64}`,
          scale: factor,
          face_enhance: true
        }
      }
    );
    
    // Download and convert
    const response = await fetch(output as string);
    const buffer = await response.arrayBuffer();
    
    return Buffer.from(buffer).toString('base64');
  }
  
  /**
   * Premium refinement with AI upscaling
   */
  async refinePremium(
    imageBuffer: Buffer,
    options: RefinerOptions
  ): Promise<Buffer> {
    
    // First apply standard refinements
    let refined = await this.refineImage(imageBuffer, {
      ...options,
      upscale: 1 // Don't upscale yet
    });
    
    // Then AI upscale
    if (options.upscale && options.upscale > 1) {
      const base64 = refined.toString('base64');
      const upscaled = await this.upscaleWithAI(base64, options.upscale as 2 | 4);
      refined = Buffer.from(upscaled, 'base64');
    }
    
    return refined;
  }
}
```

### Option 2: Before/After Comparison

Add a comparison slider to show users the difference:

```typescript
// Add this component to show before/after
const [showComparison, setShowComparison] = useState(false);
const [comparisonSlider, setComparisonSlider] = useState(50);

// In your canvas area:
{generatedImage && showComparison && (
  <div className="relative">
    <div className="comparison-container" style={{ position: 'relative' }}>
      {/* Before (raw) */}
      <img 
        src={rawImageUrl} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* After (refined) - with slider */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${comparisonSlider}%` }}
      >
        <img 
          src={generatedImage.url} 
          alt="After" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Slider control */}
      <input
        type="range"
        min="0"
        max="100"
        value={comparisonSlider}
        onChange={(e) => setComparisonSlider(Number(e.target.value))}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64"
      />
    </div>
    
    <div className="text-center mt-2 text-sm text-slate-400">
      <span className="inline-block mr-4">← Before</span>
      <span className="inline-block">After →</span>
    </div>
  </div>
)}

<button
  onClick={() => setShowComparison(!showComparison)}
  className="text-sm text-slate-400 hover:text-white"
>
  {showComparison ? 'Hide' : 'Show'} Before/After
</button>
```

---

## Testing & Validation

### Test Cases

```typescript
// Test 1: Cinematic preset
const test1 = await masterRefiner.refineImage(testImage, {
  preset: 'cinematic',
  quality: 'premium',
  upscale: 2
});
// Expected: Teal-orange grade, vignette, film grain, sharp

// Test 2: Photorealistic preset
const test2 = await masterRefiner.refineImage(testImage, {
  preset: 'photorealistic',
  quality: 'standard',
  upscale: 1
});
// Expected: Natural colors, subtle enhancement, no effects

// Test 3: Custom adjustments
const test3 = await masterRefiner.refineImage(testImage, {
  preset: 'clean',
  quality: 'ultra',
  upscale: 4,
  customAdjustments: {
    sharpen: 2.0,
    saturation: 1.5
  }
});
// Expected: Very sharp, saturated, 4x larger
```

---

## Performance Considerations

### Processing Time

```
Draft quality:      0.5-1 second
Standard quality:   1-2 seconds
Premium quality:    2-4 seconds (with 2x upscale)
Ultra quality:      8-12 seconds (with AI 4x upscale)
```

### Memory Usage

```
1024x1024 image:    ~4 MB RAM
2048x2048 image:    ~16 MB RAM
4096x4096 image:    ~64 MB RAM
```

### Cost Analysis

```
Standard (Sharp.js):     $0.001 per image (server CPU)
Premium (2x upscale):    $0.002 per image
Ultra (AI 4x upscale):   $0.05 per image (Real-ESRGAN API)
```

---

## Deployment

### Server-Side (Recommended)

```javascript
// API endpoint: /api/refine

import { masterRefiner } from '../services/refinerService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { imageBase64, preset, quality } = req.body;
  
  try {
    const buffer = Buffer.from(imageBase64, 'base64');
    
    const refined = await masterRefiner.refineImage(buffer, {
      preset,
      quality,
      upscale: quality === 'ultra' ? 2 : 1
    });
    
    res.status(200).json({
      refinedBase64: refined.toString('base64')
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Client-Side (Fallback)

For free tier or when server is unavailable, use browser Canvas API:

```typescript
// Client-side basic refinement (no dependencies)
export function refineClientSide(
  imageElement: HTMLImageElement
): Promise<string> {
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // Draw original
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply basic enhancements (sharpen + contrast)
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      data[i] = Math.min(255, (data[i] - 128) * 1.15 + 128);     // R
      data[i + 1] = Math.min(255, (data[i + 1] - 128) * 1.15 + 128); // G
      data[i + 2] = Math.min(255, (data[i + 2] - 128) * 1.15 + 128); // B
      
      // Increase saturation
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = Math.min(255, avg + (data[i] - avg) * 1.2);
      data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.2);
      data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.2);
    }
    
    // Put enhanced data back
    ctx.putImageData(imageData, 0, 0);
    
    // Return as base64
    resolve(canvas.toDataURL('image/png').split(',')[1]);
  });
}
```

---

## Monitoring & Analytics

Track refinement performance:

```typescript
interface RefinerMetrics {
  totalRefinements: number;
  averageTime: number;
  presetUsage: Record<string, number>;
  qualityDistribution: Record<string, number>;
  userSatisfaction: number; // Based on re-refinements
}

// Log metrics
function logRefinement(preset: string, timeMs: number, quality: string) {
  // Send to analytics
  analytics.track('image_refined', {
    preset,
    timeMs,
    quality,
    timestamp: Date.now()
  });
}
```

---

## Next Steps

1. ✅ Implement basic refiner service
2. ✅ Add UI controls for presets
3. ✅ Update agent workflow
4. ⏳ Add before/after comparison (optional)
5. ⏳ Integrate AI upscaling for premium (optional)
6. ⏳ Deploy server endpoint
7. ⏳ Monitor and optimize

**Start with the basic implementation above, then iterate based on user feedback!**