
/**
 * LIGHTING SETUPS KNOWLEDGE BASE
 * Professional lighting configurations for AI-generated product mockups
 * Version: 1.0
 * Last Updated: 2025-12-01
 * 
 * Purpose: Provides detailed lighting specifications for different photography scenarios
 * to generate photorealistic product mockups with proper illumination, shadows, and atmosphere.
 */

export interface LightingSetup {
  id: string;
  name: string;
  category: 'studio' | 'natural' | 'lifestyle' | 'dramatic' | 'editorial';
  description: string;
  technicalSpecs: {
    colorTemperature: string;
    lightRatio: string;
    shadowType: string;
    highlights: string;
  };
  promptPhrase: string;
  promptDetails: string;
  bestFor: string[];
  avoidFor: string[];
  timeOfDay?: string;
  environmentNotes?: string;
}

// ============================================================================
// STUDIO LIGHTING SETUPS
// ============================================================================

export const STUDIO_LIGHTING: LightingSetup[] = [
  {
    id: 'three-point-classic',
    name: 'Classic Three-Point Lighting',
    category: 'studio',
    description: 'Professional standard setup with key, fill, and back light for dimensional product shots',
    technicalSpecs: {
      colorTemperature: '5500K-6000K (daylight balanced)',
      lightRatio: '3:1 (key to fill)',
      shadowType: 'Soft, controlled shadows with clear definition',
      highlights: 'Moderate specular highlights, controlled hotspots'
    },
    promptPhrase: 'professional three-point studio lighting',
    promptDetails: 'key light at 45° front-side, soft fill light opposite at half intensity, rim light from behind for edge separation, balanced 5600K daylight temperature, soft shadows with clear product definition, controlled highlights on reflective surfaces',
    bestFor: [
      'Product close-ups',
      'Phone cases with detailed designs',
      'Apparel with intricate patterns',
      'E-commerce product shots',
      'Professional catalog images'
    ],
    avoidFor: [
      'Lifestyle scenes (too artificial)',
      'Editorial fashion (needs more drama)',
      'Outdoor mockups'
    ]
  },

  {
    id: 'clamshell-beauty',
    name: 'Clamshell Beauty Lighting',
    category: 'studio',
    description: 'Soft, even lighting from above and below for flawless, shadow-free product presentation',
    technicalSpecs: {
      colorTemperature: '5800K (neutral daylight)',
      lightRatio: '2:1 (top to bottom)',
      shadowType: 'Minimal to no shadows, extremely soft',
      highlights: 'Even, diffused highlights across surface'
    },
    promptPhrase: 'clamshell beauty lighting setup',
    promptDetails: 'large softbox directly above at 45°, white reflector or soft light below for fill, creates butterfly shadow pattern under subject, extremely soft and flattering illumination, minimal texture emphasis, smooth tonal transitions',
    bestFor: [
      'Apparel with models (face flattering)',
      'Smooth product surfaces',
      'Beauty and cosmetic products',
      'High-end fashion pieces',
      'Premium product presentations'
    ],
    avoidFor: [
      'Textured products (flattens detail)',
      'Products needing dimension',
      'Masculine/rugged aesthetics'
    ]
  },

  {
    id: 'single-softbox-dramatic',
    name: 'Single Softbox Dramatic',
    category: 'studio',
    description: 'Bold, high-contrast lighting with strong directional shadows for impactful product shots',
    technicalSpecs: {
      colorTemperature: '5200K-5500K',
      lightRatio: '8:1 or higher (high contrast)',
      shadowType: 'Deep, dramatic shadows with hard edges',
      highlights: 'Strong, defined highlights with falloff'
    },
    promptPhrase: 'dramatic single source studio lighting',
    promptDetails: 'single large softbox at 60-90° side angle, creates strong directional lighting with deep shadows, high contrast chiaroscuro effect, emphasizes texture and dimension, minimal fill light or reflector bounce only',
    bestFor: [
      'Editorial product photography',
      'Masculine products (watches, tech)',
      'Products with interesting textures',
      'Bold, statement pieces',
      'Artistic mockups'
    ],
    avoidFor: [
      'E-commerce listings (too dark)',
      'Products needing clear detail visibility',
      'Soft, feminine aesthetics'
    ]
  },

  {
    id: 'overhead-flat-lay',
    name: 'Overhead Flat Lay Lighting',
    category: 'studio',
    description: 'Even, shadowless overhead lighting for flat lay compositions and top-down product shots',
    technicalSpecs: {
      colorTemperature: '5600K (standard daylight)',
      lightRatio: '1:1 (completely even)',
      shadowType: 'No visible shadows, pure overhead',
      highlights: 'Uniform, no hotspots'
    },
    promptPhrase: 'overhead flat lay studio lighting',
    promptDetails: 'multiple overhead light sources or large diffusion panel directly above, creates perfectly even illumination with no shadows, ideal for flat lay compositions, colors appear true and saturated, no dimensional modeling',
    bestFor: [
      'Social media flat lays',
      'Product arrangements',
      'Graphic t-shirt designs',
      'Pattern showcases',
      'Instagram-style compositions'
    ],
    avoidFor: [
      '3D products needing dimension',
      'Apparel on models',
      'Products requiring depth perception'
    ]
  },

  {
    id: 'rembrandt-portrait',
    name: 'Rembrandt Portrait Lighting',
    category: 'studio',
    description: 'Classic portrait lighting with characteristic triangle under eye, perfect for apparel with models',
    technicalSpecs: {
      colorTemperature: '5400K-5800K',
      lightRatio: '4:1 (moderate contrast)',
      shadowType: 'Defined shadows with signature light triangle on cheek',
      highlights: 'Natural-looking, dimensional highlights'
    },
    promptPhrase: 'Rembrandt portrait lighting technique',
    promptDetails: 'key light at 45° above and to side of subject, creates small triangle of light on shadow side of face, one eye in shadow with light triangle below, natural and dimensional, classic portrait photography aesthetic',
    bestFor: [
      'Apparel with models',
      'T-shirts on people',
      'Fashion photography',
      'Professional portraits',
      'Lifestyle with people'
    ],
    avoidFor: [
      'Products without people',
      'Flat lay compositions',
      'Pure product shots'
    ]
  },

  {
    id: 'high-key-white',
    name: 'High-Key White Background',
    category: 'studio',
    description: 'Bright, blown-out white background with clean product separation for e-commerce',
    technicalSpecs: {
      colorTemperature: '6000K (bright daylight)',
      lightRatio: 'Overexposed background, properly exposed subject',
      shadowType: 'No shadows visible, pure white backdrop',
      highlights: 'Clean highlights, no clipping on product'
    },
    promptPhrase: 'high-key pure white background lighting',
    promptDetails: 'multiple background lights overexposing white backdrop to pure RGB 255, front fill light for product, creates perfect product isolation, commercial catalog style, shadows eliminated through overexposure',
    bestFor: [
      'E-commerce product shots',
      'Amazon/eBay listings',
      'Catalog photography',
      'Clean product presentations',
      'Website hero images'
    ],
    avoidFor: [
      'Lifestyle mockups',
      'Editorial content',
      'Mood-driven photography'
    ]
  }
];

