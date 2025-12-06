import { LightingSetup } from '@shared/mockupTypes';

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
  }
];

export function getLightingSetup(id: string): LightingSetup | undefined {
  const allSetups = [...STUDIO_LIGHTING, ...NATURAL_LIGHTING];
  return allSetups.find(setup => setup.id === id);
}
