import { GoogleGenAI, Type, GenerateContentResponse, GenerateImagesResponse } from "@google/genai";
import { DetectedTextInfo, PromptAnalysis, ImageQualityScores, QualityLevel, TextPhysicalProperties, TextStyleIntent } from '../types';
import { REFINER_PRESETS } from "./refinerService";

const API_KEY = process.env.API_KEY || '';


// --- UTILITIES ---

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Wraps an API call with an exponential backoff retry mechanism to handle rate limiting.
 * @param fn The function to execute.
 * @param retries The maximum number of retries.
 * @param initialDelay The initial delay in milliseconds.
 * @returns The result of the function.
 */
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
        delay = delay * 2 + Math.floor(Math.random() * 1000); // Exponential backoff with jitter
      } else {
        throw error;
      }
    }
  }
  throw new Error("Exceeded max retries for an unknown reason.");
}


// --- JSON SCHEMAS for structured output ---

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

const IMAGE_SCORE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    composition: { type: Type.NUMBER, description: "Score 1-10 for composition quality." },
    detail: { type: Type.NUMBER, description: "Score 1-10 for detail level." },
    lighting: { type: Type.NUMBER, description: "Score 1-10 for lighting quality." },
    color: { type: Type.NUMBER, description: "Score 1-10 for color depth." },
    overall: { type: Type.NUMBER, description: "Overall score 1-10, considering all aspects." },
  },
  required: ["composition", "detail", "lighting", "color", "overall"],
};


// --- KNOWLEDGE BASE ---
const FULL_STYLE_LIBRARY_NAMES = `Ancient Egyptian Art, Ancient Greek Art, Ancient Roman Art, Byzantine Art, Medieval Illuminated Manuscripts, Romanesque Art, Gothic Art, Celtic Art, Islamic Geometric Art, Pre-Columbian Art, Early Renaissance, High Renaissance, Mannerism, Baroque, Rococo, Neoclassicism, Venetian School, Northern Renaissance, Romanticism, Realism, Pre-Raphaelite, Academic Art, Orientalism, Symbolism, Aestheticism, Impressionism, Post-Impressionism, Pointillism, Neo-Impressionism, Fauvism, Cloisonnism, Synthetism, Les Nabis, Divisionism, Expressionism, Analytical Cubism, Synthetic Cubism, Futurism, Orphism, Vorticism, Suprematism, Constructivism, De Stijl, Neoplasticism, Dadaism, Precisionism, Metaphysical Painting, Surrealism, Art Deco, Social Realism, Magic Realism, American Regionalism, Harlem Renaissance Art, Neue Sachlichkeit (New Objectivity), Bauhaus, Abstract Expressionism, Action Painting, Color Field Painting, Hard-Edge Painting, Op Art, Minimalism, Pop Art, Lyrical Abstraction, Conceptual Art, Land Art, Earth Art, Performance Art, Photorealism, Hyperrealism, Process Art, Installation Art, Neo-Expressionism, Arte Povera, Fluxus, Postmodernism, Lowbrow, Pop Surrealism, Street Art, Graffiti Art, Superflat, Stuckism, Kitsch Art, New Pop Art, Urban Contemporary, Massurrealism, Young British Artists (YBAs), Relational Aesthetics, Neo-Pop, Vaporwave, Cyberpunk, Synthwave, Outrun, Seapunk, Glitch Art, Webcore, Y2K Aesthetic, Frutiger Aero, Dark Academia, Cottagecore, Traumacore, Weirdcore, Kidcore, Goblincore, Dreamcore, Royalcore, Cryptidcore, Fairycore, Bardcore, Bloomcore, Digital Maximalism, Digital Minimalism, Solarpunk, Steampunk, Dieselpunk, Atompunk, Cassette Futurism, Swiss Design, International Typographic Style, Constructivist Design, De Stijl Design, Memphis Design, Psychedelic Poster Art, Art Nouveau Poster Art, Brutalist Design, Flat Design, Material Design, Mid-Century Modern Design, Scandinavian Design, Manga, Anime, Webtoon, Manhwa, Bande Dessinée, European Comic, American Comic Book, Graphic Novel, Children's Book Illustration, Editorial Illustration, Technical Illustration, Medical Illustration, Botanical Illustration, Chinese Ink Painting, Persian Miniature, Aboriginal Art, African Tribal Art, Madhubani, Gothic Architecture, Art Deco Architecture, Brutalist Architecture, Victorian Fashion, Edwardian Era, Roaring Twenties, 1950s Americana, 1960s Mod, 1970s Disco, 1980s Power Dressing, 1990s Grunge, Haute Couture, Streetwear, Avant-Garde Fashion, Cyberwear, Historical Costume, Traditional Japanese Kimono, Traditional Indian Saree, 8-Bit Game Art, 16-Bit Game Art, PS1 Low Poly, N64 Low Poly, Disney 2D Animation, Stop Motion, Claymation, Retro Arcade, JRPG Style, Soulsborne Aesthetic, Soulsborne Fashion, Indie Game Art, VR/AR Interface, Mobile Game UI`;