// ============================================================================
// NATURAL LIGHTING SETUPS
// ============================================================================

export const NATURAL_LIGHTING: LightingSetup[] = [
  {
    id: 'golden-hour-outdoor',
    name: 'Golden Hour Outdoor',
    category: 'natural',
    description: 'Warm, soft directional sunlight during magic hour, 30 minutes before sunset',
    technicalSpecs: {
      colorTemperature: '3500K-4500K (warm orange-gold)',
      lightRatio: '2:1 (gentle contrast)',
      shadowType: 'Long, soft shadows with warm tones',
      highlights: 'Golden, glowing highlights with warm cast'
    },
    promptPhrase: 'golden hour outdoor natural lighting',
    promptDetails: 'warm golden sunlight 15-20 degrees above horizon, soft directional light from side or back, creates long shadows with orange-amber glow, gentle contrast with warm highlights, magical quality light, enhances skin tones and colors',
    bestFor: [
      'Lifestyle apparel photography',
      'Outdoor scene mockups',
      'Fashion editorial',
      'Social media content',
      'Romantic/warm aesthetics'
    ],
    avoidFor: [
      'Product detail shots',
      'Technical mockups',
      'E-commerce listings'
    ],
    timeOfDay: '30 minutes before sunset or after sunrise',
    environmentNotes: 'Best in open areas, avoid direct harsh sun, use natural reflectors'
  },

  {
    id: 'overcast-soft',
    name: 'Overcast Soft Diffused',
    category: 'natural',
    description: 'Even, soft lighting from cloudy sky acting as giant natural softbox',
    technicalSpecs: {
      colorTemperature: '6000K-7000K (cool daylight)',
      lightRatio: '1:1 (very low contrast)',
      shadowType: 'No harsh shadows, extremely soft',
      highlights: 'Subdued, even highlights across surface'
    },
    promptPhrase: 'overcast natural diffused lighting',
    promptDetails: 'soft even illumination from overcast sky, clouds act as massive diffuser, shadowless lighting with gentle falloff, slightly cool color temperature, colors appear saturated and true, perfect for avoiding harsh shadows',
    bestFor: [
      'Product photography outdoors',
      'Casual lifestyle shots',
      'Street fashion',
      'Even-toned mockups',
      'Color-accurate presentations'
    ],
    avoidFor: [
      'Dramatic photography',
      'Warm aesthetics',
      'High-contrast needs'
    ],
    timeOfDay: 'Any time during overcast weather',
    environmentNotes: 'Consistent throughout day, ideal for extended shoots'
  },

  {
    id: 'window-light-indirect',
    name: 'Indirect Window Light',
    category: 'natural',
    description: 'Soft, directional natural light from large window without direct sun',
    technicalSpecs: {
      colorTemperature: '5000K-6500K (depends on time of day)',
      lightRatio: '3:1 (moderate contrast)',
      shadowType: 'Soft, gradual shadows with natural falloff',
      highlights: 'Natural, dimensional highlights'
    },
    promptPhrase: 'soft window light interior photography',
    promptDetails: 'large window providing indirect natural daylight, subject positioned near window at 45-90° angle, soft directional lighting with natural shadow transition, creates depth and dimension, authentic interior lighting feel',
    bestFor: [
      'Indoor lifestyle photography',
      'Home/casual settings',
      'Authentic lifestyle mockups',
      'Morning coffee aesthetics',
      'Cozy interior scenes'
    ],
    avoidFor: [
      'Outdoor scenes',
      'High-energy photography',
      'Studio product shots'
    ],
    timeOfDay: 'Morning to mid-afternoon (avoid direct sun)',
    environmentNotes: 'North-facing windows provide most consistent light'
  },

  {
    id: 'backlit-sunset',
    name: 'Backlit Sunset Silhouette',
    category: 'natural',
    description: 'Dramatic backlighting during sunset creating rim light and subject glow',
    technicalSpecs: {
      colorTemperature: '2500K-3500K (deep warm tones)',
      lightRatio: 'Extreme (subject darker than background)',
      shadowType: 'Subject in relative shadow, rim-lit edges',
      highlights: 'Bright rim highlights around subject edges'
    },
    promptPhrase: 'dramatic backlit sunset photography',
    promptDetails: 'sun positioned behind subject creating rim light effect, subject slightly underexposed with glowing edges, warm sunset colors in background, creates dramatic silhouette or semi-silhouette effect, lens flare and atmospheric haze',
    bestFor: [
      'Editorial fashion',
      'Artistic mockups',
      'Dramatic lifestyle shots',
      'Silhouette aesthetics',
      'Outdoor adventure gear'
    ],
    avoidFor: [
      'Product detail visibility',
      'E-commerce',
      'Clear product presentation'
    ],
    timeOfDay: 'Last 10 minutes before sunset',
    environmentNotes: 'Requires careful exposure balancing, use fill light or reflector for subject'
  },

  {
    id: 'midday-harsh-sun',
    name: 'Midday Direct Sun (High Contrast)',
    category: 'natural',
    description: 'Strong overhead sunlight creating hard shadows and high contrast',
    technicalSpecs: {
      colorTemperature: '5500K-6000K (neutral daylight)',
      lightRatio: '8:1 or higher (very high contrast)',
      shadowType: 'Hard, defined shadows directly below subject',
      highlights: 'Bright, potentially blown highlights'
    },
    promptPhrase: 'harsh midday sun direct lighting',
    promptDetails: 'overhead direct sunlight at 12-2pm, creates strong hard shadows beneath subject, high contrast with deep blacks and bright highlights, challenging lighting that can be used for bold graphic effects or avoided for softer looks',
    bestFor: [
      'Bold graphic aesthetics',
      'Urban street photography',
      'High-contrast editorial',
      'Summer/beach themes',
      'Athletic/sports gear'
    ],
    avoidFor: [
      'Flattering portraits',
      'Soft aesthetics',
      'Detail visibility in shadows',
      'Most e-commerce'
    ],
    timeOfDay: '11am-2pm',
    environmentNotes: 'Often considered worst lighting, but can be used creatively for specific aesthetics'
  },

  {
    id: 'open-shade',
    name: 'Open Shade Natural',
    category: 'natural',
    description: 'Soft even lighting in shaded area with sky providing ambient fill',
    technicalSpecs: {
      colorTemperature: '6500K-8000K (cool blue cast from sky)',
      lightRatio: '2:1 (low contrast)',
      shadowType: 'Minimal shadows, very soft',
      highlights: 'Gentle, even highlights'
    },
    promptPhrase: 'open shade natural ambient lighting',
    promptDetails: 'subject in shade from building or trees, lit by open sky acting as giant softbox, slightly cool color temperature from blue sky, soft and flattering, avoids harsh shadows while maintaining natural outdoor feel',
    bestFor: [
      'Portrait photography',
      'Lifestyle apparel',
      'Outdoor product shots',
      'Natural casual looks',
      'Street fashion'
    ],
    avoidFor: [
      'Warm aesthetics',
      'Dramatic photography',
      'Studio looks'
    ],
    timeOfDay: 'Any time of day in shade',
    environmentNotes: 'Choose shade with open sky above for best results, avoid dark enclosed areas'
  }
];

