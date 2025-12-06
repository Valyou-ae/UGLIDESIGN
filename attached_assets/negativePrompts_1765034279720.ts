/**
 * NEGATIVE PROMPTS KNOWLEDGE BASE
 * Quality control exclusions and unwanted artifacts for AI-generated product mockups
 * Version: 1.0
 * Last Updated: 2025-12-01
 * 
 * Purpose: Provides comprehensive negative prompts to prevent common AI generation issues,
 * technical flaws, unwanted styles, and artifacts that reduce mockup quality and realism.
 * These prompts tell the AI what NOT to generate.
 */

export interface NegativePromptCategory {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  applicableFor: string[];
}

// ============================================================================
// CRITICAL TECHNICAL FLAWS (Always Exclude)
// ============================================================================

export const TECHNICAL_FLAWS: NegativePromptCategory = {
  id: 'technical-flaws',
  name: 'Technical Quality Flaws',
  description: 'Critical technical issues that destroy image quality and realism',
  severity: 'critical',
  applicableFor: ['all'],
  prompts: [
    // Blur and Focus Issues
    'blurry',
    'out of focus',
    'soft focus',
    'motion blur',
    'bokeh on subject',
    'unfocused',
    'lack of sharpness',
    'fuzzy details',
    
    // Noise and Artifacts
    'grainy',
    'noisy',
    'pixelated',
    'jpeg artifacts',
    'compression artifacts',
    'digital noise',
    'ISO noise',
    'banding',
    'posterization',
    'color banding',
    
    // Exposure Problems
    'overexposed',
    'underexposed',
    'blown out highlights',
    'crushed blacks',
    'clipped highlights',
    'loss of detail in shadows',
    'extreme contrast',
    'washed out colors',
    
    // Color Issues
    'color cast',
    'wrong white balance',
    'oversaturated',
    'undersaturated',
    'unnatural colors',
    'incorrect skin tones',
    'color fringing',
    'chromatic aberration',
    'purple fringing',
    
    // Distortion Issues
    'lens distortion',
    'barrel distortion',
    'pincushion distortion',
    'perspective distortion',
    'warped lines',
    'curved straight lines',
    'fisheye effect',
    'stretched proportions'
  ]
};

// ============================================================================
// AI GENERATION ARTIFACTS (Common AI Problems)
// ============================================================================

export const AI_ARTIFACTS: NegativePromptCategory = {
  id: 'ai-artifacts',
  name: 'AI Generation Artifacts',
  description: 'Common problems specific to AI-generated images',
  severity: 'critical',
  applicableFor: ['all'],
  prompts: [
    // Structural Problems
    'deformed',
    'disfigured',
    'malformed',
    'mutated',
    'ugly',
    'poorly drawn',
    'bad anatomy',
    'wrong anatomy',
    'extra limbs',
    'missing limbs',
    'floating limbs',
    'disconnected limbs',
    'mutation',
    'mutilated',
    
    // Hand and Face Issues (for human subjects)
    'bad hands',
    'fused fingers',
    'too many fingers',
    'missing fingers',
    'extra fingers',
    'long neck',
    'duplicate',
    'morbid',
    'mutilated hands',
    'poorly drawn hands',
    'poorly drawn face',
    'bad proportions',
    'extra heads',
    'two heads',
    
    // Duplication Issues
    'duplicate',
    'multi',
    'two faces',
    'two of the same object',
    'cloned',
    'copy',
    
    // Text and Watermarks
    'watermark',
    'signature',
    'text',
    'logo',
    'username',
    'copyright',
    'dated',
    'timestamp',
    'words',
    'letters',
    'writing',
    'signed',
    
    // Low Quality Indicators
    'low quality',
    'low res',
    'normal quality',
    'worst quality',
    'error',
    'cropped',
    'lowres',
    'jpeg artifacts',
    'draft',
    'sketch'
  ]
};

// ============================================================================
// UNWANTED STYLES & AESTHETICS
// ============================================================================