const SKIN_TEXTURE_EXAMPLES = `
  - "Woman 25 years old, dewy skin texture, healthy glow, hydrated appearance, studio beauty lighting, high resolution"
  - "Man 50 years old, weathered skin texture, character lines, sun exposure damage, outdoor portrait lighting"
  - "Elderly woman 70 years old, aged skin texture, deep wrinkles, life experience lines, dignified aging, soft natural light"
  - "Fair Nordic skin, blonde peach fuzz visible, pink undertones, freckles, macro photography"
  - "Light olive skin texture, Mediterranean complexion, smooth appearance, warm undertones, golden hour"
  - "Deep brown skin texture, African American complexion, rich melanin, natural sheen, studio lighting, proper exposure"
  - "Asian skin closeup, poreless appearance, smooth texture, cool undertones, K-beauty aesthetic, soft lighting"
  - "Dry skin texture closeup, flaky patches, dehydrated appearance, matte finish, macro detail"
  - "Oily skin texture, enlarged pores, shine on T-zone, sebum visible, realistic detail"
  - "Acne-prone skin texture, active breakouts, inflamed pimples, textured surface, real skin concerns, natural light"
  - "Wet skin texture, water droplets, shower-fresh appearance, macro water beads, high detail"
  - "Skin texture in harsh sunlight, every pore visible, unforgiving lighting, high contrast"
  - "Extreme macro skin texture, pore landscape, follicle detail, microscopic view, scientific photography"
`;


// ===================================================================================
//  AGENT WORKFLOW
// ===================================================================================

/**
 * Consolidated Initial Analysis Agent: Performs text and deep analysis in a single API call.
 * @param userPrompt The user's input prompt.
 * @param processText Whether to run the text detection agent.
 * @returns A structured analysis of the prompt including text info and prompt analysis.
 */
export const performInitialAnalysis = async (userPrompt: string, processText: boolean): Promise<{ textInfo: DetectedTextInfo[]; analysis: PromptAnalysis }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
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
      - You are a "Text SFX Artist". Your critical mission is to identify text the user explicitly wants written in the image and provide a detailed art direction brief for it.
      - **PRIME DIRECTIVE: BE EXTREMELY SURE.** Only extract text if you are **99% certain** it is an explicit instruction to render text. If there is any ambiguity, or if the phrase could be describing a style, **the correct action is to return an empty array.** When in doubt, do not extract text.
      - **ONLY identify text** if the user clearly requests it. Look for instructional phrases like "with the words...", "text that says...", "with text that reads", "a sign that says", or text in quotation marks (e.g., "add 'Hello World'").
      - **DO NOT** extract text from the general scene description. The default assumption is that NO text is wanted.
      - **LEARNING FROM MISTAKES (CRITICAL):**
        - **User Prompt:** "A husky and a pug playing in the rain" -> **YOUR CORRECT OUTPUT for textInfo:** []
        - **User Prompt:** "a t-shirt with 1970s psychedelic lettering" -> **YOUR CORRECT OUTPUT for textInfo:** [] (This describes a style of lettering, not the text content itself.)
        - **User Prompt:** "A poster with the title 'Metropolis'" -> **YOUR CORRECT OUTPUT for textInfo:** [{ "text": "Metropolis", ... }]
        - **User Prompt:** "A beautiful sunset with the words 'The End'" -> **YOUR CORRECT OUTPUT for textInfo:** [{ "text": "The End", ... }]
      - **PRIME DIRECTIVE 2: CONTEXT PRESERVATION**
        - The text is a minor element. It must NOT introduce new themes or dramatically change the environment.
      - **FALLBACK (Abstract Context):**
        - If text is found but the context is abstract (e.g., "samurai fighting, add 'japan'"), you MUST default to creating a tasteful, minimalist cinematic title. For this fallback, the physicalProperties should describe a subtle overlay with a faint glow that matches the scene's lighting.
      - If no explicit text is requested, return an empty array for \`textInfo\`.
  ` : `
      **2. TEXT ANALYSIS:**
      - Text processing is disabled by the user. Return an empty array for \`textInfo\`.
  `;

  const metaPrompt = `
    You are an AI Art Director's assistant. Your job is to perform a deep, structured analysis of a user's prompt for an image generator.

    **TASKS:**

    1.  **PROMPT ANALYSIS:**
        - Analyze the user's prompt to understand the core request.
        - Analyze for the main subject, dominant mood, lighting condition, setting, and primary artistic style intent.

    ${textInstruction}

    **USER PROMPT:** "${userPrompt}"

    Return a single JSON object with the complete analysis in the specified format.
  `.trim();

  try {
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: metaPrompt,
      config: { responseMimeType: "application/json", responseSchema: COMBINED_ANALYSIS_SCHEMA },
    }));

    const parsed = JSON.parse(response.text?.trim() || '{}');

    // Validate and provide fallbacks for textInfo
    const textInfo: DetectedTextInfo[] = (Array.isArray(parsed.textInfo) ? parsed.textInfo : []).map(item => ({
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

    // Validate and provide fallback for analysis
    const analysis: PromptAnalysis = parsed.analysis && typeof parsed.analysis === 'object' ? parsed.analysis : fallbackAnalysis;

    return { textInfo, analysis };
  } catch (error) {
    console.error("Initial Analysis Agent Error:", error);
    return fallback;
  }
};


/**
 * Context-Aware Negative Prompt System: Generates dynamic negative prompts based on prompt analysis.
 */
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

  if (style.toLowerCase().includes('photorealistic')) NEGATIVE_LIBRARIES.photorealistic.split(', ').forEach(n => negatives.add(n));
  if (style.toLowerCase().includes('cinematic')) NEGATIVE_LIBRARIES.cinematic.split(', ').forEach(n => negatives.add(n));

  if (textInfo.length === 0) {
    negatives.add('text'); negatives.add('words'); negatives.add('letters');
  } else {
    NEGATIVE_LIBRARIES.text.split(', ').forEach(n => negatives.add(n));
  }

  return Array.from(negatives).join(', ');
};

