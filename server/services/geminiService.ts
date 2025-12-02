import { GoogleGenAI, Type, Modality } from "@google/genai";
import { 
  DetectedTextInfo, 
  PromptAnalysis, 
  QualityLevel, 
  GeneratedImageData,
  TextStyleIntent,
  ASPECT_RATIO_DIMENSIONS
} from "../../shared/imageGenTypes";
import {
  buildCinematicDNA,
  selectLightingForSubject,
  selectColorGradeForMood,
  selectCameraForSubject,
  detectArtisticStyleFromPrompt,
  getStylePromptEnhancement,
  ARTISTIC_STYLES,
  CINEMATIC_DNA_COMPONENTS
} from "./cinematicDNA";

const API_KEY = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || '';
const BASE_URL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

function validateApiKey(): void {
  if (!API_KEY) {
    throw new Error("AI service not configured. Please ensure the Gemini integration is properly set up.");
  }
}

function getAIClient() {
  validateApiKey();
  return new GoogleGenAI({ 
    apiKey: API_KEY, 
    httpOptions: BASE_URL ? { baseUrl: BASE_URL, apiVersion: "" } : undefined 
  });
}

async function withRetry<T>(fn: () => Promise<T>, retries = 5, initialDelay = 3000): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMessage = error.toString();
      const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

      if (isRateLimitError) {
        if (i === retries - 1) {
          console.error(`API rate limit exceeded. Max retries (${retries}) reached.`);
          throw new Error("The service is temporarily busy due to high demand. Please try again in a few moments.");
        }
        console.warn(`API rate limit exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await sleep(delay);
        delay = delay * 2 + Math.floor(Math.random() * 1000);
      } else {
        throw error;
      }
    }
  }
  throw new Error("Exceeded max retries for an unknown reason.");
}

const TEXT_PHYSICAL_PROPERTIES_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    material: { type: Type.STRING, description: "What is the text physically made of? (e.g., 'carved ice', 'glowing neon tube', 'displaced snow')." },
    lightingInteraction: { type: Type.STRING, description: "How does the scene's light affect it? (e.g., 'catches rim light on top edges', 'casts a soft shadow below')." },
    surfaceTexture: { type: Type.STRING, description: "What is its surface texture? (e.g., 'rough chiseled stone', 'smooth polished chrome')." },
    environmentalInteraction: { type: Type.STRING, description: "How does it affect its surroundings? (e.g., 'emits a soft glow onto the snow', 'disturbs the grass it rests on')." },
    perspectiveAndDepth: { type: Type.STRING, description: "Where is it in 3D space? (e.g., 'in the foreground, matching ground perspective')." },
  },
  required: ["material", "lightingInteraction", "surfaceTexture", "environmentalInteraction", "perspectiveAndDepth"],
};

const DETECTED_TEXT_INFO_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The corrected text content." },
      placement: { type: Type.STRING, description: "Suggested placement of the text in the image (e.g., center, bottom-right, integrated)." },
      fontStyle: { type: Type.STRING, description: "A font style that matches the mood of the text and image (e.g., 'playful', 'elegant', 'modern')." },
      fontSize: { type: Type.STRING, description: "The relative size of the font (e.g., small, medium, dominant)." },
      physicalProperties: TEXT_PHYSICAL_PROPERTIES_SCHEMA,
    },
    required: ["text", "placement", "fontStyle", "fontSize", "physicalProperties"],
  },
};

const PROMPT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    subject: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "The main subject (e.g., 'portrait', 'landscape')." },
        secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["primary", "secondary"],
    },
    mood: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "The dominant mood (e.g., 'dramatic', 'peaceful')." },
        secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["primary", "secondary"],
    },
    lighting: {
      type: Type.OBJECT,
      properties: {
        scenario: { type: Type.STRING, description: "The lighting condition (e.g., 'golden hour', 'studio')." },
      },
      required: ["scenario"],
    },
    environment: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "The setting (e.g., 'indoor', 'outdoor')." },
        details: { type: Type.STRING },
      },
      required: ["type", "details"],
    },
    style_intent: { type: Type.STRING, description: "The primary artistic style intent (e.g., 'cinematic', 'photorealistic')." },
  },
  required: ["subject", "mood", "lighting", "environment", "style_intent"],
};

const COMBINED_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    textInfo: DETECTED_TEXT_INFO_SCHEMA,
    analysis: PROMPT_ANALYSIS_SCHEMA,
  },
  required: ['textInfo', 'analysis'],
};

export const STYLE_PRESETS: Record<string, { name: string; keywords: string; guidance: string; isPhotorealistic?: boolean }> = {
  auto: { name: "Auto", keywords: "", guidance: "The AI will automatically determine the best style." },
  photo: { name: "Photorealistic", keywords: "DSLR, 8K, sharp focus, natural lighting", guidance: "Focus on photorealism with accurate lighting and detail.", isPhotorealistic: true },
  cinematic: { name: "Cinematic", keywords: "cinematic, film grain, dramatic lighting, movie still, anamorphic", guidance: "Apply Hollywood cinematography principles with dramatic lighting." },
  anime: { name: "Anime/Manga", keywords: "anime, manga, cel shaded, vibrant colors, Studio Ghibli", guidance: "Use anime art style with clean lines and vibrant colors." },
  oil: { name: "Oil Painting", keywords: "oil painting, visible brushstrokes, Renaissance, classical art", guidance: "Emulate classical oil painting techniques." },
  watercolor: { name: "Watercolor", keywords: "watercolor, soft edges, paper texture, flowing pigments", guidance: "Create soft, flowing watercolor effects." },
  digital: { name: "Digital Art", keywords: "digital art, ArtStation, concept art, trending", guidance: "Modern digital art style trending on art platforms." },
  minimal: { name: "Minimalist", keywords: "minimalist, clean lines, negative space, simple", guidance: "Focus on simplicity and negative space." },
  retro: { name: "Retrowave", keywords: "synthwave, neon, 80s aesthetic, vaporwave, grid", guidance: "Apply 80s retro-futuristic aesthetics." },
  fantasy: { name: "Dark Fantasy", keywords: "dark fantasy, gothic, dramatic lighting, epic", guidance: "Create atmospheric dark fantasy imagery." },
  pop: { name: "Pop Art", keywords: "pop art, bold colors, Ben-Day dots, Warhol", guidance: "Apply bold pop art aesthetics." },
  iso: { name: "Isometric 3D", keywords: "isometric, 3D render, clean geometry, soft shadows", guidance: "Create clean isometric 3D renders." },
  sketch: { name: "Pencil Sketch", keywords: "pencil sketch, graphite, crosshatching, detailed drawing", guidance: "Emulate detailed pencil drawings." },
};

export const QUALITY_PRESETS: Record<QualityLevel, { iterations: number; detailLevel: string }> = {
  draft: { iterations: 1, detailLevel: "quick preview" },
  standard: { iterations: 2, detailLevel: "balanced quality" },
  premium: { iterations: 3, detailLevel: "high detail" },
  ultra: { iterations: 4, detailLevel: "maximum detail and refinement" },
};

const NEGATIVE_LIBRARIES: Record<string, string> = {
  universal: "worst quality, low quality, normal quality, lowres, low resolution, blurry, jpeg artifacts, compression artifacts, noise, grainy, pixelated, bad composition, amateur, unprofessional, ugly, deformed, disfigured, watermark, signature, text unwanted, logo",
  portrait: "extra fingers, fewer fingers, extra limbs, missing limbs, deformed hands, malformed hands, fused fingers, long neck, disproportionate body, asymmetrical eyes, deformed face, disfigured face, bad anatomy, poorly drawn face, poorly drawn hands",
  landscape: "cluttered, chaotic, messy composition, unnatural colors, fake looking, cartoon, illustration",
  product: "bad lighting, harsh shadows, background clutter, unrealistic, toy-like, cheap looking",
  architecture: "distorted perspective, warped lines, crooked lines, unrealistic proportions, impossible geometry",
  animal: "extra legs, missing legs, wrong anatomy, mutated, malformed features, cartoon-like when realistic wanted",
  action: "frozen unnaturally, stiff, awkward pose, motion blur excessive, duplicate limbs, broken limbs, poorly framed",
  text: "gibberish text, unreadable text, distorted text, incorrect spelling, garbled text",
  photorealistic: "cartoon, anime, illustration, drawing, painting, sketch, 3D render, CG, artificial, fake, stylized",
  cinematic: "amateur, home video, phone camera, flat lighting, bad color grading, digital video look",
};

const buildCinematicDNADescription = (): string => {
  const components = Object.values(CINEMATIC_DNA_COMPONENTS);
  const lines = components.map((c, i) => 
    `${i + 1}. ${c.name.toUpperCase()} (${c.qualityBoost} boost): ${c.keywords.slice(0, 3).join(', ')}`
  );
  return `CINEMATIC DNA SYSTEM - Apply these 7 components for Hollywood-quality output:\n${lines.join('\n')}`;
};

const CINEMATIC_DNA = buildCinematicDNADescription();

const detectSubjectType = (analysis: PromptAnalysis): string => {
  const subject = analysis.subject.primary.toLowerCase();
  const keywords = ['portrait', 'person', 'people', 'man', 'woman', 'face'];
  if (keywords.some(kw => subject.includes(kw))) return 'portrait';
  return subject;
};

export const getNegativePrompts = (analysis: PromptAnalysis, textInfo: DetectedTextInfo[], style: string): string => {
  const negatives = new Set<string>(NEGATIVE_LIBRARIES.universal.split(', '));
  const subjectType = detectSubjectType(analysis);

  if (NEGATIVE_LIBRARIES[subjectType]) {
    NEGATIVE_LIBRARIES[subjectType].split(', ').forEach(n => negatives.add(n));
  }

  if (style.toLowerCase().includes('photo')) NEGATIVE_LIBRARIES.photorealistic.split(', ').forEach(n => negatives.add(n));
  if (style.toLowerCase().includes('cinematic')) NEGATIVE_LIBRARIES.cinematic.split(', ').forEach(n => negatives.add(n));

  if (textInfo.length === 0) {
    negatives.add('text'); negatives.add('words'); negatives.add('letters');
  } else {
    NEGATIVE_LIBRARIES.text.split(', ').forEach(n => negatives.add(n));
  }

  return Array.from(negatives).join(', ');
};

export const performInitialAnalysis = async (userPrompt: string, processText: boolean = true): Promise<{ textInfo: DetectedTextInfo[]; analysis: PromptAnalysis }> => {
  const ai = getAIClient();
  const fallbackAnalysis: PromptAnalysis = {
    subject: { primary: 'general', secondary: [] },
    mood: { primary: 'neutral', secondary: [] },
    lighting: { scenario: 'natural' },
    environment: { type: 'outdoor', details: '' },
    style_intent: 'general',
  };
  const fallback = { textInfo: [], analysis: fallbackAnalysis };

  if (!userPrompt.trim()) return fallback;

  const textInstruction = processText ? `
      **2. TEXT ANALYSIS:**
      - Identify text the user explicitly wants written in the image.
      - **ONLY identify text** if the user clearly requests it with phrases like "with the words...", "text that says...", or text in quotation marks.
      - **DO NOT** extract text from general scene descriptions.
      - If no explicit text is requested, return an empty array for textInfo.
  ` : `
      **2. TEXT ANALYSIS:**
      - Text processing is disabled. Return an empty array for textInfo.
  `;

  const metaPrompt = `
    You are an AI Art Director's assistant analyzing a prompt for an image generator.

    **TASKS:**
    1. **PROMPT ANALYSIS:** Analyze for main subject, mood, lighting, setting, and style intent.
    ${textInstruction}

    **USER PROMPT:** "${userPrompt}"

    Return a JSON object with the complete analysis.
  `.trim();

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
      config: { responseMimeType: "application/json", responseSchema: COMBINED_ANALYSIS_SCHEMA },
    }));

    const parsed = JSON.parse(response.text?.trim() || '{}');

    const textInfo: DetectedTextInfo[] = (Array.isArray(parsed.textInfo) ? parsed.textInfo : []).map((item: any) => ({
      text: item.text || '',
      placement: item.placement || 'center',
      fontStyle: item.fontStyle || 'modern',
      fontSize: item.fontSize || 'medium',
      physicalProperties: item.physicalProperties || {
        material: 'a clean modern overlay',
        lightingInteraction: 'no specific lighting',
        surfaceTexture: 'smooth',
        environmentalInteraction: 'floats on top',
        perspectiveAndDepth: 'flat on the screen'
      }
    }));

    const analysis: PromptAnalysis = parsed.analysis && typeof parsed.analysis === 'object' ? parsed.analysis : fallbackAnalysis;

    return { textInfo, analysis };
  } catch (error) {
    console.error("Initial Analysis Agent Error:", error);
    return fallback;
  }
};

export const enhanceStyle = async (
  userPrompt: string,
  analysis: PromptAnalysis,
  textInfo: DetectedTextInfo[],
  selectedStyle: string = 'auto',
  quality: QualityLevel = 'standard'
): Promise<string> => {
  const ai = getAIClient();

  try {
    const hasText = textInfo.length > 0;
    const styleInfo = STYLE_PRESETS[selectedStyle] || STYLE_PRESETS.auto;
    const qualityConfig = QUALITY_PRESETS[quality];

    const qualityLevel = quality === 'draft' ? 'fast' : quality === 'ultra' ? 'professional' : 'balanced';
    const cinematicDNA = buildCinematicDNA(qualityLevel as 'fast' | 'balanced' | 'professional');
    
    const lightingRecommendation = selectLightingForSubject(analysis.subject.primary, analysis.mood.primary);
    const colorGrade = selectColorGradeForMood(analysis.mood.primary);
    const { camera, lens } = selectCameraForSubject(analysis.subject.primary);
    
    const detectedArtStyle = detectArtisticStyleFromPrompt(userPrompt);
    const artStyleEnhancement = detectedArtStyle ? getStylePromptEnhancement(detectedArtStyle) : '';

    const textInstruction = hasText
      ? `The image MUST include the text: "${textInfo[0].text}". Style: ${textInfo[0].physicalProperties.material}`
      : 'The image must not contain any text.';

    const stylePromptInstruction = selectedStyle !== 'auto'
      ? `Apply the style: ${styleInfo.name}. Keywords: ${styleInfo.keywords}. Guidance: ${styleInfo.guidance}.`
      : detectedArtStyle && ARTISTIC_STYLES[detectedArtStyle]
        ? `Apply detected artistic style: ${ARTISTIC_STYLES[detectedArtStyle].name}. ${artStyleEnhancement}`
        : `Automatically select the most fitting artistic style based on the subject and mood.`;

    const metaPrompt = `
      You are an expert AI Art Director creating a master prompt for an advanced AI image generator.

      ${CINEMATIC_DNA}

      **CINEMATIC DNA ENHANCEMENT (Apply These):**
      ${cinematicDNA}

      **RECOMMENDED LIGHTING:** ${lightingRecommendation}
      **RECOMMENDED COLOR GRADE:** ${colorGrade.name} - ${colorGrade.keywords.join(', ')}
      **RECOMMENDED CAMERA:** ${camera.name} with ${lens.name}

      **PRIME DIRECTIVE: TEXT CONTROL**
      ${textInstruction}

      **STYLE INSTRUCTION:**
      ${stylePromptInstruction}

      **QUALITY LEVEL:** ${quality} - ${qualityConfig.detailLevel}

      **USER'S CORE IDEA:** "${userPrompt}"
      **ANALYSIS:** Subject: ${analysis.subject.primary}, Mood: ${analysis.mood.primary}, Lighting: ${analysis.lighting.scenario}, Style Intent: ${analysis.style_intent}

      **YOUR TASK:**
      Create an enhanced prompt that:
      1. Preserves the user's core idea exactly
      2. Applies ALL Cinematic DNA principles for Hollywood-quality output
      3. Uses the recommended lighting, color grade, and camera specifications
      4. Uses specific, technical photography/cinematography terms
      5. Keeps the prompt under 200 words
      6. Follows the text and style instructions precisely

      Return ONLY the enhanced prompt text, nothing else.
    `.trim();

    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    }));

    return response.text?.trim() || userPrompt;
  } catch (error) {
    console.error("Style Enhancement Error:", error);
    return userPrompt;
  }
};

export const generateImage = async (
  prompt: string,
  aspectRatio: string = '1:1',
  numberOfVariations: number = 1
): Promise<GeneratedImageData[]> => {
  const ai = getAIClient();

  try {
    const results: GeneratedImageData[] = [];

    for (let i = 0; i < numberOfVariations; i++) {
      const response = await withRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      }));

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            results.push({
              url: `data:${mimeType};base64,${base64Data}`,
              prompt: prompt,
              base64Data: base64Data,
              mimeType: mimeType,
            });
          }
        }
      }
    }

    if (results.length === 0) {
      throw new Error("No images were generated");
    }

    return results;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = getAIClient();

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Analyze this image and create a detailed prompt that could recreate it. Focus on subject, style, lighting, colors, composition, and mood. Return only the prompt text.' },
            { inlineData: { mimeType, data: base64Data } }
          ]
        }
      ],
    }));

    return response.text?.trim() || 'A creative image';
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return 'A creative image';
  }
};

export const generateIterativeEditPrompt = async (
  currentPrompt: string,
  editInstruction: string,
  textStyleIntent?: TextStyleIntent
): Promise<string> => {
  const ai = getAIClient();

  try {
    const intentInstruction = textStyleIntent 
      ? `Text style intent: ${textStyleIntent} (subtle=small non-distracting, integrated=physically part of scene, bold=dominant central feature, cinematic=clean movie-poster style)`
      : '';

    const metaPrompt = `
      You are helping refine an image generation prompt based on user feedback.

      **CURRENT PROMPT:** "${currentPrompt}"
      **USER'S EDIT REQUEST:** "${editInstruction}"
      ${intentInstruction}

      Create a new prompt that applies the user's edit while preserving what they liked about the original.
      Return ONLY the new prompt text.
    `.trim();

    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    }));

    return response.text?.trim() || currentPrompt;
  } catch (error) {
    console.error("Iterative Edit Error:", error);
    return currentPrompt;
  }
};

export interface DeepAnalysisResult {
  subject: {
    primary: string;
    secondary: string[];
    semanticCategory: string;
    emotionalResonance: string;
  };
  composition: {
    recommendedFraming: string;
    focalPoint: string;
    visualFlow: string;
    negativeSpace: string;
  };
  atmosphere: {
    mood: string;
    timeOfDay: string;
    weather: string;
    ambiance: string;
  };
  technicalRecommendations: {
    cameraAngle: string;
    lensType: string;
    lightingSetup: string;
    colorGrade: string;
    depthOfField: string;
  };
  artisticInfluences: string[];
  suggestedEnhancements: string[];
}

export const performDeepAnalysis = async (userPrompt: string): Promise<DeepAnalysisResult> => {
  const ai = getAIClient();
  
  const fallback: DeepAnalysisResult = {
    subject: { primary: 'general', secondary: [], semanticCategory: 'abstract', emotionalResonance: 'neutral' },
    composition: { recommendedFraming: 'centered', focalPoint: 'center', visualFlow: 'balanced', negativeSpace: 'moderate' },
    atmosphere: { mood: 'neutral', timeOfDay: 'day', weather: 'clear', ambiance: 'calm' },
    technicalRecommendations: { cameraAngle: 'eye level', lensType: '50mm', lightingSetup: 'natural', colorGrade: 'neutral', depthOfField: 'moderate' },
    artisticInfluences: [],
    suggestedEnhancements: []
  };

  if (!userPrompt.trim()) return fallback;

  const detectedStyle = detectArtisticStyleFromPrompt(userPrompt);
  const styleInfo = detectedStyle && ARTISTIC_STYLES[detectedStyle] ? ARTISTIC_STYLES[detectedStyle] : null;
  
  const cinematicDNAContext = Object.values(CINEMATIC_DNA_COMPONENTS)
    .map(c => `${c.name}: ${c.keywords.slice(0, 2).join(', ')}`)
    .join('; ');

  const lightingOptions = Object.values(LIGHTING_SETUPS)
    .map(l => l.name)
    .slice(0, 6)
    .join(', ');

  const colorGradeOptions = Object.values(COLOR_GRADES)
    .map(g => g.name)
    .slice(0, 6)
    .join(', ');

  const metaPrompt = `
    You are an expert Art Director performing DEEP SEMANTIC ANALYSIS of an image generation prompt.
    This is NOT basic analysis - provide detailed, actionable insights for maximizing image quality.

    **USER PROMPT:** "${userPrompt}"

    ${styleInfo ? `**DETECTED STYLE:** ${styleInfo.name}
    - Color Palette: ${styleInfo.colorPalette.join(', ')}
    - Techniques: ${styleInfo.techniques.join(', ')}
    - Best Use: ${styleInfo.bestUse.join(', ')}` : ''}

    **AVAILABLE CINEMATIC DNA COMPONENTS:**
    ${cinematicDNAContext}

    **AVAILABLE LIGHTING SETUPS:**
    ${lightingOptions}

    **AVAILABLE COLOR GRADES:**
    ${colorGradeOptions}

    Perform COMPREHENSIVE analysis covering:

    1. **SUBJECT ANALYSIS** (be specific):
       - Primary subject with detailed description
       - All secondary elements and their relationships
       - Semantic category (portrait/landscape/product/action/abstract/scene)
       - Emotional resonance and psychological impact

    2. **COMPOSITION RECOMMENDATIONS** (professional cinematography):
       - Recommended framing (close-up, medium, wide, extreme wide, Dutch angle, etc.)
       - Focal point placement (rule of thirds position, golden ratio, center power, etc.)
       - Visual flow direction (leading lines, eye path, compositional balance)
       - Negative space strategy (minimal, balanced, dramatic, asymmetric)

    3. **ATMOSPHERE** (environmental storytelling):
       - Dominant mood and secondary emotional tones
       - Specific time of day with lighting implications
       - Weather and atmospheric conditions
       - Overall ambiance and sensory qualities

    4. **TECHNICAL RECOMMENDATIONS** (professional equipment):
       - Camera angle (eye level, low angle, high angle, bird's eye, worm's eye)
       - Specific lens type with focal length (24mm wide, 35mm, 50mm, 85mm portrait, 135mm telephoto)
       - Lighting setup from available options
       - Color grade from available options
       - Depth of field (shallow bokeh, moderate, deep focus, selective focus)

    5. **ARTISTIC INFLUENCES** (up to 3):
       - Specific art movements, photographers, cinematographers, or artists
       - How each influence would enhance the image

    6. **SUGGESTED ENHANCEMENTS** (5 specific, actionable improvements):
       - Technical improvements for quality
       - Atmospheric additions for mood
       - Compositional refinements
       - Detail enhancements
       - Professional finishing touches

    Return a detailed JSON object with all fields populated.
  `.trim();

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
      config: { responseMimeType: "application/json" },
    }));

    const parsed = JSON.parse(response.text?.trim() || '{}');
    
    return {
      subject: {
        primary: parsed.subject?.primary || fallback.subject.primary,
        secondary: Array.isArray(parsed.subject?.secondary) ? parsed.subject.secondary : fallback.subject.secondary,
        semanticCategory: parsed.subject?.semanticCategory || fallback.subject.semanticCategory,
        emotionalResonance: parsed.subject?.emotionalResonance || fallback.subject.emotionalResonance
      },
      composition: {
        recommendedFraming: parsed.composition?.recommendedFraming || fallback.composition.recommendedFraming,
        focalPoint: parsed.composition?.focalPoint || fallback.composition.focalPoint,
        visualFlow: parsed.composition?.visualFlow || fallback.composition.visualFlow,
        negativeSpace: parsed.composition?.negativeSpace || fallback.composition.negativeSpace
      },
      atmosphere: {
        mood: parsed.atmosphere?.mood || fallback.atmosphere.mood,
        timeOfDay: parsed.atmosphere?.timeOfDay || fallback.atmosphere.timeOfDay,
        weather: parsed.atmosphere?.weather || fallback.atmosphere.weather,
        ambiance: parsed.atmosphere?.ambiance || fallback.atmosphere.ambiance
      },
      technicalRecommendations: {
        cameraAngle: parsed.technicalRecommendations?.cameraAngle || fallback.technicalRecommendations.cameraAngle,
        lensType: parsed.technicalRecommendations?.lensType || fallback.technicalRecommendations.lensType,
        lightingSetup: parsed.technicalRecommendations?.lightingSetup || fallback.technicalRecommendations.lightingSetup,
        colorGrade: parsed.technicalRecommendations?.colorGrade || fallback.technicalRecommendations.colorGrade,
        depthOfField: parsed.technicalRecommendations?.depthOfField || fallback.technicalRecommendations.depthOfField
      },
      artisticInfluences: Array.isArray(parsed.artisticInfluences) ? parsed.artisticInfluences : fallback.artisticInfluences,
      suggestedEnhancements: Array.isArray(parsed.suggestedEnhancements) ? parsed.suggestedEnhancements : fallback.suggestedEnhancements
    };
  } catch (error) {
    console.error("Deep Analysis Error:", error);
    return fallback;
  }
};

export interface DraftToFinalResult {
  draftPrompt: string;
  draftImages: GeneratedImageData[];
  refinedPrompt: string;
  finalImages: GeneratedImageData[];
  improvementNotes: string[];
  qualityScore: number;
}

export const draftToFinalWorkflow = async (
  userPrompt: string,
  analysis: PromptAnalysis,
  textInfo: DetectedTextInfo[],
  selectedStyle: string = 'auto',
  aspectRatio: string = '1:1'
): Promise<DraftToFinalResult> => {
  const ai = getAIClient();
  
  const draftPrompt = await enhanceStyle(userPrompt, analysis, textInfo, selectedStyle, 'draft');
  const draftImages = await generateImage(draftPrompt, aspectRatio, 1);
  
  const lightingRecommendation = selectLightingForSubject(analysis.subject.primary, analysis.mood.primary);
  const colorGrade = selectColorGradeForMood(analysis.mood.primary);
  const { camera, lens } = selectCameraForSubject(analysis.subject.primary);
  const detectedStyle = detectArtisticStyleFromPrompt(userPrompt);
  const styleEnhancement = detectedStyle ? getStylePromptEnhancement(detectedStyle) : '';
  
  const refinementPrompt = `
    You are refining a draft image prompt into a final, polished version.

    **DRAFT PROMPT:** "${draftPrompt}"
    **ORIGINAL USER INTENT:** "${userPrompt}"

    **CINEMATIC DNA TO APPLY:**
    ${buildCinematicDNA('professional')}

    **TECHNICAL RECOMMENDATIONS:**
    - Lighting: ${lightingRecommendation}
    - Color Grade: ${colorGrade.name} (${colorGrade.keywords.join(', ')})
    - Camera: ${camera.name}
    - Lens: ${lens.name}
    ${styleEnhancement ? `- Style: ${styleEnhancement}` : ''}

    Create a FINAL polished prompt that:
    1. Preserves all the good elements from the draft
    2. Applies ALL Cinematic DNA components for Hollywood-quality output
    3. Adds professional finishing touches (grain, bokeh, atmospheric depth)
    4. Uses the most specific technical photography terms
    5. Stays under 250 words

    Return ONLY the final prompt text.
  `.trim();

  try {
    const refinementResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: refinementPrompt,
    }));

    const refinedPrompt = refinementResponse.text?.trim() || draftPrompt;
    const finalImages = await generateImage(refinedPrompt, aspectRatio, 1);

    const improvementNotes = [
      `Applied ${Object.keys(CINEMATIC_DNA_COMPONENTS).length} Cinematic DNA components`,
      `Used ${camera.name} with ${lens.name} for professional quality`,
      `Applied ${colorGrade.name} color grading`,
      `Optimized lighting with ${lightingRecommendation}`,
      detectedStyle ? `Enhanced with ${ARTISTIC_STYLES[detectedStyle]?.name || detectedStyle} style` : null
    ].filter(Boolean) as string[];

    return {
      draftPrompt,
      draftImages,
      refinedPrompt,
      finalImages,
      improvementNotes,
      qualityScore: 0.85
    };
  } catch (error) {
    console.error("Draft to Final Workflow Error:", error);
    return {
      draftPrompt,
      draftImages,
      refinedPrompt: draftPrompt,
      finalImages: draftImages,
      improvementNotes: ['Fallback: Used draft as final'],
      qualityScore: 0.5
    };
  }
};