// ============================================================================
// LIFESTYLE & ENVIRONMENTAL LIGHTING
// ============================================================================

export const LIFESTYLE_LIGHTING: LightingSetup[] = [
  {
    id: 'cafe-interior-warm',
    name: 'Warm Cafe Interior',
    category: 'lifestyle',
    description: 'Cozy indoor lighting mixing warm practicals with window light',
    technicalSpecs: {
      colorTemperature: '3200K-4500K (warm mixed sources)',
      lightRatio: '3:1 (moderate with mixed sources)',
      shadowType: 'Soft, natural indoor shadows',
      highlights: 'Warm, inviting highlights from practical lights'
    },
    promptPhrase: 'warm cafe interior mixed lighting',
    promptDetails: 'combination of warm tungsten overhead lights and cooler window light, creates cozy coffee shop atmosphere, slight color temperature mix, soft shadows, inviting and casual ambiance, authentic interior lifestyle feel',
    bestFor: [
      'Lifestyle product photography',
      'Social media content',
      'Casual wear mockups',
      'Coffee shop aesthetics',
      'Cozy lifestyle scenes'
    ],
    avoidFor: [
      'Professional studio shots',
      'Clinical product photography',
      'High-end fashion'
    ],
    timeOfDay: 'Morning to afternoon for window light mix',
    environmentNotes: 'Look for cafes with large windows and warm pendant lights'
  },

  {
    id: 'urban-street-night',
    name: 'Urban Street Night',
    category: 'lifestyle',
    description: 'Mixed street lighting at night with neon signs and ambient city lights',
    technicalSpecs: {
      colorTemperature: 'Mixed 2800K-6500K (various sources)',
      lightRatio: 'Variable (high contrast in spots)',
      shadowType: 'Deep shadows with pools of colored light',
      highlights: 'Colorful highlights from neon and LED signs'
    },
    promptPhrase: 'urban street night mixed lighting',
    promptDetails: 'nighttime city environment with mixed artificial lighting sources, includes warm sodium streetlights, cool LED storefronts, colored neon signs, creates moody urban atmosphere with high contrast and color variety',
    bestFor: [
      'Urban fashion',
      'Streetwear mockups',
      'Edgy lifestyle photography',
      'Night scene mockups',
      'Modern urban aesthetics'
    ],
    avoidFor: [
      'Clear product detail',
      'E-commerce listings',
      'Soft/feminine aesthetics'
    ],
    timeOfDay: 'Nighttime, dusk for transition light',
    environmentNotes: 'Look for areas with colorful signage and multiple light sources'
  },

  {
    id: 'beach-bright-reflective',
    name: 'Beach Bright Reflective',
    category: 'lifestyle',
    description: 'Bright outdoor lighting with strong reflections from sand and water',
    technicalSpecs: {
      colorTemperature: '5500K-6500K (bright daylight)',
      lightRatio: '1:2 (low contrast due to fill from reflections)',
      shadowType: 'Soft shadows filled by reflected light',
      highlights: 'Bright, enhanced by reflective surfaces'
    },
    promptPhrase: 'bright beach natural lighting with reflective fill',
    promptDetails: 'strong overhead sun with intense fill light from white sand and water reflections, creates bright, even lighting with enhanced luminosity, shadow areas receive heavy fill reducing contrast, fresh and bright outdoor aesthetic',
    bestFor: [
      'Summer wear',
      'Swimwear mockups',
      'Active lifestyle products',
      'Beach/vacation themes',
      'Bright outdoor aesthetics'
    ],
    avoidFor: [
      'Moody photography',
      'Indoor products',
      'Low-key aesthetics'
    ],
    timeOfDay: 'Mid-morning to mid-afternoon',
    environmentNotes: 'Reflective surfaces act as massive fill lights'
  },

  {
    id: 'gym-interior-dramatic',
    name: 'Gym Interior Dramatic',
    category: 'lifestyle',
    description: 'Moody gym lighting with hard directional light and deep shadows',
    technicalSpecs: {
      colorTemperature: '4500K-5500K (neutral to slightly cool)',
      lightRatio: '6:1 (high contrast)',
      shadowType: 'Hard shadows from directional lighting',
      highlights: 'Strong, defined highlights on muscles/contours'
    },
    promptPhrase: 'dramatic gym interior directional lighting',
    promptDetails: 'hard directional lighting from overhead or side windows, creates strong contrast emphasizing body contours, relatively dark ambient with bright highlights, motivational and intense atmosphere, shadows define muscle definition',
    bestFor: [
      'Athletic wear',
      'Fitness apparel',
      'Sports gear',
      'Activewear mockups',
      'Motivational aesthetics'
    ],
    avoidFor: [
      'Casual wear',
      'Soft aesthetics',
      'Products needing even lighting'
    ],
    timeOfDay: 'Variable - controlled interior',
    environmentNotes: 'Use gyms with large windows or dramatic overhead lighting'
  },

  {
    id: 'festival-concert-colored',
    name: 'Festival/Concert Colored Lights',
    category: 'lifestyle',
    description: 'Dynamic colored stage lighting with dramatic shifts and effects',
    technicalSpecs: {
      colorTemperature: 'Variable (full spectrum colored lights)',
      lightRatio: 'Extreme (spot lighting in darkness)',
      shadowType: 'Deep black shadows with colored highlights',
      highlights: 'Intensely colored highlights from stage lights'
    },
    promptPhrase: 'dynamic concert stage colored lighting',
    promptDetails: 'vibrant colored stage lights (pink, blue, purple, red), creates high-energy party atmosphere, subject lit by multiple colored sources creating unusual color casts, dark backgrounds with bright subject illumination',
    bestFor: [
      'Music festival wear',
      'Concert merch mockups',
      'Party/nightlife products',
      'Youth culture aesthetics',
      'High-energy products'
    ],
    avoidFor: [
      'Professional products',
      'Clear color representation',
      'E-commerce accuracy'
    ],
    timeOfDay: 'Nighttime events',
    environmentNotes: 'Stage lights create unique color combinations not found in natural settings'
  },

  {
    id: 'home-studio-youtuber',
    name: 'Home Studio YouTuber Setup',
    category: 'lifestyle',
    description: 'Modern content creator lighting with LED panels and ring lights',
    technicalSpecs: {
      colorTemperature: '5600K (adjustable LED daylight)',
      lightRatio: '2:1 (controlled low contrast)',
      shadowType: 'Minimal soft shadows, modern aesthetic',
      highlights: 'Clean, even highlights, ring light catchlights'
    },
    promptPhrase: 'modern content creator LED panel lighting',
    promptDetails: 'adjustable LED panel lights providing clean even illumination, possible ring light creating circular catchlights, contemporary minimalist setup, slightly flat but professional look, designed for camera and video work',
    bestFor: [
      'Tech products',
      'Modern casual wear',
      'Content creator aesthetics',
      'YouTube/social media vibe',
      'Millennial/Gen-Z products'
    ],
    avoidFor: [
      'Traditional photography looks',
      'High-fashion editorial',
      'Outdoor products'
    ],
    timeOfDay: 'Interior - time independent',
    environmentNotes: 'Designed to be consistent and controllable'
  }
];