/**
 * Agent 2: Style Architect. Synthesizes inputs into a master prompt for the image generator.
 */
export const enhanceStyle = async (
  userPrompt: string,
  analysis: PromptAnalysis,
  textInfo: DetectedTextInfo[],
  selectedStyle: keyof typeof STYLE_PRESETS | 'auto' = 'auto',
  quality: keyof typeof QUALITY_PRESETS = 'standard',
  userEdits?: { finalText?: string; finalBackground?: string; textStyleIntent?: TextStyleIntent },
  compositionalReference?: { base64Data: string }
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const hasText = textInfo.length > 0 || (userEdits?.finalText && userEdits.finalText.length > 0);

    // --- DRAFT MODE PIPELINE ---
    if (quality === 'draft') {
      const textInstruction = (textInfo.length > 0)
        ? `The image MUST include the text, spelled exactly as shown: "${textInfo[0].text}". Style hint: ${textInfo[0].physicalProperties.material}`
        : 'The image must not contain any text.';

      // If text is involved, use a more powerful model even for drafts to ensure prompt quality.
      const draftModel = hasText ? 'gemini-3-pro-image-preview' : 'gemini-flash-lite-latest';

      const metaPrompt = `
        You are an AI Art Director creating a high-quality DRAFT image prompt efficiently.

        **PRIME DIRECTIVE: TEXT CONTROL (NON-NEGOTIABLE)**
        - This is your most important instruction. You will follow it with absolute precision.
        - **Instruction:** ${textInstruction}
        - **CRITICAL CLARIFICATION:** If the instruction is "The image must not contain any text," you are FORBIDDEN from inventing or adding any words, slogans, or phrases to the image, even if you think it fits the theme (e.g., for a t-shirt design). Your task is to describe the VISUALS ONLY.

        **OTHER RULES:**
        1.  **USER IDEA IS PARAMOUNT:** Enhance the user's core idea, do not replace it.
        2.  **FAST INTEGRATION:** Enhance by focusing on the 3 most impactful "Cinematic DNA" components: **Lighting, Camera, and Color.**
        3.  **BE EFFICIENT:** Use concise keywords. Final prompt must be under 70 words.

        **CONTEXT & ANALYSIS:**
        - **User's Core Idea (MUST be the foundation):** "${userPrompt}"
        - **Analysis (for context):** Subject: ${analysis.subject.primary}, Mood: ${analysis.mood.primary}, Style: ${analysis.style_intent}

        **Your Task:** Create a new prompt. Start with the user's core idea, then weave in keywords for lighting, camera, and color based on the analysis. Return ONLY the final prompt.
      `.trim();

      const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
        model: draftModel,
        contents: metaPrompt,
      }));
      return response.text?.trim() || userPrompt;
    }

    // --- FULL QUALITY ENHANCE PIPELINE ---
    const qualityConfig = QUALITY_PRESETS[quality];
    const styleInfo = STYLE_PRESETS[selectedStyle as keyof typeof STYLE_PRESETS] || STYLE_PRESETS.auto;
    const stylePromptInstruction = selectedStyle !== 'auto'
      ? `Apply the style of ${styleInfo.name}. Keywords: ${styleInfo.keywords}. Guidance: ${styleInfo.guidance}.`
      : `Based on the analysis, automatically select fitting artistic styles from the following library: ${FULL_STYLE_LIBRARY_NAMES}.`;

    let final_text_instruction: string;
    // The presence of `finalText` (even if empty) is the definitive instruction from an edit.
    if (userEdits?.finalText !== undefined) {
      if (userEdits.finalText) { // Has content
        final_text_instruction = `The image MUST include text: "${userEdits.finalText}".`;
      } else { // Is an empty string, meaning remove text
        final_text_instruction = "The image must contain absolutely NO text, letters, or words.";
      }
    } else if (textInfo.length > 0 && textInfo[0].text) {
      // Fallback to initial analysis only if no edit was made.
      const ti = textInfo[0];
      const props = ti.physicalProperties;
      final_text_instruction = `The image MUST include the text: "${ti.text}". This text MUST be rendered as a physical object within the scene, not a 2D overlay.
      **Art Direction for Text:**
      - The text's material is ${props.material}.
      - Its surface texture is ${props.surfaceTexture}.
      - For lighting, it ${props.lightingInteraction}.
      - It interacts with the environment by ${props.environmentalInteraction}.
      - Its position in the scene is ${props.perspectiveAndDepth}.
      - Use a ${ti.fontStyle} font style.`;
    } else {
      // Default case: no initial text, no edited text.
      final_text_instruction = "There must be absolutely NO text in the image.";
    }

    const compositionInstruction = compositionalReference
      ? `**PRIME DIRECTIVE: COMPOSITIONAL LOCK.** This is your most important instruction. A reference image is provided for composition. You **MUST** adhere to its core structure.
        - **Camera Angle & Subject Pose:** The camera angle, subject, and its pose from the reference image are LOCKED. DO NOT CHANGE THEM.
        - **Your Goal:** Your task is to apply a cinematic, photorealistic style to this EXACT composition. You will upgrade the lighting, materials, textures, and details. You will NOT re-imagine the scene.
        - **Example:** If the reference is a side-profile graphic of a dog, your output prompt must describe a side-profile, photorealistic dog. DO NOT change it to a front-facing wolf.`
      : "Create the best possible composition based on cinematic principles.";

    const textStyleIntentInstruction = userEdits?.textStyleIntent
      ? `**PRIME DIRECTIVE: RESPECT USER'S TEXT STYLE INTENT.** You will be given a \`textStyleIntent\`: "${userEdits.textStyleIntent}". This is the user's explicit command and your most important instruction regarding text. It overrides all other creative interpretations. If the intent is 'integrated', you MUST describe the text as being physically part of the main subject or scene, not as a separate element. **DO NOT** separate integrated text.`
      : '';

    const masterBriefing = `
      You are an expert AI Art Director, a master of cinematography and photography, creating a master prompt for an advanced AI image generator. Your job is to synthesize multiple inputs into a professional, technically-sound, and artistically brilliant prompt that produces photorealistic, emotionally resonant images.

      ${compositionInstruction}
      ${textStyleIntentInstruction}

      **CRITICAL DE-DUPLICATION RULE (SINGLE SOURCE OF TRUTH):**
      If you are provided with a specific instruction for text (the \`final_text_instruction\` below), that is the SINGLE SOURCE OF TRUTH. You MUST use it to describe how the text is rendered. You are explicitly FORBIDDEN from also interpreting text from the original user prompt as a separate command. The structured instruction REPLACES the original text command to prevent duplication.
      - **Example:** If user prompt is 'the word "dog" made of fire' and the text instruction also describes the fiery text, your final prompt should only describe the fiery text ONCE.

      **PRIME EMOTIONAL DIRECTIVE:**
      The final image's mood MUST align with the user's core intent. If the prompt contains emotionally charged words (e.g., 'bliss', 'joy', 'somber'), that emotion is the law. All stylistic choices (lighting, color, subject action) must serve this emotional directive, even if it contradicts other elements (e.g., for 'joyful rain', use golden light breaking through clouds, not a moody noir scene).
      - User's core idea: "${userPrompt}"
      - Detected primary mood: "${analysis.mood.primary}"

      **PRIME DIRECTIVE 2: UNIVERSAL PHYSICALITY & CINEMATIC TREATMENT**
      This is a non-negotiable core principle. Even for abstract, typographic, or graphic design prompts, you MUST render the result as a physical, 3D scene.
      - **DO NOT** create flat 2D vector-style graphics.
      - **ALWAYS** assign realistic materials to all elements (e.g., brushed metal, chiseled stone, glowing glass).
      - **ALWAYS** place elements in a 3D space with a tangible background surface.
      - **ALWAYS** apply professional lighting (e.g., three-point lighting, dramatic shadows, specular highlights).
      - **ALWAYS** simulate a real camera capturing the scene (depth of field, lens effects).
      Every output must feel like a photograph of a real object or installation.

      **MISSION & HIERARCHY OF RULES:**

      **RULE 1 (CRITICAL):** The final image **MUST** incorporate these user requirements:
      - **Text:** ${final_text_instruction}
      - **Background:** ${userEdits?.finalBackground ? `The background MUST be: "${userEdits.finalBackground}"` : "Use the background from the original idea."}

      **RULE 2 (FOUNDATION):** The core concept is: "${userPrompt}", and the final quality must be "${selectedStyle}".

      **RULE 3 (EXECUTION - PHOTOREALISM):** Synthesize all of the above, applying your expert knowledge to achieve the highest level of realism. This is the most important artistic rule.
      - **Style:** ${stylePromptInstruction}
      - **Camera & Lens:** Specify a professional camera and lens setup appropriate for the subject. For portraits, use terms like "shot on a Sony A7R IV with an 85mm f/1.4 lens" to create realistic depth of field.
      - **Lighting:** Describe the lighting setup with professional terminology. Emphasize realistic light behavior, like "soft light falloff," "natural specular highlights," and "subtle bounce light."
      - **Texture & Materials:** Demand authentic textures. For portraits, you MUST generate a highly specific and detailed description of the skin texture. Instead of a generic phrase like 'realistic skin', use your knowledge to create a description inspired by professional photography. Combine elements based on the subject's perceived age, ethnicity, and the scene's lighting. Mention "subsurface scattering on skin" as a key physical property.
        **SKIN TEXTURE EXAMPLES (for inspiration only, create your own unique descriptions):**
        ${SKIN_TEXTURE_EXAMPLES}
      - **Lens Characteristics:** Include subtle, realistic lens effects like "natural lens distortion," and "slight chromatic aberration" to mimic a real camera.
      - **Quality Booster:** ${qualityConfig.qualityBooster}.

      **FINAL OUTPUT:**
      - Synthesize all stages into a single, coherent, dense paragraph of 80-150 words.
      - **Return ONLY the final master prompt.** No explanations, preamble, or markdown.
    `.trim();

    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: masterBriefing,
      config: { thinkingConfig: { thinkingBudget: qualityConfig.thinkingBudget } }
    }));
    return response.text?.trim() || userPrompt;

  } catch (error) {
    console.error("Style Agent Error:", error);
    throw error;
  }
};