export const UNWANTED_STYLES: NegativePromptCategory = {
  id: 'unwanted-styles',
  name: 'Unwanted Style Elements',
  description: 'Style and aesthetic elements that conflict with photorealism',
  severity: 'high',
  applicableFor: ['photorealistic-mockups'],
  prompts: [
    // Artistic Styles (avoid for photorealism)
    'painting',
    'drawing',
    'illustration',
    'sketch',
    'cartoon',
    'anime',
    'comic',
    'graphic novel',
    '3D render',
    'CGI',
    'digital art',
    'concept art',
    'oil painting',
    'watercolor',
    'pencil drawing',
    
    // Non-Realistic Rendering
    'artistic',
    'stylized',
    'abstract',
    'surreal',
    'fantasy',
    'unrealistic',
    'imaginary',
    'fictional',
    'fake looking',
    'computer generated look',
    'synthetic',
    
    // Filter and Effect Overuse
    'HDR',
    'excessive HDR',
    'over-processed',
    'heavy filters',
    'Instagram filter',
    'fake colors',
    'artificial saturation',
    'over-sharpened',
    'halo effect',
    'excessive clarity',
    
    // Wrong Era/Style
    'vintage',
    'retro',
    'old photo',
    'aged',
    'antique',
    'sepia',
    'black and white',
    'grayscale',
    'monochrome',
    'faded',
    
    // Wrong Medium
    'screenshot',
    'phone camera',
    'amateur photo',
    'selfie',
    'webcam',
    'security camera',
    'CCTV',
    'dashcam',
    'screen capture'
  ]
};

// ============================================================================
// PRODUCT-SPECIFIC: PHONE CASE NEGATIVE PROMPTS
// ============================================================================

export const PHONE_CASE_NEGATIVES: NegativePromptCategory = {
  id: 'phone-case-negatives',
  name: 'Phone Case Specific Exclusions',
  description: 'Negative prompts specific to phone case mockups',
  severity: 'high',
  applicableFor: ['phone-case', 'tech-accessories'],
  prompts: [
    // Design Issues
    'distorted design',
    'warped pattern',
    'stretched graphics',
    'skewed print',
    'misaligned design',
    'off-center print',
    'design bleeding off edges',
    'incomplete design',
    'cut off graphics',
    
    // Physical Case Problems
    'damaged case',
    'scratched',
    'cracked',
    'broken',
    'dirty',
    'worn',
    'old',
    'used looking',
    'scuffed',
    'chipped',
    
    // Incorrect Case Type
    'wrong phone model',
    'incorrect cutouts',
    'misaligned buttons',
    'blocked camera',
    'incorrect size',
    'doesn\'t fit',
    
    // Material Issues
    'cheap looking',
    'plastic sheen',
    'glossy when should be matte',
    'matte when should be glossy',
    'wrong material texture',
    'fake leather',
    'poor quality material',
    
    // Reflections and Lighting
    'excessive glare',
    'screen glare',
    'reflection obscuring design',
    'hotspot on case',
    'lens flare on product',
    
    // Composition Issues
    'case too small in frame',
    'case cut off',
    'awkward angle',
    'floating in space',
    'no context',
    'unrealistic positioning'
  ]
};

// ============================================================================
// PRODUCT-SPECIFIC: APPAREL/T-SHIRT NEGATIVE PROMPTS
// ============================================================================

export const APPAREL_NEGATIVES: NegativePromptCategory = {
  id: 'apparel-negatives',
  name: 'Apparel Specific Exclusions',
  description: 'Negative prompts specific to apparel and t-shirt mockups',
  severity: 'high',
  applicableFor: ['apparel', 't-shirt', 'clothing'],
  prompts: [
    // Design Problems
    'distorted print',
    'warped design',
    'stretched graphic',
    'compressed design',
    'skewed text',
    'unreadable text',
    'design not following fabric contours',
    'flat design on curved surface',
    'design floating above fabric',
    'design not wrapping correctly',
    
    // Fabric and Material Issues
    'wrinkled',
    'creased',
    'folded incorrectly',
    'bunched up',
    'stretched fabric',
    'saggy',
    'ill-fitting',
    'too tight',
    'too loose',
    'poor draping',
    'stiff fabric',
    'unnatural fabric behavior',
    
    // Print Quality Issues
    'pixelated print',
    'low resolution design',
    'blurry graphics',
    'faded print',
    'cracked print',
    'peeling design',
    'vintage distressed when shouldn\'t be',
    'wrong print technique look',
    
    // Fit and Construction
    'wrong size',
    'incorrect proportions',
    'uneven seams',
    'twisted garment',
    'inside out',
    'backwards',
    'incorrect neckline',
    'wrong collar',
    'misshapen',
    
    // Model Issues (when applicable)
    'awkward pose',
    'stiff posture',
    'unnatural expression',
    'forced smile',
    'uncomfortable looking',
    'bad body proportions',
    'unrealistic figure',
    
    // Color and Tone
    'wrong fabric color',
    'color bleeding',
    'uneven color',
    'faded areas',
    'discolored',
    'wrong undertone',
    
    // Context Issues
    'wrong setting',
    'inappropriate background',
    'distracting elements',
    'cluttered background',
    'competing focal points'
  ]
};