// ============================================================================
// DRAMATIC & EDITORIAL LIGHTING
// ============================================================================

export const DRAMATIC_LIGHTING: LightingSetup[] = [
  {
    id: 'film-noir-hard-shadow',
    name: 'Film Noir Hard Shadow',
    category: 'dramatic',
    description: 'High-contrast dramatic lighting with venetian blind shadows and mystery',
    technicalSpecs: {
      colorTemperature: '3200K (warm dramatic)',
      lightRatio: '16:1 (extreme contrast)',
      shadowType: 'Hard, defined dramatic shadows with patterns',
      highlights: 'Bright, isolated highlights in darkness'
    },
    promptPhrase: 'film noir dramatic hard shadow lighting',
    promptDetails: 'single hard light source creating extreme contrast, venetian blind or slatted shadow patterns, subject partially in deep shadow, mysterious and dramatic aesthetic, inspired by 1940s noir cinematography',
    bestFor: [
      'Editorial fashion',
      'Artistic product photography',
      'Dramatic brand aesthetics',
      'Luxury products',
      'Mysterious/bold concepts'
    ],
    avoidFor: [
      'E-commerce',
      'Soft aesthetics',
      'Clear product visibility'
    ]
  },

  {
    id: 'chiaroscuro-renaissance',
    name: 'Chiaroscuro Renaissance',
    category: 'dramatic',
    description: 'Classical painting-inspired dramatic light and shadow interplay',
    technicalSpecs: {
      colorTemperature: '3500K-4000K (warm amber)',
      lightRatio: '8:1 (high contrast)',
      shadowType: 'Gradual but dramatic shadow transitions',
      highlights: 'Luminous, painterly quality highlights'
    },
    promptPhrase: 'chiaroscuro dramatic Renaissance painting lighting',
    promptDetails: 'directional light creating dramatic but gradual shadow transitions, inspired by Caravaggio and Rembrandt, rich tonal range from deep shadows to luminous highlights, creates three-dimensional sculptural quality',
    bestFor: [
      'High-end fashion editorial',
      'Luxury product photography',
      'Artistic mockups',
      'Heritage brands',
      'Sophisticated aesthetics'
    ],
    avoidFor: [
      'Casual products',
      'Modern minimalist',
      'Youth market'
    ]
  },

  {
    id: 'colored-gel-creative',
    name: 'Colored Gel Creative',
    category: 'dramatic',
    description: 'Bold colored lighting gels creating dramatic color contrasts',
    technicalSpecs: {
      colorTemperature: 'Variable (gelled to specific colors)',
      lightRatio: 'Variable based on color intensity',
      shadowType: 'Colored shadows with complementary tones',
      highlights: 'Vibrant colored highlights'
    },
    promptPhrase: 'dramatic colored gel lighting with contrasts',
    promptDetails: 'colored lighting gels on multiple sources creating bold color contrasts, typically complementary colors (blue/orange, red/green), modern editorial aesthetic, creates unique and memorable visual impact',
    bestFor: [
      'Fashion editorial',
      'Creative product campaigns',
      'Modern brand aesthetics',
      'Album covers/posters',
      'Bold statement pieces'
    ],
    avoidFor: [
      'Traditional photography',
      'True color representation',
      'Conservative brands'
    ]
  },

  {
    id: 'low-key-spotlight',
    name: 'Low-Key Spotlight',
    category: 'dramatic',
    description: 'Subject isolated in darkness with single focused spotlight',
    technicalSpecs: {
      colorTemperature: '4000K-5000K',
      lightRatio: 'Infinite (subject lit, background black)',
      shadowType: 'Subject emerges from darkness',
      highlights: 'Concentrated spotlight on subject only'
    },
    promptPhrase: 'low-key spotlight dramatic isolation',
    promptDetails: 'single focused spotlight illuminating subject against pure black background, creates isolation and drama, subject fully lit while everything else fades to black, theatrical and powerful presentation',
    bestFor: [
      'Premium products',
      'Dramatic reveals',
      'Luxury items',
      'Editorial photography',
      'Spotlight moments'
    ],
    avoidFor: [
      'Casual products',
      'Environmental context needs',
      'Lifestyle photography'
    ]
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export interface LightingRecommendation {
  primary: LightingSetup;
  alternatives: LightingSetup[];
  reasoning: string;
}

/**
 * Get recommended lighting setup based on product category and style
 */
export function getRecommendedLighting(
  productCategory: string,
  style: 'commercial' | 'lifestyle' | 'editorial' | 'dramatic' = 'commercial'
): LightingRecommendation {
  const allSetups = [
    ...STUDIO_LIGHTING,
    ...NATURAL_LIGHTING,
    ...LIFESTYLE_LIGHTING,
    ...DRAMATIC_LIGHTING
  ];

  // Mapping logic
  const styleToCategory: Record<string, LightingSetup['category'][]> = {
    commercial: ['studio'],
    lifestyle: ['natural', 'lifestyle'],
    editorial: ['dramatic', 'editorial'],
    dramatic: ['dramatic']
  };

  const targetCategories = styleToCategory[style] || ['studio'];
  const filtered = allSetups.filter(setup => 
    targetCategories.includes(setup.category)
  );

  // Smart recommendations based on product
  let primary: LightingSetup;
  let alternatives: LightingSetup[] = [];

  if (productCategory.includes('apparel') || productCategory.includes('t-shirt')) {
    if (style === 'lifestyle') {
      primary = NATURAL_LIGHTING.find(l => l.id === 'golden-hour-outdoor')!;
      alternatives = [
        NATURAL_LIGHTING.find(l => l.id === 'overcast-soft')!,
        LIFESTYLE_LIGHTING.find(l => l.id === 'cafe-interior-warm')!
      ];
    } else if (style === 'editorial') {
      primary = DRAMATIC_LIGHTING.find(l => l.id === 'film-noir-hard-shadow')!;
      alternatives = [
        DRAMATIC_LIGHTING.find(l => l.id === 'chiaroscuro-renaissance')!,
        STUDIO_LIGHTING.find(l => l.id === 'single-softbox-dramatic')!
      ];
    } else {
      primary = STUDIO_LIGHTING.find(l => l.id === 'rembrandt-portrait')!;
      alternatives = [
        STUDIO_LIGHTING.find(l => l.id === 'three-point-classic')!,
        STUDIO_LIGHTING.find(l => l.id === 'clamshell-beauty')!
      ];
    }
  } else if (productCategory.includes('phone') || productCategory.includes('case')) {
    primary = STUDIO_LIGHTING.find(l => l.id === 'three-point-classic')!;
    alternatives = [
      STUDIO_LIGHTING.find(l => l.id === 'overhead-flat-lay')!,
      LIFESTYLE_LIGHTING.find(l => l.id === 'home-studio-youtuber')!
    ];
  } else {
    // Default to commercial
    primary = STUDIO_LIGHTING.find(l => l.id === 'three-point-classic')!;
    alternatives = filtered.slice(0, 2);
  }

  return {
    primary,
    alternatives,
    reasoning: `Selected ${primary.name} as primary setup for ${productCategory} in ${style} style`
  };
}

/**
 * Build complete lighting prompt phrase for AI generation
 */
export function buildLightingPrompt(lightingId: string, includeDetails: boolean = true): string {
  const allSetups = [
    ...STUDIO_LIGHTING,
    ...NATURAL_LIGHTING,
    ...LIFESTYLE_LIGHTING,
    ...DRAMATIC_LIGHTING
  ];

  const setup = allSetups.find(s => s.id === lightingId);
  if (!setup) return 'professional studio lighting';

  if (includeDetails) {
    return `${setup.promptPhrase}, ${setup.promptDetails}`;
  }
  return setup.promptPhrase;
}

/**
 * Get all lighting setups by category
 */
export function getLightingByCategory(category: LightingSetup['category']): LightingSetup[] {
  const allSetups = [
    ...STUDIO_LIGHTING,
    ...NATURAL_LIGHTING,
    ...LIFESTYLE_LIGHTING,
    ...DRAMATIC_LIGHTING
  ];
  return allSetups.filter(setup => setup.category === category);
}

/**
 * Get lighting setup by ID
 */
export function getLightingById(id: string): LightingSetup | undefined {
  const allSetups = [
    ...STUDIO_LIGHTING,
    ...NATURAL_LIGHTING,
    ...LIFESTYLE_LIGHTING,
    ...DRAMATIC_LIGHTING
  ];
  return allSetups.find(setup => setup.id === id);
}

// Export all for easy access
export const ALL_LIGHTING_SETUPS = [
  ...STUDIO_LIGHTING,
  ...NATURAL_LIGHTING,
  ...LIFESTYLE_LIGHTING,
  ...DRAMATIC_LIGHTING
];

export default {
  STUDIO_LIGHTING,
  NATURAL_LIGHTING,
  LIFESTYLE_LIGHTING,
  DRAMATIC_LIGHTING,
  ALL_LIGHTING_SETUPS,
  getRecommendedLighting,
  buildLightingPrompt,
  getLightingByCategory,
  getLightingById
};