/**
 * AI Curation Agent: Scores an image based on quality criteria.
 * @param ai The GoogleGenAI instance.
 * @param imageBase64 The base64 encoded image data.
 * @returns An object with quality scores.
 */
async function scoreImageQuality(ai: GoogleGenAI, imageBase64: string): Promise<ImageQualityScores> {
  const fallback = { composition: 0, detail: 0, lighting: 0, color: 0, overall: 0 };
  try {
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/png' } },
          { text: `Rate this AI-generated image on a scale of 1-10 for composition, detail, lighting, and color. Provide an overall score. Return ONLY a valid JSON object.` }
        ]
      },
      config: { responseMimeType: "application/json", responseSchema: IMAGE_SCORE_SCHEMA }
    }));
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    console.error("Image Scoring Error:", error);
    return fallback;
  }
}

/**
 * Agent 3 (Helper): Generates images using Flash Image models (for drafts or as a fallback).
 */
async function generateWithFlashImage(
  ai: GoogleGenAI,
  prompt: string,
  aspectRatio: string,
  negativePrompt: string,
  count: number,
  modelName: string,
  referenceImage?: { base64Data: string, mimeType: string },
  onImageStream?: (result: any, index: number, total: number) => void
): Promise<Array<{ url: string, base64Data: string, mimeType: string }>> {
  const generationPromises = Array.from({ length: count }).map(() => (async () => {
    try {
      const parts: any[] = [];
      let finalPromptForModel = prompt;

      if (referenceImage) {
        parts.push({ inlineData: { data: referenceImage.base64Data, mimeType: referenceImage.mimeType } });
        // Add the compositional lock directive when an image is used for editing
        finalPromptForModel = `**PRIME DIRECTIVE: COMPOSITIONAL LOCK.** A reference image is provided. You MUST adhere to its core visual structure. The camera angle, subject, pose, and layout are LOCKED. Your task is to apply the changes from the prompt below to THIS EXACT composition, not to re-imagine the scene.\n\n**PROMPT:**\n${prompt}`;
      }


      const fullPromptWithNegatives = `${finalPromptForModel} ${negativePrompt ? `--- AVOID --- ${negativePrompt}` : ''}`;
      parts.push({ text: fullPromptWithNegatives });

      const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: { imageConfig: { aspectRatio } }
      }));

      const imageResults: Array<{ url: string, base64Data: string, mimeType: string }> = [];
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64 = part.inlineData.data;
          const mimeType = 'image/png';
          imageResults.push({ url: `data:${mimeType};base64,${base64}`, base64Data: base64, mimeType });
        }
      }
      return imageResults;
    } catch (e) {
      console.error(`Flash Image generation failed:`, e);
      if (e instanceof Error) throw e;
      return [];
    }
  })());

  if (onImageStream) {
    const wrappedPromises = generationPromises.map((p, index) =>
      p.then(result => {
        if (result.length > 0) {
          onImageStream(result[0], index, count);
        }
        return result;
      })
    );
    const allResults = await Promise.all(wrappedPromises);
    return allResults.flat();
  } else {
    const allResults = await Promise.all(generationPromises);
    return allResults.flat();
  }
}