// ============================================================================
// HUMAN SUBJECT NEGATIVE PROMPTS (For lifestyle with models)
// ============================================================================

export const HUMAN_SUBJECT_NEGATIVES: NegativePromptCategory = {
  id: 'human-subject-negatives',
  name: 'Human Subject Quality Control',
  description: 'Negative prompts for images featuring people/models',
  severity: 'critical',
  applicableFor: ['lifestyle', 'model-photography', 'portrait'],
  prompts: [
    // Face and Expression
    'bad face',
    'ugly face',
    'deformed face',
    'asymmetrical face',
    'cross-eyed',
    'wrong eyes',
    'dead eyes',
    'blank expression',
    'weird expression',
    'creepy',
    'unsettling',
    
    // Body Anatomy
    'bad anatomy',
    'wrong proportions',
    'extra limbs',
    'missing limbs',
    'extra arms',
    'extra legs',
    'fused limbs',
    'broken limbs',
    'twisted limbs',
    'floating limbs',
    'disconnected body parts',
    
    // Hands (Major AI problem area)
    'bad hands',
    'deformed hands',
    'fused fingers',
    'extra fingers',
    'missing fingers',
    'six fingers',
    'too many fingers',
    'long fingers',
    'broken fingers',
    'mutated hands',
    'poorly drawn hands',
    
    // Skin and Texture
    'plastic skin',
    'waxy skin',
    'unnatural skin texture',
    'overly smooth skin',
    'fake skin',
    'doll-like',
    'mannequin',
    
    // Pose and Body Language
    'awkward pose',
    'unnatural pose',
    'uncomfortable position',
    'stiff',
    'rigid',
    'forced',
    'mannequin pose',
    
    // Other Issues
    'multiple people when should be one',
    'crowd when should be single subject',
    'partial person',
    'cut off person',
    'headless',
    'floating head'
  ]
};

// ============================================================================
// COMPOSITION & FRAMING NEGATIVES
// ============================================================================

export const COMPOSITION_NEGATIVES: NegativePromptCategory = {
  id: 'composition-negatives',
  name: 'Composition and Framing Issues',
  description: 'Problems with image composition and framing',
  severity: 'medium',
  applicableFor: ['all'],
  prompts: [
    // Framing Issues
    'poorly framed',
    'bad composition',
    'unbalanced composition',
    'awkward framing',
    'subject cut off',
    'cropped awkwardly',
    'too much empty space',
    'cramped',
    'too tight framing',
    'too loose framing',
    
    // Background Problems
    'busy background',
    'distracting background',
    'cluttered',
    'messy',
    'chaotic background',
    'competing elements',
    'background more interesting than subject',
    
    // Perspective Issues
    'wrong perspective',
    'tilted horizon',
    'dutch angle when shouldn\'t be',
    'converging verticals',
    'falling backwards',
    'leaning',
    
    // Depth and Focus
    'flat',
    'no depth',
    'everything in focus when shouldn\'t be',
    'wrong focus point',
    'subject not in focus',
    'background sharper than subject'
  ]
};

// ============================================================================
// LIGHTING NEGATIVES
// ============================================================================

export const LIGHTING_NEGATIVES: NegativePromptCategory = {
  id: 'lighting-negatives',
  name: 'Lighting and Exposure Problems',
  description: 'Issues with lighting quality and direction',
  severity: 'high',
  applicableFor: ['all'],
  prompts: [
    // Poor Lighting
    'bad lighting',
    'harsh lighting',
    'flat lighting',
    'no dimension',
    'muddy shadows',
    'harsh shadows',
    'wrong shadow direction',
    'multiple shadow directions',
    'conflicting light sources',
    
    // Light Quality
    'artificial looking light',
    'unnatural lighting',
    'wrong time of day lighting',
    'mixed color temperature',
    'wrong color temperature',
    'green tint',
    'yellow cast',
    'blue cast',
    
    // Specific Lighting Problems
    'direct flash',
    'on-camera flash',
    'red eye',
    'flash hotspot',
    'lens flare when unwanted',
    'sun spots',
    'light leaks',
    
    // Exposure
    'too dark',
    'too bright',
    'inconsistent exposure',
    'patches of light and dark'
  ]
};