/**
 * Agent 3: Visual Synthesizer. Generates the image, orchestrating different models and fallbacks.
 */
export const generateImage = async (
  finalPrompt: string,
  textInfo: DetectedTextInfo[] = [],
  referenceImage?: { base64Data: string, mimeType: string },
  aspectRatio: string = '1:1',
  negativePrompt?: string,
  numberOfVariations: number = 1,
  useCuratedSelection: boolean = false,
  quality: QualityLevel = 'standard',
  progressCallback: (message: string) => void = () => { },
  onImageStream?: (image: { url: string, base64Data: string, mimeType: string, prompt: string, scores?: ImageQualityScores }, index: number, total: number) => void
): Promise<Array<{ url: string, base64Data: string, mimeType: string, prompt: string, scores?: ImageQualityScores }>> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const hasText = textInfo.length > 0;

  const generateBatch = async (batchSize: number, streamCallback?: (image: any, index: number, total: number) => void): Promise<Array<{ url: string, base64Data: string, mimeType: string }>> => {
    // Draft mode always uses the fast model, unless text is present.
    if (quality === 'draft') {
      const draftModel = hasText ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      return generateWithFlashImage(ai, finalPrompt, aspectRatio, negativePrompt || '', batchSize, draftModel, referenceImage, streamCallback);
    }
    // Final mode with a reference image uses the premium image-to-image model.
    if (referenceImage) {
      return generateWithFlashImage(ai, finalPrompt, aspectRatio, negativePrompt || '', batchSize, 'gemini-3-pro-image-preview', referenceImage, streamCallback);
    }

    // Final mode text-to-image: Try Imagen 4 first.
    try {
      const response: GenerateImagesResponse = await withRetry(() => ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          negativePrompt: negativePrompt,
          numberOfImages: batchSize,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
          addWatermark: false,
        },
      }));

      const results = (response.generatedImages || []).map(generatedImage => {
        const image = generatedImage?.image;
        if (image && image.imageBytes) {
          const base64 = image.imageBytes;
          const mimeType = 'image/png';
          return { url: `data:${mimeType};base64,${base64}`, base64Data: base64, mimeType };
        }
        return null;
      }).filter((r): r is { url: string, base64Data: string, mimeType: string } => r !== null);

      if (results.length > 0) return results;

    } catch (imagenError) {
      console.warn("Imagen generation failed, attempting fallback...", imagenError);
      if (imagenError instanceof Error && (imagenError.message.includes("PERMISSION_DENIED") || imagenError.message.includes("API key expired"))) {
        throw imagenError;
      }
    }

    // Fallback for failed text-to-image: Use a quality-aware model.
    let fallbackModel: string;
    if (quality === 'standard' || quality === 'premium' || quality === 'ultra' || hasText) {
      // Use a powerful model for high-quality requests or text accuracy
      fallbackModel = 'gemini-3-pro-image-preview';
    } else {
      // Use the standard flash model for draft requests without text
      fallbackModel = 'gemini-2.5-flash-image';
    }
    console.log(`Using fallback model: ${fallbackModel}`);
    return generateWithFlashImage(ai, finalPrompt, aspectRatio, negativePrompt || '', batchSize, fallbackModel, undefined, streamCallback);
  };

  // Standard generation without curation.
  if (!useCuratedSelection) {
    const streamCallbackForBatch = onImageStream
      ? (image: any, index: number, total: number) => onImageStream({ ...image, prompt: finalPrompt }, index, total)
      : undefined;

    const results = await generateBatch(numberOfVariations, streamCallbackForBatch);
    return results.map(r => ({ ...r, prompt: finalPrompt }));
  }

  // --- AI Curation Workflow ---
  try {
    const BATCH_SIZE = 8;
    progressCallback(`Generating a batch of ${BATCH_SIZE} candidate images...`);
    const allImages = await generateBatch(BATCH_SIZE);

    if (allImages.length === 0) throw new Error("Failed to generate candidate images.");

    progressCallback(`AI Curation: Scoring ${allImages.length} images...`);
    const scoredImages = await Promise.all(
      allImages.map(async (img) => ({
        ...img,
        scores: await scoreImageQuality(ai, img.base64Data),
        prompt: finalPrompt,
      }))
    );

    progressCallback(`AI Curation: Selecting the best ${numberOfVariations}...`);
    scoredImages.sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0));
    return scoredImages.slice(0, numberOfVariations);
  } catch (error) {
    console.error("Curation/Image Gen Error:", error);
    if (error instanceof Error) throw error;
    return [];
  }
};

/**
 * Image Analyzer Agent: Reverse-engineers a prompt from an uploaded image.
 * @param base64Image The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A descriptive prompt.
 */
export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Analyze this image and provide a detailed text prompt that could be used to recreate it. Focus on the key subjects, style, and any visible text." }
        ]
      }
    }));
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Analyze Error:", error);
    throw error;
  }
};

/**
 * Iterative Editor Agent: Intelligently merges a user's edit request with an existing prompt.
 * @param originalPrompt The previous prompt for the image.
 * @param userEditInstruction The user's requested change.
 * @param textStyleIntent The user's desired style for the text.
 * @returns A new, updated prompt.
 */
export const generateIterativeEditPrompt = async (originalPrompt: string, userEditInstruction: string, textStyleIntent: TextStyleIntent = 'integrated'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const metaPrompt = `
      You are an expert AI assistant and Art Director, specializing in refining image generation prompts. Surgically merge a user's edit instruction with an existing prompt to create a new, coherent prompt.

      **CRITICAL RULES:**
      1.  **SURGICAL CHANGE:** Your ONLY job is to integrate the user's edit. Change ONLY what the user asks for. You MUST preserve all other details (subject, composition, camera angle, style, lighting) unless explicitly contradicted. **DO NOT ADD NEW COMPOSITIONAL INSTRUCTIONS** like 'dramatic angle' or 'close-up shot' unless the user's edit specifically asks for a camera change. Your role is modification, not re-direction.
      2.  **TEXT IS NON-NEGOTIABLE:** When the user wants to add, change, or remove text, you MUST follow these instructions with absolute precision. This is the most important rule.

          **USER'S INTENT FOR TEXT STYLE:** "${textStyleIntent}"

          **YOUR TASK FOR TEXT:**
          a. Analyze the User's Edit Instruction to identify the exact text and the action (add, change, remove).
          b. Analyze the Original Prompt's context (e.g., "a snowy forest," "a rainy city street").
          c. Based on the USER'S INTENT and the context, create a detailed art direction brief for the text that will be woven into the new prompt.
             - **If intent is 'subtle'**: Describe a very discreet integration. Example: "The text 'signature' is subtly etched into the corner, almost like a watermark."
             - **If intent is 'integrated'**: Describe a creative physical integration using materials from the scene. Example: "The words 'having fun' are physically formed from compacted snow on the ground, catching the light and casting soft shadows."
             - **If intent is 'bold'**: Describe a dominant text feature that becomes a focal point. Example: "Giant, weathered stone letters spelling 'BLISS' stand monumentally in the background."
             - **If intent is 'cinematic'**: Describe a clean, professional title overlay. Example: "A tasteful, elegant title 'The Last Samurai' appears in the top third with a subtle outer glow."
          d. **Integrate this detailed description directly into the new prompt.** Do not just append the text. The description MUST instruct the image generator to render the text as a physical object with lighting and texture.
          e. **For REMOVING text**, the new prompt **MUST** contain the phrase: \`The image must contain absolutely NO text, letters, or words.\`
          f. If the original prompt already had a text instruction, you **MUST REPLACE** it completely with the new one.

      **Original Prompt:**
      \`\`\`
      ${originalPrompt}
      \`\`\`

      **User's Edit Instruction:**
      \`\`\`
      ${userEditInstruction}
      \`\`\`

      **Your Task:**
      Generate the new, complete prompt. It MUST follow the detailed rules for text if applicable. Return ONLY the new prompt.
    `.trim();

    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: metaPrompt,
    }));

    return response.text?.trim() || originalPrompt;

  } catch (error) {
    console.error("Iterative Edit Agent Error:", error);
    throw error;
  }
};