// ============================================================================
// PLATFORM-SPECIFIC: GEMINI AI QUIRKS
// ============================================================================

export const GEMINI_SPECIFIC_NEGATIVES: NegativePromptCategory = {
  id: 'gemini-specific',
  name: 'Gemini AI Specific Issues',
  description: 'Common artifacts and problems specific to Google Gemini AI generation',
  severity: 'high',
  applicableFor: ['gemini-ai'],
  prompts: [
    // Known Gemini Issues
    'oversaturated colors',
    'unnatural color boosting',
    'artificial HDR look',
    'overly vivid',
    'cartoon-like colors',
    'synthetic appearance',
    
    // Text Rendering
    'gibberish text',
    'fake text',
    'nonsense letters',
    'unreadable signs',
    'wrong language',
    
    // Material Rendering
    'plastic-looking materials',
    'overly glossy when shouldn\'t be',
    'fake texture',
    'repeated patterns',
    'tiled textures',
    
    // Consistency Issues
    'style inconsistency',
    'mixed art styles',
    'conflicting aesthetics',
    'parts in different styles'
  ]
};

// ============================================================================
// CONTEXT-BASED NEGATIVE PROMPTS
// ============================================================================

export const CONTEXT_NEGATIVES = {
  ecommerce: [
    'lifestyle clutter',
    'too casual',
    'unprofessional',
    'inconsistent product presentation',
    'unclear product details',
    'artistic blur',
    'creative angles when need standard',
    'environmental context overwhelming product'
  ],
  
  lifestyle: [
    'too clinical',
    'sterile',
    'studio look when need authentic',
    'obvious staging',
    'fake lifestyle',
    'forced scenario',
    'unnatural situation',
    'overly posed'
  ],
  
  editorial: [
    'generic',
    'boring',
    'standard commercial look',
    'too safe',
    'uninspired',
    'catalog photography when need artistic'
  ],
  
  socialMedia: [
    'too formal',
    'corporate',
    'boring composition',
    'no personality',
    'generic stock photo look',
    'dated aesthetic'
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build comprehensive negative prompt string
 */
export function buildNegativePrompt(options: {
  productType?: 'phone-case' | 'apparel' | 'accessory';
  includeHumans?: boolean;
  context?: 'ecommerce' | 'lifestyle' | 'editorial' | 'socialMedia';
  severity?: 'critical' | 'all';
  platform?: 'gemini' | 'midjourney' | 'stable-diffusion';
}): string {
  const {
    productType,
    includeHumans = false,
    context,
    severity = 'all',
    platform
  } = options;

  let negatives: string[] = [];

  // Always include critical technical flaws and AI artifacts
  negatives.push(...TECHNICAL_FLAWS.prompts);
  negatives.push(...AI_ARTIFACTS.prompts);

  // Add unwanted styles for photorealistic work
  if (severity === 'all') {
    negatives.push(...UNWANTED_STYLES.prompts);
  }

  // Add product-specific negatives
  if (productType === 'phone-case') {
    negatives.push(...PHONE_CASE_NEGATIVES.prompts);
  } else if (productType === 'apparel') {
    negatives.push(...APPAREL_NEGATIVES.prompts);
  }

  // Add human subject negatives if needed
  if (includeHumans) {
    negatives.push(...HUMAN_SUBJECT_NEGATIVES.prompts);
  }

  // Add composition and lighting negatives
  if (severity === 'all') {
    negatives.push(...COMPOSITION_NEGATIVES.prompts);
    negatives.push(...LIGHTING_NEGATIVES.prompts);
  }

  // Add context-specific negatives
  if (context && CONTEXT_NEGATIVES[context]) {
    negatives.push(...CONTEXT_NEGATIVES[context]);
  }

  // Add platform-specific negatives
  if (platform === 'gemini') {
    negatives.push(...GEMINI_SPECIFIC_NEGATIVES.prompts);
  }

  // Remove duplicates and join
  const uniqueNegatives = [...new Set(negatives)];
  return uniqueNegatives.join(', ');
}

/**
 * Build minimal critical-only negative prompt
 */
export function buildMinimalNegativePrompt(productType?: 'phone-case' | 'apparel'): string {
  let negatives: string[] = [
    'blurry', 'out of focus', 'low quality', 'pixelated', 'deformed',
    'bad anatomy', 'watermark', 'text', 'signature', 'overexposed',
    'underexposed', 'grainy', 'noisy', 'distorted', 'warped'
  ];

  if (productType === 'phone-case') {
    negatives.push('distorted design', 'misaligned design', 'damaged case', 'wrong phone model');
  } else if (productType === 'apparel') {
    negatives.push('distorted print', 'wrinkled', 'ill-fitting', 'stretched fabric');
  }

  return negatives.join(', ');
}

/**
 * Get category-specific negatives
 */
export function getCategoryNegatives(categoryId: string): string[] {
  const categories: Record<string, NegativePromptCategory> = {
    'technical-flaws': TECHNICAL_FLAWS,
    'ai-artifacts': AI_ARTIFACTS,
    'unwanted-styles': UNWANTED_STYLES,
    'phone-case-negatives': PHONE_CASE_NEGATIVES,
    'apparel-negatives': APPAREL_NEGATIVES,
    'human-subject-negatives': HUMAN_SUBJECT_NEGATIVES,
    'composition-negatives': COMPOSITION_NEGATIVES,
    'lighting-negatives': LIGHTING_NEGATIVES,
    'gemini-specific': GEMINI_SPECIFIC_NEGATIVES
  };

  return categories[categoryId]?.prompts || [];
}

/**
 * Build custom negative prompt from selected categories
 */
export function buildCustomNegativePrompt(categoryIds: string[]): string {
  const allNegatives = categoryIds.flatMap(id => getCategoryNegatives(id));
  const uniqueNegatives = [...new Set(allNegatives)];
  return uniqueNegatives.join(', ');
}

/**
 * Add custom negatives to base prompt
 */
export function extendNegativePrompt(basePrompt: string, additionalNegatives: string[]): string {
  const existing = basePrompt.split(',').map(s => s.trim());
  const combined = [...existing, ...additionalNegatives];
  const unique = [...new Set(combined)];
  return unique.join(', ');
}

// ============================================================================
// PRESET NEGATIVE PROMPTS
// ============================================================================

export const PRESET_NEGATIVES = {
  // Quick presets for common scenarios
  phoneCaseCommercial: buildNegativePrompt({
    productType: 'phone-case',
    context: 'ecommerce',
    severity: 'all',
    platform: 'gemini'
  }),

  phoneCaseLifestyle: buildNegativePrompt({
    productType: 'phone-case',
    context: 'lifestyle',
    includeHumans: true,
    severity: 'all',
    platform: 'gemini'
  }),

  apparelCommercial: buildNegativePrompt({
    productType: 'apparel',
    context: 'ecommerce',
    severity: 'all',
    platform: 'gemini'
  }),

  apparelLifestyle: buildNegativePrompt({
    productType: 'apparel',
    context: 'lifestyle',
    includeHumans: true,
    severity: 'all',
    platform: 'gemini'
  }),

  apparelEditorial: buildNegativePrompt({
    productType: 'apparel',
    context: 'editorial',
    includeHumans: true,
    severity: 'all',
    platform: 'gemini'
  }),

  minimalQuality: buildMinimalNegativePrompt(),
  
  minimalPhoneCase: buildMinimalNegativePrompt('phone-case'),
  
  minimalApparel: buildMinimalNegativePrompt('apparel')
};

// Export all
export default {
  TECHNICAL_FLAWS,
  AI_ARTIFACTS,
  UNWANTED_STYLES,
  PHONE_CASE_NEGATIVES,
  APPAREL_NEGATIVES,
  HUMAN_SUBJECT_NEGATIVES,
  COMPOSITION_NEGATIVES,
  LIGHTING_NEGATIVES,
  GEMINI_SPECIFIC_NEGATIVES,
  CONTEXT_NEGATIVES,
  PRESET_NEGATIVES,
  buildNegativePrompt,
  buildMinimalNegativePrompt,
  getCategoryNegatives,
  buildCustomNegativePrompt,
  extendNegativePrompt
};