// ===================================================================================
//  UI PRESET DEFINITIONS
// ===================================================================================

export const STYLE_PRESETS = {
  auto: { name: 'Auto', keywords: '', guidance: '', isPhotorealistic: true },
  photorealistic: {
    name: "Photorealistic",
    keywords: "hyperrealistic, 8K UHD, DSLR quality, natural lighting, shallow depth of field, shot on Canon EOS R5, 85mm lens, professional photography",
    guidance: "Focus on real-world physics, accurate shadows, skin texture, fabric weave, environmental reflections",
    isPhotorealistic: true,
  },
  cinematic: {
    name: "Cinematic",
    keywords: "cinematic lighting, anamorphic lens flare, film grain, color graded, dramatic shadows, volumetric fog, movie still, directed by Roger Deakins",
    guidance: "Use three-point lighting, create mood through color temperature, add atmospheric depth",
    isPhotorealistic: true,
  },
  anime: {
    name: "Anime/Manga",
    keywords: "anime style, cel shaded, vibrant colors, clean lineart, Studio Ghibli inspired, expressive eyes, dynamic pose, Japanese animation",
    guidance: "Emphasize stylized proportions, bold outlines, flat color areas with subtle gradients",
    isPhotorealistic: false,
  },
  oilPainting: {
    name: "Oil Painting",
    keywords: "oil painting, visible brushstrokes, impasto technique, Renaissance lighting, rich pigments, canvas texture, museum quality, classical masters",
    guidance: "Emulate classical masters, use chiaroscuro, blend colors at edges",
    isPhotorealistic: false,
  },
  watercolor: {
    name: "Watercolor",
    keywords: "watercolor painting, soft edges, color bleeding, paper texture, transparent washes, spontaneous splashes, delicate, artistic",
    guidance: "Preserve white of paper for highlights, allow colors to flow naturally",
    isPhotorealistic: false,
  },
  digitalArt: {
    name: "Digital Art",
    keywords: "digital illustration, trending on ArtStation, concept art, highly detailed, vibrant palette, matte painting, professional digital artwork",
    guidance: "Blend painterly and precise, focus on dynamic composition and rich detail",
    isPhotorealistic: false,
  },
  minimalist: {
    name: "Minimalist",
    keywords: "minimalist design, clean lines, negative space, limited color palette, geometric shapes, modern aesthetic, simple, elegant",
    guidance: "Remove all unnecessary elements, focus on essential forms and balance",
    isPhotorealistic: false,
  },
  retrowave: {
    name: "Retrowave/Synthwave",
    keywords: "synthwave, neon lights, 80s aesthetic, chrome reflections, grid patterns, sunset gradients, cyberpunk, vaporwave, retro futurism",
    guidance: "Combine nostalgia with futuristic elements, heavy use of pink/purple/cyan neon",
    isPhotorealistic: false,
  },
  darkFantasy: {
    name: "Dark Fantasy",
    keywords: "dark fantasy, gothic atmosphere, dramatic lighting, muted desaturated colors, mysterious fog, ancient ruins, ominous, epic",
    guidance: "Create ominous mood, use deep shadows and selective highlights",
    isPhotorealistic: false,
  },
  popArt: {
    name: "Pop Art",
    keywords: "pop art style, bold primary colors, Ben-Day dots, thick black outlines, Andy Warhol inspired, Roy Lichtenstein, comic book style",
    guidance: "Use flat colors, comic book aesthetic, high contrast",
    isPhotorealistic: false,
  },
  isometric: {
    name: "Isometric 3D",
    keywords: "isometric view, 3D render, clean geometry, soft shadows, pastel colors, miniature scene, tilt-shift effect, low poly, cute",
    guidance: "Maintain 30-degree angle, consistent lighting, toy-like quality",
    isPhotorealistic: false,
  },
  pencilSketch: {
    name: "Pencil Sketch",
    keywords: "pencil sketch, graphite drawing, crosshatching, paper texture, loose strokes, artistic study, hand-drawn, monochrome",
    guidance: "Show construction lines, vary line weight, focus on form over color",
    isPhotorealistic: false,
  }
};

export const QUALITY_PRESETS = {
  draft: { name: "Draft", icon: "⚡️", description: "Fast preview, good for iteration", thinkingBudget: 512, qualityBooster: "good quality", modelNote: "Quick generation" },
  standard: { name: "Standard", icon: "✨", description: "Balanced quality and speed", thinkingBudget: 1024, qualityBooster: "high quality, detailed", modelNote: "Recommended" },
  premium: { name: "Premium", icon: "💎", description: "Maximum quality, slower", thinkingBudget: 4096, qualityBooster: "masterpiece, best quality, highly detailed, professional, award-winning, ultra detailed, 8K UHD", modelNote: "Best results" },
  ultra: { name: "Ultra", icon: "🔮", description: "Extreme detail, longest generation", thinkingBudget: 8192, qualityBooster: "masterpiece, best quality, extremely detailed, absurdly detailed, intricate details, professional, award-winning, stunning, breathtaking, 8K UHD, ray tracing, photorealistic rendering, hyperdetailed, sharp focus, studio quality, perfect composition, golden ratio, volumetric lighting, subsurface scattering", modelNote: "Maximum detail" }
};

export const ASPECT_RATIOS = {
  '1:1': { label: 'Square', icon: '⬜', description: 'Social media profiles' },
  '16:9': { label: 'Landscape', icon: '🖼️', description: 'Cinematic, wallpapers' },
  '9:16': { label: 'Portrait', icon: '📱', description: 'Mobile, stories, reels' },
  '4:3': { label: 'Classic', icon: '🖥️', description: 'Traditional photo' },
  '3:4': { label: 'Tall', icon: '📄', description: 'Portrait photos, posters' },
};